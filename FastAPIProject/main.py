from decimal import Decimal

from fastapi import FastAPI, Security, Body
from typing import Annotated

from utils import VerifyToken
from Exceptions import UnauthenticatedException, UnauthorizedException

from sqlalchemy import func
from sqlmodel import select

from SQLModels.Branch import BranchPublic, Branch
from SQLModels.Customers import Customers, CustomersPublic, CustomersCreate, CustomersTransfer

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


@app.post("/api/transfer")
async def transfer(customer_one: Annotated[CustomersPublic, Body(embed=True)],
                   customer_two: Annotated[CustomersPublic, Body(embed=True)],
                   amount: Annotated[Decimal, Body(embed=True)],
                   auth_result: str = Security(auth_utils.verify)) -> dict:


    session_one, session_two = None, None
    try:
        session_one = next(get_database_session(customer_one.branch_id))
        session_two = next(get_database_session(customer_two.branch_id))

        if session_one is None or session_two is None:
            raise Exception()
    except Exception as error:
        raise UnauthorizedException('Invalid branch specified')

    try:
        customer_one_check_query = select(Customers).where(Customers.branch_id == customer_one.branch_id,
                                                           Customers.customer_id == customer_one.customer_id)

        customer_two_check_query = select(Customers).where(Customers.branch_id == customer_two.branch_id,
                                                           Customers.customer_id == customer_two.customer_id)

        customer_one_object = session_one.exec(customer_one_check_query).one()
        customer_two_object = session_two.exec(customer_two_check_query).one()

        if customer_one_object.balance < amount:
            raise Exception()

        customer_one_object.balance -= amount
        customer_two_object.balance += amount

        session_one.add(customer_one_object)
        session_two.add(customer_two_object)

        session_one.commit()
        session_two.commit()
    except Exception as error:
        session_one.rollback()
        session_two.rollback()
        raise UnauthorizedException('Amount could not be transferred')

    return {'status': 'Transfer successful!'}

@app.post("/api/adduser")
async def adduser(customer: CustomersCreate, auth_result: str = Security(auth_utils.verify)) -> CustomersPublic:
    print('Customer CREATE: {}'.format(customer))
    # Need to write code to create customer in DB
    return CustomersPublic.model_validate(customer)
