# Bank-backend

NOTE: Make sure you do not have anything running on ports 8000 and 3000.

## Docker:
1. There would be 2 instances of docker running for the Arizona and Texas branch.
2. Open 'Postgres Docker Folder' --> Arizona. 
3. Run 'docker pull postgres'
4. Unzip Dockerfile.zip
5. Open unzipped Dockerfile folder in Powershell.
6. Run 'docker build -t az-branch .' in powershell at above path obtained after unzipping.
7. Run 'docker image ls' and verify that you see an image named 'az-branch' .
8. Run 'docker run --name az-branch -p 5433:5432 --restart=always -d az-branch' .
9. Run 'docker ps' and verify that you see the 'az-branch' container running.

10. Open 'Postgres Docker Folder' --> Texas.
12. Unzip Dockerfile.zip
13. Open unzipped Dockerfile folder in Powershell.
14. Run 'docker build -t tx-branch .' in powershell at above path obtained after unzipping.
15. Run 'docker image ls' and verify that you see an image named 'tx-branch' .
16. Run 'docker run --name tx-branch -p 5433:5432 --restart=always -d tx-branch' .
17. Run 'docker ps' and verify that you see the 'tx-branch' container running.
 
## Python
1. Install Python 3.12
2. Fork/clone this repository.
3. Open this repository in PyCharm
4. Set interpreter for PyCharm to Python 3.12 (you'll get the prompt to set this up by clicking on the Play/Run button at the top)
5. Within PyCharm, open the Terminal from the menu to the bottom left
6. Run 'python -m pip install -r requirements.txt'
7. Click on Run/Play at the top and confirm that the server starts successfully.
