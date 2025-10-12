# listing-service/app.py, the flask application is created and the blueprint for listings is registered.
#by Afolabi Afolayan
from flask import Flask
from flask_cors import CORS
from routes import bp as listings_bp

# listing-service/app.py
def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8081", "http://localhost:19006", "exp://*"],
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
