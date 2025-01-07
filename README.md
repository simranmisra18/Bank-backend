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

## Architecture Diagram
<img width="391" alt="image" src="https://github.com/user-attachments/assets/7a0284bf-b1ae-47af-b2a4-31fb9cef5ad8" />

## Implementation Details
### A. 2PC Transactions

 The 2-Phase Commit (2PC) protocol ensures that 
transactions remain consistent across multiple databases. It 
works in two stages: First, in the "prepare" phase, the 
coordinator checks if all the databases involved are ready to 
commit the transaction. Then, in the "commit" phase, the 
transaction is finalized if all databases agree. If any database 
refuses to commit, the entire transaction is canceled, and all 
changes are rolled back to maintain consistency.
 We demonstrated distributed database transactions using 
PostgreSQL in Docker, with instances for the Arizona and 
Texas branches. Postman was used to simulate transaction API 
calls. After a transaction, we verified that the amount was 
deducted from the first customer’s account at Arizona Branch 
and credited to the second customer’s account at Texas 
Branch. The transaction depends on the customer’s branch ID 
for connection, and failure at any point causes the transaction 
to fail, ensuring no funds are transferred. Before starting, we 
confirm the customer has sufficient balance. If all conditions 
are met, the transaction is executed with simultaneous debit 
and credit. In case of failure, the transaction is rolled back. 
This proof of concept was successfully demonstrated in a local 
environment, but due to resource limitations and integration 
challenges, we couldn't integrate it with the hosted application.

### B. LWLocks 

 LWLocks are lightweight synchronization mechanisms in 
PostgreSQL that protect shared resources, such as buffers and 
internal data structures, ensuring safe access in a multi-process 
environment. They are faster and more resource-efficient than 
traditional locks, making them ideal for internal database 
operations. By using LWLocks, PostgreSQL can maintain 
concurrency 
without 
slowing 
down performance. 
Serialization, on the other hand, ensures that concurrent 
transactions produce results as if they were executed one after 
the other, preventing conflicts. PostgreSQL achieves this 
through Serializable Snapshot Isolation (SSI), which helps 
maintain data consistency while supporting high levels of 
concurrency. This is particularly crucial for financial systems, 
like our distributed banking application, where data integrity 
and performance are both key priorities.
 Our system is designed to handle multiple transactions 
simultaneously. This ensures that the users can perform 
operations like deposits, withdrawals, or transfers without 
waiting for other transactions to be completed. We have 
implemented Mutex locks, which are used to maintain data 
consistency during asynchronous operations, preventing 
issues such as race conditions or deadlocks. Mutex locks 
ensure atomicity in transactions by failing inconsistent 
operations, such as simultaneous asynchronous transactions 
that might conflict. For instance, if two deposits of $8 are 
processed concurrently on an account with a balance limit of 
$16, the system ensures no balance exceeds the limit.



