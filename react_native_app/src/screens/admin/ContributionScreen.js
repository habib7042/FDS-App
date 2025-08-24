import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Picker,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMembers } from '../../store/slices/memberSlice';
import { fetchContributions, addContribution } from '../../store/slices/contributionSlice';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const ContributionScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.member);
  const { contributions } = useSelector((state) => state.contribution);
  
  const [mode, setMode] = useState('list');
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    memberId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: '',
    description: '',
    paymentMethod: 'cash',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { mode: routeMode, memberId } = route.params || {};
    if (routeMode) {
      setMode(routeMode);
      if (routeMode === 'create' && memberId) {
        setFormData(prev => ({ ...prev, memberId }));
        setShowAddModal(true);
      }
    }
    
    dispatch(fetchMembers());
    dispatch(fetchContributions());
  }, [route.params, dispatch]);

  const handleAddContribution = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(addContribution({
        ...formData,
        month: formData.month.toString().padStart(2, '0'),
        amount: parseFloat(formData.amount),
      })).unwrap();
      
      Alert.alert('Success', 'Contribution added successfully');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', error || 'Failed to add contribution');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.memberId) {
      errors.push('Please select a member');
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.push('Please enter a valid amount');
    }

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: '',
      description: '',
      paymentMethod: 'cash',
    });
    setSelectedMember(null);
  };

  const handleGenerateReport = async () => {
    try {
      Alert.alert('Success', 'Report generated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  const renderAddContributionModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => {
            setShowAddModal(false);
            resetForm();
          }}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Contribution</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Member</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                Alert.alert(
                  'Select Member',
                  'Choose a member',
                  members.map(member => ({
                    text: `${member.name} (${member.accountNumber})`,
                    onPress: () => {
                      setSelectedMember(member);
                      setFormData(prev => ({ ...prev, memberId: member.id }));
                    },
                  })),
                  { cancelable: true }
                );
              }}
            >
              <Text style={[styles.selectText, !selectedMember && styles.placeholderText]}>
                {selectedMember ? `${selectedMember.name} (${selectedMember.accountNumber})` : 'Select a member'}
              </Text>
              <Icon name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Month</Text>
              <View style={styles.selectButton}>
                <Picker
                  selectedValue={formData.month}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                  style={styles.picker}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <Picker.Item key={month} label={`${month.toString().padStart(2, '0')}`} value={month} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: spacing.sm }]}>
              <Text style={styles.label}>Year</Text>
              <View style={styles.selectButton}>
                <Picker
                  selectedValue={formData.year}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                  style={styles.picker}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <Picker.Item key={year} label={year.toString()} value={year} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount (৳)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#999"
              value={formData.amount}
              onChangeText={(value) => setFormData(prev => ({ ...prev, amount: value }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.selectButton}>
              <Picker
                selectedValue={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Bank Transfer" value="bank" />
                <Picker.Item label="Mobile Banking" value="mobile" />
                <Picker.Item label="Check" value="check" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleAddContribution}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Add Contribution</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderContributionList = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contributions</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterButton}>
          <Icon name="filter-outline" size={16} color={colors.primary} />
          <Text style={styles.filterText}>All Time</Text>
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="export" size={16} color="#FFFFFF" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>৳{contributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{contributions.length}</Text>
            <Text style={styles.statLabel}>Total Contributions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ৳{(contributions.reduce((sum, c) => sum + c.amount, 0) / contributions.length || 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Average Amount</Text>
          </View>
        </View>

        <View style={styles.contributionsList}>
          <Text style={styles.listTitle}>Recent Contributions</Text>
          
          {contributions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="cash-off" size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No contributions yet</Text>
              <Text style={styles.emptyDescription}>Add the first contribution to get started</Text>
            </View>
          ) : (
            contributions.slice(0, 20).map((contribution) => {
              const member = members.find(m => m.id === contribution.memberId);
              return (
                <View key={contribution.id} style={styles.contributionItem}>
                  <View style={styles.contributionLeft}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarText}>
                        {member?.name?.charAt(0)?.toUpperCase() || 'M'}
                      </Text>
                    </View>
                    <View style={styles.contributionInfo}>
                      <Text style={styles.memberName}>{member?.name || 'Unknown Member'}</Text>
                      <Text style={styles.contributionPeriod}>
                        {contribution.getMonthName?.('bn') || contribution.month} {contribution.year}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.contributionRight}>
                    <Text style={styles.contributionAmount}>
                      ৳{contribution.amount.toLocaleString()}
                    </Text>
                    <Text style={styles.contributionDate}>
                      {new Date(contribution.paymentDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {renderAddContributionModal()}
    </View>
  );

  const renderReportGenerator = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Generate Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.reportOptions}>
          <Text style={styles.sectionTitle}>Report Type</Text>
          
          <TouchableOpacity style={styles.reportOption}>
            <Icon name="file-pdf-box" size={32} color={colors.error} />
            <View style={styles.reportOptionInfo}>
              <Text style={styles.reportOptionTitle}>Monthly Statement</Text>
              <Text style={styles.reportOptionDesc}>Generate monthly contribution statements</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportOption}>
            <Icon name="file-chart" size={32} color={colors.primary} />
            <View style={styles.reportOptionInfo}>
              <Text style={styles.reportOptionTitle}>Yearly Summary</Text>
              <Text style={styles.reportOptionDesc}>Annual contribution summary report</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportOption}>
            <Icon name="account-group" size={32} color={colors.success} />
            <View style={styles.reportOptionInfo}>
              <Text style={styles.reportOptionTitle}>Member Directory</Text>
              <Text style={styles.reportOptionDesc}>Complete member contact list</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{members.length}</Text>
              <Text style={styles.quickStatLabel}>Total Members</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{contributions.length}</Text>
              <Text style={styles.quickStatLabel}>Contributions</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>
                ৳{contributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
              </Text>
              <Text style={styles.quickStatLabel}>Total Amount</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.generateReportButton} onPress={handleGenerateReport}>
          <Icon name="file-pdf-box" size={20} color="#FFFFFF" />
          <Text style={styles.generateReportButtonText}>Generate Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (mode === 'report') {
    return renderReportGenerator();
  }

  return renderContributionList();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  filterText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  exportText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    ...shadows.md,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contributionsList: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  contributionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  contributionInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  contributionPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contributionRight: {
    alignItems: 'flex-end',
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  contributionDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalContent: {
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  selectButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.textLight,
  },
  picker: {
    flex: 1,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    ...shadows.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportOptions: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  reportOptionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  reportOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reportOptionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickStats: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.sm,
    ...shadows.sm,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  generateReportButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  generateReportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default ContributionScreen;