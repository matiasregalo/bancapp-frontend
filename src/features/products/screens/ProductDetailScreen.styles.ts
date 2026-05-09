import { StyleSheet } from 'react-native';
import { Colors } from '../../../shared/theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { paddingBottom: 32 },
  titleSection: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  logo: { width: '100%', height: 120 },
  logoPlaceholder: {
    backgroundColor: Colors.backgroundDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: { fontSize: 14, color: Colors.textSecondary },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: { fontSize: 14, color: Colors.textSecondary },
  rowValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
  },
  editButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  deleteButton: {
    backgroundColor: Colors.danger,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  deleteButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.white },
});
