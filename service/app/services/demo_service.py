"""
Demo业务逻辑服务
处理Demo相关的业务逻辑
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.crud import demo as demo_crud, user as user_crud
from app.schemas.demo import DemoCreate, DemoUpdate, DemoSearch
from app.models.demo import Demo
from app.core.response import BusinessException, NotFoundException, PermissionException


class DemoService:
    """Demo业务逻辑服务类"""
    
    def create_demo(
        self, 
        db: Session, 
        *, 
        demo_in: DemoCreate, 
        current_user_id: int
    ) -> Demo:
        """
        创建新Demo
        
        Args:
            db: 数据库会话
            demo_in: Demo创建数据
            current_user_id: 当前用户ID
            
        Returns:
            Demo: 创建的Demo实例
            
        Raises:
            BusinessException: 业务逻辑错误
            NotFoundException: 用户不存在
        """
        # 验证用户是否存在
        user = user_crud.get(db, id=current_user_id)
        if not user:
            raise NotFoundException(
                error="用户不存在",
                message=f"ID为 {current_user_id} 的用户不存在"
            )
        
        # 检查Demo名称是否已存在
        existing_demo = demo_crud.get_by_name(db, name=demo_in.name)
        if existing_demo:
            raise BusinessException(
                error="Demo名称已存在",
                message=f"名称为 '{demo_in.name}' 的Demo已存在"
            )
        
        # 验证状态值
        valid_statuses = ["active", "inactive", "pending"]
        if demo_in.status not in valid_statuses:
            raise BusinessException(
                error="无效的状态值",
                message=f"状态必须为以下值之一: {', '.join(valid_statuses)}"
            )
        
        # 设置所有者为当前用户
        demo_in.owner_id = current_user_id
        
        return demo_crud.create(db, obj_in=demo_in)
    
    def get_demo_by_id(self, db: Session, *, demo_id: int) -> Demo:
        """
        通过ID获取Demo
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            
        Returns:
            Demo: Demo实例
            
        Raises:
            NotFoundException: Demo不存在
        """
        demo = demo_crud.get(db, id=demo_id)
        if not demo or demo.is_deleted:
            raise NotFoundException(
                error="Demo不存在",
                message=f"ID为 {demo_id} 的Demo不存在"
            )
        return demo
    
    def update_demo(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        demo_in: DemoUpdate,
        current_user_id: int
    ) -> Demo:
        """
        更新Demo信息
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            demo_in: 更新数据
            current_user_id: 当前用户ID
            
        Returns:
            Demo: 更新后的Demo实例
            
        Raises:
            NotFoundException: Demo不存在
            PermissionException: 权限不足
            BusinessException: 业务逻辑错误
        """
        demo = self.get_demo_by_id(db, demo_id=demo_id)
        
        # 检查权限（只有所有者可以更新）
        if demo.owner_id != current_user_id:
            raise PermissionException(
                error="权限不足",
                message="只有Demo的所有者可以更新Demo"
            )
        
        # 检查名称是否被其他Demo使用
        if demo_in.name and demo_in.name != demo.name:
            existing_demo = demo_crud.get_by_name(db, name=demo_in.name)
            if existing_demo and existing_demo.id != demo_id:
                raise BusinessException(
                    error="Demo名称已存在",
                    message=f"名称为 '{demo_in.name}' 的Demo已存在"
                )
        
        # 验证状态值
        if demo_in.status:
            valid_statuses = ["active", "inactive", "pending"]
            if demo_in.status not in valid_statuses:
                raise BusinessException(
                    error="无效的状态值",
                    message=f"状态必须为以下值之一: {', '.join(valid_statuses)}"
                )
        
        return demo_crud.update(db, db_obj=demo, obj_in=demo_in)
    
    def delete_demo(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        current_user_id: int
    ) -> Demo:
        """
        删除Demo（软删除）
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            current_user_id: 当前用户ID
            
        Returns:
            Demo: 被删除的Demo实例
            
        Raises:
            NotFoundException: Demo不存在
            PermissionException: 权限不足
        """
        demo = self.get_demo_by_id(db, demo_id=demo_id)
        
        # 检查权限（只有所有者可以删除）
        if demo.owner_id != current_user_id:
            raise PermissionException(
                error="权限不足",
                message="只有Demo的所有者可以删除Demo"
            )
        
        return demo_crud.soft_delete(db, id=demo_id)
    
    def search_demos(
        self, 
        db: Session, 
        *, 
        search_params: DemoSearch,
        skip: int = 0,
        limit: int = 100
    ) -> List[Demo]:
        """
        搜索Demo
        
        Args:
            db: 数据库会话
            search_params: 搜索参数
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        filters = {}
        
        # 构建过滤条件
        if search_params.status:
            filters["status"] = search_params.status
            
        if search_params.is_featured is not None:
            filters["is_featured"] = search_params.is_featured
            
        if search_params.owner_id:
            filters["owner_id"] = search_params.owner_id
        
        # 默认不包含已删除的记录
        filters["is_deleted"] = False
        
        # 如果有名称搜索，使用模糊搜索
        if search_params.name:
            filters["name"] = {"like": search_params.name}
        
        return demo_crud.get_multi(
            db, 
            skip=skip, 
            limit=limit, 
            filters=filters,
            order_by="-priority"  # 按优先级降序排列
        )
    
    def get_user_demos(
        self, 
        db: Session, 
        *, 
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Demo]:
        """
        获取用户的Demo列表
        
        Args:
            db: 数据库会话
            user_id: 用户ID
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: Demo列表
        """
        return demo_crud.get_by_owner(db, owner_id=user_id, skip=skip, limit=limit)
    
    def get_featured_demos(
        self, 
        db: Session, 
        *, 
        skip: int = 0,
        limit: int = 100
    ) -> List[Demo]:
        """
        获取推荐Demo列表
        
        Args:
            db: 数据库会话
            skip: 跳过记录数
            limit: 限制记录数
            
        Returns:
            List[Demo]: 推荐Demo列表
        """
        return demo_crud.get_featured(db, skip=skip, limit=limit)
    
    def update_demo_status(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        new_status: str,
        current_user_id: int
    ) -> Demo:
        """
        更新Demo状态
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            new_status: 新状态
            current_user_id: 当前用户ID
            
        Returns:
            Demo: 更新后的Demo实例
            
        Raises:
            NotFoundException: Demo不存在
            PermissionException: 权限不足
            BusinessException: 业务逻辑错误
        """
        demo = self.get_demo_by_id(db, demo_id=demo_id)
        
        # 检查权限
        if demo.owner_id != current_user_id:
            raise PermissionException(
                error="权限不足",
                message="只有Demo的所有者可以更新状态"
            )
        
        # 验证状态值
        valid_statuses = ["active", "inactive", "pending"]
        if new_status not in valid_statuses:
            raise BusinessException(
                error="无效的状态值",
                message=f"状态必须为以下值之一: {', '.join(valid_statuses)}"
            )
        
        return demo_crud.update_status(db, demo_id=demo_id, new_status=new_status)
    
    def set_demo_featured(
        self, 
        db: Session, 
        *, 
        demo_id: int, 
        is_featured: bool,
        current_user_id: int
    ) -> Demo:
        """
        设置Demo推荐状态
        
        Args:
            db: 数据库会话
            demo_id: Demo ID
            is_featured: 是否推荐
            current_user_id: 当前用户ID
            
        Returns:
            Demo: 更新后的Demo实例
            
        Raises:
            NotFoundException: Demo不存在
            PermissionException: 权限不足
        """
        demo = self.get_demo_by_id(db, demo_id=demo_id)
        
        # 检查权限
        if demo.owner_id != current_user_id:
            raise PermissionException(
                error="权限不足",
                message="只有Demo的所有者可以设置推荐状态"
            )
        
        return demo_crud.set_featured(db, demo_id=demo_id, is_featured=is_featured)
    
    def get_demo_statistics(self, db: Session) -> Dict[str, Any]:
        """
        获取Demo统计信息
        
        Args:
            db: 数据库会话
            
        Returns:
            Dict[str, Any]: 统计信息
        """
        return {
            "total": demo_crud.count(db, filters={"is_deleted": False}),
            "active": demo_crud.count_by_status(db, status="active"),
            "inactive": demo_crud.count_by_status(db, status="inactive"),
            "pending": demo_crud.count_by_status(db, status="pending"),
            "featured": demo_crud.count(db, filters={"is_featured": True, "is_deleted": False})
        }


# 创建全局服务实例
demo_service = DemoService()
