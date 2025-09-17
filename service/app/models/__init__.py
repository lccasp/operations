"""
模型包初始化文件
导入所有模型，确保 SQLAlchemy 能够发现它们
"""

from app.db.base import Base
from app.models.user import User
from app.models.demo import Demo

# 导出所有模型
__all__ = [
    "Base",
    "User", 
    "Demo",
]
