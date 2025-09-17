import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MOCK_ALARMS = [
  { id: '1', level: '紧急', title: '核心网-5GC-01 CPU利用率过高', object: '核心网-5GC-01', time: '2025-09-17 10:30' },
  { id: '2', level: '重要', title: '云服务器-VM-128 磁盘空间不足', object: '云服务器-VM-128', time: '2025-09-17 09:15' },
  { id: '3', level: '次要', title: '承载设备-Router-X 端口丢包', object: '承载设备-Router-X', time: '2025-09-17 08:45' },
  { id: '4', level: '紧急', title: '数据库连接池耗尽', object: 'MySQL-DB-01', time: '2025-09-17 08:30' },
];

const STATS = [
    { title: '总告警数', value: 128 },
    { title: '已派单', value: 60 },
    { title: '处理中', value: 47 },
    { title: '已解决', value: 21 },
];

const FaultAlarmScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    const renderAlarmItem = ({ item }) => {
        const levelColors = {
            '紧急': theme.colors.error,
            '重要': theme.colors.warning,
            '次要': theme.colors.info,
        };
        const levelColor = levelColors[item.level] || theme.colors.text.secondary;

        return (
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.colors.background.card }]}
                onPress={() => navigation.navigate('AlarmDetails', { id: item.id })}
            >
                <View style={[styles.levelIndicator, { backgroundColor: levelColor }]} />
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
                    <View style={styles.cardRow}>
                        <Ionicons name="hardware-chip-outline" color={theme.colors.text.secondary} size={14} />
                        <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>{item.object}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Ionicons name="time-outline" color={theme.colors.text.secondary} size={14} />
                        <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>{item.time}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>故障告警</Text>
                <TouchableOpacity onPress={() => console.log('Open filters')}>
                    <Ionicons name="filter-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: theme.colors.background.primary }]}>
                {STATS.map(stat => (
                    <View key={stat.title} style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{stat.value}</Text>
                        <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>{stat.title}</Text>
                    </View>
                ))}
            </View>

            <FlatList
                data={MOCK_ALARMS}
                renderItem={renderAlarmItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statTitle: { fontSize: 12, marginTop: 4 },
    listContent: { padding: 16 },
    card: {
        borderRadius: 12,
        marginBottom: 16,
        elevation: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    levelIndicator: {
        width: 6,
    },
    cardContent: {
        padding: 16,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    cardText: {
        marginLeft: 8,
        fontSize: 14,
    }
});

export default FaultAlarmScreen;
