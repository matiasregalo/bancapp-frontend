import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../../shared/theme/colors';
import { styles } from './ProductFormActions.styles';

interface ProductFormActionsProps {
  apiError: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  apiError,
  isSubmitting,
  onSubmit,
  onReset,
}) => (
  <>
    {apiError ? (
      <Text style={styles.apiError} testID="api-error">
        {apiError}
      </Text>
    ) : null}

    <TouchableOpacity
      style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
      onPress={onSubmit}
      disabled={isSubmitting}
      testID="submit-button"
    >
      {isSubmitting ? (
        <ActivityIndicator color={Colors.textPrimary} testID="submit-loading" />
      ) : (
        <Text style={styles.submitButtonText}>Enviar</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.resetButton}
      onPress={onReset}
      disabled={isSubmitting}
      testID="reset-button"
    >
      <Text style={styles.resetButtonText}>Reiniciar</Text>
    </TouchableOpacity>
  </>
);
