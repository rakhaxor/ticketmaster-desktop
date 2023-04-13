import moment from 'moment';

export const forceNavigate = (url: string): void => {
  window.location.href = url;
};

// Time related
export const utcToLocal = (time: string): string => {
  return moment.utc(time).local().format('MMM DD, YYYY hh:mm A');
};

export const localToUtc = (time: Date): string => {
  return moment(time).utc().format();
};

// Url related
export const baseUrl = (url: string): string => {
  return `/${url}`;
};

export const apiUrl = (url: string): string => {
  return `/api/${url}`;
};

export const createFormData = (data: any) => {
  const formData = new FormData();
  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data?.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  return formData;
}

