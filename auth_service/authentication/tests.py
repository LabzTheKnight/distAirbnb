from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
import json


class AuthenticationAPITestCase(APITestCase):
    """Test cases for authentication API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('user_profile')
        self.update_profile_url = reverse('update_profile')
        self.verify_token_url = reverse('verify_token')
        
        # Test user data
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        # Create a test user for login tests
        self.test_user = User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='existingpass123',
            first_name='Existing',
            last_name='User'
        )
        self.test_token = Token.objects.create(user=self.test_user)

    def test_user_registration_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['message'], 'User created successfully')
        self.assertEqual(response.data['user']['username'], 'testuser')
        
        # Verify user was created in database
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_registration_password_mismatch(self):
        """Test registration with password mismatch"""
        invalid_data = self.user_data.copy()
        invalid_data['password_confirm'] = 'differentpass'
        
        response = self.client.post(self.register_url, invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_user_registration_duplicate_username(self):
        """Test registration with existing username"""
        duplicate_data = self.user_data.copy()
        duplicate_data['username'] = 'existinguser'
        
        response = self.client.post(self.register_url, duplicate_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test successful user login"""
        login_data = {
            'username': 'existinguser',
            'password': 'existingpass123'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['message'], 'Login successful')

    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'username': 'existinguser',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout_success(self):
        """Test successful user logout"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.test_token.key)
        
        response = self.client.post(self.logout_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Logout successful')

    def test_user_logout_unauthenticated(self):
        """Test logout without authentication"""
        response = self.client.post(self.logout_url)
        
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_get_user_profile_success(self):
        """Test getting user profile"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.test_token.key)
        
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'existinguser')

    def test_get_user_profile_unauthenticated(self):
        """Test getting profile without authentication"""
        response = self.client.get(self.profile_url)
        
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_update_user_profile_success(self):
        """Test updating user profile"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.test_token.key)
        
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'email': 'updated@example.com'
        }
        
        response = self.client.put(self.update_profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['user']['first_name'], 'Updated')

    def test_verify_token_success(self):
        """Test token verification"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.test_token.key)
        
        response = self.client.post(self.verify_token_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('valid', response.data)
        self.assertTrue(response.data['valid'])

    def test_verify_token_invalid(self):
        """Test invalid token verification"""
        self.client.credentials(HTTP_AUTHORIZATION='Token invalidtoken123')
        
        response = self.client.post(self.verify_token_url)
        
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_api_endpoints_without_auth(self):
        """Test that protected endpoints require authentication"""
        protected_endpoints = [
            self.logout_url,
            self.profile_url,
            self.update_profile_url,
            self.verify_token_url
        ]
        
        for endpoint in protected_endpoints:
            response = self.client.get(endpoint) if endpoint != self.verify_token_url else self.client.post(endpoint)
            self.assertIn(
                response.status_code, 
                [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
                f"Endpoint {endpoint} should require authentication"
            )


class AuthenticationModelTestCase(TestCase):
    """Test cases for authentication models"""
    
    def test_user_creation(self):
        """Test user model creation"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))

    def test_token_creation(self):
        """Test token creation for user"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        token = Token.objects.create(user=user)
        
        self.assertEqual(token.user, user)
        self.assertTrue(len(token.key) > 0)
