// eslint-disable-next-line import/named
import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

interface ToastInterface {
  id: string;
  actionId: string;
  actionType: string;
}

interface GlobalType {
  loading: boolean;
  error: string;
  toasts: Array<ToastInterface>;
  toastsMadeInComponents: Array<ToastInterface>;
}

const initialState: GlobalType = {
  loading: false,
  error: '',
  toasts: [],
  toastsMadeInComponents: [],
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoadingTo: (state, action: PayloadAction<boolean>): void => {
      state.loading = action.payload;
      if (action.payload) {
        const toastId = toast.loading('Please wait...');
        state.toastsMadeInComponents.push({
          id: toastId,
          actionId: '',
          actionType: '',
        });
      } else {
        if (state.toastsMadeInComponents.length) {
          state.toastsMadeInComponents.forEach(item => {
            toast.dismiss(item.id);
          });
        }

        state.toastsMadeInComponents = [];
      }
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(isPending, (state, action: any) => {
        state.loading = true;
        let loadingMessage = 'Loading ...';

        // if type something like: "auth/logout/Logging you out/pending"
        // get the 3rd part of the action type
        const actionTypes = action.type.split('/');
        if (actionTypes.length > 3) {
          loadingMessage = `${actionTypes[2]}`;
        }
        const toastId = toast.loading(loadingMessage);
        state.toasts.push({
          id: toastId,
          actionId: action.meta.requestId,
          actionType: action.type,
        });
      })
      .addMatcher(isRejected, (state, action) => {
        const toastIndex = state.toasts?.findIndex((t: ToastInterface) => t.actionId === action.meta.requestId);
        if (toastIndex !== -1) {
          let message = `${action.payload}` || 'Something went wrong!';
          if (message === 'Unauthenticated.') {
            message = 'Session expired';
          }
          toast.error(message, { id: state.toasts[toastIndex].id });
        }

        state.loading = false;
      })
      .addMatcher(isFulfilled, (state, action: any) => {
        const toastIndex = state.toasts.findIndex((t: ToastInterface) => t.actionId === action.meta.requestId);
        if (toastIndex !== -1) {
          const message = action.payload?.message ? `${action.payload?.message}` : 'Success!';
          const foundToast = state.toasts[toastIndex];
          // if (foundToast.type.includes('/list')) {
          //   return;
          // }
          toast.success(message, { id: foundToast.id });
        }
        state.loading = false;
      });
  },
});

export const { setLoadingTo } = globalSlice.actions;

export default globalSlice.reducer;
