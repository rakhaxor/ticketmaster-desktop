export interface JsonResponseInterface<T> {
  status: boolean;
  message: string | { errors: string };
  data: T;
}

export interface RegisterResInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginResInterface {
  email: string;
  password: string;
}
