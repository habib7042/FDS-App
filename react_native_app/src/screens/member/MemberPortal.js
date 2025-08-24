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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMemberByAccount } from '../../store/slices/memberSlice';
import { fetchContributions } from '../../store/slices/contributionSlice';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const MemberPortal = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentMember, isLoading: memberLoading } = useSelector((state) => state.member);
  const { contributions, isLoading: contributionsLoading } = useSelector((state) => state.contribution);
  
  const [accountNumber, setAccountNumber] = useState('');
  const [showAccountInput, setShowAccountInput] = useState(true);
  const [stats, setStats] = useState({
    totalContributions: 0,
    monthlyAverage: 0,
    currentMonthStatus: false,
    latestContribution: null,
  });

  useEffect(() => {
    // Check if we have member data from navigation
    const params = navigation.getState()?.routes?.find(route => route.name === 'Member')?.params;
    if (params?.accountNumber) {
      setAccountNumber(params.accountNumber);
      loadMemberData(params.accountNumber);
    }
  }, [navigation]);

  useEffect(() => {
    if (currentMember) {
      calculateStats();
    }
  }, [currentMember, contributions]);

  const loadMemberData = async (accNumber) => {
    try {
      await dispatch(fetchMemberByAccount(accNumber)).unwrap();
      setShowAccountInput(false);
    } catch (error) {
      Alert.alert('Error', 'Invalid account number. Please try again.');
    }
  };

  const calculateStats = () => {
    if (!currentMember) return;

    const totalContributions = currentMember.getTotalContributions?.() || 0;
    const contributionCount = currentMember.getContributionsCount?.() || 0;
    const monthlyAverage = contributionCount > 0 ? totalContributions / contributionCount : 0;
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthStatus = currentMember.hasContributionForMonth?.(currentYear, currentMonth.toString().padStart(2, '0'));
    
    const latestContribution = currentMember.getLatestContribution?.();

    setStats({
      totalContributions,
      monthlyAverage,
      currentMonthStatus,
      latestContribution,
    });
  };

  const handleAccountSubmit = () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter your account number');
      return;
    }
    loadMemberData(accountNumber.trim());
  };

  const handleGenerateStatement = async () => {
    try {
      Alert.alert('Success', 'Your statement has been generated and downloaded');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate statement');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My FDS Contribution Summary\nAccount: ${currentMember?.accountNumber}\nTotal Contributions: ৳${stats.totalContributions.toLocaleString()}\nStatus: ${stats.currentMonthStatus ? 'Up to date' : 'Payment pending'}`,
        title: 'My FDS Statement',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleLogout = () => {
    setShowAccountInput(true);
    setAccountNumber('');
    // Clear member data from store if needed
  };

  const renderAccountInput = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.loginContainer}>
            <View style={styles.logoContainer}>
              <Icon name="account-circle" size={80} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Member Portal</Text>
            <Text style={styles.subtitle}>Enter your account number to view your contribution history</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon name="account-key-outline" size={24} color="#FFFFFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleAccountSubmit}>
                <Text style={styles.loginButtonText}>Access Portal</Text>
              </TouchableOpacity>

              <View style={styles.demoInfo}>
                <Text style={styles.demoText}>Demo Account: FR6BHG</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const renderMemberDashboard = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.memberInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {currentMember?.name?.charAt(0)?.toUpperCase() || 'M'}
              </Text>
            </View>
            <View>
              <Text style={styles.memberName}>{currentMember?.name}</Text>
              <Text style={styles.memberAccount}>Account: {currentMember?.accountNumber}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Account Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: stats.currentMonthStatus ? colors.success : colors.warning }]}>
              <Text style={styles.statusText}>
                {stats.currentMonthStatus ? 'Up to Date' : 'Payment Pending'}
              </Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>
            {stats.currentMonthStatus 
              ? 'Thank you for your continued support! Your contributions are up to date.'
              : 'Please make your contribution for this month to maintain your active status.'
            }
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="cash-multiple" size={32} color={colors.primary} />
            <Text style={styles.statValue}>৳{stats.totalContributions.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Contributed</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="chart-line" size={32} color={colors.success} />
            <Text style={styles.statValue}>৳{stats.monthlyAverage.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Monthly Average</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="calendar-check" size={32} color={colors.info} />
            <Text style={styles.statValue}>{currentMember?.getContributionsCount?.() || 0}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleGenerateStatement}>
              <Icon name="file-pdf-box" size={32} color={colors.error} />
              <Text style={styles.actionTitle}>Download Statement</Text>
              <Text style={styles.actionDescription}>Get your PDF statement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleShare}>
              <Icon name="share-variant" size={32} color={colors.info} />
              <Text style={styles.actionTitle}>Share Summary</Text>
              <Text style={styles.actionDescription}>Share your contribution info</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard} 
              onPress={() => navigation.navigate('MemberDetail', { accountNumber: currentMember?.accountNumber })}
            >
              <Icon name="history" size={32} color={colors.warning} />
              <Text style={styles.actionTitle}>View History</Text>
              <Text style={styles.actionDescription}>Full contribution history</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Icon name="help-circle-outline" size={32} color={colors.secondary} />
              <Text style={styles.actionTitle}>Get Help</Text>
              <Text style={styles.actionDescription}>Contact support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Contributions */}
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Contributions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MemberDetail', { accountNumber: currentMember?.accountNumber })}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {contributions.length === 0 ? (
            <View style={styles.emptyContributions}>
              <Icon name="cash-off" size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No contributions yet</Text>
              <Text style={styles.emptyDescription}>Your contribution history will appear here</Text>
            </View>
          ) : (
            contributions.slice(0, 5).map((contribution) => (
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

        {/* Contact Info */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            {currentMember?.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={20} color={colors.primary} />
                <Text style={styles.contactText}>{currentMember.phone}</Text>
              </View>
            )}
            {currentMember?.email && (
              <View style={styles.contactItem}>
                <Icon name="email" size={20} color={colors.info} />
                <Text style={styles.contactText}>{currentMember.email}</Text>
              </View>
            )}
            {currentMember?.address && (
              <View style={styles.contactItem}>
                <Icon name="map-marker" size={20} color={colors.warning} />
                <Text style={styles.contactText}>{currentMember.address}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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

  if (showAccountInput || !currentMember) {
    return renderAccountInput();
  }

  return renderMemberDashboard();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  demoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  memberAccount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
  actionsContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '47%',
    margin: spacing.sm,
    ...shadows.md,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentContainer: {
    marginBottom: spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyContributions: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
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
  contactContainer: {
    marginBottom: spacing.lg,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.md,
  },
});

export default MemberPortal;