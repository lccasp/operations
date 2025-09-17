import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MOCK_RESOURCES = [
  { id: '1', name: '核心网-5GC-01', type: '5GC', status: '正常', location: '北京-A机房' },
  { id: '2', name: '云服务器-VM-128', type: '云资源', status: '告警', location: '上海-B机房' },
  { id: '3', name: '承载设备-Router-X', type: '承载设备', status: '正常', location: '广州-C机房' },
  { id: '4', name: '核心网-5GC-02', type: '5GC', status: '正常', location: '北京-A机房' },
  { id: '5', name: '云存储-NAS-03', type: '云资源', status: '维护中', location: '上海-B机房' },
];

const FILTERS = ['按专业', '按类型', '按地域'];

const ResourceManagementScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

    const onChangeSearch = query => setSearchQuery(query);

    const renderResourceItem = ({ item }) => {
        const statusColors = {
            '正常': theme.colors.success,
            '告警': theme.colors.error,
            '维护中': theme.colors.warning,
        };
        const statusColor = statusColors[item.status] || theme.colors.text.secondary;

        return (
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.colors.background.card }]}
                onPress={() => navigation.navigate('ResourceDetails', { id: item.id })}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{item.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.cardRow}>
                    <Ionicons name="hardware-chip-outline" color={theme.colors.text.secondary} size={14} />
                    <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>{item.type}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Ionicons name="location-outline" color={theme.colors.text.secondary} size={14} />
                    <Text style={[styles.cardText, { color: theme.colors.text.secondary }]}>{item.location}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
                <Searchbar
                    placeholder="按资源名称/类型搜索"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={[styles.searchbar, { backgroundColor: theme.colors.background.secondary }]}
                    inputStyle={{ color: theme.colors.text.primary }}
                    placeholderTextColor={theme.colors.text.secondary}
                    iconColor={theme.colors.text.secondary}
                />
            </View>

            <View style={[styles.filterContainer, { backgroundColor: theme.colors.background.primary }]}>
                {FILTERS.map(filter => (
                    <TouchableOpacity 
                        key={filter} 
                        style={[
                            styles.filterButton, 
                            selectedFilter === filter && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text style={[
                            styles.filterText, 
                            { color: selectedFilter === filter ? theme.colors.primary : theme.colors.text.secondary }
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={MOCK_RESOURCES}
                renderItem={renderResourceItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingTop: 50, // for notch
    },
    searchbar: {
        borderRadius: 10,
        elevation: 0,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    filterButton: {
        paddingVertical: 8,
    },
    filterText: {
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
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

export default ResourceManagementScreen;
