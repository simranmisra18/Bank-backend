## Instructions for running this project

# Pre-requisites
Please have the following installations ready before doing the below steps:
1. Docker
2. Postman

#Steps
Run the below commands in Poweshell/Bash one by one in this folder containing the README.md file.

# 1. Build Docker images
1. docker build -t frontend frontend/
2. docker build -t backend backend/
3. docker build -t az-branch database/az-branch/
4. docker build -t tx-branch database/tx-branch/


# 2. Run Docker images
1. docker network create newnet
2. docker run -d --name frontend --network newnet --network-alias frontend -p 3000:3000 frontend
3. docker run -d --name backend --network newnet --network-alias backend -p 8000:8000 backend
4. docker run --name az-branch -p 5433:5432 --network newnet --network-alias az-branch --restart=always -d az-branch
5. docker run --name tx-branch -p 5434:5432 --network newnet --network-alias tx-branch --restart=always -d tx-branch

# 3. Check status
docker ps -a

# 4. Access project
Visit: http://localhost:3000

Login Credentials:
1. Arizona Branch:
- Username: az-branch
- Password: password

2. Texas Branch:
- Username: tx-branch 
- Password: password 

Login using either of these credentials to check the customers under these branches

# 5. Evaluate transaction API
- Download Postman
- Import 'transaction.json' as a Postman Collection (https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/)
- Execute the Login GET API - you will receive a token in the response
- Copy the token from the response to the previous API
- Open the Transaction POST API, and go the the Authorization section
- Under 'Auth Type', choose 'Bearer Token' - you should see the string 'THIS-IS-A-PLACEHOLDER'
- Replace the previous placeholder string with the copied token
- Check the 'Body' section, and make changes as required to test the API (you can check the balance for various customers by logging in to the specific branch)
- Execute the API
- Check the response - you should get a 200 OK for a successful transaction, a 403 Forbidden for any issues with amount or customers, and a 401 Unauthorized 
  for an invalid token

# Cleanup 
# 6. Kill Docker containers
docker kill frontend
docker kill backend
docker kill az-branch
docker kill tx-branch

# Remove Docker containers
docker rm frontend
docker rm backend
docker rm az-branch
docker rm tx-branch
docker network rm newnet

# Remove Docker images
docker image rm frontend
docker image rm backend
docker image rm az-branch
docker image rm tx-branch
