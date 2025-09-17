"""
用户管理API端点
处理用户相关的CRUD操作
"""

from typing import Any, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db, 
    get_current_active_user, 
    get_current_superuser,
    get_common_params,
    CommonQueryParams
)
from app.core.response import (
    success_response, 
    error_response, 
    paginated_response,
    BusinessException,
    NotFoundException
)
from app.services import user_service
from app.schemas.user import User, UserUpdate, UserPasswordUpdate
from app.models.user import User as UserModel

router = APIRouter()


@router.get("/", summary="获取用户列表")
def get_users(
    *,
    db: Session = Depends(get_db),
    params: CommonQueryParams = Depends(get_common_params),
    current_user: UserModel = Depends(get_current_superuser)
) -> Any:
    """
    获取用户列表（仅超级用户可访问）
    
    - **skip**: 跳过记录数
    - **limit**: 限制记录数
    - **order_by**: 排序字段
    """
    try:
        # 获取用户列表
        users = user_service.get_users(
            db, 
            skip=params.skip, 
            limit=params.limit
        )
        
        # 获取总数
        total = user_service.count_users(db)
        
        # 计算分页信息
        page = (params.skip // params.limit) + 1
        
        return paginated_response(
            items=[User.model_validate(user) for user in users],
            total=total,
            page=page,
            page_size=params.limit,
            message="获取用户列表成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取用户列表失败"
        )


@router.get("/me", summary="获取当前用户信息")
def get_current_user_profile(
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    获取当前用户的详细信息
    """
    return success_response(
        data=User.model_validate(current_user),
        message="获取用户信息成功"
    )


@router.put("/me", summary="更新当前用户信息")
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    更新当前用户信息
    
    - **email**: 邮箱地址
    - **username**: 用户名
    - **full_name**: 全名
    - **phone**: 手机号
    - **avatar**: 头像URL
    - **bio**: 个人简介
    """
    try:
        updated_user = user_service.update_user(
            db,
            user_id=current_user.id,
            user_in=user_in
        )
        
        return success_response(
            data=User.model_validate(updated_user),
            message="更新用户信息成功"
        )
        
    except (BusinessException, NotFoundException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="更新用户信息失败"
        )


@router.put("/me/password", summary="更新当前用户密码")
def update_current_user_password(
    *,
    db: Session = Depends(get_db),
    password_update: UserPasswordUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    更新当前用户密码
    
    - **current_password**: 当前密码
    - **new_password**: 新密码
    - **confirm_password**: 确认新密码
    """
    try:
        user_service.update_password(
            db,
            user_id=current_user.id,
            password_update=password_update
        )
        
        return success_response(
            message="密码更新成功"
        )
        
    except (BusinessException, NotFoundException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="密码更新失败"
        )


@router.get("/{user_id}", summary="获取指定用户信息")
def get_user_by_id(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_superuser)
) -> Any:
    """
    获取指定用户信息（仅超级用户可访问）
    
    - **user_id**: 用户ID
    """
    try:
        user = user_service.get_user_by_id(db, user_id=user_id)
        
        return success_response(
            data=User.model_validate(user),
            message="获取用户信息成功"
        )
        
    except NotFoundException as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取用户信息失败"
        )


@router.put("/{user_id}", summary="更新指定用户信息")
def update_user_by_id(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_superuser)
) -> Any:
    """
    更新指定用户信息（仅超级用户可访问）
    
    - **user_id**: 用户ID
    """
    try:
        updated_user = user_service.update_user(
            db,
            user_id=user_id,
            user_in=user_in
        )
        
        return success_response(
            data=User.model_validate(updated_user),
            message="更新用户信息成功"
        )
        
    except (BusinessException, NotFoundException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="更新用户信息失败"
        )


@router.put("/{user_id}/deactivate", summary="停用用户")
def deactivate_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_superuser)
) -> Any:
    """
    停用指定用户（仅超级用户可访问）
    
    - **user_id**: 用户ID
    """
    try:
        updated_user = user_service.deactivate_user(db, user_id=user_id)
        
        return success_response(
            data=User.model_validate(updated_user),
            message="用户已停用"
        )
        
    except NotFoundException as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="停用用户失败"
        )


@router.put("/{user_id}/activate", summary="激活用户")
def activate_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_superuser)
) -> Any:
    """
    激活指定用户（仅超级用户可访问）
    
    - **user_id**: 用户ID
    """
    try:
        updated_user = user_service.activate_user(db, user_id=user_id)
        
        return success_response(
            data=User.model_validate(updated_user),
            message="用户已激活"
        )
        
    except NotFoundException as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="激活用户失败"
        )
