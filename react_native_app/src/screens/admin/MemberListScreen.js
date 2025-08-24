import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMembers, deleteMember } from '../../store/slices/memberSlice';
import { colors, spacing, borderRadius, shadows } from '../../utils/theme';

const MemberListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { members, isLoading, pagination } = useSelector((state) => state.member);
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchQuery]);

  const loadMembers = async () => {
    try {
      await dispatch(fetchMembers()).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to load members');
    }
  };

  const filterMembers = () => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.accountNumber.toLowerCase().includes(query) ||
      member.phone?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query)
    );
    setFilteredMembers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  };

  const handleMemberPress = (member) => {
    navigation.navigate('MemberDetail', { memberId: member.id });
  };

  const handleAddMember = () => {
    navigation.navigate('MemberDetail', { mode: 'create' });
  };

  const handleDeleteMember = (member) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await dispatch(deleteMember(member.id)).unwrap();
              Alert.alert('Success', 'Member deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete member');
            }
          },
        },
      ]
    );
  };

  const handleCallMember = (phone) => {
    if (phone) {
      // This would typically open the phone dialer
      Alert.alert('Call', `Would call: ${phone}`);
    }
  };

  const handleEmailMember = (email) => {
    if (email) {
      // This would typically open the email client
      Alert.alert('Email', `Would email: ${email}`);
    }
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.memberCard, shadows.md]}
      onPress={() => handleMemberPress(item)}
    >
      <View style={styles.memberHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0)?.toUpperCase() || 'M'}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberAccount}>Account: {item.accountNumber}</Text>
          <Text style={styles.memberContact}>
            {item.phone || item.email || 'No contact info'}
          </Text>
        </View>
        <View style={styles.memberStatus}>
          <View style={[styles.statusDot, { backgroundColor: item.isActive ? colors.success : colors.error }]} />
          <Text style={[styles.statusText, { color: item.isActive ? colors.success : colors.error }]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.memberStats}>
        <View style={styles.statItem}>
          <Icon name="cash-multiple" size={16} color={colors.primary} />
          <Text style={styles.statText}>
            ৳{item.getTotalContributions?.() || 0}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="file-document-outline" size={16} color={colors.info} />
          <Text style={styles.statText}>
            {item.getContributionsCount?.() || 0} contributions
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="calendar" size={16} color={colors.warning} />
          <Text style={styles.statText}>
            {new Date(item.joinDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.memberActions}>
        {item.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCallMember(item.phone)}
          >
            <Icon name="phone" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        {item.email && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEmailMember(item.email)}
          >
            <Icon name="email" size={20} color={colors.info} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteMember(item)}
        >
          <Icon name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="account-group-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyStateTitle}>No members found</Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery ? 'Try adjusting your search terms' : 'Add your first member to get started'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <Icon name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  memberCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  memberAccount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  memberContact: {
    fontSize: 12,
    color: colors.textLight,
  },
  memberStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionButton: {
    marginLeft: spacing.md,
    padding: spacing.sm,
  },
  deleteButton: {
    marginLeft: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default MemberListScreen;