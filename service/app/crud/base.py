"""
基础CRUD操作类
提供通用的数据库操作方法
"""

from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    基础CRUD操作类
    提供标准的创建、读取、更新、删除操作
    """
    
    def __init__(self, model: Type[ModelType]):
        """
        初始化CRUD对象
        
        Args:
            model: SQLAlchemy模型类
        """
        self.model = model
    
    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        通过ID获取单个记录
        
        Args:
            db: 数据库会话
            id: 记录ID
            
        Returns:
            Optional[ModelType]: 模型实例或None
        """
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None
    ) -> List[ModelType]:
        """
        获取多个记录
        
        Args:
            db: 数据库会话
            skip: 跳过记录数
            limit: 限制记录数
            filters: 过滤条件字典
            order_by: 排序字段
            
        Returns:
            List[ModelType]: 模型实例列表
        """
        query = db.query(self.model)
        
        # 应用过滤条件
        if filters:
            filter_conditions = []
            for key, value in filters.items():
                if hasattr(self.model, key):
                    attr = getattr(self.model, key)
                    if isinstance(value, list):
                        filter_conditions.append(attr.in_(value))
                    elif isinstance(value, dict) and 'like' in value:
                        filter_conditions.append(attr.like(f"%{value['like']}%"))
                    else:
                        filter_conditions.append(attr == value)
            
            if filter_conditions:
                query = query.filter(and_(*filter_conditions))
        
        # 应用排序
        if order_by:
            if order_by.startswith('-'):
                # 降序
                order_field = order_by[1:]
                if hasattr(self.model, order_field):
                    query = query.order_by(getattr(self.model, order_field).desc())
            else:
                # 升序
                if hasattr(self.model, order_by):
                    query = query.order_by(getattr(self.model, order_by))
        
        return query.offset(skip).limit(limit).all()
    
    def count(
        self, 
        db: Session, 
        filters: Optional[Dict[str, Any]] = None
    ) -> int:
        """
        获取记录总数
        
        Args:
            db: 数据库会话
            filters: 过滤条件字典
            
        Returns:
            int: 记录总数
        """
        query = db.query(self.model)
        
        # 应用过滤条件
        if filters:
            filter_conditions = []
            for key, value in filters.items():
                if hasattr(self.model, key):
                    attr = getattr(self.model, key)
                    if isinstance(value, list):
                        filter_conditions.append(attr.in_(value))
                    elif isinstance(value, dict) and 'like' in value:
                        filter_conditions.append(attr.like(f"%{value['like']}%"))
                    else:
                        filter_conditions.append(attr == value)
            
            if filter_conditions:
                query = query.filter(and_(*filter_conditions))
        
        return query.count()
    
    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        """
        创建新记录
        
        Args:
            db: 数据库会话
            obj_in: 创建对象的数据
            
        Returns:
            ModelType: 创建的模型实例
        """
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # type: ignore
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """
        更新记录
        
        Args:
            db: 数据库会话
            db_obj: 要更新的模型实例
            obj_in: 更新数据
            
        Returns:
            ModelType: 更新后的模型实例
        """
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db: Session, *, id: int) -> ModelType:
        """
        删除记录
        
        Args:
            db: 数据库会话
            id: 记录ID
            
        Returns:
            ModelType: 被删除的模型实例
        """
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    def get_by_field(
        self, 
        db: Session, 
        field_name: str, 
        field_value: Any
    ) -> Optional[ModelType]:
        """
        通过指定字段获取记录
        
        Args:
            db: 数据库会话
            field_name: 字段名
            field_value: 字段值
            
        Returns:
            Optional[ModelType]: 模型实例或None
        """
        if hasattr(self.model, field_name):
            attr = getattr(self.model, field_name)
            return db.query(self.model).filter(attr == field_value).first()
        return None
    
    def exists(self, db: Session, **kwargs) -> bool:
        """
        检查记录是否存在
        
        Args:
            db: 数据库会话
            **kwargs: 查询条件
            
        Returns:
            bool: 是否存在
        """
        query = db.query(self.model)
        
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                attr = getattr(self.model, key)
                query = query.filter(attr == value)
        
        return query.first() is not None


class CRUDBaseWithSoftDelete(CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    支持软删除的CRUD操作类
    """
    
    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
        include_deleted: bool = False
    ) -> List[ModelType]:
        """
        获取多个记录（默认排除已删除的记录）
        """
        if not include_deleted and hasattr(self.model, 'is_deleted'):
            if filters is None:
                filters = {}
            filters['is_deleted'] = False
        
        return super().get_multi(
            db, skip=skip, limit=limit, filters=filters, order_by=order_by
        )
    
    def count(
        self, 
        db: Session, 
        filters: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False
    ) -> int:
        """
        获取记录总数（默认排除已删除的记录）
        """
        if not include_deleted and hasattr(self.model, 'is_deleted'):
            if filters is None:
                filters = {}
            filters['is_deleted'] = False
        
        return super().count(db, filters=filters)
    
    def soft_delete(self, db: Session, *, id: int) -> ModelType:
        """
        软删除记录
        
        Args:
            db: 数据库会话
            id: 记录ID
            
        Returns:
            ModelType: 被软删除的模型实例
        """
        obj = db.query(self.model).get(id)
        if obj and hasattr(obj, 'soft_delete'):
            obj.soft_delete()
            db.add(obj)
            db.commit()
            db.refresh(obj)
        return obj
