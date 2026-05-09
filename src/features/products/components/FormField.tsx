import React from 'react';
import { View, Text, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { styles } from './FormField.styles';

interface FormFieldProps
  extends Pick<TextInputProps, 'editable' | 'value' | 'testID'> {
  label: string;
  error?: string;
  onChangeText?: (text: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  editable = true,
  value,
  onChangeText,
  testID,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        !editable && styles.inputDisabled,
        error ? styles.inputError : null,
      ]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      testID={testID}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);
