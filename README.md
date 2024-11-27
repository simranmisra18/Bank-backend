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
