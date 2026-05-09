import React from 'react';
import { Text, ScrollView } from 'react-native';
import { Header } from '../../../shared/components/Header';
import { ProductFormFields } from '../components/ProductFormFields';
import { ProductFormActions } from '../components/ProductFormActions';
import { useProductFormScreen } from './useProductFormScreen';
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

      <ProductFormFields
        values={values}
        errors={errors}
        isEdit={isEdit}
        changeField={changeField}
      />

      <ProductFormActions
        apiError={apiError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </ScrollView>
  );
};
