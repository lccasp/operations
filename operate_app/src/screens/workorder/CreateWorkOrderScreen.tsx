import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import Button from '../../components/ui/Button';

const CreateWorkOrderScreen = () => {
  const theme = useTheme();
  const [orderType, setOrderType] = useState('割接巡检');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>新建工单</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>工单类型</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeButton, orderType === '割接巡检' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setOrderType('割接巡检')}
          >
            <Text style={[styles.typeButtonText, orderType === '割接巡检' && { color: '#FFFFFF' }]}>割接巡检</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, orderType === '介质携带' && { backgroundColor: theme.colors.primary }]}
            onPress={() => setOrderType('介质携带')}
          >
            <Text style={[styles.typeButtonText, orderType === '介质携带' && { color: '#FFFFFF' }]}>介质携带</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: theme.colors.text.primary }]}>标题</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary }]}
          placeholder="请输入工单标题"
          placeholderTextColor={theme.colors.text.secondary}
        />

        <Text style={[styles.label, { color: theme.colors.text.primary }]}>详细描述</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary }]}
          placeholder="请详细描述工单内容..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
        />
        
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>附件上传</Text>
        <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.colors.background.card }]}>
            <Text style={{color: theme.colors.primary}}>点击上传附件</Text>
        </TouchableOpacity>

        <Button title="提交" variant="primary" style={{ marginTop: 30 }} onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8, marginTop: 16 },
  input: { height: 50, borderRadius: 10, paddingHorizontal: 16, fontSize: 16 },
  textArea: { height: 120, borderRadius: 10, paddingHorizontal: 16, paddingTop: 16, fontSize: 16, textAlignVertical: 'top' },
  typeSelector: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, padding: 4 },
  typeButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  typeButtonText: { fontSize: 14, fontWeight: '600' },
  uploadButton: { height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: 'gray' },
});

export default CreateWorkOrderScreen;
