import React from 'react';
import { FormField } from './FormField';
import type { ProductFormValues, ProductFormErrors } from '../../../types/product.types';

interface ProductFormFieldsProps {
  values: ProductFormValues;
  errors: ProductFormErrors;
  isEdit: boolean;
  changeField: (field: keyof ProductFormValues) => (text: string) => void;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  values,
  errors,
  isEdit,
  changeField,
}) => (
  <>
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
  </>
);
