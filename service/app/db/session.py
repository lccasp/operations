"""
数据库会话管理模块
配置数据库引擎和会话工厂
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings


# 根据数据库URL判断数据库类型并设置相应参数
def get_engine_kwargs():
    """获取数据库引擎参数"""
    if settings.DATABASE_URL.startswith("sqlite"):
        # SQLite 配置
        return {
            "poolclass": StaticPool,
            "connect_args": {
                "check_same_thread": False,
            },
            "echo": settings.DEBUG,
        }
    else:
        # PostgreSQL 配置
        return {
            "pool_size": settings.DATABASE_POOL_SIZE,
            "max_overflow": settings.DATABASE_MAX_OVERFLOW,
            "pool_timeout": settings.DATABASE_POOL_TIMEOUT,
            "pool_recycle": settings.DATABASE_POOL_RECYCLE,
            "echo": settings.DEBUG,
        }


# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    **get_engine_kwargs()
)

# 创建会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """
    数据库会话依赖注入函数
    用于FastAPI路由中获取数据库会话
    
    Yields:
        Session: 数据库会话对象
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 测试数据库配置
def get_test_engine():
    """获取测试数据库引擎"""
    test_engine_kwargs = {
        "poolclass": StaticPool,
        "connect_args": {"check_same_thread": False},
        "echo": False,
    }
    
    return create_engine(
        settings.TEST_DATABASE_URL,
        **test_engine_kwargs
    )


def get_test_db():
    """
    测试数据库会话依赖注入函数
    用于测试中获取数据库会话
    
    Yields:
        Session: 测试数据库会话对象
    """
    test_engine = get_test_engine()
    TestSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine
    )
    
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
