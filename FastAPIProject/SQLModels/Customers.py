import enum

from datetime import datetime
from sqlmodel import Field, SQLModel, Enum
from decimal import Decimal

class ST(str, enum.Enum):
    AZ = 'AZ'
    CA = 'CA'
    WA = 'WA'
    NY = 'NY'
    TX = 'TX'
    IL = 'IL'

class CustomersBase(SQLModel):
    first_name: str = Field()
    balance: Decimal = Field(default=0, max_digits=15, decimal_places=2)

class Customers(CustomersBase, table=True):
    customer_id: str = Field(index=True, primary_key=True)
    password_hash: str = Field()
    first_name: str = Field()
    middle_name: str = Field()
    last_name: str = Field()
    loc: str = Field()
    pincode: int = Field()
    st: ST = Field(Enum(ST))
    credit_limit: Decimal = Field(default=0, max_digits=15, decimal_places=2)
    credit_usage: Decimal = Field(default=0, max_digits=15, decimal_places=2)
    credit_score: int = Field()
    registration_time: datetime = Field(default=None)
    branch_id: str = Field()
    balance: Decimal = Field(default=0, max_digits=15, decimal_places=2)

class CustomersPublic(CustomersBase):
    customer_id: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    pincode: int
    credit_limit: Decimal
    credit_usage: Decimal
    credit_score: int
    registration_time: datetime
    branch_id: str
    balance: Decimal

class CustomersCreate(CustomersBase):
    first_name: str
    middle_name: str | None = None
    last_name: str
    loc: str | None = None
    pincode: int
    st: ST = Field(Enum(ST))