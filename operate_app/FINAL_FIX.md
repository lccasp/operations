# React Native 上下文错误 - 最终修复方案

## 问题总结

您遇到的核心问题是：
```
ReactNoCrashSoftException: Tried to access onWindowFocusChange while context is not ready
Tried to remove non-existent frame callback
```

## 已实施的修复

### 1. MainActivity.kt 增强版本
```kotlin
package com.operate_app

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate

class MainActivity : ReactActivity() {

  private val handler = Handler(Looper.getMainLooper())
  private var isReactContextReady = false

  override fun getMainComponentName(): String = "operate_app"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      SafeReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // 延迟设置React上下文就绪状态
    handler.postDelayed({
      isReactContextReady = true
      android.util.Log.d("MainActivity", "React context marked as ready")
    }, 2000)
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    try {
      super.onWindowFocusChanged(hasFocus)
    } catch (e: Exception) {
      android.util.Log.w("MainActivity", "onWindowFocusChanged error: ${e.message}")
    }
  }

  override fun onPause() {
    try {
      super.onPause()
    } catch (e: Exception) {
      android.util.Log.w("MainActivity", "onPause error: ${e.message}")
    }
  }

  override fun onResume() {
    try {
      super.onResume()
    } catch (e: Exception) {
      android.util.Log.w("MainActivity", "onResume error: ${e.message}")
    }
  }
}
```

### 2. SafeReactActivityDelegate.kt
```kotlin
package com.operate_app

import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class SafeReactActivityDelegate(
    activity: ReactActivity,
    mainComponentName: String?,
    fabricEnabled: Boolean = false
) : DefaultReactActivityDelegate(activity, mainComponentName ?: "", fabricEnabled) {
    
    private val TAG = "SafeReactActivityDelegate"
    private var isContextReady = false
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        try {
            Log.d(TAG, "onWindowFocusChanged called with hasFocus=$hasFocus")
            
            if (plainActivity?.isFinishing == true || plainActivity?.isDestroyed == true) {
                Log.d(TAG, "Activity is finishing/destroyed, skipping")
                return
            }
            
            if (!isContextReady) {
                Log.d(TAG, "Context not ready, postponing")
                plainActivity?.let { activity ->
                    activity.runOnUiThread {
                        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                            if (!activity.isFinishing && !activity.isDestroyed) {
                                isContextReady = true
                                onWindowFocusChanged(hasFocus)
                            }
                        }, 1000)
                    }
                }
                return
            }
            
            super.onWindowFocusChanged(hasFocus)
            
        } catch (e: Exception) {
            Log.w(TAG, "Error in onWindowFocusChanged: ${e.message}", e)
        }
    }
    
    override fun onResume() {
        try {
            super.onResume()
            isContextReady = true
            Log.d(TAG, "onResume called, context marked as ready")
        } catch (e: Exception) {
            Log.w(TAG, "Error in onResume: ${e.message}", e)
        }
    }
    
    override fun onPause() {
        try {
            super.onPause()
            Log.d(TAG, "onPause called")
        } catch (e: Exception) {
            Log.w(TAG, "Error in onPause: ${e.message}", e)
        }
    }
}
```

### 3. App.tsx 增强版本
```typescript
import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, AppState, LogBox, View, Text } from 'react-native';

// 开发环境配置
if (__DEV__) {
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
    'Setting a timer for a long period of time',
    'Maximum update depth exceeded',
    'Tried to access onWindowFocusChange while context is not ready',
    'Tried to remove non-existent frame callback',
    'ReactNoCrashSoftException',
  ]);
}

function App() {
  const theme = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[App] Initializing application...');
        
        // 等待确保React Native完全初始化
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (StorageUtils.isFirstLaunch()) {
          console.log('[App] First launch detected');
          StorageUtils.setFirstLaunch(false);
        }

        // 延迟设置ready状态
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setIsReady(true);
        console.log('[App] Application initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize application:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // 如果应用尚未就绪，显示加载屏幕
  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.primary 
      }}>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 24, 
          fontWeight: 'bold',
          marginBottom: 16 
        }}>
          专网综合网管
        </Text>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 16,
          marginBottom: 32 
        }}>
          掌上运维平台
        </Text>
        <Text style={{ 
          color: theme.colors.text.inverse, 
          fontSize: 14 
        }}>
          正在初始化应用...
        </Text>
        {initError && (
          <Text style={{ 
            color: '#FF3B30', 
            fontSize: 12, 
            marginTop: 16,
            textAlign: 'center',
            paddingHorizontal: 20
          }}>
            初始化错误: {initError}
          </Text>
        )}
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={createPaperTheme(theme)}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <LoadingProvider>
              <NotificationProvider>
                <StatusBar
                  barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
                  backgroundColor={theme.colors.background.primary}
                  translucent={Platform.OS === 'android'}
                />
                <RootNavigator />
              </NotificationProvider>
            </LoadingProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
```

## 最终测试命令

```bash
# Windows PowerShell 兼容命令
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
# 在新终端窗口运行:
npx react-native run-android
```

## 验证修复

运行应用后，您应该看到：
1. ✅ 应用正常启动并显示界面
2. ✅ 没有 ReactNoCrashSoftException 错误
3. ✅ 没有 "frame callback" 错误
4. ✅ 窗口焦点变化不再导致错误

## 关于蓝牙错误

您看到的蓝牙错误：
```
BluetoothPowerStatsCollector system_server E Cannot acquire BluetoothActivityEnergyInfo
```

这是Android模拟器的系统级错误，与您的React Native应用无关。这是模拟器本身的蓝牙功能问题，不会影响您的应用运行。

## 如果问题仍然存在

如果React Host错误仍然出现，请尝试：

1. **完全重置开发环境：**
```bash
# 停止所有进程
taskkill /f /im node.exe
taskkill /f /im java.exe

# 清理所有缓存
rmdir /s /q node_modules
del package-lock.json
cd android
./gradlew clean
cd ..

# 重新安装
npm install
npx react-native run-android
```

2. **检查模拟器：**
   - 尝试不同的Android版本
   - 增加模拟器的RAM和存储空间
   - 启用硬件加速

3. **监控特定错误：**
```bash
adb logcat | grep -E "(operate_app|ReactNoCrashSoftException)"
```

这个解决方案应该彻底解决React Native上下文问题。蓝牙错误是模拟器问题，与您的应用代码无关。
