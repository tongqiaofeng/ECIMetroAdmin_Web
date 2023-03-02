<template>
	<!-- 单栏目 -->
	<el-menu-item
		class="sub-menu"
		:key="item.path"
		:index="item.path"
		v-if="!item.children"
	>
    <img class="menu-icon" v-if="item.actvieIcon && item.path == curPath" :src="item.actvieIcon" />
		<img class="menu-icon" v-if="item.icon && item.path != curPath" :src="item.icon" />

		<template #title>
			<span class="title">
				{{ item.meta.title }}
			</span>
		</template>
	</el-menu-item>
	<!-- 有子栏目 -->
	<el-sub-menu v-else :index="item.path" class="sub-menu-item">
		<template #title>
      <img class="menu-icon" v-if="item.actvieIcon && curPath.indexOf(item.path) != -1" :src="item.actvieIcon" />

			<img class="menu-icon" v-if="item.icon && curPath.indexOf(item.path) == -1" :src="item.icon" />

			<span class="title">{{ item.meta.title }}</span>
		</template>
		<template v-for="(option, index) in item.children">
			<menu-item
				v-if="option.children && option.meta.isMenu"
				:key="option.path"
				:item="option"
			/>
			<el-menu-item
				v-if="!option.children && option.meta.isMenu"
				:index="option.path"
				:key="index"
			>
				<span class="sub-title">
					{{ option.meta.title }}
				</span>
			</el-menu-item>
		</template>
	</el-sub-menu>
</template>

<script>
export default {
	name: 'MenuItem',
};
</script>

<script setup>
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const curPath = ref('');

watch(
	() => route.path,
	(value) => {
    curPath.value = value;
	},
	{
		immediate: true,
	}
);

const props = defineProps({
	item: {
		type: Object,
		default: () => {
			return {};
		},
	},
});
</script>
<style lang="scss" scoped>
:deep(.el-menu-item) {
	height: 60px;
	padding-left: 55px !important;
	background-color: $menu-default-bg-color;
}

:deep(.el-icon) {
	font-size: 16px !important;
}

.sub-menu-item {
	&.is-active {
		:deep(.el-sub-menu__title) {
			color: $font-color;
		}
	}
}

:deep(.el-menu-item:hover) {
	background-color: $menu-hover-color;
}

.menu-icon,
.icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 24px !important;
	height: 24px !important;
	object-fit: cover;
	margin-right: 13px;
	visibility: initial !important;
}
.title {
	font-size: 15px;
}

.sub-title {
	font-size: 14px;
}
</style>
