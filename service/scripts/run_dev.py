#!/usr/bin/env python3
"""
开发环境启动脚本
"""

import os
import sys
import subprocess
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def main():
    """启动开发服务器"""
    
    # 设置开发环境变量
    os.environ.setdefault("ENVIRONMENT", "development")
    os.environ.setdefault("DEBUG", "true")
    
    # 检查.env文件是否存在
    env_file = project_root / ".env"
    if not env_file.exists():
        env_example = project_root / "env.example"
        if env_example.exists():
            print("⚠️  .env 文件不存在，请复制 env.example 并配置:")
            print(f"   cp {env_example} {env_file}")
            return 1
        else:
            print("❌ 配置文件不存在，请创建 .env 文件")
            return 1
    
    # 启动服务器
    print("🚀 启动开发服务器...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--reload",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--log-level", "info"
        ], cwd=project_root)
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        return 0
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
