"""
核心配置管理模块
使用 pydantic-settings 从环境变量加载配置
"""

import os
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    应用配置类
    所有配置项都可以通过环境变量覆盖
    """
    
    # === 基础应用配置 ===
    PROJECT_NAME: str = "Operations Service"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "基于 FastAPI 的后端服务，支持 React Native 移动客户端"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # === 服务器配置 ===
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # === 数据库配置 ===
    DATABASE_URL: str = "sqlite:///./app.db"
    TEST_DATABASE_URL: str = "sqlite:///./test.db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30
    DATABASE_POOL_RECYCLE: int = 3600
    
    # === 安全配置 ===
    SECRET_KEY: str = "change-this-in-production-to-a-random-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    
    # === Redis 配置 ===
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 10
    
    # === CORS 配置 ===
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        """解析 CORS 源列表"""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # === 邮件配置 ===
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[EmailStr] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # === 日志配置 ===
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # === 分页配置 ===
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # === 文件上传配置 ===
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"]
    UPLOAD_PATH: str = "./uploads"
    
    # === 缓存配置 ===
    CACHE_TTL: int = 300  # 5分钟
    
    @property
    def is_development(self) -> bool:
        """是否为开发环境"""
        return self.ENVIRONMENT.lower() in ("development", "dev", "local")
    
    @property
    def is_production(self) -> bool:
        """是否为生产环境"""
        return self.ENVIRONMENT.lower() in ("production", "prod")
    
    @property
    def is_testing(self) -> bool:
        """是否为测试环境"""
        return self.ENVIRONMENT.lower() in ("testing", "test")
    
    def get_database_url(self, for_test: bool = False) -> str:
        """获取数据库连接字符串"""
        if for_test:
            return self.TEST_DATABASE_URL
        return self.DATABASE_URL
    
    class Config:
        """Pydantic 配置"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


# 全局配置实例
settings = Settings()


def get_settings() -> Settings:
    """
    获取配置实例（依赖注入函数）
    """
    return settings
