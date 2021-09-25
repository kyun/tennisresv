import axios from 'axios';
import qs from 'qs';


const url = process.env.TARGET_URL;
const user_id = process.env.USER_ID;
const user_pwd = process.env.USER_PWD;

async function login(): Promise<string> {
  axios.defaults.headers['Origin'] = url;
  axios.defaults.headers['Referer'] = `${url}/online/tennis/login.do`;
  axios.defaults.headers['Content-type'] = 'application/x-www-form-urlencoded';
  const params = { user_id, user_pwd };

  const cookies = await axios.post(`${url}/online/login/login_check.do`, qs.stringify(params)).then((res) => {
    if (res.data.login_check !== 1) {
      // Login Failure
      // TODO:...
      console.log('Login Failure...', params);
      throw 'err';
    }
    console.log('Login Success...');
    const chunk = res.headers['set-cookie'][1].split(';')[0];
    const cookies = [chunk, chunk].reverse().join("; ");
    return cookies;
  })
    .catch((err) => {
      console.log(err);
      return "ERROR";
  })
  return cookies;
};

export default login;