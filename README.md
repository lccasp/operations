# Operations Service

基于 FastAPI 的后端服务，支持 React Native 移动客户端。采用分层架构设计，提供完整的用户认证、Demo 管理等功能。

## 🏗️ 架构设计

本项目采用五层架构设计：

```
┌─────────────────────────────────────────┐
│           表现层 (API Layer)             │  ← 路由、请求处理、响应格式化
├─────────────────────────────────────────┤
│         业务逻辑层 (Service Layer)        │  ← 业务规则、流程控制
├─────────────────────────────────────────┤
│        数据访问层 (CRUD Layer)           │  ← 数据库操作抽象
├─────────────────────────────────────────┤
│        数据模型层 (Model Layer)          │  ← SQLAlchemy 模型定义
├─────────────────────────────────────────┤
│         核心层 (Core Layer)              │  ← 配置、工具、依赖注入
└─────────────────────────────────────────┘
```

## 🚀 技术栈

- **Web 框架**: FastAPI 0.104+
- **ORM**: SQLAlchemy 2.0+
- **数据库**: PostgreSQL (生产) / SQLite (开发/测试)
- **迁移工具**: Alembic
- **认证**: JWT + FastAPI-Users
- **缓存**: Redis
- **包管理**: uv
- **测试**: Pytest

## 📁 项目结构

```
service/
├── app/                        # 主应用目录
│   ├── api/                    # API层
│   │   ├── deps.py            # 依赖注入
│   │   └── v1/                # API v1版本
│   │       ├── api.py         # 路由汇总
│   │       └── endpoints/     # 具体端点
│   ├── core/                  # 核心层
│   │   ├── config.py         # 配置管理
│   │   ├── response.py       # 响应工具
│   │   └── security.py       # 安全工具
│   ├── crud/                  # 数据访问层
│   │   ├── base.py           # 基础CRUD类
│   │   ├── crud_user.py      # 用户CRUD
│   │   └── crud_demo.py      # Demo CRUD
│   ├── db/                    # 数据库配置
│   │   ├── base.py           # 基础模型
│   │   └── session.py        # 会话管理
│   ├── models/                # 数据模型层
│   │   ├── user.py           # 用户模型
│   │   └── demo.py           # Demo模型
│   ├── schemas/               # 数据验证
│   │   ├── user.py           # 用户Schema
│   │   └── demo.py           # Demo Schema
│   ├── services/              # 业务逻辑层
│   │   ├── user_service.py   # 用户服务
│   │   └── demo_service.py   # Demo服务
│   └── main.py               # 应用入口
├── tests/                     # 测试目录
├── alembic/                   # 数据库迁移
├── pyproject.toml            # 项目配置
├── requirements.txt          # 依赖列表
└── README.md                # 项目说明
```

## 🔧 环境配置

1. **复制环境配置文件**
   ```bash
   cp env.example .env
   ```

2. **编辑配置文件**
   ```bash
   # 必须配置的项目
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://username:password@localhost:5432/operations_db
   ```

## 🛠️ 快速开始

### 使用 uv (推荐)

1. **安装 uv**
   ```bash
   pip install uv
   ```

2. **安装依赖**
   ```bash
   uv pip install -r requirements.txt
   ```

3. **初始化数据库**
   ```bash
   # 生成第一个迁移
   alembic revision --autogenerate -m "Initial migration"
   
   # 执行迁移
   alembic upgrade head
   ```

4. **启动开发服务器**
   ```bash
   python app/main.py
   ```

### 传统方式

1. **创建虚拟环境**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

3. **其他步骤同上**

## 📖 API 文档

服务启动后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## 🧪 运行测试

```bash
# 运行所有测试
pytest

# 运行指定测试文件
pytest tests/test_auth.py

# 运行测试并生成覆盖率报告
pytest --cov=app --cov-report=html
```

## 🗄️ 数据库管理

### 创建迁移

```bash
# 自动生成迁移（推荐）
alembic revision --autogenerate -m "Migration description"

# 手动创建空迁移
alembic revision -m "Migration description"
```

### 执行迁移

```bash
# 升级到最新版本
alembic upgrade head

# 升级到指定版本
alembic upgrade +1

# 降级
alembic downgrade -1
```

### 查看迁移历史

```bash
# 查看当前版本
alembic current

# 查看迁移历史
alembic history

# 查看迁移详情
alembic show <revision>
```

## 🔐 用户认证

项目使用 JWT Token 进行用户认证：

1. **注册**: `POST /api/v1/auth/register`
2. **登录**: `POST /api/v1/auth/login`
3. **获取当前用户**: `GET /api/v1/auth/me`
4. **刷新Token**: `POST /api/v1/auth/refresh`

认证头格式：`Authorization: Bearer <your-token>`

## 📊 主要功能模块

### 用户管理
- 用户注册、登录、注销
- 用户信息管理
- 密码修改
- 用户状态管理（激活/停用）

### Demo管理
- Demo创建、编辑、删除
- Demo状态管理
- Demo搜索和筛选
- 推荐Demo管理
- 用户Demo列表

## 🚀 部署指南

### 生产环境部署

1. **设置环境变量**
   ```bash
   export ENVIRONMENT=production
   export DEBUG=false
   export SECRET_KEY=your-production-secret-key
   export DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

2. **安装生产依赖**
   ```bash
   uv pip install -r requirements.txt
   uv pip install gunicorn
   ```

3. **执行数据库迁移**
   ```bash
   alembic upgrade head
   ```

4. **启动服务**
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔍 监控和日志

- **健康检查**: `GET /health`
- **应用信息**: `GET /`
- **日志级别**: 通过 `LOG_LEVEL` 环境变量配置
- **处理时间**: 响应头中包含 `X-Process-Time`

## 🤝 开发规范

### 代码风格

```bash
# 格式化代码
black app/ tests/

# 排序导入
isort app/ tests/

# 类型检查
mypy app/

# 代码检查
flake8 app/ tests/
```

### 提交规范

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 📞 技术支持

如有问题，请联系开发团队或提交 Issue。

---

**版本**: 1.0.0  
**最后更新**: 2024年1月  
**维护团队**: Operations Team
