import React, { useCallback } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../../shared/components/Header';
import { FormField } from '../components/FormField';
import { useProductForm } from '../hooks/useProductForm';
import type { RootStackParamList } from '../../../types/navigation.types';
import type { ProductFormValues } from '../../../types/product.types';
import { Colors } from '../../../shared/theme/colors';
import { styles } from './ProductFormScreen.styles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;
type RouteType = RouteProp<RootStackParamList, 'ProductForm'>;

export const ProductFormScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();

  const isEdit = route.params.mode === 'edit';
  const initialProduct = isEdit ? route.params.product : undefined;

  const onSuccess = useCallback(
    () => navigation.navigate('ProductList'),
    [navigation],
  );

  const {
    values,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
    handleReset,
  } = useProductForm(route.params.mode, initialProduct, onSuccess);

  const changeField = useCallback(
    (field: keyof ProductFormValues) => (v: string) => handleChange(field, v),
    [handleChange],
  );

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
