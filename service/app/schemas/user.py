"""
用户相关数据模式
定义用户的输入输出数据结构
"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# === 用户基础模式 ===

class UserBase(BaseModel):
    """用户基础模式"""
    email: EmailStr = Field(..., description="邮箱地址")
    username: Optional[str] = Field(None, max_length=50, description="用户名")
    full_name: Optional[str] = Field(None, max_length=100, description="全名")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")
    is_active: bool = Field(True, description="是否激活")
    is_superuser: bool = Field(False, description="是否超级用户")
    is_verified: bool = Field(False, description="是否验证邮箱")


# === 用户创建模式 ===

class UserCreate(UserBase):
    """用户创建模式"""
    password: str = Field(..., min_length=8, max_length=100, description="密码")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "testuser",
                "full_name": "Test User",
                "phone": "13800138000",
                "password": "password123"
            }
        }


# === 用户更新模式 ===

class UserUpdate(BaseModel):
    """用户更新模式"""
    email: Optional[EmailStr] = Field(None, description="邮箱地址")
    username: Optional[str] = Field(None, max_length=50, description="用户名")
    full_name: Optional[str] = Field(None, max_length=100, description="全名")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")
    avatar: Optional[str] = Field(None, max_length=255, description="头像URL")
    bio: Optional[str] = Field(None, description="个人简介")
    is_active: Optional[bool] = Field(None, description="是否激活")
    is_superuser: Optional[bool] = Field(None, description="是否超级用户")
    is_verified: Optional[bool] = Field(None, description="是否验证邮箱")
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Updated Name",
                "phone": "13900139000",
                "bio": "This is my bio"
            }
        }


# === 用户密码更新模式 ===

class UserPasswordUpdate(BaseModel):
    """用户密码更新模式"""
    current_password: str = Field(..., description="当前密码")
    new_password: str = Field(..., min_length=8, max_length=100, description="新密码")
    confirm_password: str = Field(..., description="确认新密码")
    
    class Config:
        json_schema_extra = {
            "example": {
                "current_password": "oldpassword123",
                "new_password": "newpassword123",
                "confirm_password": "newpassword123"
            }
        }


# === 用户输出模式 ===

class User(UserBase):
    """用户输出模式"""
    id: int = Field(..., description="用户ID")
    avatar: Optional[str] = Field(None, description="头像URL")
    bio: Optional[str] = Field(None, description="个人简介")
    last_login_at: Optional[datetime] = Field(None, description="最后登录时间")
    login_count: int = Field(0, description="登录次数")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "user@example.com",
                "username": "testuser",
                "full_name": "Test User",
                "phone": "13800138000",
                "avatar": "https://example.com/avatar.jpg",
                "bio": "This is my bio",
                "is_active": True,
                "is_superuser": False,
                "is_verified": True,
                "last_login_at": "2023-01-01T12:00:00",
                "login_count": 10,
                "created_at": "2023-01-01T10:00:00",
                "updated_at": "2023-01-01T12:00:00"
            }
        }


# === 用户简要信息模式 ===

class UserBrief(BaseModel):
    """用户简要信息模式"""
    id: int = Field(..., description="用户ID")
    email: EmailStr = Field(..., description="邮箱地址")
    username: Optional[str] = Field(None, description="用户名")
    full_name: Optional[str] = Field(None, description="全名")
    avatar: Optional[str] = Field(None, description="头像URL")
    
    class Config:
        from_attributes = True


# === 用户登录模式 ===

class UserLogin(BaseModel):
    """用户登录模式"""
    email: EmailStr = Field(..., description="邮箱地址")
    password: str = Field(..., description="密码")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "password123"
            }
        }


# === 用户注册模式 ===

class UserRegister(BaseModel):
    """用户注册模式"""
    email: EmailStr = Field(..., description="邮箱地址")
    username: str = Field(..., min_length=3, max_length=50, description="用户名")
    full_name: str = Field(..., min_length=1, max_length=100, description="全名")
    password: str = Field(..., min_length=8, max_length=100, description="密码")
    confirm_password: str = Field(..., description="确认密码")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newuser@example.com",
                "username": "newuser",
                "full_name": "New User",
                "password": "password123",
                "confirm_password": "password123"
            }
        }
