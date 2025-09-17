"""
Demo相关数据模式
定义Demo的输入输出数据结构
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.user import UserBrief


# === Demo基础模式 ===

class DemoBase(BaseModel):
    """Demo基础模式"""
    name: str = Field(..., max_length=100, description="名称")
    description: Optional[str] = Field(None, description="描述")
    status: str = Field("active", description="状态: active, inactive, pending")
    priority: int = Field(0, description="优先级，数字越大优先级越高")
    is_featured: bool = Field(False, description="是否推荐")


# === Demo创建模式 ===

class DemoCreate(DemoBase):
    """Demo创建模式"""
    owner_id: int = Field(..., description="所有者ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "示例Demo",
                "description": "这是一个示例Demo的描述",
                "status": "active",
                "priority": 1,
                "is_featured": False,
                "owner_id": 1
            }
        }


# === Demo更新模式 ===

class DemoUpdate(BaseModel):
    """Demo更新模式"""
    name: Optional[str] = Field(None, max_length=100, description="名称")
    description: Optional[str] = Field(None, description="描述")
    status: Optional[str] = Field(None, description="状态")
    priority: Optional[int] = Field(None, description="优先级")
    is_featured: Optional[bool] = Field(None, description="是否推荐")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "更新后的Demo名称",
                "description": "更新后的描述",
                "status": "active",
                "priority": 2,
                "is_featured": True
            }
        }


# === Demo状态更新模式 ===

class DemoStatusUpdate(BaseModel):
    """Demo状态更新模式"""
    status: str = Field(..., description="新状态: active, inactive, pending")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "inactive"
            }
        }


# === Demo优先级更新模式 ===

class DemoPriorityUpdate(BaseModel):
    """Demo优先级更新模式"""
    priority: int = Field(..., description="优先级")
    
    class Config:
        json_schema_extra = {
            "example": {
                "priority": 5
            }
        }


# === Demo推荐设置模式 ===

class DemoFeaturedUpdate(BaseModel):
    """Demo推荐设置模式"""
    is_featured: bool = Field(..., description="是否推荐")
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_featured": True
            }
        }


# === Demo输出模式 ===

class Demo(DemoBase):
    """Demo输出模式"""
    id: int = Field(..., description="Demo ID")
    owner_id: int = Field(..., description="所有者ID")
    is_deleted: bool = Field(False, description="是否已删除")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "示例Demo",
                "description": "这是一个示例Demo的描述",
                "status": "active",
                "priority": 1,
                "is_featured": False,
                "owner_id": 1,
                "is_deleted": False,
                "created_at": "2023-01-01T10:00:00",
                "updated_at": "2023-01-01T12:00:00"
            }
        }


# === Demo详细信息模式 ===

class DemoDetail(Demo):
    """Demo详细信息模式（包含所有者信息）"""
    owner: UserBrief = Field(..., description="所有者信息")
    
    class Config:
        from_attributes = True


# === Demo简要信息模式 ===

class DemoBrief(BaseModel):
    """Demo简要信息模式"""
    id: int = Field(..., description="Demo ID")
    name: str = Field(..., description="名称")
    status: str = Field(..., description="状态")
    is_featured: bool = Field(..., description="是否推荐")
    
    class Config:
        from_attributes = True


# === Demo搜索模式 ===

class DemoSearch(BaseModel):
    """Demo搜索模式"""
    name: Optional[str] = Field(None, description="名称关键词")
    status: Optional[str] = Field(None, description="状态筛选")
    is_featured: Optional[bool] = Field(None, description="是否只显示推荐")
    owner_id: Optional[int] = Field(None, description="所有者ID筛选")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "搜索关键词",
                "status": "active",
                "is_featured": True,
                "owner_id": 1
            }
        }
