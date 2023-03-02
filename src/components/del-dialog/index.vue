<template>
	<div class="del-dialog">
		<el-dialog
			:title="title"
			v-model="dialog"
			center
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			:width="width"
			@close="close"
		>
			<div>
				<p class="text-center">{{desc}}</p>
			</div>
			<template #footer>
				<el-button size="large" @click="cancel">取 消</el-button>
				<el-button size="large" @click="confirm" type="primary" v-preventClick
					>确 定</el-button
				>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="del-dialog" lang="ts">
import { ref } from 'vue';

const props = defineProps({
	// 标题
	title: {
		type: String,
  },
  desc: {
    type: String,
    default: '确定删除该信息？删除后不可恢复'
  },
	// 宽度
	width: {
		type: String,
		default: '520px',
	},
});

const emit = defineEmits(['close', 'cancel', 'confirm']);

const dialog = ref(false);
const delId = ref(null);

const open = (id?: number) => {
	dialog.value = true;
	delId.value = id;
};

const cancel = () => {
	dialog.value = false;
	emit('cancel');
};

const close = () => {
	dialog.value = false;
	delId.value = null;
	emit('close');
};

const confirm = () => {
	emit('confirm', delId.value);
};

defineExpose({
	open,
	close,
});
</script>

<style lang="scss" scoped></style>
