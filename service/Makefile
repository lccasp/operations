# Operations Service Makefile
# 提供常用的开发命令

.PHONY: help install dev test clean lint format init-db migrate

# 默认目标
help:
	@echo "Operations Service - 可用命令:"
	@echo ""
	@echo "  install     安装依赖"
	@echo "  dev         启动开发服务器"
	@echo "  test        运行测试"
	@echo "  lint        代码检查"
	@echo "  format      代码格式化"
	@echo "  init-db     初始化数据库"
	@echo "  migrate     创建数据库迁移"
	@echo "  clean       清理临时文件"
	@echo ""

# 安装依赖
install:
	@echo "📦 安装依赖..."
	pip install -r requirements.txt

# 启动开发服务器
dev:
	@echo "🚀 启动开发服务器..."
	python scripts/run_dev.py

# 运行测试
test:
	@echo "🧪 运行测试..."
	python scripts/test.py

# 代码检查
lint:
	@echo "🔍 检查代码质量..."
	flake8 app/ tests/
	mypy app/

# 代码格式化
format:
	@echo "✨ 格式化代码..."
	black app/ tests/ scripts/
	isort app/ tests/ scripts/

# 初始化数据库
init-db:
	@echo "🗄️ 初始化数据库..."
	python scripts/init_db.py

# 创建数据库迁移
migrate:
	@echo "📝 创建数据库迁移..."
	@read -p "输入迁移描述: " desc; \
	alembic revision --autogenerate -m "$$desc"

# 清理临时文件
clean:
	@echo "🧹 清理临时文件..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info/
