import { get, post, uploadFileRequest } from '../http';

/**
 * 登录
 * @param data
 * @returns
 */
export const login = (data: object) => {
	return post('/account/login', data);
};

/**
 * 获取验证码
 * @returns
 */
export const verifyCodeGet = () => {
	return post('/account/verifyCodeGet');
};

/**
 * 修改密码
 * @param data 
 * @returns 
 */
export const pswSave = (data: object) => {
  return post('/account/pswSave', data);
}

/**
 * 上传文件
 * @param files 
 * @returns 
 */
export const uploadFile = (files: any) => {
  return uploadFileRequest('/file/upload', files);
}

