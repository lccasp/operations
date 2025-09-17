"""
Schemas 包初始化文件
导出所有数据模式
"""

from app.schemas.user import (
    User,
    UserCreate, 
    UserUpdate,
    UserBrief,
    UserLogin,
    UserRegister,
    UserPasswordUpdate
)

from app.schemas.demo import (
    Demo,
    DemoCreate,
    DemoUpdate,
    DemoDetail,
    DemoBrief,
    DemoSearch,
    DemoStatusUpdate,
    DemoPriorityUpdate,
    DemoFeaturedUpdate
)

# 导出所有模式
__all__ = [
    # 用户相关
    "User",
    "UserCreate", 
    "UserUpdate",
    "UserBrief",
    "UserLogin",
    "UserRegister",
    "UserPasswordUpdate",
    
    # Demo相关
    "Demo",
    "DemoCreate",
    "DemoUpdate", 
    "DemoDetail",
    "DemoBrief",
    "DemoSearch",
    "DemoStatusUpdate",
    "DemoPriorityUpdate",
    "DemoFeaturedUpdate",
]
