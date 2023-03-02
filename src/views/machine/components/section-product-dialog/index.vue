<template>
	<div class="section-product">
		<el-dialog
			:title="title"
			width="800px"
			v-model="productSelectDialog"
			center
			@close="handleClose"
		>
			<el-table
				ref="tableRef"
				:data="list"
				border
				stripe
				:row-key="getRowKeys"
				@selection-change="handleTableSectionChange"
			>
				<el-table-column
					type="selection"
					align="center"
					width="55"
					:reserve-selection="true"
				/>
				<el-table-column prop="id" align="center" width="120" label="ID" />
				<el-table-column prop="imgUrl" align="center" label="图片">
					<template #default="{ row }">
						<el-image
							:src="
								row.imgUrl ? config.baseFileUrl + row.imgUrl.split('|')[0] : ''
							"
							class="upload-img"
							preview-teleported
						/>
					</template>
				</el-table-column>
				<el-table-column prop="model" align="center" label="型号" />
				<el-table-column
					v-if="status == 'recycle'"
					prop="recycleEquipmentNo"
					align="center"
					label="设备编号"
				/>
			</el-table>

			<slot name="pagination"></slot>
			<template #footer>
				<div>
					<el-button size="large" @click="productSelectDialog = false"
						>取 消</el-button
					>
					<el-button size="large" type="primary" v-preventClick @click="confirm"
						>确 定
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="selection-product-dialog" lang="ts">
import { ref, reactive, nextTick } from 'vue';
import config from '@/config/index';
import { ElMessage } from 'element-plus';

const props = defineProps({
	title: {
		type: String,
		default: '产品选择',
	},

	// product产品  industry山工 recycle二手
	status: {
		type: String,
		default: 'product',
	},

	list: {
		type: Array,
		default() {
			return [];
		},
	},
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const productSelectDialog = ref(false);
const tableRef = ref(null);

const selectedList = ref([]); // 选取的数据

const getRowKeys = (row) => {
	return row.id;
};

const handleTableSectionChange = (selectRows) => {
	selectedList.value = selectRows;
};

// 确认
const confirm = () => {
	emit('confirm', selectedList.value);
};

const open = () => {
	productSelectDialog.value = true;
};

const close = () => {
	productSelectDialog.value = false;
};

const handleClose = () => {
	nextTick(() => {
		tableRef.value?.clearSelection();
	});
	emit('close');
};

// 设置默认选中
const setDefaultSelected = (list = []) => {
	if (list && list.length) {
		list.forEach((row) => {
			nextTick(() => {
				tableRef.value?.toggleRowSelection(row, true);
			});
		});
	}
};

defineExpose({
	open,
	close,
	setDefaultSelected,
});
</script>

<style scoped lang="scss">
.upload-img {
	width: 50px;
	height: 40px;
	z-index: 99;
}
</style>
