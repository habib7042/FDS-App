import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setTheme, setLanguage, setAppConfig } from '../store/slices/uiSlice';

const SettingsScreen = ({ navigation }) => {
  const { theme, language, appConfig } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrl, setServerUrl] = useState(appConfig.baseUrl);

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
  };

  const handleServerConfigSave = () => {
    if (serverUrl.trim()) {
      dispatch(setAppConfig({ baseUrl: serverUrl.trim() }));
      setShowServerConfig(false);
      Alert.alert('Success', 'Server configuration updated successfully');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            dispatch(setTheme('light'));
            dispatch(setLanguage('en'));
            dispatch(setAppConfig({ baseUrl: 'http://localhost:3000/api' }));
            setNotificationsEnabled(true);
            setBiometricEnabled(false);
            setAutoSyncEnabled(true);
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'theme-light-dark',
          title: 'Theme',
          subtitle: theme === 'dark' ? 'Dark' : 'Light',
          type: 'select',
          options: ['light', 'dark'],
          value: theme,
          onValueChange: handleThemeChange,
        },
        {
          icon: 'translate',
          title: 'Language',
          subtitle: language === 'bn' ? 'বাংলা' : 'English',
          type: 'select',
          options: ['en', 'bn'],
          value: language,
          onValueChange: handleLanguageChange,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: 'bell-outline',
          title: 'Notifications',
          subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: 'fingerprint',
          title: 'Biometric Login',
          subtitle: biometricEnabled ? 'Enabled' : 'Disabled',
          type: 'switch',
          value: biometricEnabled,
          onValueChange: setBiometricEnabled,
        },
      ],
    },
    {
      title: 'Data & Sync',
      items: [
        {
          icon: 'sync',
          title: 'Auto Sync',
          subtitle: autoSyncEnabled ? 'Enabled' : 'Disabled',
          type: 'switch',
          value: autoSyncEnabled,
          onValueChange: setAutoSyncEnabled,
        },
        {
          icon: 'server',
          title: 'Server Configuration',
          subtitle: 'Configure API server',
          type: 'button',
          onPress: () => setShowServerConfig(true),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-outline',
          title: 'App Version',
          subtitle: '1.0.0',
          type: 'static',
        },
        {
          icon: 'code-tags',
          title: 'Build Number',
          subtitle: '1',
          type: 'static',
        },
        {
          icon: 'account-group-outline',
          title: 'Developer',
          subtitle: 'FDS Team',
          type: 'static',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'switch':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Icon name={item.icon} size={24} color="#666" />
              <View style={styles.settingItemText}>
                <Text style={styles.settingItemTitle}>{item.title}</Text>
                <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#ccc', true: '#00897B' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        );

      case 'select':
        return (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              const options = item.options.map(opt => ({
                text: opt === 'light' ? 'Light' : opt === 'dark' ? 'Dark' : opt === 'en' ? 'English' : 'বাংলা',
                onPress: () => item.onValueChange(opt),
              }));
              
              Alert.alert(
                `Select ${item.title}`,
                '',
                options.map(opt => ({
                  text: opt.text,
                  onPress: opt.onPress,
                })),
                { cancelable: true }
              );
            }}
          >
            <View style={styles.settingItemLeft}>
              <Icon name={item.icon} size={24} color="#666" />
              <View style={styles.settingItemText}>
                <Text style={styles.settingItemTitle}>{item.title}</Text>
                <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        );

      case 'button':
        return (
          <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
            <View style={styles.settingItemLeft}>
              <Icon name={item.icon} size={24} color="#666" />
              <View style={styles.settingItemText}>
                <Text style={styles.settingItemTitle}>{item.title}</Text>
                <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        );

      case 'static':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Icon name={item.icon} size={24} color="#666" />
              <View style={styles.settingItemText}>
                <Text style={styles.settingItemTitle}>{item.title}</Text>
                <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
          <Icon name="restore" size={24} color="#FF6B6B" />
          <Text style={styles.resetButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showServerConfig}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Server Configuration</Text>
            <TouchableOpacity onPress={() => setShowServerConfig(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Server URL</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://localhost:3000/api"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleServerConfigSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#00897B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 16,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00897B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;