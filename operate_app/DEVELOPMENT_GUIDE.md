# 🛠️ OperateApp 开发指南

> 完整的代码规范、最佳实践和开发流程指南

---

## 📖 目录

1. [项目概述](#-项目概述)
2. [代码架构](#-代码架构)
3. [开发规范](#-开发规范)
4. [代码风格](#-代码风格)
5. [类型安全](#-类型安全)
6. [错误处理](#-错误处理)
7. [性能优化](#-性能优化)
8. [测试策略](#-测试策略)
9. [Git工作流](#-git工作流)
10. [部署流程](#-部署流程)

---

## 🚀 项目概述

OperateApp 是一个基于 React Native 的企业级移动应用，采用现代化的技术栈和严格的代码规范，确保代码质量和可维护性。

### 核心原则

- **类型安全**: 全面使用 TypeScript，确保编译时类型检查
- **模块化**: 清晰的模块边界和依赖关系
- **可测试性**: 易于编写和维护的单元测试
- **性能优先**: 优化用户体验和应用性能
- **可维护性**: 清晰的代码结构和完整的文档

---

## 🏗️ 代码架构

### 目录结构

```
src/
├── components/          # 可复用UI组件
│   ├── ui/             # 基础UI组件
│   ├── forms/          # 表单组件
│   ├── navigation/     # 导航组件
│   └── common/         # 通用组件
├── screens/            # 页面组件
├── navigation/         # 导航配置
├── store/             # 状态管理
├── services/          # API服务层
├── types/             # TypeScript类型定义
├── utils/             # 工具函数
├── hooks/             # 自定义Hooks
├── theme/             # 主题系统
└── assets/            # 静态资源
```

### 架构分层

1. **表示层 (Presentation Layer)**
   - 页面组件 (`screens/`)
   - UI组件 (`components/`)
   - 导航配置 (`navigation/`)

2. **业务逻辑层 (Business Logic Layer)**
   - 状态管理 (`store/`)
   - 自定义Hooks (`hooks/`)
   - 工具函数 (`utils/`)

3. **数据访问层 (Data Access Layer)**
   - API服务 (`services/`)
   - 本地存储 (`utils/storage.ts`)

4. **基础设施层 (Infrastructure Layer)**
   - 类型定义 (`types/`)
   - 主题系统 (`theme/`)
   - 常量配置 (`utils/constants.ts`)

---

## 📝 开发规范

### 文件命名规范

```typescript
// 组件文件 - PascalCase
UserProfile.tsx
ErrorBoundary.tsx

// 工具文件 - camelCase
apiClient.ts
errorHandler.ts

// 类型文件 - camelCase
userTypes.ts
navigationTypes.ts

// 常量文件 - camelCase
apiConstants.ts
themeConstants.ts

// Hook文件 - camelCase (以use开头)
useAuth.ts
useTheme.ts
```

### 组件开发规范

#### 1. 组件结构模板

```typescript
/**
 * 组件描述
 * 
 * @example
 * <UserProfile userId="123" onEdit={() => {}} />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ComponentProps } from './types';

// ===== 接口定义 =====
interface UserProfileProps {
  /** 用户ID */
  userId: string;
  /** 编辑回调 */
  onEdit?: () => void;
  /** 自定义样式 */
  style?: ViewStyle;
}

// ===== 组件实现 =====
const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onEdit,
  style,
}) => {
  // 状态定义
  const [loading, setLoading] = useState(false);
  
  // 副作用
  useEffect(() => {
    // 组件逻辑
  }, [userId]);
  
  // 事件处理
  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);
  
  // 渲染函数
  return (
    <View style={[styles.container, style]}>
      <Text>User Profile</Text>
    </View>
  );
};

// ===== 样式定义 =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// ===== 默认属性 =====
UserProfile.defaultProps = {
  onEdit: undefined,
};

export default UserProfile;
```

#### 2. 组件Props设计原则

```typescript
// ✅ 好的Props设计
interface ButtonProps {
  /** 按钮文本 */
  title: string;
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'outline';
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onPress?: () => void;
}

// ❌ 避免的Props设计
interface BadButtonProps {
  text: string;           // 不够语义化
  type: string;          // 类型不明确
  isDisabled: boolean;   // 应该可选
  onClick: () => void;   // React Native使用onPress
}
```

### API服务开发规范

#### 1. API服务结构

```typescript
/**
 * 用户相关API服务
 */

import { http } from '../client';
import type { User, ApiResponse } from '../../types';

// ===== 类型定义 =====
interface GetUserRequest {
  userId: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// ===== API函数 =====

/**
 * 获取用户信息
 * @param params - 请求参数
 * @returns 用户信息
 */
export async function getUserAPI(params: GetUserRequest): Promise<ApiResponse<User>> {
  return http.get<ApiResponse<User>>(`/users/${params.userId}`);
}

/**
 * 更新用户信息
 * @param userId - 用户ID
 * @param params - 更新参数
 * @returns 更新结果
 */
export async function updateUserAPI(
  userId: string,
  params: UpdateUserRequest
): Promise<ApiResponse<User>> {
  return http.put<ApiResponse<User>>(`/users/${userId}`, params);
}
```

#### 2. 错误处理规范

```typescript
import { handleApiError, safeExecute } from '../../utils/errorHandler';

/**
 * 安全的API调用示例
 */
export async function safeGetUser(userId: string): Promise<User | null> {
  return safeExecute(
    () => getUserAPI({ userId }),
    {
      category: 'network',
      customMessage: '获取用户信息失败',
      context: { userId },
    }
  );
}
```

### 状态管理规范

#### 1. Zustand Store结构

```typescript
/**
 * 用户状态管理切片
 */

import type { StateCreator } from 'zustand';
import type { User } from '../../types';

// ===== 状态接口 =====
export interface UserState {
  // 数据状态
  currentUser: User | null;
  users: User[];
  
  // 加载状态
  loading: boolean;
  error: string | null;
  
  // 分页状态
  pagination: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}

// ===== 操作接口 =====
export interface UserActions {
  // 数据操作
  setCurrentUser: (user: User | null) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  
  // 列表操作
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  
  // 状态操作
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 异步操作
  fetchUser: (userId: string) => Promise<void>;
  fetchUsers: (params?: any) => Promise<void>;
}

// ===== 切片类型 =====
export type UserSlice = {
  user: UserState;
} & UserActions;

// ===== 初始状态 =====
const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    hasMore: false,
  },
};

// ===== 切片创建 =====
export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set, get) => ({
  // 状态
  user: initialState,
  
  // 同步操作
  setCurrentUser: (user) => {
    set((state) => {
      state.user.currentUser = user;
    });
  },
  
  // 异步操作
  fetchUser: async (userId) => {
    set((state) => {
      state.user.loading = true;
      state.user.error = null;
    });
    
    try {
      const response = await getUserAPI({ userId });
      if (response.success) {
        set((state) => {
          state.user.currentUser = response.data;
        });
      }
    } catch (error) {
      set((state) => {
        state.user.error = error.message;
      });
    } finally {
      set((state) => {
        state.user.loading = false;
      });
    }
  },
});
```

---

## 🎨 代码风格

### TypeScript规范

#### 1. 类型定义

```typescript
// ✅ 推荐的类型定义
interface User {
  /** 用户ID */
  id: string;
  /** 用户名称 */
  name: string;
  /** 邮箱地址 */
  email: string;
  /** 创建时间 */
  createdAt: number;
}

// 使用type定义联合类型
type UserRole = 'admin' | 'user' | 'guest';
type Theme = 'light' | 'dark' | 'auto';

// 使用泛型提高复用性
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
```

#### 2. 函数定义

```typescript
// ✅ 推荐的函数定义
/**
 * 格式化用户名称
 * @param user - 用户对象
 * @param options - 格式化选项
 * @returns 格式化后的名称
 */
function formatUserName(
  user: User,
  options: {
    includeEmail?: boolean;
    maxLength?: number;
  } = {}
): string {
  const { includeEmail = false, maxLength = 50 } = options;
  
  let name = user.name;
  if (includeEmail) {
    name += ` (${user.email})`;
  }
  
  if (name.length > maxLength) {
    name = name.substring(0, maxLength - 3) + '...';
  }
  
  return name;
}
```

### React Hooks规范

```typescript
// ✅ 自定义Hook示例
/**
 * 用户数据管理Hook
 * @param userId - 用户ID
 * @returns 用户数据和操作方法
 */
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 获取用户数据
  const fetchUser = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserAPI({ userId });
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message || '获取用户失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // 更新用户数据
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await updateUserAPI(user.id, updates);
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // 初始化加载
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
}
```

---

## 🔒 类型安全

### 严格的TypeScript配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 类型守卫的使用

```typescript
// 类型守卫函数
function isUser(value: any): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}

// 使用类型守卫
function processUser(data: unknown) {
  if (isUser(data)) {
    // 这里TypeScript知道data是User类型
    console.log(data.name);
  } else {
    throw new Error('Invalid user data');
  }
}
```

---

## ⚠️ 错误处理

### 统一错误处理策略

```typescript
// 1. API层错误处理
export async function apiCall<T>(
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    // 统一错误处理
    handleApiError(error);
    throw error;
  }
}

// 2. 组件层错误处理
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await safeExecute(
          () => getUserAPI({ userId }),
          { 
            customMessage: '加载用户信息失败',
            showAlert: true 
          }
        );
        
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        setError('加载失败');
      }
    };
    
    loadUser();
  }, [userId]);
  
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => {}} />;
  }
  
  return <View>{/* 正常渲染 */}</View>;
}
```

---

## ⚡ 性能优化

### React性能优化

```typescript
// 1. 使用React.memo优化组件渲染
const UserCard = React.memo<UserCardProps>(({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{user.name}</Text>
    </TouchableOpacity>
  );
});

// 2. 使用useCallback优化函数引用
function UserList({ users }: { users: User[] }) {
  const handleUserPress = useCallback((userId: string) => {
    navigation.navigate('UserDetail', { userId });
  }, [navigation]);
  
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserCard 
          user={item} 
          onPress={() => handleUserPress(item.id)} 
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

// 3. 使用useMemo优化计算
function UserStats({ users }: { users: User[] }) {
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
    };
  }, [users]);
  
  return <View>{/* 渲染统计信息 */}</View>;
}
```

### 列表性能优化

```typescript
// 使用FlatList的性能优化配置
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  // 性能优化配置
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={100}
  initialNumToRender={10}
  windowSize={10}
  // 避免匿名函数
  getItemLayout={getItemLayout}
/>
```

---

## 🧪 测试策略

### 单元测试示例

```typescript
// UserProfile.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserProfile from '../UserProfile';
import { getUserAPI } from '../../services/api/userApi';

// Mock API
jest.mock('../../services/api/userApi');
const mockGetUserAPI = getUserAPI as jest.MockedFunction<typeof getUserAPI>;

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render user information', async () => {
    // Arrange
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: Date.now(),
    };
    
    mockGetUserAPI.mockResolvedValue({
      success: true,
      data: mockUser,
    });
    
    // Act
    const { getByText } = render(<UserProfile userId="1" />);
    
    // Assert
    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
    });
  });
  
  it('should handle loading state', () => {
    mockGetUserAPI.mockReturnValue(new Promise(() => {})); // 永不resolve
    
    const { getByText } = render(<UserProfile userId="1" />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });
});
```

---

## 🔄 Git工作流

### 分支策略

```
main                 # 生产环境分支
├── develop          # 开发环境分支
├── feature/xxx      # 功能分支
├── bugfix/xxx       # 修复分支
├── hotfix/xxx       # 热修复分支
└── release/xxx      # 发布分支
```

### 提交信息规范

```
type(scope): description

feat(auth): add biometric authentication
fix(ui): resolve button alignment issue
docs(readme): update installation guide
style(theme): adjust color palette
refactor(api): restructure user service
test(user): add unit tests for user profile
chore(deps): update react-native version
```

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 类型定义完整准确
- [ ] 错误处理得当
- [ ] 性能考虑充分
- [ ] 测试覆盖充分
- [ ] 文档更新及时
- [ ] 无安全隐患
- [ ] 兼容性良好

---

## 🚀 部署流程

### 构建配置

```bash
# 开发构建
npm run build:dev

# 生产构建
npm run build:prod

# 分析构建
npm run build:analyze
```

### 环境配置

```typescript
// config/index.ts
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    LOG_LEVEL: 'debug',
    ENABLE_FLIPPER: true,
  },
  production: {
    API_BASE_URL: 'https://api.operateapp.com',
    LOG_LEVEL: 'error',
    ENABLE_FLIPPER: false,
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 📚 学习资源

### 推荐阅读

- [React Native官方文档](https://reactnative.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [React Navigation文档](https://reactnavigation.org/)
- [Zustand文档](https://github.com/pmndrs/zustand)
- [React Query文档](https://tanstack.com/query)

### 开发工具

- VS Code + React Native Tools
- Flipper调试工具
- React Native Debugger
- Reactotron状态调试

---

## 🤝 贡献指南

1. Fork项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交代码审查
5. 合并到主分支

---

**持续改进，追求卓越！** 🚀
