import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useLogIn from '../../hooks/useLogIn';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('../../hooks/useLogIn', () => jest.fn());

describe('LoginScreen unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given valid credentials When logIn Then navigates to correct route', async () => {
    useLogIn.mockReturnValue({
      logIn: jest.fn((username, password) => {
        return Promise.resolve();
      }),
      loading: false,
      error: null,
      data: {
        message: 'Inicio de sesión exitoso',
        token: 'mock-token',
        data: {
          rol: 'Administrador',
          nombreCompleto: 'Test User',
          id: 1,
        },
      },
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Usuario'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');
    fireEvent.press(getByText('Iniciar sesión'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'mock-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('rol', 'Administrador');
      expect(router.replace).toHaveBeenCalledWith('/main/adminForm');
    });
  });

  test('Given invalid credentials When logIn Then shows error alert', async () => {
    useLogIn.mockReturnValue({
      logIn: jest.fn(() => Promise.resolve()),
      loading: false,
      error: 'Credenciales inválidas',
      data: null,
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Usuario'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrongpassword');
    fireEvent.press(getByText('Iniciar sesión'));

    await waitFor(() => {
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  test('Given no credentials When logIn Then shows alert for incomplete fields', async () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Iniciar sesión'));

    await waitFor(() => {
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  test('Given stored session When app loads Then navigates automatically', async () => {
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'userToken') return Promise.resolve('mock-token');
      if (key === 'rol') return Promise.resolve('Administrador');
      return Promise.resolve(null);
    });

    render(<LoginScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/main/adminForm');
    });
  });
});