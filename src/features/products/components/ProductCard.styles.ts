import { StyleSheet } from 'react-native';
import { Colors } from '../../../shared/theme/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  id: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 18, color: Colors.textSecondary, marginLeft: 8 },
});
