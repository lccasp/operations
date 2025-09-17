# 项目设置指南

## 🚀 快速开始

### 1. 环境准备

确保您的系统已安装：
- Python 3.9+
- PostgreSQL (生产环境) 或 SQLite (开发环境)
- Redis (可选，用于缓存)

### 2. 克隆并进入项目

```bash
cd service/
```

### 3. 配置环境

```bash
# 复制环境配置文件
cp env.example .env

# 编辑配置文件，至少修改以下项目：
# - SECRET_KEY (生产环境必须修改)
# - DATABASE_URL (如果使用PostgreSQL)
```

### 4. 安装依赖

**使用 uv (推荐)**
```bash
pip install uv
uv pip install -r requirements.txt
```

**使用传统方式**
```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 5. 初始化数据库

```bash
# 使用脚本自动初始化
python scripts/init_db.py

# 或手动执行
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 6. 启动开发服务器

```bash
# 使用脚本启动
python scripts/run_dev.py

# 或使用Makefile
make dev

# 或直接使用uvicorn
uvicorn app.main:app --reload
```

### 7. 验证安装

访问以下地址验证服务正常运行：

- **API文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health
- **ReDoc文档**: http://localhost:8000/redoc

## 🧪 运行测试

```bash
# 使用脚本运行测试
python scripts/test.py

# 或使用Makefile
make test

# 或直接使用pytest
pytest -v --cov=app
```

## 📝 常用开发命令

```bash
# 启动开发服务器
make dev

# 运行测试
make test

# 代码格式化
make format

# 代码检查
make lint

# 创建数据库迁移
make migrate

# 查看所有可用命令
make help
```

## 🗄️ 数据库管理

### 创建迁移

```bash
# 自动生成迁移
alembic revision --autogenerate -m "描述"

# 手动创建空迁移
alembic revision -m "描述"
```

### 执行迁移

```bash
# 升级到最新版本
alembic upgrade head

# 降级一个版本
alembic downgrade -1
```

### 查看迁移状态

```bash
# 查看当前版本
alembic current

# 查看迁移历史
alembic history
```

## 🔧 开发工具配置

### VS Code

推荐安装以下扩展：
- Python
- Pylance
- Python Docstring Generator
- autoDocstring

### PyCharm

项目已配置好基本设置，直接导入即可。

## 🚢 部署到生产环境

### 1. 环境变量配置

```bash
export ENVIRONMENT=production
export DEBUG=false
export SECRET_KEY=your-production-secret-key
export DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### 2. 安装生产依赖

```bash
pip install gunicorn
```

### 3. 执行数据库迁移

```bash
alembic upgrade head
```

### 4. 启动生产服务器

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🔍 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 配置
   - 确保数据库服务已启动
   - 验证用户权限

2. **导入错误**
   - 确保虚拟环境已激活
   - 检查依赖是否完全安装
   - 验证Python路径设置

3. **迁移失败**
   - 检查数据库连接
   - 确保没有语法错误
   - 查看alembic日志

### 获取帮助

如遇到问题，请：
1. 查看日志输出
2. 检查环境配置
3. 参考README.md文档
4. 联系开发团队

---

**祝您开发愉快！** 🎉
