/**
 * 个人中心页面
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth, useAuthActions } from '../../store';
import Button from '../../components/ui/Button';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          个人中心
        </Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.colors.background.card }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.avatarText, { color: theme.colors.text.inverse }]}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
          {user?.name || '用户'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          账户设置
        </Text>
        
        <View style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
            编辑个人资料
          </Text>
        </View>
        
        <View style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
            隐私设置
          </Text>
        </View>
        
        <View style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
            通知设置
          </Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          应用设置
        </Text>
        
        <View style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
            主题设置
          </Text>
        </View>
        
        <View style={[styles.menuItem, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
            语言设置
          </Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <Button
          title="退出登录"
          variant="destructive"
          fullWidth
          onPress={handleLogout}
          style={styles.logoutButton}
        />
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
  profileCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
  },
  actionSection: {
    marginTop: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
