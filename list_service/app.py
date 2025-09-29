# listing-service/app.py, the flask application is created and the blueprint for listings is registered.
#by Afolabi Afolayan
from flask import Flask
from routes import bp as listings_bp

# listing-service/app.py
def create_app():
    app = Flask(__name__)
    app.register_blueprint(listings_bp)
    return app

if __name__ == "__main__":
    create_app().run(debug=True, host="0.0.0.0", port=5000)
