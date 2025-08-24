import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './theme';

export const toastConfig = {
  success: (props) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <Icon name="check-circle" size={24} color={colors.success} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
  
  error: (props) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <Icon name="alert-circle" size={24} color={colors.error} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
  
  info: (props) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <Icon name="information" size={24} color={colors.info} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
  
  warning: (props) => (
    <View style={[styles.toastContainer, styles.warningToast]}>
      <Icon name="alert" size={24} color={colors.warning} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  warningToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
});