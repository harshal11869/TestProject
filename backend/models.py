from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None


class Customer(CustomerBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True


class FinancialDetailsBase(BaseModel):
    customer_id: str
    account_number: str
    account_type: str  # savings, checking, credit
    balance: float
    credit_limit: Optional[float] = None
    monthly_income: Optional[float] = None
    employment_status: str


class FinancialDetailsCreate(FinancialDetailsBase):
    pass


class FinancialDetailsUpdate(BaseModel):
    account_number: Optional[str] = None
    account_type: Optional[str] = None
    balance: Optional[float] = None
    credit_limit: Optional[float] = None
    monthly_income: Optional[float] = None
    employment_status: Optional[str] = None


class FinancialDetails(FinancialDetailsBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True


class TransactionBase(BaseModel):
    customer_id: str
    transaction_type: str  # debit, credit
    amount: float
    description: str
    category: str


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: str = Field(alias="_id")
    transaction_date: datetime

    class Config:
        populate_by_name = True
