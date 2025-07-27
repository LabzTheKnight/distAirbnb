# in this code, we define a MongoDB model for Airbnb listings using MongoEngine.
# the listing and review models are defined with various fields and types.
#by Afolabi Afolayan

import os
from datetime import datetime
from dotenv import load_dotenv
from mongoengine import (
    connect,
    Document,
    DynamicDocument,
    EmbeddedDocument,
    DynamicEmbeddedDocument,
    StringField,
    Decimal128Field,
    IntField,
    BooleanField,
    DateField,
    DateTimeField,
    ListField,
    DictField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    Decimal128Field
)
from bson.decimal128 import Decimal128
from decimal import Decimal




load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sample_airbnb")
connect(host=MONGO_URI)




class Review(DynamicEmbeddedDocument):
    _id = StringField(required=True)
    listing_id = StringField(required=True)
    reviewer_id = StringField(required=True)
    reviewer_name = StringField(required=True)
    comments = StringField()
    date = DateTimeField(default=datetime.utcnow)




#class Booking(EmbeddedDocument):
#    user_id = StringField(required=True)  
#    start_date = DateField(required=True)
#    end_date = DateField(required=True)
#    total_price = Decimal128Field(required=True)

##    create listing model
class Listing(DynamicDocument):
    meta = {
        "collection": "listingsAndReviews",
        "indexes": [
            "name",
            {"fields": ["-price"]}
        ]
    }
    _id = StringField(primary_key=True)
    name = StringField()
    summary = StringField()
    description = StringField(db_field="notes")
    price = Decimal128Field()
    property_type = StringField()
    room_type = StringField()
    accommodates = IntField()
    bathrooms = Decimal128Field()
    bedrooms = IntField()
    beds = IntField()
    security_deposit = Decimal128Field()
    cleaning_fee = Decimal128Field()
    extra_people = Decimal128Field()
    guests_included = IntField()
    weekly_price = Decimal128Field()
    monthly_price = Decimal128Field()
    cancellation_policy = StringField()
    neighborhood_overview = StringField()
    transit = StringField()
    address = DictField()
    location = DictField(geo_index=True)
    amenities = ListField(StringField())
    availability = DictField()
    number_of_reviews = IntField()
    review_scores = DictField()
    reviews = EmbeddedDocumentListField(Review)
    #bookings = EmbeddedDocumentListField(Booking)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    #saving the document will update the updated_at field
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
    #to_json method to convert Decimal128 and Decimal fields to float
    def to_json(self):
        def convert_values(data):
            for key, value in data.items():
                if isinstance(value, Decimal128):
                    data[key] = float(value.to_decimal())
                elif isinstance(value, Decimal):
                    data[key] = float(value)
                elif isinstance(value, dict):
                    convert_values(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict):
                            convert_values(item)
            return data
        data = super().to_mongo().to_dict()
        data = convert_values(data)
        return data



# Example usage to connect to MongoDB and fetch a listing
if __name__ == "__main__":
    from mongoengine.connection import get_db
    try:
        db = get_db()
        print("Connected to MongoDB. Collections:", db.list_collection_names())
        listing = Listing.objects.first()
        if listing:
            print("One Listing:", listing.to_json())
        else:
            print("No listings found in the database.")
    except Exception as e:
        print("Failed to connect to MongoDB or fetch listing:", e)