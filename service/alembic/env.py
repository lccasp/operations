"""
Alembic环境配置文件
配置数据库连接和迁移环境
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 导入应用配置和模型
from app.core.config import settings
from app.db.base import Base
from app.models import *  # 导入所有模型

# 这是Alembic配置对象
config = context.config

# 设置数据库URL
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# 解释配置文件的Python日志记录配置
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 添加模型的MetaData对象以支持'autogenerate'
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """在"离线"模式下运行迁移。

    这会配置上下文，只需要一个URL，而不需要实际的引擎，
    尽管在这里引擎也可以接受。通过跳过引擎创建，
    我们甚至不需要DBAPI可用。

    调用context.execute()将输出SQL脚本到标准输出。

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """在"在线"模式下运行迁移。

    在这种情况下，我们需要创建一个引擎并将连接与上下文关联。

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
