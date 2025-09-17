"""
API依赖注入模块
定义FastAPI路由的依赖项
"""

from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.core.security import verify_token
from app.crud import user as user_crud
from app.models.user import User

# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    获取当前登录用户
    
    Args:
        db: 数据库会话
        credentials: 认证凭据
        
    Returns:
        User: 当前用户实例
        
    Raises:
        HTTPException: 认证失败
    """
    # 验证token
    user_id = verify_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 获取用户
    user = user_crud.get(db, id=int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 检查用户状态
    if not user_crud.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户账户已被停用"
        )
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    获取当前活跃用户
    
    Args:
        current_user: 当前用户
        
    Returns:
        User: 当前活跃用户实例
        
    Raises:
        HTTPException: 用户不活跃
    """
    if not user_crud.is_active(current_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="用户账户已被停用"
        )
    return current_user


def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    获取当前超级用户
    
    Args:
        current_user: 当前用户
        
    Returns:
        User: 当前超级用户实例
        
    Raises:
        HTTPException: 权限不足
    """
    if not user_crud.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足"
        )
    return current_user


def get_optional_current_user(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    """
    获取可选的当前用户（允许匿名访问）
    
    Args:
        db: 数据库会话
        credentials: 可选的认证凭据
        
    Returns:
        Optional[User]: 当前用户实例或None
    """
    if credentials is None:
        return None
    
    try:
        user_id = verify_token(credentials.credentials)
        if user_id is None:
            return None
        
        user = user_crud.get(db, id=int(user_id))
        if user is None or not user_crud.is_active(user):
            return None
        
        return user
    except Exception:
        return None


class CommonQueryParams:
    """
    通用查询参数类
    用于分页和排序
    """
    
    def __init__(
        self,
        skip: int = 0,
        limit: int = 20,
        order_by: Optional[str] = None
    ):
        self.skip = max(0, skip)
        self.limit = min(max(1, limit), settings.MAX_PAGE_SIZE)
        self.order_by = order_by


def get_common_params(
    skip: int = 0,
    limit: int = 20,
    order_by: Optional[str] = None
) -> CommonQueryParams:
    """
    获取通用查询参数
    
    Args:
        skip: 跳过记录数
        limit: 限制记录数
        order_by: 排序字段
        
    Returns:
        CommonQueryParams: 查询参数对象
    """
    return CommonQueryParams(skip=skip, limit=limit, order_by=order_by)


def get_settings():
    """
    获取应用配置依赖项
    
    Returns:
        Settings: 应用配置实例
    """
    return settings
