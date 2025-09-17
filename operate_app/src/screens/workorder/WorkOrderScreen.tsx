import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MOCK_ORDERS = [
  { id: '1', title: '修复核心网-5GC-01 CPU告警', type: '故障工单', status: '处理中', time: '2025-09-17 10:35' },
  { id: '2', title: '计划性割接-网络扩容', type: '割接巡检', status: '待处理', time: '2025-09-17 09:00' },
  { id: '3', title: '服务器磁盘空间清理', type: '故障工单', status: '已完成', time: '2025-09-16 18:00' },
  { id: '4', title: '携带介质进入A机房申请', type: '介质携带', status: '处理中', time: '2025-09-16 15:20' },
];

const FILTERS = ['全部', '待处理', '处理中', '已完成'];

const WorkOrderScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

    const renderOrderItem = ({ item }) => {
        const statusColors = {
            '待处理': theme.colors.warning,
            '处理中': theme.colors.info,
            '已完成': theme.colors.success,
        };
        const statusColor = statusColors[item.status] || theme.colors.text.secondary;

        return (
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.colors.background.card }]}
                onPress={() => navigation.navigate('WorkOrderDetails', { id: item.id })}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
                </View>
                <View style={styles.cardRow}>
                    <View style={[styles.badge, { backgroundColor: theme.colors.primaryLight }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{item.type}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: statusColor }]}>
                        <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.cardRow}>
                     <Ionicons name="time-outline" color={theme.colors.text.secondary} size={14} />
                    <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>{item.time}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>运维工单</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateWorkOrder')}>
                    <Ionicons name="add-circle-outline" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.filterContainer, { backgroundColor: theme.colors.background.primary }]}>
                {FILTERS.map(filter => (
                    <TouchableOpacity 
                        key={filter} 
                        style={[styles.filterButton, selectedFilter === filter && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text style={[
                            styles.filterText, 
                            { color: selectedFilter === filter ? '#FFFFFF' : theme.colors.text.primary }
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={MOCK_ORDERS}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
    filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    filterText: { fontSize: 14, fontWeight: '600' },
    listContent: { padding: 16 },
    card: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    cardHeader: { marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: '600' },
    cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    cardText: { marginLeft: 8, fontSize: 14 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
    badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});

export default WorkOrderScreen;
