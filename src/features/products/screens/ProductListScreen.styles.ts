import { StyleSheet } from 'react-native';
import { Colors } from '../../../shared/theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    fontSize: 15,
  },
  counter: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  errorText: { color: Colors.danger, fontSize: 14, marginTop: 8 },
  addButton: {
    backgroundColor: Colors.brand,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    margin: 16,
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
});
