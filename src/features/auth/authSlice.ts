import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/api/axios';
import { signIn } from 'next-auth/react';
import { CustomUser } from '@/features/users/types';
import { getSession } from 'next-auth/react';
import { isAxiosError } from 'axios'

interface AuthState {
  user: CustomUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  accessToken: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post('auth/token/create/', { email, password });
    console.log('Response:', response.data);

    if (response.data) {
      const nextAuthResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (nextAuthResponse?.error) {
        throw new Error(nextAuthResponse.error);
      }

      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
      };
    }
    throw new Error('Login failed');
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
    throw new Error('Something went wrong');
  }
});

export const syncUserSession = createAsyncThunk('auth/syncUserSession', async () => {
  const session = await getSession();
  if (session) {
    return {
      user: session.user,
      accessToken: session.accessToken,
    };
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken ?? null;
    },
    logout: (state) => {
      state.status = 'idle';
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(syncUserSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(syncUserSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken ?? null;
        }
      })
      .addCase(syncUserSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
