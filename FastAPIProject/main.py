from fastapi import FastAPI, Security

from utils import VerifyToken
from Exceptions import UnauthorizedException, UnauthenticatedException

from sqlalchemy import func
from sqlmodel import select

from SQLModels.Branch import BranchPublic, Branch
from SQLModels.Customers import Customers, CustomersPublic, CustomersCreate

from fastapi.middleware.cors import CORSMiddleware

from database import get_database_session

app = FastAPI() # Starts server and listens on http://localhost:8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # This is the frontend server address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_utils = VerifyToken()

@app.get("/api/login")
async def login(branch_id: str,
                password_hash: str) -> dict:
    # Get database session
    session = next(get_database_session(branch_id)) # Connection to required database

    # Query for authenticating user
    branch_select = select(Branch).where(Branch.branch_id == branch_id, Branch.password_hash == password_hash)

    try:
        # Get branch, if authentication was successful
        branch = BranchPublic.model_validate(session.exec(branch_select).one())
    except Exception as error:
        print(error)
        raise UnauthenticatedException('Error authenticating admin user!')

    # Generate JWT based on branch info
    token = auth_utils.generate_token(branch)

    # Prepare response
    return {"token": token, "data": branch}

@app.get("/api/users")
async def login(branchid: str,
                offset: int,
                auth_result: str = Security(auth_utils.verify)) -> dict: # include in ALL API calls that require authenticated user
    # Get database session
    session = next(get_database_session(branchid))

    # Aggregate count
    customer_count_query = select(func.count(Customers.customer_id)).where(Customers.branch_id == branchid).offset(offset)
    customer_count = session.exec(customer_count_query).first()

    # Actual customers, 'offset' number of rows onwards
    customer_query = select(Customers).where(Customers.branch_id == branchid).offset(offset).limit(5)
    customers = session.exec(customer_query)

    # List of customers to be displayed in frontend
    customer_data = [CustomersPublic.model_validate(customer) for customer in customers]

    return {'count': customer_count, 'data': customer_data, 'offset': offset}

@app.post("/api/adduser")
async def adduser(customer: CustomersCreate, auth_result: str = Security(auth_utils.verify)) -> CustomersPublic:
    print('Customer CREATE: {}'.format(customer))
    # Need to write code to create customer in DB
    return CustomersPublic.model_validate(customer)
