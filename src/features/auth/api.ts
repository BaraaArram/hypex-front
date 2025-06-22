import axios from 'axios';
import { AuthEndpoints } from './endpoints';

export const register = async (
  username: string,
  phone_number: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  re_password: string
) => {
  try {
    const response = await axios.post(AuthEndpoints.Register, {
      username,
      phone_number,
      first_name,
      last_name,
      email,
      password,
      re_password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to register');
    }
    throw new Error('Failed to register');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(AuthEndpoints.TokenCreate, { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to login');
    }
    throw new Error('Failed to login');
  }
};
