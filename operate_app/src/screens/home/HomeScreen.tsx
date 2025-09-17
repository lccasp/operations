/**
 * 首页概览
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../store';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

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

  const AnnouncementBar = useMemo(() => (
    showAnnouncement ? (
      <View style={[styles.announcementBar, { backgroundColor: theme.colors.primaryLight }]}>
        <Text style={[styles.announcementText, { color: theme.colors.primary }]}>
          [重要] V3.2系统将于今晚23:00进行升级...
        </Text>
        <TouchableOpacity onPress={handleCloseAnnouncement}>
          <Ionicons name="close-circle" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    ) : null
  ), [showAnnouncement, theme.colors.primary, theme.colors.primaryLight, handleCloseAnnouncement]);

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
    >
      {AnnouncementBar}

      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
          您好, {user?.name || '运维人员'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          这是您的网络运行状况概览
        </Text>
      </View>

      <View style={styles.coreMetricsGrid}>
        <CoreMetric title="当前活动告警" value={47} />
        <CoreMetric title="进行中工单" value={8} />
        <CoreMetric title="资源健康度" value="98%" />
      </View>

      <View style={styles.cardGrid}>
        {/* 故障概览卡片 */}
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>故障告警</Text>
            <View style={{ width: CARD_WIDTH, height: 120, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: theme.colors.text.secondary }}>故障分布图</Text>
              <Text style={{ color: theme.colors.error, fontSize: 24, fontWeight: 'bold' }}>47</Text>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>总告警数</Text>
            </View>
          <Text style={[styles.cardFooter, { color: theme.colors.text.secondary }]}>重大故障: 2</Text>
        </TouchableOpacity>

        {/* 性能概览卡片 */}
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.background.card }]} onPress={() => { /* Navigate to performance details */ }}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>网络性能</Text>
            <View style={styles.performanceItem}>
                <Ionicons name="hardware-chip-outline" color={theme.colors.error} size={16} />
                <Text style={[styles.performanceText, { color: theme.colors.text.primary }]}>XX设备CPU使用率过高</Text>
            </View>
            <View style={styles.performanceItem}>
                <Ionicons name="swap-vertical-outline" color={theme.colors.warning} size={16} />
                <Text style={[styles.performanceText, { color: theme.colors.text.primary }]}>YY设备网络延迟</Text>
            </View>
             <Text style={[styles.cardFooter, { color: theme.colors.text.secondary, marginTop: 'auto' }]}>Top 2 性能异常</Text>
        </TouchableOpacity>

        {/* 资源概览卡片 */}
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>资源统计</Text>
          <View style={{ width: CARD_WIDTH, height: 120, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text.secondary }}>资源分布</Text>
            <Text style={{ color: theme.colors.primary, fontSize: 24, fontWeight: 'bold' }}>550</Text>
            <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>总资源数</Text>
          </View>
          <Text style={[styles.cardFooter, { color: theme.colors.text.secondary }]}>合规率: 95%</Text>
        </TouchableOpacity>
        
        {/* 工单概览卡片 */}
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>运维工单</Text>
          <View style={styles.workOrderItem}>
            <Text style={[styles.workOrderNumber, { color: theme.colors.warning }]}>8</Text>
            <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>在途工单</Text>
          </View>
          <View style={styles.workOrderItem}>
            <Text style={[styles.workOrderNumber, { color: theme.colors.error }]}>2</Text>
            <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>超时工单</Text>
          </View>
          <View style={styles.workOrderItem}>
            <Text style={[styles.workOrderNumber, { color: theme.colors.success }]}>15</Text>
            <Text style={[styles.workOrderLabel, { color: theme.colors.text.secondary }]}>今日已完成</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  announcementBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  announcementText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  coreMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  metricContainer: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  metricTitle: {
    fontSize: 12,
    marginTop: 4,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardFooter: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  performanceText: {
    marginLeft: 8,
    fontSize: 12,
    flexShrink: 1,
  },
  workOrderItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workOrderNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  workOrderLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default HomeScreen;
