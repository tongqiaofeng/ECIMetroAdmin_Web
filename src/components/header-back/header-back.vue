<template>
	<!-- 头部返回组件 -->
	<div class="back-img" @click="goBack">
		<img class="back-icon" src="@/assets/imgs/back_icon.png" />
		<span class="font">{{title}}</span>
	</div>
</template>

<script setup name="headerBack" lang="ts">
import { useRouter } from 'vue-router';

defineProps({
  title: {
    type: String,
    default: '返回'
  }
})
const router = useRouter();

const goBack = () => {
	router.go(-1);
};
</script>

<style lang="scss" scoped>
</style>
