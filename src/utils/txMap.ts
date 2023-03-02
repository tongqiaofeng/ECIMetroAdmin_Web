import { jsonp } from 'vue-jsonp';
import config from '@/config/index';

const key = config.txMapKey;
const TxMap = {
	// 通过地址获取经纬度
	getLal: (address: string) => {
		return new Promise((resolve, reject) => {
			jsonp('https://apis.map.qq.com/ws/geocoder/v1/?', {
				address: address,
				output: 'jsonp',
				key,
			})
				.then((res) => {
					resolve(res);
				})
				.then((err) => {
					reject(err);
				});
		});
	},

	// 通过经纬度获取地址
	// lat纬度  lng经度
	getLocation: (lat: string, lng: string) => {
		return new Promise((resolve, reject) => {
			jsonp('https://apis.map.qq.com/ws/geocoder/v1/?', {
				location: `${lat},${lng}`,
				output: 'jsonp',
				key,
				get_poi: 1,
			})
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
};

export default TxMap;
