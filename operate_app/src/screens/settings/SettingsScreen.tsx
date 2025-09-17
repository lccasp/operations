/**
 * 设置页面
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { useApp, useAppActions } from '../../store';
import Button from '../../components/ui/Button';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { theme: currentTheme, language } = useApp();
  const { setTheme, setLanguage } = useAppActions();

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLanguage(newLanguage);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          设置
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          外观
        </Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              主题模式
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              当前: {currentTheme === 'light' ? '浅色' : '深色'}
            </Text>
          </View>
          
          <Button
            title="切换"
            variant="outline"
            size="small"
            onPress={handleThemeToggle}
          />
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              语言设置
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              当前: {language === 'zh-CN' ? '简体中文' : 'English'}
            </Text>
          </View>
          
          <Button
            title="切换"
            variant="outline"
            size="small"
            onPress={handleLanguageToggle}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          通知
        </Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              推送通知
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              接收应用通知
            </Text>
          </View>
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              邮件通知
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              接收邮件提醒
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          关于
        </Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              应用版本
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              1.0.0
            </Text>
          </View>
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              隐私政策
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              查看隐私政策
            </Text>
          </View>
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              服务条款
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              查看服务条款
            </Text>
          </View>
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SettingsScreen;
