declare global {
  interface Window {
    csrfToken: string | '';
    baseURL: string | '';
    appName: string | '';
  }
}

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  password: string;
  accountID: number;
  verified: boolean;
  tag: string;
}
