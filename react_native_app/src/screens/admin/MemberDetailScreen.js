import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMemberByAccount } from '../../store/slices/memberSlice';
import { fetchContributions } from '../../store/slices/contributionSlice';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const MemberDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { currentMember, isLoading: memberLoading } = useSelector((state) => state.member);
  const { contributions, isLoading: contributionsLoading } = useSelector((state) => state.contribution);
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [mode, setMode] = useState('view');

  useEffect(() => {
    const { memberId, accountNumber, mode: routeMode } = route.params || {};
    if (routeMode) {
      setMode(routeMode);
    }
    
    if (memberId) {
      // Load member by ID
    } else if (accountNumber) {
      dispatch(fetchMemberByAccount(accountNumber));
    }
  }, [route.params, dispatch]);

  useEffect(() => {
    if (currentMember) {
      dispatch(fetchContributions({ memberId: currentMember.id }));
    }
  }, [currentMember, dispatch]);

  const handleEditMember = () => {
    navigation.navigate('MemberDetail', { memberId: currentMember.id, mode: 'edit' });
  };

  const handleDeleteMember = () => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${currentMember?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Handle delete logic
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddContribution = () => {
    navigation.navigate('ContributionScreen', { 
      memberId: currentMember.id, 
      mode: 'create' 
    });
  };

  const handleGenerateStatement = async () => {
    try {
      // Generate PDF statement logic
      Alert.alert('Success', 'Statement generated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate statement');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Member Statement for ${currentMember?.name}\nAccount: ${currentMember?.accountNumber}\nTotal Contributions: ৳${currentMember?.getTotalContributions?.() || 0}`,
        title: 'Member Statement',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleCall = () => {
    if (currentMember?.phone) {
      Alert.alert('Call', `Would call: ${currentMember.phone}`);
    }
  };

  const handleEmail = () => {
    if (currentMember?.email) {
      Alert.alert('Email', `Would email: ${currentMember.email}`);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{currentMember?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Number</Text>
          <Text style={styles.infoValue}>{currentMember?.accountNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{currentMember?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{currentMember?.email || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{currentMember?.address || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Join Date</Text>
          <Text style={styles.infoValue}>
            {new Date(currentMember?.joinDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: currentMember?.isActive ? colors.success : colors.error }]} />
            <Text style={[styles.statusText, { color: currentMember?.isActive ? colors.success : colors.error }]}>
              {currentMember?.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.infoCardTitle}>Contribution Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>৳{currentMember?.getTotalContributions?.() || 0}</Text>
            <Text style={styles.statLabel}>Total Contributed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentMember?.getContributionsCount?.() || 0}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {currentMember?.getAvailableYears?.()?.[0] || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Latest Year</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContributionsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.contributionsHeader}>
        <Text style={styles.contributionsTitle}>Recent Contributions</Text>
        <TouchableOpacity style={styles.addContributionButton} onPress={handleAddContribution}>
          <Icon name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addContributionText}>Add</Text>
        </TouchableOpacity>
      </View>

      {contributions.length === 0 ? (
        <View style={styles.emptyContributions}>
          <Icon name="cash-off" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No contributions yet</Text>
          <Text style={styles.emptyDescription}>Add the first contribution for this member</Text>
        </View>
      ) : (
        contributions.slice(0, 10).map((contribution) => (
          <View key={contribution.id} style={styles.contributionItem}>
            <View style={styles.contributionLeft}>
              <Text style={styles.contributionMonth}>
                {contribution.getMonthName?.('bn') || contribution.month}
              </Text>
              <Text style={styles.contributionYear}>{contribution.year}</Text>
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
        ))
      )}
    </View>
  );

  const renderStatementsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statementsCard}>
        <Icon name="file-document-outline" size={48} color={colors.primary} />
        <Text style={styles.statementsTitle}>Generate Statement</Text>
        <Text style={styles.statementsDescription}>
          Create a comprehensive PDF statement for this member's contribution history
        </Text>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateStatement}>
          <Icon name="file-pdf-box" size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generate PDF</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentStatements}>
        <Text style={styles.recentStatementsTitle}>Recent Statements</Text>
        <View style={styles.statementItem}>
          <Icon name="file-pdf-box" size={24} color={colors.error} />
          <View style={styles.statementInfo}>
            <Text style={styles.statementName}>January 2024 Statement</Text>
            <Text style={styles.statementDate}>Generated on Jan 15, 2024</Text>
          </View>
          <TouchableOpacity style={styles.statementAction}>
            <Icon name="download" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const isLoading = memberLoading || contributionsLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentMember) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="account-alert" size={64} color={colors.error} />
        <Text style={styles.errorTitle}>Member not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Details</Text>
        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.menuButton} onPress={() => {
            Alert.alert(
              'Options',
              'Choose an action',
              [
                {
                  text: 'Edit Member',
                  onPress: handleEditMember,
                },
                {
                  text: 'Delete Member',
                  onPress: handleDeleteMember,
                  style: 'destructive',
                },
                {
                  text: 'Share',
                  onPress: handleShare,
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ]
            );
          }}>
            <Icon name="dots-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {currentMember.name?.charAt(0)?.toUpperCase() || 'M'}
            </Text>
          </View>
          <Text style={styles.memberName}>{currentMember.name}</Text>
          <Text style={styles.memberAccount}>Account: {currentMember.accountNumber}</Text>
          
          <View style={styles.contactActions}>
            {currentMember.phone && (
              <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                <Icon name="phone" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            {currentMember.email && (
              <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                <Icon name="email" size={20} color={colors.info} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabContainer}>
          {['overview', 'contributions', 'statements'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'contributions' && renderContributionsTab()}
        {activeTab === 'statements' && renderStatementsTab()}
      </ScrollView>
    </View>
  );
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
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  memberAccount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.lg,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: -spacing.lg,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary + '10',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    padding: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  contributionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  contributionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addContributionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addContributionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  emptyContributions: {
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
    alignItems: 'flex-start',
  },
  contributionMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  contributionYear: {
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
  statementsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  statementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  statementsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  recentStatements: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  recentStatementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statementInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  statementName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  statementDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  statementAction: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MemberDetailScreen;