"""
Demo管理API端点
处理Demo相关的CRUD操作
"""

from typing import Any, List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db, 
    get_current_active_user,
    get_optional_current_user,
    get_common_params,
    CommonQueryParams
)
from app.core.response import (
    success_response, 
    error_response, 
    paginated_response,
    created_response,
    updated_response,
    deleted_response,
    BusinessException,
    NotFoundException,
    PermissionException
)
from app.services import demo_service
from app.schemas.demo import (
    Demo, 
    DemoCreate, 
    DemoUpdate, 
    DemoDetail,
    DemoSearch,
    DemoStatusUpdate,
    DemoPriorityUpdate,
    DemoFeaturedUpdate
)
from app.models.user import User as UserModel

router = APIRouter()


@router.post("/", summary="创建Demo")
def create_demo(
    *,
    db: Session = Depends(get_db),
    demo_in: DemoCreate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    创建新的Demo
    
    - **name**: Demo名称
    - **description**: Demo描述
    - **status**: 状态 (active, inactive, pending)
    - **priority**: 优先级
    - **is_featured**: 是否推荐
    """
    try:
        demo = demo_service.create_demo(
            db,
            demo_in=demo_in,
            current_user_id=current_user.id
        )
        
        return created_response(
            data=Demo.model_validate(demo),
            message="Demo创建成功"
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
            message="创建Demo失败"
        )


@router.get("/", summary="获取Demo列表")
def get_demos(
    *,
    db: Session = Depends(get_db),
    params: CommonQueryParams = Depends(get_common_params),
    name: Optional[str] = Query(None, description="名称搜索关键词"),
    status: Optional[str] = Query(None, description="状态筛选"),
    is_featured: Optional[bool] = Query(None, description="是否只显示推荐"),
    owner_id: Optional[int] = Query(None, description="所有者ID筛选"),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
) -> Any:
    """
    获取Demo列表（支持搜索和筛选）
    
    - **skip**: 跳过记录数
    - **limit**: 限制记录数
    - **name**: 名称搜索关键词
    - **status**: 状态筛选
    - **is_featured**: 是否只显示推荐
    - **owner_id**: 所有者ID筛选
    """
    try:
        # 构建搜索参数
        search_params = DemoSearch(
            name=name,
            status=status,
            is_featured=is_featured,
            owner_id=owner_id
        )
        
        # 搜索Demo
        demos = demo_service.search_demos(
            db,
            search_params=search_params,
            skip=params.skip,
            limit=params.limit
        )
        
        # 获取总数（使用相同的筛选条件）
        from app.crud import demo as demo_crud
        filters = {"is_deleted": False}
        if status:
            filters["status"] = status
        if is_featured is not None:
            filters["is_featured"] = is_featured
        if owner_id:
            filters["owner_id"] = owner_id
        if name:
            filters["name"] = {"like": name}
        
        total = demo_crud.count(db, filters=filters)
        
        # 计算分页信息
        page = (params.skip // params.limit) + 1
        
        return paginated_response(
            items=[Demo.model_validate(demo) for demo in demos],
            total=total,
            page=page,
            page_size=params.limit,
            message="获取Demo列表成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取Demo列表失败"
        )


@router.get("/featured", summary="获取推荐Demo列表")
def get_featured_demos(
    *,
    db: Session = Depends(get_db),
    params: CommonQueryParams = Depends(get_common_params)
) -> Any:
    """
    获取推荐Demo列表
    
    - **skip**: 跳过记录数
    - **limit**: 限制记录数
    """
    try:
        demos = demo_service.get_featured_demos(
            db,
            skip=params.skip,
            limit=params.limit
        )
        
        # 获取推荐Demo总数
        from app.crud import demo as demo_crud
        total = demo_crud.count(db, filters={"is_featured": True, "is_deleted": False})
        
        # 计算分页信息
        page = (params.skip // params.limit) + 1
        
        return paginated_response(
            items=[Demo.model_validate(demo) for demo in demos],
            total=total,
            page=page,
            page_size=params.limit,
            message="获取推荐Demo列表成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取推荐Demo列表失败"
        )


@router.get("/my", summary="获取我的Demo列表")
def get_my_demos(
    *,
    db: Session = Depends(get_db),
    params: CommonQueryParams = Depends(get_common_params),
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    获取当前用户的Demo列表
    
    - **skip**: 跳过记录数
    - **limit**: 限制记录数
    """
    try:
        demos = demo_service.get_user_demos(
            db,
            user_id=current_user.id,
            skip=params.skip,
            limit=params.limit
        )
        
        # 获取用户Demo总数
        from app.crud import demo as demo_crud
        total = demo_crud.count(db, filters={"owner_id": current_user.id, "is_deleted": False})
        
        # 计算分页信息
        page = (params.skip // params.limit) + 1
        
        return paginated_response(
            items=[Demo.model_validate(demo) for demo in demos],
            total=total,
            page=page,
            page_size=params.limit,
            message="获取我的Demo列表成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取我的Demo列表失败"
        )


@router.get("/statistics", summary="获取Demo统计信息")
def get_demo_statistics(
    *,
    db: Session = Depends(get_db)
) -> Any:
    """
    获取Demo统计信息
    """
    try:
        stats = demo_service.get_demo_statistics(db)
        
        return success_response(
            data=stats,
            message="获取统计信息成功"
        )
        
    except Exception as e:
        return error_response(
            error=str(e),
            message="获取统计信息失败"
        )


@router.get("/{demo_id}", summary="获取Demo详情")
def get_demo(
    *,
    db: Session = Depends(get_db),
    demo_id: int,
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
) -> Any:
    """
    获取Demo详细信息
    
    - **demo_id**: Demo ID
    """
    try:
        demo = demo_service.get_demo_by_id(db, demo_id=demo_id)
        
        return success_response(
            data=Demo.model_validate(demo),
            message="获取Demo信息成功"
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
            message="获取Demo信息失败"
        )


@router.put("/{demo_id}", summary="更新Demo")
def update_demo(
    *,
    db: Session = Depends(get_db),
    demo_id: int,
    demo_in: DemoUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    更新Demo信息
    
    - **demo_id**: Demo ID
    """
    try:
        demo = demo_service.update_demo(
            db,
            demo_id=demo_id,
            demo_in=demo_in,
            current_user_id=current_user.id
        )
        
        return updated_response(
            data=Demo.model_validate(demo),
            message="Demo更新成功"
        )
        
    except (BusinessException, NotFoundException, PermissionException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="更新Demo失败"
        )


@router.delete("/{demo_id}", summary="删除Demo")
def delete_demo(
    *,
    db: Session = Depends(get_db),
    demo_id: int,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    删除Demo（软删除）
    
    - **demo_id**: Demo ID
    """
    try:
        demo_service.delete_demo(
            db,
            demo_id=demo_id,
            current_user_id=current_user.id
        )
        
        return deleted_response(message="Demo删除成功")
        
    except (NotFoundException, PermissionException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="删除Demo失败"
        )


@router.put("/{demo_id}/status", summary="更新Demo状态")
def update_demo_status(
    *,
    db: Session = Depends(get_db),
    demo_id: int,
    status_update: DemoStatusUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    更新Demo状态
    
    - **demo_id**: Demo ID
    - **status**: 新状态
    """
    try:
        demo = demo_service.update_demo_status(
            db,
            demo_id=demo_id,
            new_status=status_update.status,
            current_user_id=current_user.id
        )
        
        return updated_response(
            data=Demo.model_validate(demo),
            message="Demo状态更新成功"
        )
        
    except (BusinessException, NotFoundException, PermissionException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="更新Demo状态失败"
        )


@router.put("/{demo_id}/featured", summary="设置Demo推荐状态")
def set_demo_featured(
    *,
    db: Session = Depends(get_db),
    demo_id: int,
    featured_update: DemoFeaturedUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> Any:
    """
    设置Demo推荐状态
    
    - **demo_id**: Demo ID
    - **is_featured**: 是否推荐
    """
    try:
        demo = demo_service.set_demo_featured(
            db,
            demo_id=demo_id,
            is_featured=featured_update.is_featured,
            current_user_id=current_user.id
        )
        
        return updated_response(
            data=Demo.model_validate(demo),
            message="Demo推荐状态更新成功"
        )
        
    except (NotFoundException, PermissionException) as e:
        return error_response(
            error=e.error,
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return error_response(
            error=str(e),
            message="更新Demo推荐状态失败"
        )
