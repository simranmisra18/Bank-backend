# Build
docker build -t az-branch .

# Run
docker run --name az-branch -p 5433:5432 --restart=always -d az-branch

# Kill
docker kill az-branch

# Remove Container (only after Kill)
docker rm az-branch

# Remove image
docker image rm az-branch

# Save image as TAR
docker save --output az-branch.tar az-branch

# Load image as TAR
docker load --input az-branch.tar