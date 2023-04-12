import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RunBotReqInterface } from '@renderer/interfaces/reqInterfaces';
import { runBotAPI } from '@renderer/services/dashboard/userService';

interface State {
  history: Array<any>;
}

const initialState: State = {
  history: [],
};

export const runBotThunk = createAsyncThunk('auth/run-bot/Running bot 🤖', async (arg: RunBotReqInterface, thunkAPI) => {
  try {
    const res = await runBotAPI(arg);
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || 'Something went wrong!');
  }
});

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(runBotThunk.fulfilled, (state, {payload}) => {
      console.log(payload);
    });
  },
});

export default userSlice.reducer;
