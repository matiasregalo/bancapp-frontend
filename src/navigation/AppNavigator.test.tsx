import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppNavigator } from './AppNavigator';

jest.mock('../features/products/screens/ProductListScreen', () => {
  const MockReact = require('react');
  const { View } = require('react-native');
  return {
    ProductListScreen: () => MockReact.createElement(View, { testID: 'screen-product-list' }),
  };
});

jest.mock('../features/products/screens/ProductDetailScreen', () => {
  const MockReact = require('react');
  const { View } = require('react-native');
  return {
    ProductDetailScreen: () => MockReact.createElement(View, { testID: 'screen-product-detail' }),
  };
});

jest.mock('../features/products/screens/ProductFormScreen', () => {
  const MockReact = require('react');
  const { View } = require('react-native');
  return {
    ProductFormScreen: () => MockReact.createElement(View, { testID: 'screen-product-form' }),
  };
});

describe('AppNavigator', () => {
  it('renderiza ProductListScreen como pantalla inicial (@story:HU-06)', () => {
    render(<AppNavigator />);
    expect(screen.getByTestId('screen-product-list')).toBeTruthy();
  });

  it('no renderiza ProductDetailScreen en la pantalla inicial', () => {
    render(<AppNavigator />);
    expect(screen.queryByTestId('screen-product-detail')).toBeNull();
  });

  it('no renderiza ProductFormScreen en la pantalla inicial', () => {
    render(<AppNavigator />);
    expect(screen.queryByTestId('screen-product-form')).toBeNull();
  });

  it('monta NavigationContainer con las 3 rutas sin errores', () => {
    expect(() => render(<AppNavigator />)).not.toThrow();
  });
});
