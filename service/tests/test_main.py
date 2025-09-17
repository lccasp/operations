"""
主应用测试
测试应用基础功能
"""

import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """
    测试根路径端点
    """
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_check(client: TestClient):
    """
    测试健康检查端点
    """
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data


def test_404_error(client: TestClient):
    """
    测试404错误处理
    """
    response = client.get("/nonexistent")
    assert response.status_code == 404
    
    data = response.json()
    assert data["success"] is False
    assert "error" in data
    assert "message" in data
