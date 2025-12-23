# in this code, we define a MongoDB model for Airbnb listings using MongoEngine.
# the listing and review models are defined with various fields and types.
#by Afolabi Afolayan

import os
from datetime import datetime
from dotenv import load_dotenv
from mongoengine import (
    connect,
    Document,
    StringField,
    Decimal128Field,
    IntField,
    BooleanField,
    DateField,
    DateTimeField,
    ListField,
    ReferenceField,
    CASCADE,
    ValidationError,
)
from bson.decimal128 import Decimal128
from decimal import Decimal




load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/house_ix")
connect(host=MONGO_URI)





# ReferenceField, CASCADE and ValidationError are imported above

class Room(Document):
    meta = {
        "collection": "rooms",
        "strict": True,
        "indexes": [
            "room_number",
            "room_type",
            {"fields": ["price_per_night"]}
        ]
    }

    _id = StringField(primary_key=True)
    room_number = IntField(required=True, unique=True)
    room_type = StringField(required=True)  # single, double, suite
    capacity = IntField(required=True)

    price_per_night = Decimal128Field(required=True)

    amenities = ListField(StringField())
    image_urls = ListField(StringField())

    active = BooleanField(default=True)

    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def to_json(self):
        data = super().to_mongo().to_dict()
        for k, v in data.items():
            if isinstance(v, Decimal128):
                data[k] = float(v.to_decimal())
        return data

class Booking(Document):
    meta = {
        "collection": "bookings",
        "indexes": ["room", "start_date", "end_date"]
    }

    # reference the Room document for integrity
    room = ReferenceField(Room, required=True, reverse_delete_rule=CASCADE)
    # guest_id kept as string (no user model in this service)
    guest_id = StringField(required=True)

    start_date = DateField(required=True)
    end_date = DateField(required=True)

    status = StringField(
        choices=["pending", "confirmed", "checked_in", "checked_out"],
        default="pending"
    )

    total_price = Decimal128Field(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    def clean(self):
        """Validate that end_date is after start_date."""
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError("end_date must be the same or after start_date")


# Example usage to connect to MongoDB and fetch a listing
if __name__ == "__main__":
    from mongoengine.connection import get_db
    try:
        db = get_db()
        print("Connected to MongoDB. Collections:", db.list_collection_names())
        room = Room.objects.first()
        if room:
            print("One Room:", room.to_json())
        else:
            print("No rooms found in the database.")
    except Exception as e:
        print("Failed to connect to MongoDB or fetch room:", e)