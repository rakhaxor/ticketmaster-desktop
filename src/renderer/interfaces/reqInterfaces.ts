import { RowInterface } from '@renderer/interfaces/interfaces';

export interface RegisterReqInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginReqInterface {
  username: string;
  password: string;
  timezone: string | null;
  apiKey: string;
}

export interface ForgotPasswordReqInterface {
  email: string;
}

export interface RunBotReqInterface {
  concurrency: number;
  runHeadless: boolean;
  buyUrl: string;
  maxRetries: number;
  useProxy: boolean;
  rows: Array<RowInterface>;
}

