# Bank-backend

NOTE: Make sure you do not have anything running on ports 8000 and 3000.

## Docker:
1. Run 'docker pull postgres'
2. Unzip Dockerfile.zip
3. Open unzipped Dockerfile folder in Powershell
4. Run 'docker build -t bank-postgres .' in powershell at above path obtained after unzipping.
5. Run 'docker image ls' and verify that you see an image named 'bank-postgres' .
6. Run 'docker run --name bankdb -p 5433:5432 --restart=always -d bank-postgres' .
7. Run 'docker ps' and verify that you see the 'bankdb' container running.
 
## Python
1. Install Python 3.12
2. Fork/clone this repository.
3. Open this repository in PyCharm
4. Set interpreter for PyCharm to Python 3.12 (you'll get the prompt to set this up by clicking on the Play/Run button at the top)
5. Within PyCharm, open the Terminal from the menu to the bottom left
6. Run 'python -m pip install -r requirements.txt'
7. Click on Run/Play at the top and confirm that the server starts successfully.

## Architecture Diagram
<img width="391" alt="image" src="https://github.com/user-attachments/assets/7a0284bf-b1ae-47af-b2a4-31fb9cef5ad8" />

## Implementation Details
### 2PC Transactions

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


