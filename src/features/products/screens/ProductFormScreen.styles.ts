import { StyleSheet } from 'react-native';
import { Colors } from '../../../shared/theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginVertical: 16,
  },
  apiError: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.brand,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  resetButton: {
    backgroundColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
