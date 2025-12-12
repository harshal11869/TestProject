from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime
from bson import ObjectId

from config import settings
from database import connect_to_mongo, close_mongo_connection, get_database
from models import (
    Customer, CustomerCreate, CustomerUpdate,
    FinancialDetails, FinancialDetailsCreate, FinancialDetailsUpdate,
    Transaction, TransactionCreate
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Customer Management API",
    description="API for managing customer information and financial details",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc:
        doc["_id"] = str(doc["_id"])
        return doc
    return None


@app.get("/")
async def root():
    return {"message": "Customer Management API", "version": "1.0.0"}


# Customer endpoints
@app.post("/api/customers", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: CustomerCreate):
    db = get_database()
    customer_dict = customer.model_dump()
    customer_dict["created_at"] = datetime.utcnow()
    customer_dict["updated_at"] = datetime.utcnow()
    
    result = await db.customers.insert_one(customer_dict)
    created_customer = await db.customers.find_one({"_id": result.inserted_id})
    
    return serialize_doc(created_customer)


@app.get("/api/customers", response_model=List[Customer])
async def get_customers(skip: int = 0, limit: int = 100):
    db = get_database()
    customers = []
    cursor = db.customers.find().skip(skip).limit(limit)
    async for customer in cursor:
        customers.append(serialize_doc(customer))
    return customers


@app.get("/api/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str):
    db = get_database()
    try:
        customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid customer ID format")
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return serialize_doc(customer)


@app.put("/api/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, customer_update: CustomerUpdate):
    db = get_database()
    try:
        oid = ObjectId(customer_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid customer ID format")
    
    update_data = {k: v for k, v in customer_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.customers.update_one(
        {"_id": oid},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    updated_customer = await db.customers.find_one({"_id": oid})
    return serialize_doc(updated_customer)


@app.delete("/api/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(customer_id: str):
    db = get_database()
    try:
        oid = ObjectId(customer_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid customer ID format")
    
    result = await db.customers.delete_one({"_id": oid})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Also delete associated financial details and transactions
    await db.financial_details.delete_many({"customer_id": customer_id})
    await db.transactions.delete_many({"customer_id": customer_id})
    
    return None


# Financial Details endpoints
@app.post("/api/financial-details", response_model=FinancialDetails, status_code=status.HTTP_201_CREATED)
async def create_financial_details(financial_details: FinancialDetailsCreate):
    db = get_database()
    
    # Verify customer exists
    try:
        customer = await db.customers.find_one({"_id": ObjectId(financial_details.customer_id)})
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid customer ID")
    
    financial_dict = financial_details.model_dump()
    financial_dict["created_at"] = datetime.utcnow()
    financial_dict["updated_at"] = datetime.utcnow()
    
    result = await db.financial_details.insert_one(financial_dict)
    created_financial = await db.financial_details.find_one({"_id": result.inserted_id})
    
    return serialize_doc(created_financial)


@app.get("/api/financial-details/customer/{customer_id}", response_model=List[FinancialDetails])
async def get_customer_financial_details(customer_id: str):
    db = get_database()
    financial_details = []
    cursor = db.financial_details.find({"customer_id": customer_id})
    async for detail in cursor:
        financial_details.append(serialize_doc(detail))
    return financial_details


@app.get("/api/financial-details/{detail_id}", response_model=FinancialDetails)
async def get_financial_detail(detail_id: str):
    db = get_database()
    try:
        detail = await db.financial_details.find_one({"_id": ObjectId(detail_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid detail ID format")
    
    if not detail:
        raise HTTPException(status_code=404, detail="Financial details not found")
    
    return serialize_doc(detail)


@app.put("/api/financial-details/{detail_id}", response_model=FinancialDetails)
async def update_financial_details(detail_id: str, details_update: FinancialDetailsUpdate):
    db = get_database()
    try:
        oid = ObjectId(detail_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid detail ID format")
    
    update_data = {k: v for k, v in details_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.financial_details.update_one(
        {"_id": oid},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Financial details not found")
    
    updated_detail = await db.financial_details.find_one({"_id": oid})
    return serialize_doc(updated_detail)


@app.delete("/api/financial-details/{detail_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_financial_details(detail_id: str):
    db = get_database()
    try:
        oid = ObjectId(detail_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid detail ID format")
    
    result = await db.financial_details.delete_one({"_id": oid})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Financial details not found")
    
    return None


# Transaction endpoints
@app.post("/api/transactions", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: TransactionCreate):
    db = get_database()
    
    # Verify customer exists
    try:
        customer = await db.customers.find_one({"_id": ObjectId(transaction.customer_id)})
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid customer ID")
    
    transaction_dict = transaction.model_dump()
    transaction_dict["transaction_date"] = datetime.utcnow()
    
    result = await db.transactions.insert_one(transaction_dict)
    created_transaction = await db.transactions.find_one({"_id": result.inserted_id})
    
    return serialize_doc(created_transaction)


@app.get("/api/transactions/customer/{customer_id}", response_model=List[Transaction])
async def get_customer_transactions(customer_id: str, skip: int = 0, limit: int = 50):
    db = get_database()
    transactions = []
    cursor = db.transactions.find({"customer_id": customer_id}).sort("transaction_date", -1).skip(skip).limit(limit)
    async for transaction in cursor:
        transactions.append(serialize_doc(transaction))
    return transactions


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
