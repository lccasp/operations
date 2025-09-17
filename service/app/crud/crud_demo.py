"""
Demo模型CRUD操作
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBaseWithSoftDelete
from app.models.demo import Demo
from app.schemas.demo import DemoCreate, DemoUpdate


class CRUDDemo(CRUDBaseWithSoftDelete[Demo, DemoCreate, DemoUpdate]):
    """
    Demo CRUD操作类
    """
    
    def get_by_name(self, db: Session, *, name: str) -> Optional[Demo]:
        """
        通过名称获取Demo
        
        Args:
            db: 数据库会话
            name: Demo名称
            
        Returns:
            Optional[Demo]: Demo实例或None
        """
        return db.query(Demo).filter(
            Demo.name == name,
            Demo.is_deleted == False
        ).first()
    
    def get_by_owner(
        self, 
        db: Session, 
        *, 
        owner_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Demo]:
        """
        获取指定用户的Demo列表
        
        Args:
            db: 数据库会话
            owner_id: 所有者ID
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        return db.query(Demo).filter(
            Demo.owner_id == owner_id,
            Demo.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def get_active(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Demo]:
        """
        获取活跃状态的Demo列表
        
        Args:
            db: 数据库会话
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        return db.query(Demo).filter(
            Demo.status == "active",
            Demo.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def get_featured(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Demo]:
        """
        获取推荐的Demo列表
        
        Args:
            db: 数据库会话
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        return db.query(Demo).filter(
            Demo.is_featured == True,
            Demo.is_deleted == False
        ).order_by(Demo.priority.desc()).offset(skip).limit(limit).all()
    
    def search_by_name(
        self, 
        db: Session, 
        *, 
        name_pattern: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Demo]:
        """
        通过名称模糊搜索Demo
        
        Args:
            db: 数据库会话
            name_pattern: 名称搜索模式
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        return db.query(Demo).filter(
            Demo.name.like(f"%{name_pattern}%"),
            Demo.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def count_by_status(self, db: Session, *, status: str) -> int:
        """
        统计指定状态的Demo数量
        
        Args:
            db: 数据库会话
            status: 状态
            
        Returns:
            int: Demo数量
        """
        return db.query(Demo).filter(
            Demo.status == status,
            Demo.is_deleted == False
        ).count()
    
    def update_status(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        new_status: str
    ) -> Optional[Demo]:
        """
        更新Demo状态
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            new_status: 新状态
            
        Returns:
            Optional[Demo]: 更新后的Demo实例
        """
        demo = self.get(db, id=demo_id)
        if demo:
            demo.status = new_status
            db.add(demo)
            db.commit()
            db.refresh(demo)
        return demo
    
    def set_featured(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        is_featured: bool = True
    ) -> Optional[Demo]:
        """
        设置Demo为推荐/取消推荐
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            is_featured: 是否推荐
            
        Returns:
            Optional[Demo]: 更新后的Demo实例
        """
        demo = self.get(db, id=demo_id)
        if demo:
            demo.is_featured = is_featured
            db.add(demo)
            db.commit()
            db.refresh(demo)
        return demo
    
    def update_priority(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        priority: int
    ) -> Optional[Demo]:
        """
        更新Demo优先级
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            priority: 优先级
            
        Returns:
            Optional[Demo]: 更新后的Demo实例
        """
        demo = self.get(db, id=demo_id)
        if demo:
            demo.priority = priority
            db.add(demo)
            db.commit()
            db.refresh(demo)
        return demo


demo = CRUDDemo(Demo)
