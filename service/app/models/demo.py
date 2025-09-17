"""
示例模型
演示业务模型的实现方式
"""

from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import BaseModelWithSoftDelete


class Demo(BaseModelWithSoftDelete):
    """
    示例模型
    演示基础CRUD操作和业务逻辑实现
    """
    
    name = Column(
        String(100), 
        nullable=False, 
        index=True,
        comment="名称"
    )
    
    description = Column(
        Text, 
        nullable=True,
        comment="描述"
    )
    
    status = Column(
        String(20), 
        default="active", 
        nullable=False,
        comment="状态: active, inactive, pending"
    )
    
    priority = Column(
        Integer, 
        default=0, 
        nullable=False,
        comment="优先级，数字越大优先级越高"
    )
    
    is_featured = Column(
        Boolean, 
        default=False, 
        nullable=False,
        comment="是否推荐"
    )
    
    # 外键关联用户
    owner_id = Column(
        Integer, 
        ForeignKey("users.id"), 
        nullable=False,
        comment="所有者ID"
    )
    
    # 关系映射
    owner = relationship("User", back_populates="demos")
    
    def __repr__(self):
        return f"<Demo(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """是否为活跃状态"""
        return self.status == "active" and not self.is_deleted
    
    def activate(self):
        """激活"""
        self.status = "active"
    
    def deactivate(self):
        """停用"""
        self.status = "inactive"
