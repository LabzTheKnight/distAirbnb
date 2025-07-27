FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run migrations and start server
EXPOSE 8001
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8001"]