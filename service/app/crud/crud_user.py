"""
用户相关CRUD操作
"""

from typing import Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """
    用户CRUD操作类
    """
    
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """
        通过邮箱获取用户
        
        Args:
            db: 数据库会话
            email: 邮箱地址
            
        Returns:
            Optional[User]: 用户实例或None
        """
        return db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        """
        通过用户名获取用户
        
        Args:
            db: 数据库会话
            username: 用户名
            
        Returns:
            Optional[User]: 用户实例或None
        """
        return db.query(User).filter(User.username == username).first()
    
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """
        创建用户
        
        Args:
            db: 数据库会话
            obj_in: 用户创建数据
            
        Returns:
            User: 创建的用户实例
        """
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            full_name=obj_in.full_name,
            phone=obj_in.phone,
            hashed_password=get_password_hash(obj_in.password),
            is_active=True,
            is_superuser=False,
            is_verified=False,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_password(
        self, db: Session, *, db_obj: User, new_password: str
    ) -> User:
        """
        更新用户密码
        
        Args:
            db: 数据库会话
            db_obj: 用户实例
            new_password: 新密码
            
        Returns:
            User: 更新后的用户实例
        """
        db_obj.hashed_password = get_password_hash(new_password)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> Optional[User]:
        """
        验证用户登录
        
        Args:
            db: 数据库会话
            email: 邮箱
            password: 密码
            
        Returns:
            Optional[User]: 验证成功返回用户实例，失败返回None
        """
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def is_active(self, user: User) -> bool:
        """
        检查用户是否激活
        
        Args:
            user: 用户实例
            
        Returns:
            bool: 是否激活
        """
        return user.is_active and not user.is_deleted
    
    def is_superuser(self, user: User) -> bool:
        """
        检查用户是否为超级用户
        
        Args:
            user: 用户实例
            
        Returns:
            bool: 是否为超级用户
        """
        return user.is_superuser
    
    def deactivate(self, db: Session, *, user_id: int) -> User:
        """
        停用用户
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            
        Returns:
            User: 更新后的用户实例
        """
        user = self.get(db, id=user_id)
        if user:
            user.is_active = False
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    def activate(self, db: Session, *, user_id: int) -> User:
        """
        激活用户
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            
        Returns:
            User: 更新后的用户实例
        """
        user = self.get(db, id=user_id)
        if user:
            user.is_active = True
            db.add(user)
            db.commit()
            db.refresh(user)
        return user


user = CRUDUser(User)
