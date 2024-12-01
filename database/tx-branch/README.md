# Build
docker build -t tx-branch .

# Run
docker run --name tx-branch -p 5434:5432 --restart=always -d tx-branch

# Kill
docker kill tx-branch

# Remove Container (only after Kill)
docker rm tx-branch

# Remove image
docker image rm tx-branch

# Save image as TAR
docker image save --output tx-branch.tar tx-branch

# Load image as TAR
docker load --input tx-branch.tar 