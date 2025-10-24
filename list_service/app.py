# listing-service/app.py, the flask application is created and the blueprint for listings is registered.
#by Afolabi Afolayan
from flask import Flask
from flask_cors import CORS
from routes import bp as listings_bp
import os

# listing-service/app.py
def create_app():
    app = Flask(__name__)

    # Default allowed origins for development (include frontend on :8080)
    default_origins = ["http://localhost:8081", "http://localhost:19006", "http://localhost:8080", "exp://*"]

    # Allow overriding allowed origins via environment variable (comma-separated)
    env_origins = os.getenv("ALLOWED_ORIGINS")
    if env_origins:
        # split and strip
        origins = [o.strip() for o in env_origins.split(",") if o.strip()]
    else:
        origins = default_origins

    # Enable CORS for api routes
    CORS(app, resources={
        r"/api/*": {
            "origins": origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    app.register_blueprint(listings_bp)
    return app

if __name__ == "__main__":
    create_app().run(debug=True, host="0.0.0.0", port=5000)
