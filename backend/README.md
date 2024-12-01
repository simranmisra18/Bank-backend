# Build
docker build -t backend .

# Run
docker run --name backend -p 8000:8000 --restart=always -d backend

# Kill
docker kill backend

# Remove Container (only after Kill)
docker rm backend

# Remove image
docker image rm backend

# Save image as TAR
docker image save --output backend.tar backend

# Load image as TAR
docker load --input backend.tar