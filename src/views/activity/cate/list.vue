<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box text-left">
				<div class="search-right">
					<el-button type="primary" size="large" @click="showDialog('add')">
						<span class="add-style"> <span>+</span> </span>
						增加类型
					</el-button>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table :data="list" border stripe>
					<el-table-column label="类型名" prop="typeName" align="center" />
					<el-table-column label="操作" align="center" width="400">
						<template #default="{ row }">
							<div class="btn-row">
								<div class="btn" @click="showDialog('edit', row)">
									<span>编辑</span>
								</div>
								<div class="btn" @click="showDelDialog(row.id)">
									<span>删除</span>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<!-- 弹窗 -->
		<el-dialog
			:title="mode == 'add' ? `新增类型` : `编辑类型`"
			width="600px"
			v-model="dialogStatus"
			center
			@close="handleDialogClose"
		>
			<el-form
				ref="formRef"
				label-width="95px"
				:model="formData"
				:rules="formDataRules"
			>
				<el-form-item prop="typeName" label="类型名：">
					<el-input
						type="text"
						placeholder="请输入类型名称"
						size="large"
						v-model="formData.typeName"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button size="large" @click="dialogStatus = false"
						>取 消</el-button
					>
					<el-button
						size="large"
						@click="postFormData"
						type="primary"
						v-preventClick
						>确 定
					</el-button>
				</div>
			</template>
		</el-dialog>

		<DelDialog
			@confirm="confirmDel"
			:title="'删除活动类型'"
			ref="delDialogRef"
		/>
	</div>
</template>

<script setup lang="ts" name="activityList">
import { ref, reactive, onMounted } from 'vue';
import * as ActivityApi from '@/request/api/activity';
import { ElMessage } from 'element-plus';
import { resetObjValues } from '@/utils/utils';

const list = ref([]);

const formRef = ref(null);
const mode = ref('add');
const dialogStatus = ref(false);

const formData = reactive({
	id: '',
	typeName: '',
});

const formDataRules = reactive({
	typeName: { required: true, message: '请输入类型名称', trigger: ['click', 'blur'] },
});

// 活动类型
const getActivityCateList = async () => {
	const { data: res } = await ActivityApi.articleTypeListGet();
	if (res.code == 200) {
		list.value = res.data;
	} else {
		list.value = [];
	}
};
getActivityCateList();

const handleDialogClose = () => {
  formRef.value?.resetFields();
  resetObjValues(formData);
};

const postFormData = () => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		const { data: res } = await ActivityApi.articleTypeSave(formData);
		if (res.code == 200) {
			if (!formData.id && mode.value == 'add') {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			dialogStatus.value = false;
			getActivityCateList();
		} else if (res.code == 400) {
			ElMessage.error(res.data);
		}
	});
};

const showDialog = (status: string, item?: any) => {
	mode.value = status;
	dialogStatus.value = true;
	if (status == 'edit') {
		Object.assign(formData, item);
	} else {
		resetObjValues(formData);
	}
};

// 删除
const delDialogRef = ref(null);
const showDelDialog = (id: number) => {
	delDialogRef.value.open(id);
};

const confirmDel = async (delId) => {
	if (delId) {
		const { data: res } = await ActivityApi.articleTypeDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getActivityCateList();
		}
	}
};
</script>

<style lang="scss" scoped>
#container {
	padding: 20px;
}
.wrapper {
	padding: 20px;
	background-color: #fff;
	border-radius: 10px;
}
</style>
