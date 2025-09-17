"""
数据库基础模块
定义基础模型类和公共字段
"""

from typing import Any
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, Boolean
from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    """
    SQLAlchemy 基础模型类
    所有模型都应该继承此类
    """
    id: Any
    __name__: str
    
    # 生成表名
    @declared_attr
    def __tablename__(cls) -> str:
        """自动生成表名（类名的复数形式）"""
        return cls.__name__.lower() + "s"


class TimestampMixin:
    """
    时间戳混入类
    为模型添加创建时间和更新时间字段
    """
    created_at = Column(
        DateTime, 
        default=datetime.utcnow, 
        nullable=False,
        comment="创建时间"
    )
    updated_at = Column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow, 
        nullable=False,
        comment="更新时间"
    )


class SoftDeleteMixin:
    """
    软删除混入类
    为模型添加软删除功能
    """
    is_deleted = Column(
        Boolean, 
        default=False, 
        nullable=False,
        comment="是否已删除"
    )
    deleted_at = Column(
        DateTime, 
        nullable=True,
        comment="删除时间"
    )
    
    def soft_delete(self):
        """执行软删除"""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()


class BaseModel(Base, TimestampMixin):
    """
    基础模型类，包含ID、时间戳
    大多数模型都应该继承此类
    """
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True, comment="主键ID")


class BaseModelWithSoftDelete(BaseModel, SoftDeleteMixin):
    """
    带软删除功能的基础模型类
    需要软删除功能的模型应该继承此类
    """
    __abstract__ = True
