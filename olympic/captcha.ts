import axios from 'axios';
import fs from 'fs';
import { createWorker } from 'tesseract.js';

const url = process.env.TARGET_URL;
async function captcha(cookies: string = ''): Promise<any> {
  const TODAY = `${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}`;
  axios.defaults.headers['Cookie'] = cookies;
  axios.defaults.headers['Origin'] = url;
  axios.defaults.headers['Referer'] = `${url}/online/tennis/resrvtn_aplictn.do`;

  const response = await axios.get(`${url}/online/captcha.do?${Date.now()}`, { responseType: 'stream' }).catch();
  const IMAGE_WRITER = fs.createWriteStream(`${TODAY}.png`);
  await response.data.pipe(IMAGE_WRITER);
  return `${TODAY}.png`;
}

export async function recognize(img: string): Promise<string> {
  const rectangle = { left: 20, top: 1, width: 100, height: 38 };
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize(img, {rectangle});
  await worker.terminate();
  if (text.length !== 6) {
    // TODO: 다시 캡챠 요청할 것..
    return '-1';
  }
  return text;
}

export default captcha;