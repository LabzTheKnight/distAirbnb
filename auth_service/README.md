# Django Authentication Service

A microservice for handling user authentication in your distributed Airbnb application.

## Features

- User registration
- User login/logout
- Token-based authentication
- User profile management
- Token verification for other microservices
- CORS support for frontend integration

## Setup

1. **Create and activate virtual environment:**
   ```bash
   cd auth_service
   source venv_auth/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start the server:**
   ```bash
   python manage.py runserver 8001
   ```

## API Endpoints

Base URL: `http://127.0.0.1:8001/api/auth/`

### Public Endpoints (No authentication required)

#### Register User
- **POST** `/register/`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

#### Login User
- **POST** `/login/`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```

### Protected Endpoints (Token required)

Add header: `Authorization: Token <your_token_here>`

#### Get User Profile
- **GET** `/profile/`

#### Update User Profile
- **PUT** `/profile/update/`
- **Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe Updated",
    "email": "newemail@example.com"
  }
  ```

#### Logout User
- **POST** `/logout/`

#### Verify Token (For other microservices)
- **POST** `/verify/`

## Database

Currently using SQLite for development. The database file is created as `db.sqlite3` in the project root.

### Available SQL Database Options:

1. **SQLite** (Current - Good for development)
2. **PostgreSQL** (Recommended for production)
3. **MySQL** (Alternative option)

## Testing

Run the test script to verify all endpoints:
```bash
./test_auth_api.sh
```

## Integration with Other Services

Other microservices can verify user tokens by making a POST request to `/api/auth/verify/` with the token in the Authorization header.

Example from Flask (list_service):
```python
import requests

def verify_user_token(token):
    headers = {'Authorization': f'Token {token}'}
    response = requests.post('http://127.0.0.1:8001/api/auth/verify/', headers=headers)
    if response.status_code == 200:
        return response.json()['user']
    return None
```

## Environment Variables

Create a `.env` file for production with:
```
SECRET_KEY=your_secret_key_here
DEBUG=False
ALLOWED_HOSTS=your_domain.com,127.0.0.1
```
