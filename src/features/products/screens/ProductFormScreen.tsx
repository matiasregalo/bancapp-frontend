import React from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../../shared/components/Header';
import { FormField } from '../components/FormField';
import { useProductFormScreen } from './useProductFormScreen';
import { Colors } from '../../../shared/theme/colors';
import { styles } from './ProductFormScreen.styles';

export const ProductFormScreen: React.FC = () => {
  const {
    isEdit,
    values,
    errors,
    isSubmitting,
    apiError,
    changeField,
    handleSubmit,
    handleReset,
  } = useProductFormScreen();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID="form-screen"
    >
      <Header />
      <Text style={styles.title}>
        {isEdit ? 'Formulario de Edición' : 'Formulario de Registro'}
      </Text>

      <FormField
        label="ID"
        value={values.id}
        onChangeText={changeField('id')}
        editable={!isEdit}
        error={errors.id}
        testID="field-id"
      />
      <FormField
        label="Nombre"
        value={values.name}
        onChangeText={changeField('name')}
        error={errors.name}
        testID="field-name"
      />
      <FormField
        label="Descripción"
        value={values.description}
        onChangeText={changeField('description')}
        error={errors.description}
        testID="field-description"
      />
      <FormField
        label="Logo"
        value={values.logo}
        onChangeText={changeField('logo')}
        error={errors.logo}
        testID="field-logo"
      />
      <FormField
        label="Fecha Liberación"
        value={values.date_release}
        onChangeText={changeField('date_release')}
        error={errors.date_release}
        testID="field-date-release"
      />
      <FormField
        label="Fecha Revisión"
        value={values.date_revision}
        editable={false}
        testID="field-date-revision"
      />

      {apiError ? (
        <Text style={styles.apiError} testID="api-error">
          {apiError}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
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
        onPress={handleReset}
        disabled={isSubmitting}
        testID="reset-button"
      >
        <Text style={styles.resetButtonText}>Reiniciar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
