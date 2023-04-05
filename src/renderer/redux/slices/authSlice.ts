import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
} from '../../services/authService';
import { ForgotPasswordReqInterface, LoginReqInterface, RegisterReqInterface } from '@renderer/interfaces/reqInterfaces';
import { UserInterface } from '@renderer/interfaces';

interface State {
  loggedIn: boolean;
  token: string | null;
  userDetails: UserInterface | null;
}

const initialState: State = {
  loggedIn: false,
  token: null,
  userDetails: null,
};

export const registerThunk = createAsyncThunk('auth/register/Registration in process 🤖', async (arg: RegisterReqInterface, thunkAPI) => {
  try {
    const res = await registerAPI(arg);
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || 'Something went wrong!');
  }
});

export const loginThunk = createAsyncThunk('auth/login/Logging in 🖐', async (arg: LoginReqInterface, thunkAPI) => {
  try {
    const res = await loginAPI(arg);
    // localStorage.setItem('token', res.data.data.token);
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || 'Something went wrong!');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout/Logging out 👋', async (arg, thunkAPI) => {
  try {
    const res = await logoutAPI();
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || 'Something went wrong!');
  }
});

export const forgotPasswordThunk = createAsyncThunk('auth/forgot-password', async (arg: ForgotPasswordReqInterface, thunkAPI) => {
  try {
    const res = await forgotPasswordAPI(arg);
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || 'Something went wrong!');
  }
});

const saveDetails = (state: any, { token, user }: { token: string; user: UserInterface }): void => {
  state.loggedIn = true;
  state.token = token;
  localStorage.setItem('token', token);
  state.userDetails = user;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.loggedIn = false;
      state.token = null;
      state.userDetails = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      // saveDetails(state, action.payload.data);
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      // saveDetails(state, action.payload.data);
    });
    builder.addCase(logoutThunk.fulfilled, state => {
      state.loggedIn = false;
      state.token = null;
      state.userDetails = null;
      localStorage.clear();
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
