#!/usr/bin/env python3
"""
测试运行脚本
"""

import os
import sys
import subprocess
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def main():
    """运行测试"""
    
    # 切换到项目根目录
    os.chdir(project_root)
    
    # 设置测试环境变量
    os.environ["ENVIRONMENT"] = "testing"
    
    print("🧪 开始运行测试...")
    
    # 构建pytest命令
    cmd = [
        sys.executable, "-m", "pytest",
        "-v",                    # 详细输出
        "--tb=short",           # 简短的错误回溯
        "--strict-markers",     # 严格标记检查
        "--cov=app",           # 代码覆盖率
        "--cov-report=term-missing",  # 终端覆盖率报告
        "--cov-report=html:htmlcov",  # HTML覆盖率报告
    ]
    
    # 如果有参数，传递给pytest
    if len(sys.argv) > 1:
        cmd.extend(sys.argv[1:])
    
    try:
        result = subprocess.run(cmd)
        
        if result.returncode == 0:
            print("\n✅ 所有测试通过!")
            print("📊 覆盖率报告已生成到 htmlcov/ 目录")
        else:
            print(f"\n❌ 测试失败 (退出码: {result.returncode})")
        
        return result.returncode
        
    except KeyboardInterrupt:
        print("\n🛑 测试被用户中断")
        return 1
    except Exception as e:
        print(f"❌ 运行测试时出错: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
