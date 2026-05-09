import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormField } from './FormField';

describe('FormField', () => {
  describe('renderizado', () => {
    it('muestra el label', () => {
      const { getByText } = render(<FormField label="ID" value="" />);
      expect(getByText('ID')).toBeTruthy();
    });

    it('muestra el label de Fecha Revisión', () => {
      const { getByText } = render(
        <FormField label="Fecha Revisión" value="2031-01-01" editable={false} />,
      );
      expect(getByText('Fecha Revisión')).toBeTruthy();
    });

    it('muestra el valor en el TextInput', () => {
      const { getByTestId } = render(
        <FormField label="Nombre" value="Tarjeta Crédito" testID="field-name" />,
      );
      expect(getByTestId('field-name').props.value).toBe('Tarjeta Crédito');
    });

    it('muestra el texto de error cuando error tiene valor', () => {
      const { getByText } = render(
        <FormField label="ID" value="" error="Este campo es requerido!" />,
      );
      expect(getByText('Este campo es requerido!')).toBeTruthy();
    });

    it('muestra el mensaje de error de longitud mínima', () => {
      const { getByText } = render(
        <FormField label="ID" value="ab" error="Mínimo 3 caracteres" />,
      );
      expect(getByText('Mínimo 3 caracteres')).toBeTruthy();
    });

    it('no muestra texto de error cuando error es undefined', () => {
      const { queryByText } = render(<FormField label="ID" value="" />);
      expect(queryByText('Este campo es requerido!')).toBeNull();
    });

    it('no muestra texto de error cuando no se pasa la prop error', () => {
      const { queryByText } = render(
        <FormField label="Nombre" value="Algo" />,
      );
      expect(queryByText(/requerido/)).toBeNull();
    });
  });

  describe('prop editable', () => {
    it('input es editable por defecto', () => {
      const { getByTestId } = render(
        <FormField label="Nombre" value="" testID="field-nombre" />,
      );
      expect(getByTestId('field-nombre').props.editable).toBe(true);
    });

    it('input no es editable cuando editable=false', () => {
      const { getByTestId } = render(
        <FormField
          label="Fecha Revisión"
          value="2031-01-01"
          editable={false}
          testID="field-revision"
        />,
      );
      expect(getByTestId('field-revision').props.editable).toBe(false);
    });

    it('input es editable cuando editable=true (explícito)', () => {
      const { getByTestId } = render(
        <FormField label="ID" value="" editable={true} testID="field-id" />,
      );
      expect(getByTestId('field-id').props.editable).toBe(true);
    });
  });

  describe('interacción', () => {
    it('llama onChangeText cuando el texto cambia', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(
        <FormField
          label="ID"
          value=""
          onChangeText={onChangeText}
          testID="field-id"
        />,
      );
      fireEvent.changeText(getByTestId('field-id'), 'abc');
      expect(onChangeText).toHaveBeenCalledWith('abc');
      expect(onChangeText).toHaveBeenCalledTimes(1);
    });

    it('llama onChangeText con el texto completo ingresado', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(
        <FormField
          label="Nombre"
          value=""
          onChangeText={onChangeText}
          testID="field-name"
        />,
      );
      fireEvent.changeText(getByTestId('field-name'), 'Tarjeta Visa Premium');
      expect(onChangeText).toHaveBeenCalledWith('Tarjeta Visa Premium');
    });

    it('no lanza error si onChangeText no está definido', () => {
      const { getByTestId } = render(
        <FormField label="Fecha Revisión" value="2031-01-01" editable={false} testID="field-rev" />,
      );
      expect(() =>
        fireEvent.changeText(getByTestId('field-rev'), 'algo'),
      ).not.toThrow();
    });
  });
});
