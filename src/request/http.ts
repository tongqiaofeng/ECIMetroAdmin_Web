import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import _sessionStorage from '@/utils/sessionStorage';
import router from '@/router/index';
import { ElMessage } from 'element-plus';
import config from '@/config/index';

// 请求基础 URL
axios.defaults.baseURL = config.baseUrl;

// POST 请求头
axios.defaults.headers.post['Content-Type'] =
	'application/x-www-form-urlencoded';

// 请求拦截
axios.interceptors.request.use((config) => {
	let userStore = useUserStore();
	if (userStore.token) {
		if (config && config.headers) {
			config.headers['token'] = userStore.token;
		}
	}
	return config;
});

// 响应拦截
axios.interceptors.response.use(
	(response: any) => {
    if (response.status === 200) {
      if (response.data.code == 300) {
				ElMessage.warning('认证失败，请重新登录');
				_sessionStorage.remove('token');
				_sessionStorage.remove('admin_info');
				setTimeout(() => {
					router.replace({
						path: '/',
					});
				}, 400);
      } else {
        return Promise.resolve(response);
      }
    } else {
			return response;
		}
	},
	(error) => {
		console.log('请求错误', error);
		if (error && error.response && error.response.status) {
			switch (error.response.status) {
				case 404:
					ElMessage.warning('接口不存在，请刷新重试');
					break;
				case 500:
					ElMessage.error('服务异常，请稍后刷新重试');
					break;
				case 502:
					ElMessage.error('服务异常，请稍后刷新重试');
					break;
				default:
					ElMessage.warning(error.response.data.message);
					return Promise.reject(error.response);
			}
		}

		return Promise.reject(error);
	}
);

/**
 * 封装 get方法 对应 GET 请求
 * @param {string} url 请求url
 * @param {object} params 查询参数
 * @returns {Promise}
 */
export function get(url: string, params?: any): Promise<any> {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params,
			})
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
/**
 * 封装 post 方法，对应 POST 请求
 * @param {string} url 请求url
 * @param {object} data 请求体
 * @returns {Promise}
 */
export function post(url: string, data: any = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios
			.post(url, data)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * 上传文件
 * @param url
 * @param files
 * @returns
 */

export const uploadFileRequest = (url: string, files: any) => {
	let formData = new FormData();
	formData.append('files', files);
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res: any) => {
				// 上传成功
				if (res.status == 200) {
					resolve(res.data);
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * 封装 put 方法，对应 PUT 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function put(url: string, params: object = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios.put(url, params).then(
			(res) => {
				resolve(res);
			},
			(err) => {
				reject(err);
			}
		);
	});
}

/**
 * 封装 axiosDelete 方法，对应 DELETE 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function axiosDelete(url: string, params: object = {}): Promise<any> {
	return new Promise((resolve, reject) => {
		axios
			.delete(url, params)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
