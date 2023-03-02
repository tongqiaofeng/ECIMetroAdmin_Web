import {
	createRouter,
	createWebHistory,
	createWebHashHistory,
} from 'vue-router';
import Layout from '@/layouts/index.vue';
import { useSaveStore } from '@/store/saveStore';

export const constantRoutes: Array<any> = [
	{
		path: '/',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/admin',
		component: Layout,
		redirect: '/user/list',
		children: [
			{
				path: '/user',
				name: '用户管理',
				icon: new URL('../assets/imgs/menu-icon/user_icon.png', import.meta.url)
					.href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/user_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '用户管理',
					isMenu: true,
				},
				children: [
					{
						path: '/user/list',
						component: () => import('@/views/user/list.vue'),
						meta: {
							title: '用户列表',
							isMenu: true,
						},
					},
				],
			},
			{
				path: '/product',
				name: '产品管理',
				icon: new URL(
					'../assets/imgs/menu-icon/product_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/product_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '产品管理',
					isMenu: true,
				},
				children: [
					{
						path: '/product/cate',
						component: () => import('@/views/product/cate/list.vue'),
						meta: {
							title: '产品分类',
							isMenu: true,
						},
					},
					{
						path: '/product/list',
						component: () => import('@/views/product/product/list.vue'),
						meta: {
							title: '产品列表',
							isMenu: true,
						},
					},
					{
						path: '/product/edit',
						component: () => import('@/views/product/product/edit.vue'),
						meta: {
							title: '添加/编辑产品',
							isMenu: false,
						},
					},
					{
						path: '/product/list/edit',
						component: () => import('@/views/product/product/edit.vue'),
						meta: {
							title: '添加/编辑产品',
							isMenu: false,
						},
					},
				],
			},
			{
				path: '/machine',
				name: '工装机具管理',
				icon: new URL(
					'../assets/imgs/menu-icon/machine_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/machine_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '工装机具管理',
					isMenu: true,
				},
				children: [
					{
						path: '/machine/list',
						component: () => import('@/views/machine/list.vue'),
						meta: {
							title: '工装机具列表',
							isMenu: true,
						},
					},
				],
			},
			{
				path: '/service',
				name: '服务支持管理',
				icon: new URL(
					'../assets/imgs/menu-icon/service_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/service_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '服务支持管理',
					isMenu: true,
				},
				children: [
					{
						path: '/service/cate',
						component: () => import('@/views/service/cate/list.vue'),
						meta: {
							title: '服务支持管理',
							isMenu: true,
						},
					},
				],
			},
			{
				path: '/activity',
				name: '活动分享管理',
				icon: new URL(
					'../assets/imgs/menu-icon/activity_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/activity_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '活动分享管理',
					isMenu: true,
				},
				children: [
					{
						path: '/activity/cate',
						component: () => import('@/views/activity/cate/list.vue'),
						meta: {
							title: '活动类型',
							isMenu: true,
						},
					},
					{
						path: '/activity/list',
						component: () => import('@/views/activity/activity/list.vue'),
						meta: {
							title: '活动列表',
							isMenu: true,
						},
					},
					{
						path: '/activity/list/edit',
						component: () => import('@/views/activity/activity/edit.vue'),
						meta: {
							title: '活动添加/编辑',
							isMenu: false,
						},
					},
				],
			},
			{
				path: '/lease',
				name: '设备租赁管理',
				icon: new URL(
					'../assets/imgs/menu-icon/lease_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/lease_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '设备租赁管理',
					isMenu: true,
				},
				children: [
					{
						path: '/lease/list',
						component: () => import('@/views/lease/list.vue'),
						meta: {
							title: '设备租赁管理',
							isMenu: true,
						},
					},
				],
			},
			{
				path: '/join',
				name: '招聘管理',
				icon: new URL('../assets/imgs/menu-icon/join_icon.png', import.meta.url)
					.href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/join_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '招聘管理',
					isMenu: true,
				},
				children: [
					{
						path: '/join/list',
						component: () => import('@/views/join/list.vue'),
						meta: {
							title: '招聘列表',
							isMenu: true,
						},
					},
				],
			},
			{
				path: '/system',
				name: '系统配置',
				icon: new URL(
					'../assets/imgs/menu-icon/setting_icon.png',
					import.meta.url
				).href,
				actvieIcon: new URL(
					'../assets/imgs/menu-icon/setting_active_icon.png',
					import.meta.url
				).href,
				meta: {
					title: '系统配置',
					isMenu: true,
				},
				children: [
					{
						path: '/system/setting',
						component: () => import('@/views/system/setting.vue'),
						meta: {
							title: '系统配置',
							isMenu: true,
						},
					},
				],
			},
		],
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/404.vue'),
		meta: {
			title: '404',
		},
	},
	{
		path: '/:pathMath(.*)',
		redirect: '/404',
	},
];

const router = createRouter({
	history: createWebHistory('/admin/'),
	// history: createWebHashHistory('/admin/'),
	routes: constantRoutes,
	// 路由跳转,页面回到顶部
	scrollBehavior: (to, from, savePosition) => {
		const saveStore = useSaveStore();
		if (to.fullPath.indexOf('/product/list') == -1) {
			saveStore.removeProductSearchParams();
		}
		if (to.fullPath.indexOf('/activity/list') == -1) {
			saveStore.removeActivityParams();
		}

		if (savePosition) {
			return savePosition;
		} else {
			return {
				top: 0,
			};
		}
	},
});

export default router;
