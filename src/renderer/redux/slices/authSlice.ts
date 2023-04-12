import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
} from '../../services/authService';
import { ForgotPasswordReqInterface, LoginReqInterface, RegisterReqInterface } from '@renderer/interfaces/reqInterfaces';
import { UserInterface } from '@renderer/interfaces';
import { RESPONSE_CODES } from '@renderer/constants';

interface State {
  loggedIn: boolean;
  token: string | null;
  userDetails: UserInterface | null;
  apikey: string | null;
}

const initialState: State = {
  loggedIn: false,
  token: null,
  userDetails: null,
  apikey: null,
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.loggedIn = false;
      state.token = null;
      state.userDetails = null;
      state.apikey = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { payload } = action;
      const { code, data } = payload;

      const codeData = RESPONSE_CODES[code as keyof typeof RESPONSE_CODES];
      if(codeData?.status) {
        state.loggedIn = true;
        const {account, user} = data;
        // combine both account and user details
        const {id, email, username, password, verified} = account;
        state.userDetails = {id, email, username, password, verified, tag: user.tag, accountID: user.accountID};

        // extract apikey from the request
        state.apikey = action.meta.arg.apiKey;
      }
    });
    builder.addCase(logoutThunk.fulfilled, _ => {
      logout();
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
