<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box text-left">
				<div v-if="adminInfo.role == 'ADMIN'" class="search-right">
					<el-button type="primary" size="large" @click="showDialog('add')">
						<span class="add-style"> <span>+</span> </span>
						增加用户
					</el-button>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table :data="list" border stripe>
					<el-table-column label="工号" prop="employeeNumber" align="center" />
					<el-table-column label="姓名" prop="name" align="center" />
					<el-table-column label="部门" prop="deptName" align="center" />
					<el-table-column label="手机号" prop="phoneNumber" align="center" />
					<el-table-column label="操作" align="center" width="250">
						<template #default="{ row }">
							<div class="btn-row">
								<div class="btn" @click="showDialog('edit', row)">
									<span>编辑</span>
								</div>
								<button
									class="btn del-btn"
									@click="showDelDialog(row.id)"
								>
									<span>删除</span>
								</button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<!-- 弹窗 -->
		<el-dialog
			:title="mode == 'add' ? `新增用户` : `编辑用户`"
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
				<el-form-item prop="name" label="姓名：">
					<el-input
						type="text"
						placeholder="请输入姓名"
						size="large"
						v-model="formData.name"
						clearable
					/>
				</el-form-item>
				<el-form-item prop="employeeNumber" label="工号：">
					<el-input
						type="text"
						placeholder="请输入工号"
						size="large"
						v-model="formData.employeeNumber"
						clearable
					/>
				</el-form-item>
				<el-form-item v-if="mode == 'add'" prop="password" label="密码：">
					<el-input
						type="text"
						placeholder="请输入密码"
						size="large"
						v-model="formData.password"
						clearable
					/>
				</el-form-item>
				<el-form-item prop="deptName" label="部门：">
					<el-input
						type="text"
						placeholder="请输入部门"
						size="large"
						v-model="formData.deptName"
						clearable
					/>
				</el-form-item>
				<el-form-item prop="phoneNumber" label="手机号：">
					<el-input
						type="text"
						placeholder="请输入手机号"
						size="large"
						v-model="formData.phoneNumber"
						clearable
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

		<DelDialog @confirm="confirmDel" :title="'删除用户'" ref="delDialogRef" />
	</div>
</template>

<script setup lang="ts" name="userList">
import { ref, reactive } from 'vue';
import * as UserApi from '@/request/api/user';
import { ElMessage } from 'element-plus';
import { resetObjValues } from '@/utils/utils';
import { useUserStore } from '@/store/userStore';

const list = ref([]);
const formRef = ref(null);
const mode = ref('add');
const dialogStatus = ref(false);
const userStore = useUserStore();

const adminInfo: any = userStore.adminInfo;
const formData = reactive({
	id: '',
	employeeNumber: '',
	deptName: '',
	name: '',
	password: '',
	phoneNumber: '',
});

// 手机号验证
const validatePhone = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入手机号'));
	} else {
		if (!/^1[3456789]\d{9}$/.test(value)) {
			callback(new Error('手机号格式错误'));
		} else {
			callback();
		}
	}
};

const formDataRules: any = reactive({
	name: { required: true, message: '请输入姓名', trigger: ['click', 'blur'] },
	employeeNumber: {
		required: true,
		message: '请输入工号',
		trigger: ['click', 'blur'],
	},
	password: {
		required: true,
		message: '请输入密码',
		trigger: ['click', 'blur'],
	},
	deptName: {
		required: true,
		message: '请输入部门',
		trigger: ['click', 'blur'],
	},
	phoneNumber: [
		{ required: true, message: '请输入手机号', trigger: ['click', 'blur'] },
		{
			validator: validatePhone,
			trigger: ['click'],
		},
	],
});



// 用户列表
const getUserList = async () => {
	const { data: res } = await UserApi.accountList();
	if (res.code == 200) {
		list.value = res.data;
	} else {
		list.value = [];
	}
};
getUserList();

const handleDialogClose = () => {
	formRef.value?.resetFields();
	resetObjValues(formData);
};

const postFormData = () => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		if (mode.value == 'edit') {
			delete formData.password;
		}
		const { data: res } = await UserApi.accountSave(formData);
		if (res.code == 200) {
			if (!formData.id && mode.value == 'add') {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			dialogStatus.value = false;
			getUserList();
		} else if (res.code == 400) {
			ElMessage.warning(res.data);
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
    const res = await UserApi.accountDel(delId);
		if (res.data.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getUserList();
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
.btn-row {
	.del-btn {
		background: none;
		border: none;
	}
}
</style>
