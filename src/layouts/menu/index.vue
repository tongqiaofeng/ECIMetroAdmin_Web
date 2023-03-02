<template>
	<el-scrollbar>
		<el-menu
			class="menu-box"
			:default-active="defaultActive"
			:collapse-transition="false"
			:background-color="config.menu.bgColor"
			:unique-opened="true"
			:collapse="false"
			:text-color="config.menu.textColor"
			:active-text-color="config.menu.activeTextColor"
			router
			:mode="'vertical'"
		>
			<template v-for="item in menuList" :key="item.path">
				<MenuItem :item="item" />
			</template>
		</el-menu>
	</el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MenuItem from './menu-item.vue';
import { constantRoutes } from '@/router/index';
import config from '@/config/index';
import { useUserStore } from '@/store/userStore';

const router = useRouter();
const userStore = useUserStore();
const adminInfo: any = userStore.adminInfo;

const defaultActive = computed(() => {
	const { fullPath } = router.currentRoute.value;
	// 添加/修改页面
	if (fullPath.indexOf('edit') > -1) {
		let lastIndex = fullPath.indexOf('/edit');
		let path = fullPath.substring(0, lastIndex);
		return path;
	}

	return fullPath || '/index';
});

const menuList = computed(() => {
	let list = constantRoutes[1]['children'];
	let findIndex = list.findIndex((item) => item.path == '/user');
	if (adminInfo && adminInfo.role && adminInfo.role == 'NORMAL') {
		list.splice(0, 1);
	} else {
		if (findIndex == -1) {
			list.unshift({
				path: '/user',
				name: '用户管理',
				icon: new URL('../../assets/imgs/menu-icon/user_icon.png', import.meta.url)
					.href,
				actvieIcon: new URL(
					'../../assets/imgs/menu-icon/user_active_icon.png',
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
			});
		}
	}
	return list;
});
</script>

<style lang="scss" scoped>
:deep(.el-menu-item.is-active) {
	background-color: $menu-active-bg-color !important;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
	color: $menu-active-title-color !important;
}

:deep(.el-menu-item:hover) {
	background-color: $menu-hover-color;
}

.menu-icon {
	width: 16px;
	height: 16px;
}

.menu-box {
	z-index: 999;
	padding-top: 40px;
}
</style>
