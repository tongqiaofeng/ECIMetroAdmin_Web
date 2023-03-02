import { get, post } from '../http';

/**
 * 产品分类列表
 * @returns
 */
export const equipmentTypeListGet = () => {
	return get('/product_type/equipmentTypeListGet');
};

/**
 * 产品分类添加/修改
 * @param data
 * @returns
 */
export const equipmentTypeSave = (data: object) => {
	return post('/product_type/equipmentTypeSave', data);
};

/**
 * 产品分类删除
 * @param id
 * @returns
 */
export const equipmentTypeDel = (id: number) => {
	return get('/product_type/equipmentTypeDel', {
		id,
	});
};

/**
 * 挖掘机&非挖 需求列表
 * @returns
 */
export const allDemandGet = (equipmentTypeId: any) => {
	return get('/product/allDemandGet?equipmentTypeId=' + equipmentTypeId);
};

/**
 * 产品详情
 * @param id ,model型号
 * @returns
 */
export const productInfoGet = (params: object) => {
	return get('/product/productInfoGet', params);
};

/**
 * 产品保存
 * @param data
 * @returns
 */
export const productSave = (data: object) => {
	return post('/product/productSave', data);
};

/**
 * 产品删除
 * @param id
 * @returns
 */
export const productDel = (id: number) => {
	return get('/product/productDel', {
		id,
	});
};

/**
 * 产品列表
 * @param data
 * @returns
 */
export const productSearch = (data: object) => {
	return post('/product/productSearch', data);
};

/**
 * 挖掘机的系列列表
 * @returns
 */
export const seriesListGet = (equipmentTypeId: any) => {
	return get('/product/seriesListGet?equipmentTypeId=' + equipmentTypeId);
};

/**
 * 型号列表
 * @returns
 */
export const modelListGet = () => {
	return get('/product/modelListGet');
};

/**
 * 二手设备所在地列表
 * @returns
 */
export const recycleAreaListGet = () => {
	return get('/project/recycleAreaListGet');
};

/**
 * 
 * 排序
 * @param data 
 * @returns 
 */
export const productSortSave = (data) => {
  return post('/product/productSortSave', data);
}