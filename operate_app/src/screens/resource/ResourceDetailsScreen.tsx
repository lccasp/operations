import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';

const MOCK_DETAILS = {
  '1': {
    name: '核心网-5GC-01',
    attributes: { 'IP地址': '10.0.X.X', '厂商': '厂商A', '型号': 'V-200', '状态': '在线' },
    alarms: [{ id: 'a1', title: '设备温度过高' }],
    performance: [
      { x: '10:00', y: 30 },
      { x: '11:00', y: 45 },
      { x: '12:00', y: 40 },
      { x: '13:00', y: 60 },
    ],
  },
  // Add other mock details as needed
};

const TABS = ['基础信息', '关联拓扑', '资源履历', '当前告警', '性能指标'];

const ResourceDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const { id } = route.params;
  const resource = MOCK_DETAILS[id] || MOCK_DETAILS['1'];
  const [activeTab, setActiveTab] = React.useState(TABS[0]);

  const renderContent = () => {
    switch (activeTab) {
      case '基础信息':
        return (
          <View style={styles.contentView}>
            {Object.entries(resource.attributes).map(([key, value]) => (
              <View key={key} style={styles.kvPair}>
                <Text style={[styles.keyText, { color: theme.colors.text.secondary }]}>{key}</Text>
                <Text style={[styles.valueText, { color: theme.colors.text.primary }]}>{value}</Text>
              </View>
            ))}
          </View>
        );
      case '性能指标':
        return (
          <View style={styles.contentView}>
            <Text style={styles.chartTitle}>CPU使用率 (%)</Text>
            <VictoryChart height={250}>
              <VictoryLine data={resource.performance} style={{ data: { stroke: theme.colors.primary } }} />
              <VictoryAxis style={{ tickLabels: { fill: theme.colors.text.secondary } }} />
              <VictoryAxis dependentAxis style={{ tickLabels: { fill: theme.colors.text.secondary } }} />
            </VictoryChart>
          </View>
        );
      default:
        return (
          <View style={styles.contentView}>
            <Text style={{ color: theme.colors.text.primary }}>{activeTab} 内容区</Text>
          </View>
        );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>{resource.name}</Text>
      </View>
      
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && { borderBottomColor: theme.colors.primary }]}>
              <Text style={[styles.tabText, { color: activeTab === tab ? theme.colors.primary : theme.colors.text.secondary }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  tabsContainer: { paddingHorizontal: 10 },
  tab: { paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 16, fontWeight: '600' },
  contentView: { padding: 20 },
  kvPair: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  keyText: { fontSize: 16 },
  valueText: { fontSize: 16, fontWeight: '500' },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, alignSelf: 'center' },
});

export default ResourceDetailsScreen;
