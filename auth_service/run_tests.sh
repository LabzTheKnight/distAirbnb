#!/bin/bash

# Test script for running Django tests in Docker
echo "Running Django Authentication Service Tests..."
echo "============================================="

# Run database migrations
echo "Running migrations..."
python manage.py migrate

# Run Django unit tests
echo ""
echo "Running Django unit tests..."
python manage.py test authentication --verbosity=2

# Check if tests passed
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed successfully!"
else
    echo ""
    echo "❌ Some tests failed!"
    exit 1
fi

echo ""
echo "Test run completed."