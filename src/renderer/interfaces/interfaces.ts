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

export interface RowInterface {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  zip: string,
  phone: string,
  proxyInfo: string,
}
