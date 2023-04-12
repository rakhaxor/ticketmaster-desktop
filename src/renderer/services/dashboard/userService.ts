import axiosClient from '@renderer/axios/axiosClient';
import { RunBotReqInterface } from '@renderer/interfaces/reqInterfaces';
import { JsonResponseInterface, RunBotResInterface } from '@renderer/interfaces/resInterfaces';

export const runBotAPI = (data: RunBotReqInterface): Promise<JsonResponseInterface<RunBotResInterface>> => {
  return axiosClient.post('/run-bot', data);
};

export default {
  runBotAPI,
};
