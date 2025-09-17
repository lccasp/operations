#!/usr/bin/env python3
"""
数据库初始化脚本
"""

import os
import sys
import subprocess
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def run_command(cmd, description):
    """运行命令并处理错误"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description}成功")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description}失败:")
        print(e.stderr)
        return False

def main():
    """初始化数据库"""
    
    print("🗄️  开始数据库初始化...")
    
    # 切换到项目根目录
    os.chdir(project_root)
    
    # 检查alembic配置
    alembic_ini = project_root / "alembic.ini"
    if not alembic_ini.exists():
        print("❌ alembic.ini 配置文件不存在")
        return 1
    
    # 检查是否已有迁移文件
    versions_dir = project_root / "alembic" / "versions"
    has_migrations = versions_dir.exists() and list(versions_dir.glob("*.py"))
    
    if not has_migrations:
        print("📝 生成初始迁移文件...")
        if not run_command("alembic revision --autogenerate -m \"Initial migration\"", "生成迁移文件"):
            return 1
    else:
        print("ℹ️  发现已有迁移文件，跳过生成")
    
    # 执行迁移
    if not run_command("alembic upgrade head", "执行数据库迁移"):
        return 1
    
    print("🎉 数据库初始化完成!")
    print("💡 提示:")
    print("   - 运行 'python scripts/run_dev.py' 启动开发服务器")
    print("   - 访问 http://localhost:8000/docs 查看API文档")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
