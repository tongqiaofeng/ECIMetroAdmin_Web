<template>
	<!-- 预览弹窗 -->
	<div class="preview-form-dialog">
		<el-dialog :title="title" v-model="status" :width="width" :center="center" @close="close">
			<slot name="content"></slot>

			<template v-if="isFooter" #footer>
				<div>
					<el-button v-if="isCancelBtn" size="large" @click="cancel">{{cancelBtnText}}</el-button>
					<el-button v-if="isConfirmBtn" size="large" type="primary" v-preventClick @click="confirm"
						>{{confirmBtnText}}
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script name="previewFormDialog" setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '预览弹窗',
	},
	width: {
		type: String,
		default: '800px',
	},
	center: {
		type: Boolean,
		default: true,
  },
  isFooter: {
    type: Boolean,
    default: true
  },
  isCancelBtn: {
    type: Boolean,
    default: true
  },
  cancelBtnText: {
    type: String,
    default: '取 消'
  },
  isConfirmBtn: {
    type: Boolean,
    default: true
  },
  confirmBtnText: {
    type: String,
    default: '确 定'
  }
});

const emit = defineEmits(['close', 'open', 'cancel', 'confirm']);

const status = ref(false);

const open = () => {
	status.value = true;
};

const close = () => {
  status.value = false;
  emit('close');
};

const cancel = () => {
	status.value = false;
	emit('cancel');
};

const confirm = () => {
	status.value = false
	emit('confirm');
};

defineExpose({
	close,
	open,
});
</script>

<style scoped></style>
