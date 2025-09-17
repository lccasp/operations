"""
认证相关API端点
处理用户登录、注册等认证操作
"""

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.core.response import success_response, error_response, BusinessException
from app.services import user_service
from app.schemas.user import User, UserLogin, UserRegister
from app.models.user import User as UserModel

router = APIRouter()


@router.post("/login", summary="用户登录")
def login(
    *,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    用户登录
    
    - **email/username**: 邮箱地址或用户名
    - **password**: 密码
    
    返回访问令牌和刷新令牌
    """
    try:
        # 尝试通过邮箱或用户名登录
        user = user_service.authenticate_user(
            db, 
            email=form_data.username,  # OAuth2PasswordRequestForm使用username字段
            password=form_data.password
        )
        
        if not user:
            return error_response(
                error="登录失败",
                message="邮箱或密码错误",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        # 创建访问令牌
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id, 
            expires_delta=access_token_expires
        )
        
        # 创建刷新令牌
        refresh_token = create_refresh_token(subject=user.id)
        
        return success_response(
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "user": User.model_validate(user)
            },
            message="登录成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="登录过程中发生错误",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.post("/register", summary="用户注册")
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserRegister
) -> Any:
    """
    用户注册
    
    - **email**: 邮箱地址
    - **username**: 用户名
    - **full_name**: 全名
    - **password**: 密码
    - **confirm_password**: 确认密码
    """
    try:
        # 验证密码确认
        if user_in.password != user_in.confirm_password:
            return error_response(
                error="密码确认不匹配",
                message="密码和确认密码不一致",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # 创建用户
        from app.schemas.user import UserCreate
        user_create = UserCreate(
            email=user_in.email,
            username=user_in.username,
            full_name=user_in.full_name,
            password=user_in.password
        )
        
        user = user_service.create_user(db, user_in=user_create)
        
        return success_response(
            data=User.model_validate(user),
            message="注册成功",
            status_code=status.HTTP_201_CREATED
        )
        
    except BusinessException as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="注册过程中发生错误",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.post("/refresh", summary="刷新令牌")
def refresh_token(
    *,
    refresh_token: str
) -> Any:
    """
    使用刷新令牌获取新的访问令牌
    """
    try:
        from app.core.security import verify_token
        
        user_id = verify_token(refresh_token)
        if user_id is None:
            return error_response(
                error="无效的刷新令牌",
                message="刷新令牌已过期或无效",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        # 创建新的访问令牌
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user_id,
            expires_delta=access_token_expires
        )
        
        return success_response(
            data={
                "access_token": access_token,
                "token_type": "bearer"
            },
            message="令牌刷新成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="令牌刷新失败",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get("/me", summary="获取当前用户信息")
def get_current_user_info(
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    获取当前登录用户的详细信息
    """
    return success_response(
        data=User.model_validate(current_user),
        message="获取用户信息成功"
    )


@router.post("/logout", summary="用户登出")
def logout(
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    用户登出
    注意：实际的token失效需要在客户端实现，服务端可以维护黑名单
    """
    # 这里可以添加将token加入黑名单的逻辑
    # 目前只是简单返回成功消息
    
    return success_response(
        message="登出成功"
    )
