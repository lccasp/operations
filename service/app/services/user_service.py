"""
用户业务逻辑服务
处理用户相关的业务逻辑
"""

from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.crud import user as user_crud
from app.schemas.user import UserCreate, UserUpdate, UserPasswordUpdate
from app.models.user import User
from app.core.response import BusinessException, NotFoundException
from app.core.security import verify_password, get_password_hash


class UserService:
    """用户业务逻辑服务类"""
    
    def create_user(self, db: Session, *, user_in: UserCreate) -> User:
        """
        创建新用户
        
        Args:
            db: 数据库会话
            user_in: 用户创建数据
            
        Returns:
            User: 创建的用户实例
            
        Raises:
            BusinessException: 业务逻辑错误
        """
        # 检查邮箱是否已存在
        existing_user = user_crud.get_by_email(db, email=user_in.email)
        if existing_user:
            raise BusinessException(
                error="邮箱已被注册",
                message="该邮箱地址已被其他用户使用"
            )
        
        # 检查用户名是否已存在（如果提供）
        if user_in.username:
            existing_username = user_crud.get_by_username(db, username=user_in.username)
            if existing_username:
                raise BusinessException(
                    error="用户名已被占用",
                    message="该用户名已被其他用户使用"
                )
        
        # 创建用户
        return user_crud.create(db, obj_in=user_in)
    
    def get_user_by_id(self, db: Session, *, user_id: int) -> User:
        """
        通过ID获取用户
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            
        Returns:
            User: 用户实例
            
        Raises:
            NotFoundException: 用户不存在
        """
        user = user_crud.get(db, id=user_id)
        if not user:
            raise NotFoundException(
                error="用户不存在",
                message=f"ID为 {user_id} 的用户不存在"
            )
        return user
    
    def get_user_by_email(self, db: Session, *, email: str) -> User:
        """
        通过邮箱获取用户
        
        Args:
            db: 数据库会话
            email: 邮箱地址
            
        Returns:
            User: 用户实例
            
        Raises:
            NotFoundException: 用户不存在
        """
        user = user_crud.get_by_email(db, email=email)
        if not user:
            raise NotFoundException(
                error="用户不存在",
                message=f"邮箱为 {email} 的用户不存在"
            )
        return user
    
    def update_user(
        self, 
        db: Session, 
        *, 
        user_id: int, 
        user_in: UserUpdate
    ) -> User:
        """
        更新用户信息
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            user_in: 更新数据
            
        Returns:
            User: 更新后的用户实例
            
        Raises:
            NotFoundException: 用户不存在
            BusinessException: 业务逻辑错误
        """
        user = self.get_user_by_id(db, user_id=user_id)
        
        # 检查邮箱是否被其他用户使用
        if user_in.email and user_in.email != user.email:
            existing_user = user_crud.get_by_email(db, email=user_in.email)
            if existing_user:
                raise BusinessException(
                    error="邮箱已被注册",
                    message="该邮箱地址已被其他用户使用"
                )
        
        # 检查用户名是否被其他用户使用
        if user_in.username and user_in.username != user.username:
            existing_username = user_crud.get_by_username(db, username=user_in.username)
            if existing_username:
                raise BusinessException(
                    error="用户名已被占用",
                    message="该用户名已被其他用户使用"
                )
        
        return user_crud.update(db, db_obj=user, obj_in=user_in)
    
    def update_password(
        self, 
        db: Session, 
        *, 
        user_id: int, 
        password_update: UserPasswordUpdate
    ) -> User:
        """
        更新用户密码
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            password_update: 密码更新数据
            
        Returns:
            User: 更新后的用户实例
            
        Raises:
            NotFoundException: 用户不存在
            BusinessException: 业务逻辑错误
        """
        user = self.get_user_by_id(db, user_id=user_id)
        
        # 验证当前密码
        if not verify_password(password_update.current_password, user.hashed_password):
            raise BusinessException(
                error="当前密码错误",
                message="请输入正确的当前密码"
            )
        
        # 验证新密码确认
        if password_update.new_password != password_update.confirm_password:
            raise BusinessException(
                error="密码确认不匹配",
                message="新密码和确认密码不一致"
            )
        
        # 检查新密码是否与当前密码相同
        if verify_password(password_update.new_password, user.hashed_password):
            raise BusinessException(
                error="新密码与当前密码相同",
                message="新密码不能与当前密码相同"
            )
        
        return user_crud.update_password(db, db_obj=user, new_password=password_update.new_password)
    
    def authenticate_user(
        self, 
        db: Session, 
        *, 
        email: str, 
        password: str
    ) -> Optional[User]:
        """
        用户认证
        
        Args:
            db: 数据库会话
            email: 邮箱
            password: 密码
            
        Returns:
            Optional[User]: 认证成功返回用户实例，失败返回None
        """
        user = user_crud.authenticate(db, email=email, password=password)
        if user and user_crud.is_active(user):
            # 更新登录信息
            user.last_login_at = datetime.utcnow()
            user.login_count += 1
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        return None
    
    def deactivate_user(self, db: Session, *, user_id: int) -> User:
        """
        停用用户
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            
        Returns:
            User: 更新后的用户实例
            
        Raises:
            NotFoundException: 用户不存在
        """
        user = self.get_user_by_id(db, user_id=user_id)
        return user_crud.deactivate(db, user_id=user_id)
    
    def activate_user(self, db: Session, *, user_id: int) -> User:
        """
        激活用户
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            
        Returns:
            User: 更新后的用户实例
            
        Raises:
            NotFoundException: 用户不存在
        """
        user = self.get_user_by_id(db, user_id=user_id)
        return user_crud.activate(db, user_id=user_id)
    
    def get_users(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[User]:
        """
        获取用户列表
        
        Args:
            db: 数据库会话
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[User]: 用户列表
        """
        return user_crud.get_multi(db, skip=skip, limit=limit)
    
    def count_users(self, db: Session) -> int:
        """
        获取用户总数
        
        Args:
            db: 数据库会话
            
        Returns:
            int: 用户总数
        """
        return user_crud.count(db)


# 创建全局服务实例
user_service = UserService()
