"""
统一响应格式工具
提供标准化的API响应结构
"""

from typing import Any, Dict, Optional, Union
from datetime import datetime

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class APIResponse(BaseModel):
    """
    标准API响应模型
    """
    success: bool
    message: str = ""
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: datetime = None
    
    def __init__(self, **data):
        if "timestamp" not in data:
            data["timestamp"] = datetime.utcnow()
        super().__init__(**data)


class PaginatedResponse(BaseModel):
    """
    分页响应模型
    """
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


def success_response(
    data: Any = None, 
    message: str = "操作成功",
    status_code: int = status.HTTP_200_OK
) -> JSONResponse:
    """
    创建成功响应
    
    Args:
        data: 响应数据
        message: 响应消息
        status_code: HTTP状态码
        
    Returns:
        JSONResponse: 格式化的成功响应
    """
    response = APIResponse(
        success=True,
        message=message,
        data=data
    )
    
    return JSONResponse(
        status_code=status_code,
        content=response.model_dump(mode="json", exclude_none=True)
    )


def error_response(
    error: str,
    message: str = "操作失败", 
    status_code: int = status.HTTP_400_BAD_REQUEST,
    data: Any = None
) -> JSONResponse:
    """
    创建错误响应
    
    Args:
        error: 错误信息
        message: 响应消息
        status_code: HTTP状态码
        data: 额外数据
        
    Returns:
        JSONResponse: 格式化的错误响应
    """
    response = APIResponse(
        success=False,
        message=message,
        error=error,
        data=data
    )
    
    return JSONResponse(
        status_code=status_code,
        content=response.model_dump(mode="json", exclude_none=True)
    )


def paginated_response(
    items: list,
    total: int,
    page: int,
    page_size: int,
    message: str = "获取数据成功"
) -> JSONResponse:
    """
    创建分页响应
    
    Args:
        items: 当前页数据
        total: 总记录数
        page: 当前页码（从1开始）
        page_size: 每页大小
        message: 响应消息
        
    Returns:
        JSONResponse: 格式化的分页响应
    """
    total_pages = (total + page_size - 1) // page_size
    
    pagination_data = PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    )
    
    return success_response(
        data=pagination_data.model_dump(),
        message=message
    )


class APIException(HTTPException):
    """
    自定义API异常
    """
    
    def __init__(
        self,
        status_code: int,
        error: str,
        message: str = "操作失败",
        headers: Optional[Dict[str, Any]] = None
    ):
        self.error = error
        self.message = message
        super().__init__(
            status_code=status_code,
            detail={"error": error, "message": message},
            headers=headers
        )


class BusinessException(APIException):
    """
    业务逻辑异常
    """
    
    def __init__(self, error: str, message: str = "业务处理失败"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error=error,
            message=message
        )


class ValidationException(APIException):
    """
    数据验证异常
    """
    
    def __init__(self, error: str, message: str = "数据验证失败"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error=error,
            message=message
        )


class NotFoundException(APIException):
    """
    资源未找到异常
    """
    
    def __init__(self, error: str = "资源未找到", message: str = "请求的资源不存在"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error=error,
            message=message
        )


class PermissionException(APIException):
    """
    权限异常
    """
    
    def __init__(self, error: str = "权限不足", message: str = "您没有执行此操作的权限"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error=error,
            message=message
        )


class AuthenticationException(APIException):
    """
    认证异常
    """
    
    def __init__(self, error: str = "认证失败", message: str = "请先登录"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error=error,
            message=message,
            headers={"WWW-Authenticate": "Bearer"}
        )


# 常用响应快捷方法

def created_response(data: Any = None, message: str = "创建成功") -> JSONResponse:
    """创建资源成功响应"""
    return success_response(data, message, status.HTTP_201_CREATED)


def updated_response(data: Any = None, message: str = "更新成功") -> JSONResponse:
    """更新资源成功响应"""
    return success_response(data, message, status.HTTP_200_OK)


def deleted_response(message: str = "删除成功") -> JSONResponse:
    """删除资源成功响应"""
    return success_response(None, message, status.HTTP_200_OK)


def not_found_response(error: str = "资源未找到") -> JSONResponse:
    """资源未找到响应"""
    return error_response(error, "请求的资源不存在", status.HTTP_404_NOT_FOUND)


def validation_error_response(error: str) -> JSONResponse:
    """数据验证错误响应"""
    return error_response(error, "数据验证失败", status.HTTP_422_UNPROCESSABLE_ENTITY)


def internal_error_response(error: str = "服务器内部错误") -> JSONResponse:
    """服务器内部错误响应"""
    return error_response(error, "服务器内部错误", status.HTTP_500_INTERNAL_SERVER_ERROR)
