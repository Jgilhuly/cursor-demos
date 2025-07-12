from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    tags: List[str] = []
    in_stock: bool = True
    created_at: datetime = datetime.now()

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    tags: List[str] = []
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    in_stock: Optional[bool] = None 