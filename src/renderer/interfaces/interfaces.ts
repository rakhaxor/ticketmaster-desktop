declare global {
  interface Window {
    csrfToken: string | '';
    baseURL: string | '';
    appName: string | '';
  }
}

export interface UserInterface {
  id: number;
  email: string;
  password: string;
  accountID: number;
  verified: boolean;
  tag: string;
}
