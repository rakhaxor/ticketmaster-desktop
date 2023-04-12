export const RESPONSE_CODES = {
  "0000": {
    status: true,
    message: "Success",
  },
  "-1": {
    status: false,
    message: "Invalid account credentials",
  },
  "-2": {
    status: false,
    message: "Account not verified yet",
  },
  "2000": {
    status: false,
    message: "Invalid API key",
  },
  "0001": {
    status: false,
    message: "Invalid request",
  },
};
