"""
用户模型
定义用户相关的数据模型
"""

from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from fastapi_users.db import SQLAlchemyBaseUserTable

from app.db.base import Base, TimestampMixin


class User(SQLAlchemyBaseUserTable[int], Base, TimestampMixin):
    """
    用户模型
    继承 FastAPI-Users 的基础用户表，添加自定义字段
    """
    
    # 基础字段由 SQLAlchemyBaseUserTable 提供：
    # - id: int (主键)
    # - email: str (邮箱，唯一)
    # - hashed_password: str (哈希密码)
    # - is_active: bool (是否激活)
    # - is_superuser: bool (是否超级用户)
    # - is_verified: bool (是否验证邮箱)
    
    # 自定义字段
    username = Column(
        String(50), 
        unique=True, 
        index=True, 
        nullable=True,
        comment="用户名"
    )
    
    full_name = Column(
        String(100), 
        nullable=True,
        comment="全名"
    )
    
    phone = Column(
        String(20), 
        nullable=True,
        comment="手机号"
    )
    
    avatar = Column(
        String(255), 
        nullable=True,
        comment="头像URL"
    )
    
    bio = Column(
        Text, 
        nullable=True,
        comment="个人简介"
    )
    
    # 账户状态
    is_deleted = Column(
        Boolean, 
        default=False, 
        nullable=False,
        comment="是否已删除"
    )
    
    last_login_at = Column(
        DateTime, 
        nullable=True,
        comment="最后登录时间"
    )
    
    login_count = Column(
        Integer, 
        default=0, 
        nullable=False,
        comment="登录次数"
    )
    
    # 关系映射
    demos = relationship("Demo", back_populates="owner")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"
