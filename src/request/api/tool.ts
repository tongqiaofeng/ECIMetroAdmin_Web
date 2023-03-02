import { get, post } from '../http';

/**
 * 工装机具列表
 * @returns
 */
export const toolListGet = (params: object) => {
	return post('/tool/toolListGet', params);
};

/**
 *
 * @returns
 * 工装机具保存
 */
export const toolSave = (data: object) => {
	return post('/tool/toolSave', data);
};

/**
 * 工装机具详情
 * @param id
 * @returns
 */
export const toolInfoGet = (id: number) => {
	return get('/tool/toolInfoGet', {
		id,
	});
};

/**
 * 工装机具删除
 * @param id
 * @returns
 */
export const toolDel = (id: number) => {
	return get('/tool/toolDel', {
		id,
	});
};

/**
 * 招聘新增
 * @param data
 * @returns
 */
export const joinSave = (data: object) => {
	return post('/join/joinSave', data);
};

/**
 * 招聘查询列表
 * @param data
 * @returns
 */
export const joinSearch = (data: object) => {
	return post('/join/joinSearch', data);
};

/**
 * 招聘删除
 * @param id 
 * @returns 
 */
export const joinDel = (id: number) => {
	return get('/join/joinDel', {
		id,
	});
};

/**
 * 设备租赁列表
 * @param data
 * @returns
 */
export const leaseRecordList = (data: object) => {
	return post('/join/leaseRecordList', data);
};

/**
 * 设备租赁删除
 * @param id
 * @returns
 */
export const leaseRecordDel = (id: number) => {
	return get('/join/leaseRecordDel', {
		id,
	});
};

/**
 * 邮箱地址列表
 * @returns 
 */
export const emailList = () => {
	return get('/join/emailList');
};

/**
 * 邮件发送
 * @param data 
 * @returns 
 */
export const leaseSendEmail = (data: object) => {
  return post('/join/leaseSendEmail', data);
}


/**
 * 系统配置详情
 * @returns
 */
export const websiteConfigGet = () => {
	return get('/config/websiteConfigGet');
};

/**
 * 系统配置保存
 * @returns
 */
export const websiteConfigSave = (data: object) => {
	return post('/config/websiteConfigSave', data);
};


