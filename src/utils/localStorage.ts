// localStorage
const _localStorage = {
	set: function (key: any, value: any) {
		if (!key) {
			return null;
		}
		// 复合类型转为json
		if (typeof value === 'object') {
			value = JSON.stringify(value);
		}
		localStorage.setItem(key, value);
	},
	get: function (key: any) {
		let value = localStorage.getItem(key);
		if (value && isJson(value)) {
			value = JSON.parse(value);
		}
		return value;
	},
	remove: function (key: any) {
		localStorage.removeItem(key);
	},
	clear: function () {
		localStorage.clear();
	},
};

/**
 * 验证json
 * @param {*} str
 * @returns Boolean
 */
export function isJson(str: string) {
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
}
export default _localStorage;
