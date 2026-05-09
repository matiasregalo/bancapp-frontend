import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useProductForm } from '../hooks/useProductForm';
import type { RootStackParamList } from '../../../types/navigation.types';
import type { ProductFormValues, ProductFormErrors } from '../../../types/product.types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;
type RouteType = RouteProp<RootStackParamList, 'ProductForm'>;

export interface UseProductFormScreenReturn {
  isEdit: boolean;
  values: ProductFormValues;
  errors: ProductFormErrors;
  isSubmitting: boolean;
  apiError: string | null;
  changeField: (field: keyof ProductFormValues) => (v: string) => void;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
}

export function useProductFormScreen(): UseProductFormScreenReturn {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();

  const isEdit = route.params.mode === 'edit';
  const initialProduct = isEdit ? route.params.product : undefined;

  const onSuccess = useCallback(
    () => navigation.navigate('ProductList'),
    [navigation],
  );

  const { values, errors, isSubmitting, apiError, handleChange, handleSubmit, handleReset } =
    useProductForm(route.params.mode, initialProduct, onSuccess);

  const changeField = useCallback(
    (field: keyof ProductFormValues) => (v: string) => handleChange(field, v),
    [handleChange],
  );

  return { isEdit, values, errors, isSubmitting, apiError, changeField, handleSubmit, handleReset };
}
