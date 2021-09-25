import 'dotenv/config';
import captcha, {recognize} from './captcha';
import login from './login';

async function main(): Promise<void>{
  // const cookies = await login();
  // console.log(cookies);

  setInterval(() => {
    console.log(Date.now());
    console.log(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());

  }, 1000);
  let CAPTCHA_TEXT = '';
  for await (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const img = await captcha();
    if (img) {
      const text = await recognize(img);
      if (text === '-1') {
        console.log(`retry...${i}`)
      } else {
        CAPTCHA_TEXT = text;
        break;
      }
    }
  }
  console.log(`CAPTCHA_TEXT: ${CAPTCHA_TEXT}`);
}

main();