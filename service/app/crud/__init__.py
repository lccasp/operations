"""
CRUD 包初始化文件
导出所有CRUD操作实例
"""

from app.crud.crud_user import user
from app.crud.crud_demo import demo

# 导出所有CRUD实例
__all__ = [
    "user",
    "demo",
]
