import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MOCK_ALARM_DETAILS = {
  '1': {
    title: '核心网-5GC-01 CPU利用率过高',
    details: {
      '告警ID': 'ALM-20250917-001',
      '级别': '紧急',
      '状态': '处理中',
      '发生时间': '2025-09-17 10:30:15',
      '定位信息': '北京-A机房 / 柜A01 / U12',
    },
    diagnosis: {
      conclusion: 'CPU资源瓶颈',
      reason: '业务流量突增导致CPU持续高负载运行。',
      suggestion: '建议立即扩容CPU资源或排查异常流量来源。',
    },
  },
  // Add other mock details as needed
};

const AlarmDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const { id } = route.params;
  const alarm = MOCK_ALARM_DETAILS[id] || MOCK_ALARM_DETAILS['1'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>告警详情</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.alarmTitle, { color: theme.colors.text.primary }]}>{alarm.title}</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>告警详情</Text>
          {Object.entries(alarm.details).map(([key, value]) => (
            <View key={key} style={styles.kvPair}>
              <Text style={[styles.keyText, { color: theme.colors.text.secondary }]}>{key}</Text>
              <Text style={[styles.valueText, { color: theme.colors.text.primary }]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>智能诊断</Text>
          <View style={[styles.diagnosisCard, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.diagnosisLabel, { color: theme.colors.text.secondary }]}>诊断结论:</Text>
            <Text style={[styles.diagnosisText, { color: theme.colors.error, fontWeight: 'bold' }]}>{alarm.diagnosis.conclusion}</Text>
            
            <Text style={[styles.diagnosisLabel, { color: theme.colors.text.secondary }]}>可能原因:</Text>
            <Text style={[styles.diagnosisText, { color: theme.colors.text.primary }]}>{alarm.diagnosis.reason}</Text>

            <Text style={[styles.diagnosisLabel, { color: theme.colors.text.secondary }]}>处理建议:</Text>
            <Text style={[styles.diagnosisText, { color: theme.colors.text.primary }]}>{alarm.diagnosis.suggestion}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20 },
  alarmTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  kvPair: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  keyText: { fontSize: 16 },
  valueText: { fontSize: 16, fontWeight: '500' },
  diagnosisCard: { borderRadius: 12, padding: 16 },
  diagnosisLabel: { fontSize: 14, marginTop: 10 },
  diagnosisText: { fontSize: 16, marginTop: 4 },
});

export default AlarmDetailsScreen;
