import doubanRequest, { locationRequest } from './index';
import useToast from '../utils/useToast';

export function getMovieData(data) {
  return doubanRequest.get(`/search_subjects?type=movie`, data);
}

export function getUserLocation() {
  return new Promise((resolve) => {
    wx.getLocation({
      success: async (res) => {
        //获取到经纬度,拿到经纬度获取到城市信息找到附近的电影院,看它上映了哪些电影
        const res2 = await locationRequest.get('/reverse_geocoding/v3', {
          output: 'json',
          coordtype: 'wgs84ll',
          ak: 'WmUYUjO78mGRz01TiGqW0UX8CxOtrQ8R',
          location: `${res.latitude},${res.longitude}` //字符串拼接// location:res.latitude + ',' + res.longitude,
        });
        let myAddress = res2.result.formatted_address;
        const resolveData = {
          latitude: res.latitude,
          longitude: res.longitude,
          myAddress,
        };

        resolve(resolveData);
      },
      fail: () => useToast('获取位置失败')
    });
  });
}
