import axios from "axios";
import {basicSmsUrl, apiKey, responseCodes} from './config'

function responseParser(response: any) {
  const code = response?.data?.code || '0001';
  const responseCode = responseCodes[code as keyof typeof responseCodes];

  return {
    status: responseCode.status,
    message: responseCode.message,
    data: response?.data || null,
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${basicSmsUrl}/login`, {
      apiKey,
      username,
      password,
    });
    return responseParser(response);
  } catch (error) {
    console.log("Error logging in", error);
    return null;
  }
}

export async function activateSlot(gateway: string, port: string) {
  try {
    const response = await axios.post(`${basicSmsUrl}/activate-slot`, {
      apiKey,
      gateway,
      slot: port,
    });
    return responseParser(response);
  } catch (error) {
    console.log("Error activating slot", gateway, port, error);
    return null;
  }
}

export async function fetchSims(id: number) {
  try {
    const response = await axios.get(`${basicSmsUrl}/all/sims/${apiKey}/${id}`);
    return responseParser(response);
  } catch (error) {
    console.log("Error fetching sims", error);
    return null;
  }
}

export async function fetchMessages(id: number) {
  try {
    const response = await axios.get(`${basicSmsUrl}/all/sms/${apiKey}/${id}`);
    return responseParser(response);
  } catch (error) {
    console.log("Error fetching sms", error);
    return null;
  }
}

export async function fetchTimeSlots() {
  try {
    const response = await axios.get(`${basicSmsUrl}/all/timeslots/${apiKey}`);
    return responseParser(response);
  } catch (error) {
    console.log("Error fetching time slots", error);
    return null;
  }
}

export async function fetchAdminTimeSlots() {
  try {
    const response = await axios.get(`${basicSmsUrl}/all/admin-timeslots/${apiKey}`);
    return responseParser(response);
  } catch (error) {
    console.log("Error fetching admin time slots", error);
    return null;
  }
}

export async function fetchSlotCooldowns() {
  try {
    const response = await axios.get(`${basicSmsUrl}/all/slot-cooldowns/${apiKey}`);
    return responseParser(response);
  } catch (error) {
    console.log("Error fetching slot cooldowns", error);
    return null;
  }
}
