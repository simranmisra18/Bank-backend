from sqlmodel import Field, Session, SQLModel, create_engine, select
from decimal import Decimal

# Common fields for all Branch objects
class BranchBase(SQLModel):
    first_name: str = Field(index=True)
    balance: Decimal | None = Field(default=0, max_digits=15, decimal_places=2)


# Actual Branch table representation
class Branch(BranchBase, table=True):
    branch_id: str = Field(index=True, primary_key=True)
    password_hash: str = Field()


# Branch representation that will be sent to frontend
class BranchPublic(BranchBase):
    branch_id: str


class BranchCreate(BranchBase):
    pass

class BranchUpdate(BranchBase):
    pass
