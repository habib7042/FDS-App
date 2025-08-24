import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMembers } from '../../store/slices/memberSlice';
import { fetchContributions } from '../../store/slices/contributionSlice';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const AdminDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { members, isLoading: membersLoading } = useSelector((state) => state.member);
  const { contributions, isLoading: contributionsLoading } = useSelector((state) => state.contribution);
  const { user } = useSelector((state) => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalContributions: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [members, contributions]);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        dispatch(fetchMembers()).unwrap(),
        dispatch(fetchContributions()).unwrap(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const calculateStats = () => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.isActive).length;
    const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = contributions
      .filter(c => c.year === currentYear && c.month === currentMonth.toString().padStart(2, '0'))
      .reduce((sum, c) => sum + c.amount, 0);

    setStats({
      totalMembers,
      activeMembers,
      totalContributions,
      monthlyRevenue,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions = [
    {
      title: 'Add Member',
      icon: 'account-plus',
      color: colors.primary,
      onPress: () => navigation.navigate('MemberDetail', { mode: 'create' }),
    },
    {
      title: 'Add Contribution',
      icon: 'cash-plus',
      color: colors.success,
      onPress: () => navigation.navigate('ContributionScreen', { mode: 'create' }),
    },
    {
      title: 'Generate Report',
      icon: 'file-chart',
      color: colors.info,
      onPress: () => navigation.navigate('ContributionScreen', { mode: 'report' }),
    },
    {
      title: 'Export Data',
      icon: 'export',
      color: colors.warning,
      onPress: () => navigation.navigate('MemberListScreen', { mode: 'export' }),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'member',
      title: 'New member added',
      description: 'মোহাম্মদ আলী joined FDS',
      time: '2 hours ago',
      icon: 'account-plus',
      color: colors.success,
    },
    {
      id: 2,
      type: 'contribution',
      title: 'Contribution received',
      description: '৳1,000 from FR6BHG',
      time: '5 hours ago',
      icon: 'cash-check',
      color: colors.primary,
    },
    {
      id: 3,
      type: 'report',
      title: 'Report generated',
      description: 'Monthly statement for January 2024',
      time: '1 day ago',
      icon: 'file-document',
      color: colors.info,
    },
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, shadows.md]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const QuickActionCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.quickActionCard, shadows.md]} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  const isLoading = membersLoading || contributionsLoading;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell-outline" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Statistics Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Total Members"
                  value={stats.totalMembers.toString()}
                  subtitle={`${stats.activeMembers} active`}
                  icon="account-group"
                  color={colors.primary}
                />
                <StatCard
                  title="Total Contributions"
                  value={`৳${stats.totalContributions.toLocaleString()}`}
                  subtitle="All time"
                  icon="cash-multiple"
                  color={colors.success}
                />
                <StatCard
                  title="Monthly Revenue"
                  value={`৳${stats.monthlyRevenue.toLocaleString()}`}
                  subtitle="This month"
                  icon="calendar-month"
                  color={colors.info}
                />
                <StatCard
                  title="Growth Rate"
                  value="+12%"
                  subtitle="vs last month"
                  icon="trending-up"
                  color={colors.warning}
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    title={action.title}
                    icon={action.icon}
                    color={action.color}
                    onPress={action.onPress}
                  />
                ))}
              </View>
            </View>

            {/* Recent Activities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} item={activity} />
                ))}
              </View>
            </View>
          </>
        )}
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.sm,
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  quickActionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.sm,
    alignItems: 'center',
    minWidth: '45%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  activitiesList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default AdminDashboard;