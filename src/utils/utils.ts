import { cloneDeep } from 'lodash';

/**
 * 清空对象的属性值数据
 * @param {*} obj
 */
export const resetObjValues = (obj: any) => {
	if (!obj) return false;
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object') {
			if (Array.isArray(obj[key])) {
				obj[key] = [];
			} else {
				obj[key] = {};
			}
		} else {
			obj[key] = null;
		}
	});
	return obj;
};

/**
 * 千分价格
 * @param {*} num
 * @returns
 */
export const formatNumberRgx = (num: string | number) => {
	if (num) {
		let parts = Number(num).toFixed(2).toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.join('.');
	} else {
		return 0;
	}
};

// 当前日期
export const getDateNow = () => {
	let now = new Date();
	let year = now.getFullYear(); //得到年份
	let month = now.getMonth(); //得到月份
	let date = now.getDate(); //得到日期

	month = month + 1;
	let mon = month.toString().padStart(2, '0');
	let dat = date.toString().padStart(2, '0');
	let defaultDate = `${year}-${mon}-${dat}`; //
	return defaultDate;
};

/**
 * 深拷贝
 * @param {*} targetObj
 * @returns
 */
export const deepCopy = (targetObj: object) => {
	if (typeof targetObj === 'object') {
		const result = Array.isArray(targetObj) ? [] : {};
		for (let i in targetObj) {
			if (typeof targetObj[i] === 'object') {
				result[i] = deepCopy(targetObj[i]);
			} else {
				result[i] = targetObj[i];
			}
		}
		return result;
	} else {
		return targetObj;
	}
};

/**
 * 是否是json
 * @param {*} str
 * @returns Boolean
 */
export const isJson = (str: string) => {
	if (typeof str === 'string') {
		try {
			let obj = JSON.parse(str);
			if (obj && typeof obj === 'object') {
				return true;
			}
		} catch (e) {
			return false;
		}
	} else {
		return false;
	}
};

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */
export const treeToArray = (data: any[], props = { children: 'children' }) => {
	data = cloneDeep(data);
	const { children } = props;
	const newData = [];
	const queue: any[] = [];
	data.forEach((child: any) => queue.push(child));
	while (queue.length) {
		const item: any = queue.shift();
		if (item[children]) {
			item[children].forEach((child: any) => queue.push(child));
			delete item[children];
		}
		newData.push(item);
	}
	return newData;
};

/**
 * @description 数组转树
 * @param {Array} data  数据
 * @param {Object} props `{ parent: 'pid', children: 'children' }`
 */
export const arrayToTree = (
	data: any[],
	props = { id: 'id', parentId: 'pid', children: 'children' }
) => {
	data = cloneDeep(data);
	const { id, parentId, children } = props;
	const result: any[] = [];
	const map = new Map();
	data.forEach((item) => {
		map.set(item[id], item);
		const parent = map.get(item[parentId]);
		if (parent) {
			parent[children] = parent[children] ?? [];
			parent[children].push(item);
		} else {
			result.push(item);
		}
	});
	return result;
};

/**
 * 验证手机号
 * @param value
 * @returns
 */
export const validatePhone = (value: string) => {
	if (!value) {
		return false;
	} else {
		if (!/^1[3456789]\d{9}$/.test(value)) {
			return false;
		} else {
			return true;
		}
	}
};

export const getUploadFileType = (suffix: string) => {
	let imgArr = [
		'jpg',
		'png',
		'gif',
		'jpeg',
		'tiff',
		'tif',
		'bmp',
		'jfif',
		'JPG',
	];

	let videoArr = [
		'avi',
		'wmv',
		'mpg',
		'mpeg',
		'3gp',
		'mov',
		'mp4',
		'rmvb',
		'mkv',
	];
	if (imgArr.includes(suffix)) {
		return 'img';
	} else if (videoArr.includes(suffix)) {
		return 'video';
	}
	return null;
};
