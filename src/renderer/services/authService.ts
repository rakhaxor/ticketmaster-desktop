// eslint-disable-next-line import/named
import {AxiosResponse} from 'axios';
import axiosClient from '@renderer/axios/axiosClient';
import { ForgotPasswordReqInterface, LoginReqInterface, RegisterReqInterface } from '@renderer/interfaces/reqInterfaces';
import { JsonResponseInterface, LoginResInterface, RegisterResInterface } from '@renderer/interfaces/resInterfaces';

export const registerAPI = (data: RegisterReqInterface): Promise<JsonResponseInterface<RegisterResInterface>> => {
  return axiosClient.post('/register', data);
};

export const loginAPI = (data: LoginReqInterface): Promise<JsonResponseInterface<LoginResInterface>> => {
  return axiosClient.post('/login', data);
};

export const logoutAPI = (): Promise<AxiosResponse> => {
  return axiosClient.post('/logout');
};

export const forgotPasswordAPI = (data: ForgotPasswordReqInterface): Promise<AxiosResponse> => {
  return axiosClient.post('/forgot-password', data);
};

export default {
  registerAPI,
  loginAPI,
  logoutAPI,
  forgotPasswordAPI,
};
