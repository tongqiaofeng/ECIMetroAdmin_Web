import { get, post } from '../http';

/**
 * 活动图文列表
 * @returns
 */
export const articleListGet = (params: object) => {
	return post('/news/articleListGet', params);
};

/**
 * 活动图文修改保存
 * @param data
 * @returns
 */
export const articleSave = (data: object) => {
	return post('/news/articleSave', data);
};

/**
 * 活动类型列表
 * @returns
 */
export const articleTypeListGet = () => {
	return get('/news/articleTypeListGet');
};

/**
 * 活动类型修改保存
 * @param data
 * @returns
 */
export const articleTypeSave = (data: object) => {
	return post('/news/articleTypeSave', data);
};

/**
 * 活动类型删除
 * @param id
 * @returns
 */
export const articleTypeDel = (id: number) => {
	return get('/news/articleTypeDel', {
		id,
	});
};

/**
 * 活动详情
 * @param id
 * @returns
 */
export const articleInfoGet = (id: number) => {
	return get('/news/articleInfoGet', {
		id,
	});
};

/**
 * 活动删除
 * @param id
 * @returns
 */
export const articleDel = (id: number) => {
	return get('/news/articleDel', {
		id,
	});
};
