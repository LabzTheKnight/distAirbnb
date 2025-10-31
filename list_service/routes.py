# in this code, we define the routes for the listing service using Flask. create, read, update, and delete operations for listings and reviews are implemented.
# decotators for authentication and admin checks are also included.
# Blueprint is used to organize the routes under a common URL.
# by Afolabi Afolayan








from flask import Blueprint, request, jsonify, current_app
from mongoengine.errors import ValidationError, DoesNotExist
from models import Listing, Review
from datetime import datetime
from functools import wraps
import os
import requests
from dotenv import load_dotenv




load_dotenv()




bp = Blueprint("listings", __name__, url_prefix="/api")




# Auth service URL
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001/api/auth")




# function to extract and validate token with authentication service
def get_token_data():
   
    token = None
   
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Token '):
            token = auth_header.split(" ")[1]
   
    if not token:
        return None, {'error': 'Token is missing!'}, 401




    try:
        response = requests.post(
            f"{AUTH_SERVICE_URL}/verify/",
            headers={"Authorization": f"Token {token}"},
            timeout=5
        )
       
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
               
                user_data = data.get('user', {})
                return user_data, None, None
            else:
                error_msg = data.get('error', 'Invalid token')
                return None, {'error': error_msg}, 401
        else:
           
            error_msg = 'Authentication service error'
            try:
                error_data = response.json()
                if 'error' in error_data:
                    error_msg = error_data['error']
            except:
                pass
            return None, {'error': error_msg}, response.status_code
    except requests.exceptions.RequestException as e:
       
        return None, {'error': f'Authentication service unavailable: {str(e)}'}, 503




# decorator for token check to protect routes for users
def token_required(f):
   
    @wraps(f)
    def decorated(*args, **kwargs):
        data, error, status_code = get_token_data()
       
        if error:
            return jsonify(error), status_code
           
        request.user = data
        return f(*args, **kwargs)
   
    return decorated




# decorator for admin check to protect routes for admin
def admin_required(f):


    @wraps(f)
    def decorated(*args, **kwargs):
        data, error, status_code = get_token_data()
       
        if error:
            return jsonify(error), status_code
           
        is_admin = data.get('is_staff', False) or data.get('is_superuser', False)
        if not is_admin:
            return jsonify({'error': 'Admin privileges required!'}), 403
           
        request.user = data
        return f(*args, **kwargs)
   
    return decorated


# api endpoint to create a listing available for admin
@bp.route("/listings", methods=["POST"])
@admin_required
def create_listing():
    try:
        data = request.get_json(force=True)
        listing = Listing(**data)
        listing.save()
        return jsonify({"id": listing.id}), 201
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400


# api endpoint to list all listings with only id, name, price,
# adress and image available for both user and admin
# Public endpoint - no auth required for browsing
@bp.route("/listings", methods=["GET"])
def get_listings():
    try:
        limit = int(request.args.get("limit", 10))
        offset = int(request.args.get("offset", 0))  
        listings = Listing.objects.skip(offset).limit(limit).only(
            "_id", "name", "price", "address", "images"
        )
        result = [
            {
                "id": str(l._id),
                "title": l.name,
                "price": float(l.price) if l.price else 0,
                "location": l.address.get("street", "Unknown") if l.address else "Unknown",
                "imageUrl": l.images.get("picture_url", "") if l.images else ""
            }
            for l in listings
        ]


        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# api endpoint to get total count of listings
@bp.route("/listings/count", methods=["GET"])
def get_listings_count():
    try:
        count = Listing.objects.count()
        return jsonify({"count": count}), 200


    except Exception as e:
        return jsonify({"error": str(e)}), 500




# api enpoint to return detailed info about a specific listing
# for both user and admin
# Public endpoint - no auth required for viewing details
@bp.route("/listings/<string:listing_id>", methods=["GET"])
def get_listing(listing_id):
    try:
        listing = Listing.objects.get(_id=listing_id)
     
        result = {
            "id": str(listing._id),
            "title": listing.name,
            "description": listing.description or "",
            "price": float(listing.price) if listing.price else 0,
            "location": listing.address.get("street", "Unknown") if listing.address else "Unknown",
            "rating": float(listing.review_scores.get("review_scores_rating", 0)) if listing.review_scores else 0,
            "reviews": [
                {
                    "reviewer_id": str(r.reviewer_id) if hasattr(r, 'reviewer_id') else "",
                    "reviewer_name": r.reviewer_name if hasattr(r, 'reviewer_name') else None,
                    "comments": r.comments,
                    "date": r.date if hasattr(r, 'date') else None
                } for r in listing.reviews
            ]if listing.reviews else "No reviews",
            "imageUrl": listing.images.get("picture_url", "") if listing.images else ""
        }
        return jsonify(result), 200
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404




