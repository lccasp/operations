"""
FastAPI主应用入口文件
配置应用实例、中间件、路由等
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import logging

from app.core.config import settings
from app.core.response import error_response, APIException
from app.api.v1.api import api_router

# 配置日志
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    处理应用启动和关闭时的操作
    """
    # 启动时的操作
    logger.info("🚀 应用启动中...")
    logger.info(f"🌍 环境: {settings.ENVIRONMENT}")
    logger.info(f"🐛 调试模式: {settings.DEBUG}")
    logger.info(f"📊 数据库: {settings.DATABASE_URL.split('://')[-1].split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    
    # 这里可以添加数据库连接检查、缓存初始化等
    
    yield
    
    # 关闭时的操作
    logger.info("📴 应用正在关闭...")
    # 这里可以添加资源清理操作


# 创建FastAPI应用实例
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    debug=settings.DEBUG,
    lifespan=lifespan,
    openapi_url=f"/api/v1/openapi.json" if settings.DEBUG else None,
    docs_url=f"/docs" if settings.DEBUG else None,
    redoc_url=f"/redoc" if settings.DEBUG else None,
)


# === 中间件配置 ===

# CORS中间件
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# 可信主机中间件（生产环境推荐）
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["*"]  # 在生产环境中应该设置具体的主机名
    )


# === 请求处理中间件 ===

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    添加请求处理时间头
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """
    请求日志中间件
    """
    start_time = time.time()
    
    # 记录请求
    logger.info(f"📥 {request.method} {request.url.path} - {request.client.host if request.client else 'unknown'}")
    
    response = await call_next(request)
    
    # 记录响应
    process_time = time.time() - start_time
    logger.info(f"📤 {request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    
    return response


# === 异常处理 ===

@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    """
    处理自定义API异常
    """
    return error_response(
        error=exc.error,
        message=exc.message,
        status_code=exc.status_code
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """
    处理404错误
    """
    return error_response(
        error="资源未找到",
        message=f"请求的资源 {request.url.path} 不存在",
        status_code=status.HTTP_404_NOT_FOUND
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """
    处理500内部服务器错误
    """
    logger.error(f"内部服务器错误: {str(exc)}")
    return error_response(
        error="服务器内部错误",
        message="服务器遇到了一个内部错误，请稍后重试",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


# === 路由配置 ===

# 健康检查端点
@app.get("/health", tags=["健康检查"])
async def health_check():
    """
    健康检查端点
    用于负载均衡器和监控系统检查服务状态
    """
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time()
    }


# 根路径
@app.get("/", tags=["根路径"])
async def root():
    """
    根路径信息
    """
    return {
        "message": f"欢迎使用 {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs_url": "/docs" if settings.DEBUG else None,
        "health_url": "/health"
    }


# 包含API路由
app.include_router(api_router, prefix="/api/v1")


# === 启动命令 ===

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
