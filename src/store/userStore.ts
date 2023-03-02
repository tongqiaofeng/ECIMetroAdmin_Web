import { defineStore } from 'pinia';
import _sessionStorage from '@/utils/sessionStorage';
import _localStorage from '@/utils/localStorage';

export const useUserStore = defineStore('userStore', {
	// 数据
	state: () => {
		return {
			token: _localStorage.get('token') || '',
			adminInfo: _localStorage.get('admin_info') || {},
		};
	},
	getters: {},
	actions: {
		setToken(token: string) {
			this.token = token;
			_localStorage.set('token', token);
		},
		setAdminInfo(data: object) {
			this.adminInfo = data;
			_localStorage.set('admin_info', data);
		},
		loginout() {
			this.adminInfo = {};
			this.token = '';
			_localStorage.remove('admin_info');
      _localStorage.remove('token');
      _localStorage.clear();
		},
	},
});
