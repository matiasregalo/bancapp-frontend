import type { ProductFormValues, ProductFormErrors } from '../../../types/product.types';
import { REQUIRED, MESSAGES } from './useProductForm.constants';

export function addOneYear(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) { return ''; }
  return `${Number(parts[0]) + 1}-${parts[1]}-${parts[2]}`;
}

function getLocalDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function validateId(id: string, mode: 'create' | 'edit'): Pick<ProductFormErrors, 'id'> {
  if (!id.trim()) { return { id: REQUIRED }; }
  if (mode === 'create') {
    if (id.length < 3) { return { id: MESSAGES.id.min }; }
    if (id.length > 10) { return { id: MESSAGES.id.max }; }
  }
  return {};
}

function validateName(name: string): Pick<ProductFormErrors, 'name'> {
  if (!name.trim()) { return { name: REQUIRED }; }
  if (name.length < 5) { return { name: MESSAGES.name.min }; }
  if (name.length > 100) { return { name: MESSAGES.name.max }; }
  return {};
}

function validateDescription(description: string): Pick<ProductFormErrors, 'description'> {
  if (!description.trim()) { return { description: REQUIRED }; }
  if (description.length < 10) { return { description: MESSAGES.description.min }; }
  if (description.length > 200) { return { description: MESSAGES.description.max }; }
  return {};
}

function validateLogo(logo: string): Pick<ProductFormErrors, 'logo'> {
  if (!logo.trim()) { return { logo: REQUIRED }; }
  return {};
}

function validateDateRelease(date_release: string): Pick<ProductFormErrors, 'date_release'> {
  if (!date_release.trim()) { return { date_release: REQUIRED }; }
  if (date_release < getLocalDateString()) {
    return { date_release: MESSAGES.date_release.past };
  }
  return {};
}

export function validateForm(
  values: ProductFormValues,
  mode: 'create' | 'edit',
): ProductFormErrors {
  return {
    ...validateId(values.id, mode),
    ...validateName(values.name),
    ...validateDescription(values.description),
    ...validateLogo(values.logo),
    ...validateDateRelease(values.date_release),
  };
}
