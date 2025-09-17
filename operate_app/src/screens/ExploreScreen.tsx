/**
 * 探索页面
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import Button from '../components/ui/Button';

const ExploreScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          探索
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          发现新的功能和内容
        </Text>
      </View>

      <View style={styles.categories}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          分类
        </Text>
        
        <View style={styles.categoryGrid}>
          <View style={[styles.categoryCard, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
              工具
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.colors.text.secondary }]}>
              实用工具集合
            </Text>
          </View>
          
          <View style={[styles.categoryCard, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
              模板
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.colors.text.secondary }]}>
              操作模板库
            </Text>
          </View>
          
          <View style={[styles.categoryCard, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
              教程
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.colors.text.secondary }]}>
              学习教程
            </Text>
          </View>
          
          <View style={[styles.categoryCard, { backgroundColor: theme.colors.background.card }]}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
              社区
            </Text>
            <Text style={[styles.categoryDescription, { color: theme.colors.text.secondary }]}>
              用户分享
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.featured}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          精选推荐
        </Text>
        
        <View style={[styles.featuredCard, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.featuredTitle, { color: theme.colors.text.primary }]}>
            新功能预览
          </Text>
          <Text style={[styles.featuredDescription, { color: theme.colors.text.secondary }]}>
            体验最新的操作功能，提升工作效率
          </Text>
          
          <Button
            title="立即体验"
            variant="primary"
            style={styles.featuredButton}
          />
        </View>
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
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  categories: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featured: {
    marginBottom: 30,
  },
  featuredCard: {
    padding: 20,
    borderRadius: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  featuredButton: {
    alignSelf: 'flex-start',
  },
});

export default ExploreScreen;
