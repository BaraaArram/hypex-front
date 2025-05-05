import axios from 'axios';

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/register', { name, email, password });
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
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to login');
    }
    throw new Error('Failed to login');
  }
};
