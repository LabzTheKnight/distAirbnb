#!/usr/bin/env python3
"""
Script to populate MongoDB with sample Airbnb listing data
"""

import sys
import os
from datetime import datetime
from bson.decimal128 import Decimal128
from decimal import Decimal

# Add parent directory to path to import models
sys.path.insert(0, os.path.dirname(__file__))

from models import Listing, Review
from mongoengine import connect
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/sample_airbnb")

# Sample listings data
SAMPLE_LISTINGS = [
    {
        "_id": "10006546",
        "name": "Ribeira Charming Duplex",
        "summary": "Fantastic duplex apartment with three bedrooms, located in the historic area of Porto, Ribeira (Cube)...",
        "description": "Privileged views of the Douro River and Ribeira square, our apartment offers the perfect place to stay, relax and enjoy the city. Apartment number one in Ribeira!",
        "price": Decimal128(Decimal("80.00")),
        "property_type": "Apartment",
        "room_type": "Entire home/apt",
        "accommodates": 8,
        "bathrooms": Decimal128(Decimal("1.0")),
        "bedrooms": 3,
        "beds": 5,
        "security_deposit": Decimal128(Decimal("200.00")),
        "cleaning_fee": Decimal128(Decimal("35.00")),
        "extra_people": Decimal128(Decimal("15.00")),
        "guests_included": 6,
        "cancellation_policy": "moderate",
        "address": {
            "street": "Porto, Porto, Portugal",
            "suburb": "",
            "government_area": "Cedofeita, Ildefonso, Sé, Miragaia, Nicolau, Vitória",
            "market": "Porto",
            "country": "Portugal",
            "country_code": "PT",
            "location": {
                "type": "Point",
                "coordinates": [-8.61308, 41.1413],
                "is_location_exact": False
            }
        },
        "amenities": ["TV", "Cable TV", "Wifi", "Kitchen", "Paid parking off premises"],
        "images": {
            "thumbnail_url": "",
            "medium_url": "",
            "picture_url": "https://a0.muscache.com/im/pictures/e83e702f-ef49-40fb-8fa0-6512d7e26e9b.jpg?aki_policy=large",
            "xl_picture_url": ""
        },
        "availability": {
            "availability_30": 28,
            "availability_60": 47,
            "availability_90": 74,
            "availability_365": 239
        },
        "number_of_reviews": 51,
        "review_scores": {
            "review_scores_accuracy": 9,
            "review_scores_cleanliness": 9,
            "review_scores_checkin": 10,
            "review_scores_communication": 10,
            "review_scores_location": 10,
            "review_scores_value": 9,
            "review_scores_rating": 89
        },
        "reviews": []
    },
    {
        "_id": "10009999",
        "name": "Horto flat with small garden",
        "summary": "Lovely and cozy apartment. Close to transportation, restaurants, and shops. Perfect for exploring the city!",
        "description": "My place is close to the metro station. You'll love my place because of the neighborhood and the ambiance. My place is good for couples, solo adventurers, and business travelers.",
        "price": Decimal128(Decimal("317.00")),
        "property_type": "Apartment",
        "room_type": "Entire home/apt",
        "accommodates": 2,
        "bathrooms": Decimal128(Decimal("1.0")),
        "bedrooms": 1,
        "beds": 1,
        "security_deposit": Decimal128(Decimal("300.00")),
        "cleaning_fee": Decimal128(Decimal("50.00")),
        "extra_people": Decimal128(Decimal("0.00")),
        "guests_included": 1,
        "cancellation_policy": "flexible",
        "address": {
            "street": "Rio de Janeiro, Rio de Janeiro, Brazil",
            "suburb": "Jardim Botânico",
            "government_area": "Jardim Botânico",
            "market": "Rio De Janeiro",
            "country": "Brazil",
            "country_code": "BR",
            "location": {
                "type": "Point",
                "coordinates": [-43.23074991429229, -22.966253551739655],
                "is_location_exact": True
            }
        },
        "amenities": ["Wifi", "Kitchen", "Free parking on premises", "Pets allowed", "Heating"],
        "images": {
            "thumbnail_url": "",
            "medium_url": "",
            "picture_url": "https://a0.muscache.com/im/pictures/5b408b9e-45da-4808-be65-4edc1f29c453.jpg?aki_policy=large",
            "xl_picture_url": ""
        },
        "availability": {
            "availability_30": 0,
            "availability_60": 0,
            "availability_90": 0,
            "availability_365": 0
        },
        "number_of_reviews": 0,
        "review_scores": {
            "review_scores_rating": 80
        },
        "reviews": []
    },
    {
        "_id": "10021707",
        "name": "Private Room in Bushwick",
        "summary": "Beautiful, spacious skylit room in a recently renovated Bushwick apartment",
        "description": "Enjoy a bright, quiet, recently renovated room in Bushwick. Room has a skylight and lots of natural light. Apartment has a washer/dryer and dishwasher.",
        "price": Decimal128(Decimal("60.00")),
        "property_type": "Apartment",
        "room_type": "Private room",
        "accommodates": 1,
        "bathrooms": Decimal128(Decimal("1.5")),
        "bedrooms": 1,
        "beds": 1,
        "security_deposit": Decimal128(Decimal("100.00")),
        "cleaning_fee": Decimal128(Decimal("25.00")),
        "extra_people": Decimal128(Decimal("0.00")),
        "guests_included": 1,
        "cancellation_policy": "strict",
        "address": {
            "street": "Brooklyn, NY, United States",
            "suburb": "Bushwick",
            "government_area": "Bushwick",
            "market": "New York",
            "country": "United States",
            "country_code": "US",
            "location": {
                "type": "Point",
                "coordinates": [-73.93615, 40.69791],
                "is_location_exact": True
            }
        },
        "amenities": ["Wifi", "Kitchen", "Washer", "Dryer", "Heating", "Air conditioning"],
        "images": {
            "thumbnail_url": "",
            "medium_url": "",
            "picture_url": "https://a0.muscache.com/im/pictures/15037101/5e400c0f_original.jpg?aki_policy=large",
            "xl_picture_url": ""
        },
        "availability": {
            "availability_30": 20,
            "availability_60": 50,
            "availability_90": 80,
            "availability_365": 300
        },
        "number_of_reviews": 12,
        "review_scores": {
            "review_scores_accuracy": 10,
            "review_scores_cleanliness": 10,
            "review_scores_checkin": 10,
            "review_scores_communication": 10,
            "review_scores_location": 9,
            "review_scores_value": 10,
            "review_scores_rating": 95
        },
        "reviews": []
    },
    {
        "_id": "10030955",
        "name": "Apt Linda Vista Lagoa - Rio",
        "summary": "Lagoa, the best area to stay in Rio! Excellent apartment with wonderful view!",
        "description": "The apartment is spacious, modern and bright. Located in the heart of Lagoa, one of the safest and most desirable neighborhoods in Rio. Walk to restaurants, bars, and the lagoon. Easy access to beaches and attractions.",
        "price": Decimal128(Decimal("200.00")),
        "property_type": "Apartment",
        "room_type": "Entire home/apt",
        "accommodates": 4,
        "bathrooms": Decimal128(Decimal("1.0")),
        "bedrooms": 2,
        "beds": 2,
        "security_deposit": Decimal128(Decimal("400.00")),
        "cleaning_fee": Decimal128(Decimal("80.00")),
        "extra_people": Decimal128(Decimal("50.00")),
        "guests_included": 2,
        "cancellation_policy": "moderate",
        "address": {
            "street": "Rio de Janeiro, Rio de Janeiro, Brazil",
            "suburb": "Lagoa",
            "government_area": "Lagoa",
            "market": "Rio De Janeiro",
            "country": "Brazil",
            "country_code": "BR",
            "location": {
                "type": "Point",
                "coordinates": [-43.20590000000001, -22.97074],
                "is_location_exact": True
            }
        },
        "amenities": ["TV", "Cable TV", "Internet", "Wifi", "Air conditioning", "Kitchen", "Doorman"],
        "images": {
            "thumbnail_url": "",
            "medium_url": "",
            "picture_url": "https://a0.muscache.com/im/pictures/33848024/3e64f0b0_original.jpg?aki_policy=large",
            "xl_picture_url": ""
        },
        "availability": {
            "availability_30": 15,
            "availability_60": 45,
            "availability_90": 75,
            "availability_365": 200
        },
        "number_of_reviews": 28,
        "review_scores": {
            "review_scores_accuracy": 9,
            "review_scores_cleanliness": 10,
            "review_scores_checkin": 10,
            "review_scores_communication": 10,
            "review_scores_location": 10,
            "review_scores_value": 9,
            "review_scores_rating": 92
        },
        "reviews": []
    },
    {
        "_id": "10056443",
        "name": "Cozy Brooklyn Studio",
        "summary": "Charming studio in the heart of Brooklyn with easy access to Manhattan",
        "description": "Perfect for solo travelers or couples. This studio has everything you need for a comfortable stay. Close to subway, restaurants, and nightlife.",
        "price": Decimal128(Decimal("125.00")),
        "property_type": "Apartment",
        "room_type": "Entire home/apt",
        "accommodates": 2,
        "bathrooms": Decimal128(Decimal("1.0")),
        "bedrooms": 1,
        "beds": 1,
        "security_deposit": Decimal128(Decimal("150.00")),
        "cleaning_fee": Decimal128(Decimal("40.00")),
        "extra_people": Decimal128(Decimal("20.00")),
        "guests_included": 1,
        "cancellation_policy": "flexible",
        "address": {
            "street": "Brooklyn, NY, United States",
            "suburb": "Williamsburg",
            "government_area": "Williamsburg",
            "market": "New York",
            "country": "United States",
            "country_code": "US",
            "location": {
                "type": "Point",
                "coordinates": [-73.96020000000001, 40.71424],
                "is_location_exact": True
            }
        },
        "amenities": ["Wifi", "Kitchen", "Heating", "Air conditioning", "Essentials", "Coffee maker"],
        "images": {
            "thumbnail_url": "",
            "medium_url": "",
            "picture_url": "https://a0.muscache.com/im/pictures/72178409/5b180d4b_original.jpg?aki_policy=large",
            "xl_picture_url": ""
        },
        "availability": {
            "availability_30": 25,
            "availability_60": 55,
            "availability_90": 85,
            "availability_365": 250
        },
        "number_of_reviews": 45,
        "review_scores": {
            "review_scores_accuracy": 9,
            "review_scores_cleanliness": 9,
            "review_scores_checkin": 10,
            "review_scores_communication": 10,
            "review_scores_location": 10,
            "review_scores_value": 9,
            "review_scores_rating": 91
        },
        "reviews": []
    }
]

def populate_listings():
    """Populate MongoDB with sample listing data"""
    print("🔌 Connecting to MongoDB...")
    connect(host=MONGO_URI)
    
    print(f"📊 Current listing count: {Listing.objects.count()}")
    
    if Listing.objects.count() > 0:
        response = input("⚠️  Database already has listings. Do you want to clear them? (yes/no): ")
        if response.lower() == 'yes':
            print("🗑️  Clearing existing listings...")
            Listing.objects.delete()
            print("✅ Cleared!")
    
    print(f"\n📝 Adding {len(SAMPLE_LISTINGS)} sample listings...")
    
    for listing_data in SAMPLE_LISTINGS:
        try:
            listing = Listing(**listing_data)
            listing.save()
            print(f"✅ Added: {listing.name} (ID: {listing._id})")
        except Exception as e:
            print(f"❌ Error adding {listing_data.get('name')}: {str(e)}")
    
    final_count = Listing.objects.count()
    print(f"\n🎉 Done! Total listings in database: {final_count}")
    
    # Show sample of what was added
    print("\n📋 Sample listings:")
    for listing in Listing.objects.limit(3):
        print(f"  - {listing.name}: ${float(listing.price)} per night")

if __name__ == "__main__":
    try:
        populate_listings()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)
