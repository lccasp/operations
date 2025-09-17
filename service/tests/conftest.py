"""
Pytest配置和全局测试夹具
"""

import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.deps import get_db
from app.db.base import Base
from app.core.config import settings


# 创建测试数据库引擎
test_engine = create_engine(
    settings.TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# 创建测试会话工厂
TestingSessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=test_engine
)


@pytest.fixture(scope="session")
def db() -> Generator:
    """
    创建测试数据库会话
    """
    # 创建所有表
    Base.metadata.create_all(bind=test_engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # 清理数据库
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="module")
def client() -> Generator:
    """
    创建测试客户端
    """
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    # 清理依赖覆盖
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """
    测试用户数据
    """
    return {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "password": "testpassword123",
        "confirm_password": "testpassword123"
    }


@pytest.fixture
def test_demo_data():
    """
    测试Demo数据
    """
    return {
        "name": "测试Demo",
        "description": "这是一个测试Demo",
        "status": "active",
        "priority": 1,
        "is_featured": False,
        "owner_id": 1
    }
