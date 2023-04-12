export interface JsonResponseInterface<T> {
  code: string;
  data: T;
}

export interface RegisterResInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginResInterface {
  data: {
    account: {
      id: number;
      email: string;
      username: string | null;
      password: string | null;
      verified: boolean;
    };
    user: {
      id: number;
      tag: string;
      email: string;
      password: string;
      accountID: number;
    };
  };
  code: string;
}

export interface RunBotResInterface {
  status: boolean,
  message: string,
  data: any,
}
