"""
API v1 路由汇总
将所有API端点模块组合在一起
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, demos

api_router = APIRouter()

# 包含所有API端点
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户管理"])
api_router.include_router(demos.router, prefix="/demos", tags=["Demo管理"])
