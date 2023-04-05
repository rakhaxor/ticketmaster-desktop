export interface RegisterReqInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginReqInterface {
  email: string;
  password: string;
  timezone: string | null;
}

export interface ForgotPasswordReqInterface {
  email: string;
}