# api enpoint to update info for a specific listing
# only available for admin
@bp.route("/listings/<string:listing_id>", methods=["PUT"])
@admin_required
def update_listing(listing_id):
    try:
        data = request.get_json(force=True)
        listing = Listing.objects.get(_id=listing_id)
        for key, val in data.items():
            setattr(listing, key, val)
        listing.save()
        return jsonify({"status": "updated"}), 200
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400




# api enpoint to delete a specific listing
# only available for admin
@bp.route("/listings/<string:listing_id>", methods=["DELETE"])
@admin_required
def delete_listing(listing_id):
    try:
        Listing.objects.get(_id=listing_id).delete()
        return jsonify({"status": "deleted"}), 200
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404


# api enpoint to list all reviews for a specific listing
# available for both user and admin
@bp.route("/listings/<string:listing_id>/reviews", methods=["POST"])
@token_required
def add_review(listing_id):
    try:
        payload = request.get_json(force=True)
        rev = Review(
            _id=payload.get("_id", str(datetime.utcnow().timestamp())),
            listing_id=listing_id,
            reviewer_id=payload["reviewer_id"],
            reviewer_name=payload.get("reviewer_name", ""),
            comments=payload.get("comments", ""),
            date=payload.get("date", datetime.utcnow()),
        )
        l = Listing.objects.get(_id=listing_id)
        l.reviews.append(rev)
        l.number_of_reviews = len(l.reviews)
        l.save()
        return jsonify({"status": "review added"}), 201
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404
    except (ValidationError, KeyError) as e:
        return jsonify({"error": str(e)}), 400


# api enpoint to delete a specific review
# only available for admin
@bp.route("/listings/<string:listing_id>/reviews", methods=["GET"])
@admin_required
def list_all_reviews(listing_id):


    try:
        listing = Listing.objects.get(_id=listing_id)
       
        if not listing.reviews:
            return jsonify({"reviews": []}), 200
           
        result = {
            "listing_id": str(listing._id),
            "listing_title": listing.name,
            "reviews": [
                {
                    "id": str(r._id),
                    "reviewer_id": str(r.reviewer_id) if hasattr(r, 'reviewer_id') else "",
                    "reviewer_name": r.reviewer_name if hasattr(r, 'reviewer_name') else None,
                    "comments": r.comments,
                    "date": r.date.isoformat() if hasattr(r, 'date') and r.date else None
                } for r in listing.reviews
            ]
        }
        return jsonify(result), 200
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@bp.route("/listings/<string:listing_id>/reviews/<string:review_id>", methods=["DELETE"])
@admin_required
def delete_review(listing_id, review_id):


    try:
        listing = Listing.objects.get(_id=listing_id)
       
        # Find the review in the listing's reviews
        review_to_delete = None
        for review in listing.reviews:
            if str(review._id) == review_id:
                review_to_delete = review
                break
       
        if not review_to_delete:
            return jsonify({"error": "Review not found"}), 404
       
        # Remove the review from the listing
        listing.reviews.remove(review_to_delete)
       
        # Update number of reviews count
        listing.number_of_reviews = len(listing.reviews)
       
        # Save the updated listing
        listing.save()
       
        return jsonify({
            "status": "deleted",
            "message": f"Review {review_id} has been deleted from listing {listing_id}"
        }), 200
    except DoesNotExist:
        return jsonify({"error": "Listing not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500






@bp.route("/test-connection", methods=["GET"])
def test_connection():
    try:
        # Try to reach the auth service with a direct URL
        auth_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000/api/users")
        response = requests.get(f"{auth_url}", timeout=2)
        return jsonify({
            "auth_url_used": auth_url,
            "status_code": response.status_code,
            "response": response.text[:100] if response.status_code == 200 else "N/A"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500




















