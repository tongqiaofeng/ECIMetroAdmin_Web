import { get, post } from '../http';

/**
 * 服务支持列表
 * @returns 
 */
export const supportListGet = () => {
	return get('/support/supportListGet');
};

/**
 * 删除支持
 * @param id 
 * @returns 
 */
export const supportDel = (id: number) => {
	return get('/support/supportDel', {
		id,
	});
};

/**
 * 支持保存
 * @param data 
 * @returns 
 */
export const supportSave = (data: object) => {
	return post('/support/supportSave', data);
};

