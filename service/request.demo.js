const BASE_URL = 'https://movie.douban.com/j';

class MyRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  request(url, data, method, header = { 'content-type': 'json' }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseURL}${url}`,
        data,
        method,
        header,
        success: (res) => resolve(res.data),
        fail: (err) => reject(err)
      });
    });
  }

  get(url, params, header) {
    return this.request(url, params, 'GET', header);
  }
  post(url, data, header) {
    return this.request(url, data, 'POST', header);
  }
  delete(url, data, header) {
    return this.request(url, data, 'DELETE', header);
  }
  put(url, data, header) {
    return this.request(url, data, 'PUT', header);
  }
}

const myRequest = new MyRequest(BASE_URL);

export default myRequest;
