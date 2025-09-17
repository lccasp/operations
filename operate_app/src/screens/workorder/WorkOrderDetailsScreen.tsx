import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MOCK_ORDER_DETAILS = {
  '1': {
    title: '修复核心网-5GC-01 CPU告警',
    id: 'WO-20250917-001',
    info: { '创建人': '张三', '创建时间': '2025-09-17 10:35', '处理时限': '2小时' },
    flow: [
      { node: '工单创建', time: '10:35', user: '张三', comment: 'CPU利用率超过95%，请紧急处理。' },
      { node: '工单派发', time: '10:36', user: '系统', comment: '已派发给网络组-李四。' },
      { node: '工单处理中', time: '10:40', user: '李四', comment: '收到，正在排查原因。' },
    ],
    status: '处理中',
  },
  // Add other mock details as needed
};

const WorkOrderDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const { id } = route.params;
  const order = MOCK_ORDER_DETAILS[id] || MOCK_ORDER_DETAILS['1'];

  const renderFlowItem = (item, isLast) => (
    <View style={styles.flowItem}>
      <View style={styles.flowMarker}>
        <View style={[styles.flowDot, { backgroundColor: theme.colors.primary }]} />
        {!isLast && <View style={[styles.flowLine, { backgroundColor: theme.colors.border.secondary }]} />}
      </View>
      <View style={styles.flowContent}>
        <Text style={[styles.flowNode, { color: theme.colors.text.primary }]}>{item.node}</Text>
        <Text style={[styles.flowComment, { color: theme.colors.text.secondary }]}>{item.comment}</Text>
        <Text style={[styles.flowMeta, { color: theme.colors.text.tertiary }]}>{item.user} at {item.time}</Text>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>{order.title}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>{order.id}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>工单信息</Text>
            {Object.entries(order.info).map(([key, value]) => (
              <View key={key} style={styles.kvPair}>
                <Text style={[styles.keyText, { color: theme.colors.text.secondary }]}>{key}</Text>
                <Text style={[styles.valueText, { color: theme.colors.text.primary }]}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>处理流程</Text>
            {order.flow.map((item, index) => renderFlowItem(item, index === order.flow.length - 1))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.actionBar, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>转派</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.actionButtonText}>处理</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, color: 'gray', marginTop: 4 },
  content: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  kvPair: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  keyText: { fontSize: 16 },
  valueText: { fontSize: 16, fontWeight: '500' },
  flowItem: { flexDirection: 'row' },
  flowMarker: { alignItems: 'center' },
  flowDot: { width: 12, height: 12, borderRadius: 6 },
  flowLine: { flex: 1, width: 2, marginTop: 4 },
  flowContent: { marginLeft: 16, paddingBottom: 20, flex: 1 },
  flowNode: { fontSize: 16, fontWeight: '600' },
  flowComment: { fontSize: 14, marginTop: 4 },
  flowMeta: { fontSize: 12, marginTop: 8 },
  actionBar: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  actionButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default WorkOrderDetailsScreen;
