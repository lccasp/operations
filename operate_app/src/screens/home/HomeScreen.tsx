/**
 * 首页概览
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../store';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const faultData = [
    { x: '紧急', y: 5 },
    { x: '重要', y: 12 },
    { x: '次要', y: 30 },
  ];

  const resourceData = [
    { x: '5GC', y: 120 },
    { x: '云资源', y: 350 },
    { x: '承载设备', y: 80 },
  ];

  const handleCloseAnnouncement = useCallback(() => {
    setShowAnnouncement(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const AnnouncementBar = useMemo(() => (
    showAnnouncement ? (
      <View style={[styles.announcementBar, { 
        backgroundColor: theme.mode === 'dark' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 122, 255, 0.08)',
        borderColor: theme.mode === 'dark' ? 'rgba(0, 122, 255, 0.3)' : 'rgba(0, 122, 255, 0.2)',
      }]}>
        <Ionicons name="megaphone-outline" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.announcementText, { color: theme.colors.primary }]}>
          V3.2系统将于今晚23:00进行升级
        </Text>
        <TouchableOpacity onPress={handleCloseAnnouncement} style={styles.closeButton}>
          <Ionicons name="close" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    ) : null
  ), [showAnnouncement, theme.colors.primary, theme.mode, handleCloseAnnouncement]);

  const CoreMetric = useMemo(() => 
    ({ title, value }: { title: string, value: string | number }) => (
      <View style={styles.metricContainer}>
        <Text style={[styles.metricValue, { color: theme.colors.primary }]}>{value}</Text>
        <Text style={[styles.metricTitle, { color: theme.colors.text.secondary }]}>{title}</Text>
      </View>
    ), [theme.colors.primary, theme.colors.text.secondary]
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          title="更新数据中..."
          titleColor={theme.colors.text.secondary}
        />
      }
    >
      {AnnouncementBar}

      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
            您好, {user?.name || '运维人员'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            这是您的网络运行状况概览
          </Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.colors.background.secondary }]}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.colors.error }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.coreMetricsContainer}>
        <View style={[styles.metricCard, { backgroundColor: theme.colors.background.card }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: theme.colors.error + '15' }]}>
            <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
          </View>
          <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>47</Text>
          <Text style={[styles.metricTitle, { color: theme.colors.text.secondary }]}>当前活动告警</Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: theme.colors.background.card }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: theme.colors.warning + '15' }]}>
            <Ionicons name="document-text" size={24} color={theme.colors.warning} />
          </View>
          <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>8</Text>
          <Text style={[styles.metricTitle, { color: theme.colors.text.secondary }]}>进行中工单</Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: theme.colors.background.card }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: theme.colors.success + '15' }]}>
            <Ionicons name="pulse" size={24} color={theme.colors.success} />
          </View>
          <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>98%</Text>
          <Text style={[styles.metricTitle, { color: theme.colors.text.secondary }]}>资源健康度</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        {/* 故障概览卡片 */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.background.card }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('FaultAlarmTab' as any)}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>故障告警</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </View>
          <View style={styles.faultDistribution}>
            <View style={styles.faultItem}>
              <View style={[styles.faultDot, { backgroundColor: theme.colors.error }]} />
              <Text style={[styles.faultLabel, { color: theme.colors.text.secondary }]}>紧急</Text>
              <Text style={[styles.faultValue, { color: theme.colors.text.primary }]}>5</Text>
            </View>
            <View style={styles.faultItem}>
              <View style={[styles.faultDot, { backgroundColor: theme.colors.warning }]} />
              <Text style={[styles.faultLabel, { color: theme.colors.text.secondary }]}>重要</Text>
              <Text style={[styles.faultValue, { color: theme.colors.text.primary }]}>12</Text>
            </View>
            <View style={styles.faultItem}>
              <View style={[styles.faultDot, { backgroundColor: theme.colors.info }]} />
              <Text style={[styles.faultLabel, { color: theme.colors.text.secondary }]}>次要</Text>
              <Text style={[styles.faultValue, { color: theme.colors.text.primary }]}>30</Text>
            </View>
          </View>
          <View style={[styles.cardFooter, { borderTopColor: theme.colors.border.secondary }]}>
            <Text style={[styles.cardFooterText, { color: theme.colors.error }]}>重大故障: 2</Text>
          </View>
        </TouchableOpacity>

        {/* 性能概览卡片 */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.background.card }]} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ResourceManagementTab' as any)}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>网络性能</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </View>
          <View style={styles.performanceList}>
            <View style={[styles.performanceItem, { backgroundColor: theme.colors.error + '10' }]}>
              <MaterialCommunityIcons name="cpu-64-bit" color={theme.colors.error} size={20} />
              <Text style={[styles.performanceText, { color: theme.colors.text.primary }]} numberOfLines={1}>
                5GC-01 CPU使用率 95%
              </Text>
            </View>
            <View style={[styles.performanceItem, { backgroundColor: theme.colors.warning + '10' }]}>
              <MaterialCommunityIcons name="lan-pending" color={theme.colors.warning} size={20} />
              <Text style={[styles.performanceText, { color: theme.colors.text.primary }]} numberOfLines={1}>
                承载-03 网络延迟 150ms
              </Text>
            </View>
          </View>
          <View style={[styles.cardFooter, { borderTopColor: theme.colors.border.secondary }]}>
            <Text style={[styles.cardFooterText, { color: theme.colors.text.secondary }]}>2 个性能异常</Text>
          </View>
        </TouchableOpacity>

        {/* 资源概览卡片 */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.background.card }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ResourceManagementTab' as any)}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>资源统计</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </View>
          <View style={styles.resourceStats}>
            <View style={styles.resourceItem}>
              <MaterialCommunityIcons name="server" size={24} color={theme.colors.primary} />
              <Text style={[styles.resourceValue, { color: theme.colors.text.primary }]}>120</Text>
              <Text style={[styles.resourceLabel, { color: theme.colors.text.secondary }]}>5GC</Text>
            </View>
            <View style={styles.resourceDivider} />
            <View style={styles.resourceItem}>
              <MaterialCommunityIcons name="cloud-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.resourceValue, { color: theme.colors.text.primary }]}>350</Text>
              <Text style={[styles.resourceLabel, { color: theme.colors.text.secondary }]}>云资源</Text>
            </View>
            <View style={styles.resourceDivider} />
            <View style={styles.resourceItem}>
              <MaterialCommunityIcons name="router-wireless" size={24} color={theme.colors.primary} />
              <Text style={[styles.resourceValue, { color: theme.colors.text.primary }]}>80</Text>
              <Text style={[styles.resourceLabel, { color: theme.colors.text.secondary }]}>承载</Text>
            </View>
          </View>
          <View style={[styles.cardFooter, { borderTopColor: theme.colors.border.secondary }]}>
            <Text style={[styles.cardFooterText, { color: theme.colors.success }]}>合规率: 95%</Text>
          </View>
        </TouchableOpacity>
        
        {/* 工单概览卡片 */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.background.card }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('WorkOrderTab' as any)}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>运维工单</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </View>
          <View style={styles.workOrderGrid}>
            <View style={[styles.workOrderItem, { backgroundColor: theme.colors.warning + '10' }]}>
              <Ionicons name="time-outline" size={20} color={theme.colors.warning} />
              <Text style={[styles.workOrderNumber, { color: theme.colors.warning }]}>8</Text>
              <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>在途工单</Text>
            </View>
            <View style={[styles.workOrderItem, { backgroundColor: theme.colors.error + '10' }]}>
              <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
              <Text style={[styles.workOrderNumber, { color: theme.colors.error }]}>2</Text>
              <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>超时工单</Text>
            </View>
            <View style={[styles.workOrderItem, { backgroundColor: theme.colors.success + '10' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} />
              <Text style={[styles.workOrderNumber, { color: theme.colors.success }]}>15</Text>
              <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>今日完成</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  announcementBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  announcementText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  coreMetricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardFooter: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // 故障分布样式
  faultDistribution: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  faultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  faultLabel: {
    flex: 1,
    fontSize: 14,
  },
  faultValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  // 性能样式
  performanceList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  performanceText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  // 资源统计样式
  resourceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resourceItem: {
    flex: 1,
    alignItems: 'center',
  },
  resourceValue: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 4,
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  resourceDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
  // 工单样式
  workOrderGrid: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  workOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  workOrderNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  workOrderLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});

export default HomeScreen;
