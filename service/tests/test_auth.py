"""
认证功能测试
"""

import pytest
from fastapi.testclient import TestClient


class TestAuth:
    """认证相关测试类"""

    def test_register_user(self, client: TestClient, test_user_data):
        """
        测试用户注册
        """
        response = client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["email"] == test_user_data["email"]
        assert data["data"]["username"] == test_user_data["username"]

    def test_register_duplicate_email(self, client: TestClient, test_user_data):
        """
        测试重复邮箱注册
        """
        # 先注册一个用户
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # 尝试用相同邮箱再次注册
        response = client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        assert "邮箱已被注册" in data["error"]

    def test_register_password_mismatch(self, client: TestClient, test_user_data):
        """
        测试密码不匹配
        """
        test_data = test_user_data.copy()
        test_data["confirm_password"] = "differentpassword"
        
        response = client.post("/api/v1/auth/register", json=test_data)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        assert "密码确认不匹配" in data["error"]

    def test_login_success(self, client: TestClient, test_user_data):
        """
        测试成功登录
        """
        # 先注册用户
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # 登录
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        response = client.post("/api/v1/auth/login", data=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "token_type" in data["data"]
        assert data["data"]["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """
        测试无效凭据登录
        """
        login_data = {
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/api/v1/auth/login", data=login_data)
        assert response.status_code == 401
        
        data = response.json()
        assert data["success"] is False
        assert "登录失败" in data["error"]

    def test_get_current_user_without_token(self, client: TestClient):
        """
        测试无token访问需要认证的端点
        """
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 403  # FastAPI默认返回403当没有认证头

    def test_get_current_user_with_token(self, client: TestClient, test_user_data):
        """
        测试使用token访问当前用户信息
        """
        # 注册并登录
        client.post("/api/v1/auth/register", json=test_user_data)
        
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        login_response = client.post("/api/v1/auth/login", data=login_data)
        token = login_response.json()["data"]["access_token"]
        
        # 使用token访问用户信息
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/auth/me", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == test_user_data["email"]
