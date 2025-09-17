"""
Services 包初始化文件
导出所有业务逻辑服务
"""

from app.services.user_service import user_service
from app.services.demo_service import demo_service

# 导出所有服务实例
__all__ = [
    "user_service",
    "demo_service",
]
