/**
 * 主导航器
 * 管理主应用的Tab导航和各个模块的Stack导航
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme';
import type { 
    MainTabParamList, 
    HomeStackParamList,
    ResourceManagementStackParamList,
    FaultAlarmStackParamList,
    WorkOrderStackParamList,
    ProfileStackParamList
} from '../types/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';


// 导入页面组件
import HomeScreen from '../screens/home/HomeScreen';
import ResourceManagementScreen from '../screens/resource/ResourceManagementScreen';
import FaultAlarmScreen from '../screens/alarm/FaultAlarmScreen';
import WorkOrderScreen from '../screens/workorder/WorkOrderScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ResourceDetailsScreen from '../screens/resource/ResourceDetailsScreen';
import AlarmDetailsScreen from '../screens/alarm/AlarmDetailsScreen';
import WorkOrderDetailsScreen from '../screens/workorder/WorkOrderDetailsScreen';
import CreateWorkOrderScreen from '../screens/workorder/CreateWorkOrderScreen';


// 创建Stack导航器
const HomeStack = createStackNavigator<HomeStackParamList>();
const ResourceManagementStack = createStackNavigator<ResourceManagementStackParamList>();
const FaultAlarmStack = createStackNavigator<FaultAlarmStackParamList>();
const WorkOrderStack = createStackNavigator<WorkOrderStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// 首页Stack导航
const HomeStackNavigator = () => {
  const theme = useTheme();
  
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.colors.background.primary,
        },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

// 资源管理Stack导航
const ResourceManagementStackNavigator = () => {
    const theme = useTheme();
    return (
        <ResourceManagementStack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
            }}
        >
            <ResourceManagementStack.Screen name="ResourceManagement" component={ResourceManagementScreen} />
            <ResourceManagementStack.Screen name="ResourceDetails" component={ResourceDetailsScreen} />
        </ResourceManagementStack.Navigator>
    );
};

// 故障告警Stack导航
const FaultAlarmStackNavigator = () => {
    const theme = useTheme();
    return (
        <FaultAlarmStack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
            }}
        >
            <FaultAlarmStack.Screen name="FaultAlarm" component={FaultAlarmScreen} />
            <FaultAlarmStack.Screen name="AlarmDetails" component={AlarmDetailsScreen} />
        </FaultAlarmStack.Navigator>
    );
};

// 运维工单Stack导航
const WorkOrderStackNavigator = () => {
    const theme = useTheme();
    return (
        <WorkOrderStack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
            }}
        >
            <WorkOrderStack.Screen name="WorkOrder" component={WorkOrderScreen} />
            <WorkOrderStack.Screen name="WorkOrderDetails" component={WorkOrderDetailsScreen} />
            <WorkOrderStack.Screen name="CreateWorkOrder" component={CreateWorkOrderScreen} />
        </WorkOrderStack.Navigator>
    );
};

// 个人中心Stack导航
const ProfileStackNavigator = () => {
    const theme = useTheme();
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: theme.colors.background.primary },
            }}
        >
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        </ProfileStack.Navigator>
    );
};


// 创建Tab导航器
const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors?.background?.card || '#FFFFFF',
          borderTopColor: theme.colors?.border?.secondary || '#E5E5EA',
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 90 : 65,
        },
        tabBarActiveTintColor: theme.colors?.primary || '#007AFF',
        tabBarInactiveTintColor: theme.colors?.text?.secondary || '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          fontFamily: 'System',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: '首页概览',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ResourceManagementTab"
        component={ResourceManagementStackNavigator}
        options={{
          tabBarLabel: '资源管理',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="FaultAlarmTab"
        component={FaultAlarmStackNavigator}
        options={{
          tabBarLabel: '故障告警',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="WorkOrderTab"
        component={WorkOrderStackNavigator}
        options={{
          tabBarLabel: '运维工单',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: '个人中心',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
