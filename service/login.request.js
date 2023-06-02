import  { loginRequest } from './index';

// 用户登录
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: (res) => {
        resolve(res.code);
      },
      fail: (err) => {
        console.log('getLoginCode err', err);
        reject(err);
      }
    });
  });
}
export function codeToToken(code) {
  return loginRequest.post('/login', { code });
}

export function checkToken() {
  return loginRequest.post('/auth', {}, true); //isAuth传true,那边已配置header传入token
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
}