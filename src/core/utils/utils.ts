import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import BigNumber from 'bignumber.js';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export const getCurDate = () => {
  return dayjs().tz();
};
export const getCurDateString = (): string => {
  return dayjs().tz().format('YYYY-MM-DD HH:mm:ss.SSS').toString();
};
export const sendPatchRequest = async (url: string, params: any, apiKey?: string) => {
  try {
    const response = await axios.patch(
      url,
      params,
      { headers: { 'Content-Type': 'application/json', 'insideApiKey': apiKey },
      });
    if (response.status !== 200) {
      throw new Error(`this status is not 200. (status: ${response.status}, message: ${response.statusText})`);
    }
    return response.data;
  } catch (e) {
    console.log('[sendPatchRequest] ', url, e.toString());
    throw '[sendPatchRequest] ' + url + e.toString();
  }
};
export const sendPostRequest = async (
  url: string,
  id: string,
  method: string,
  params: any,
  jsonrpc?: string,
) => {
  try {
    jsonrpc = !jsonrpc ? '2.0' : jsonrpc;
    const response = await axios.post(
      url,
      { jsonrpc, id, method, params },
      { headers: { 'Content-Type': 'application/json' } },
    );
    if (response.data.error) {
      throw response.data.error;
    }
    return response.data;
  } catch (e) {
    if (e.message) {
      const err = '[sendPostRequest] ' + e.message;
      console.log(err);
      // console.error(err);
      throw err;
    }
    const err = '[sendPostRequest] ' + e.toString();
    console.log(err);
    // console.error(err);
    throw err;
  }
};
