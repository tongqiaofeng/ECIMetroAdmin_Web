import { defineStore } from 'pinia';
import _sessionStorage from '@/utils/sessionStorage';
import _localStorage from '@/utils/localStorage';

export const useSaveStore = defineStore('saveStore', {
	// 数据
	state: () => {
		return {
			productSearchParams: _localStorage.get('product_search') || {},
			activityParams: _localStorage.get('activity_search') || {},
		};
	},
	getters: {},
	actions: {
    // 设置商品搜索
    setProductSearchParams(data: object) {
      this.productSearchParams = data;
      _localStorage.set('product_search', data);
    },
    // 删除商品搜索参数
    removeProductSearchParams() {
      this.productSearchParams = null;
      _localStorage.remove('product_search');
    },
    setActivityParams(data: object) {
      this.activityParams = data;
			_localStorage.set('activity_search', data);
    },
    removeActivityParams() {
      this.activityParams = null;
			_localStorage.remove('activity_search');
    }
	}
});