#!/bin/bash
# Quick script to populate listing data

echo "🚀 Populating listing data..."
docker exec -it distairbnb-list-service-1 python populate_data.py
