export const concurrency = 1; // number of instances to run
export const fileName = "example.csv"; // file to read from
export const useProxy = true; // use proxy or not
export const runHeadless = true; // it shows browser if false
export const buyUrl =
  "https://verifiedfan.ticketmaster.com/jonasbrothersyankees"; // url to go to
export const basicSmsUrl = "https://fan.basicsms.com/fan/basicsms/api/v1";
export const apiKey = "CZ3!lqT!D8!a04RxnAvq";
export const maxRetries = 3; // how many retries if bot fails

export const responseCodes = {
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
  2000: {
    status: false,
    message: "Invalid API key",
  },
  "0001": {
    status: false,
    message: "Invalid request",
  },
};
