# Use the official MongoDB image from the Docker Hub
FROM mongo:latest

# Set environment variables
ENV MONGO_INITDB_DATABASE=test-database

# Expose port 27017
EXPOSE 27017

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD mongo --eval 'printjson(db.runCommand({ connectionStatus: 1 }))'

# Create a volume for MongoDB data
VOLUME /data/db
