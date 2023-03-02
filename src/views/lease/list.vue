<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box text-left">
				<div class="search-left">
					<el-form inline class="search-query-form">
						<el-form-item label="处理状态：">
							<el-select
								size="large"
								clearable
								v-model="formQuery.state"
								placeholder="请选择"
							>
								<el-option :label="'所有'" :value="null"></el-option>
								<el-option :label="'未处理'" :value="0"></el-option>
								<el-option :label="'已处理'" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-input
								size="large"
								style="width: 450px"
								v-model="formQuery.keyword"
								placeholder="请输入姓名、电话"
								clearable
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button
								size="large"
								@click="handleCurrentChange(1)"
								type="primary"
								>查 询</el-button
							>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table :data="list" border stripe>
					<el-table-column label="租赁设备型号" prop="model" align="center" />
					<el-table-column label="姓名" prop="fullName" align="center" />
					<el-table-column label="手机号" prop="phoneNumber" align="center" />
					<el-table-column label="邮箱" prop="email" align="center">
						<template #default="{ row }">
							<span v-if="row.email">{{ row.email }}</span>
							<span v-else>暂无</span>
						</template>
					</el-table-column>
					<el-table-column label="处理状态" align="center">
						<template #default="{ row }">
							<el-tag type="warning" v-if="row.state == 0">未处理</el-tag>
							<el-tag type="info" v-if="row.state == 1">已处理</el-tag>
						</template>
					</el-table-column>
					<el-table-column
						label="租赁开始日期"
						prop="startDate"
						align="center"
					/>
					<el-table-column label="租赁结束日期" prop="endDate" align="center" />
					<el-table-column label="施工地址" prop="address" align="center" />
					<el-table-column label="备注" prop="note" align="center">
						<template #default="{ row }">
							<el-popover
								placement="top-start"
								title="租赁备注"
								:width="200"
								trigger="hover"
								:content="row.note"
							>
								<template #reference>
									<p class="font-warp note">{{ row.note }}</p>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						fixed="right"
						align="center"
						width="220"
					>
						<template #default="{ row }">
							<div class="btn-row">
								<div
									class="btn"
									v-if="row.state != 1"
									@click="showSendEmailDialog(row)"
								>
									<span>发送邮箱</span>
								</div>
								<div class="btn" @click="showDelDialog(row.id)">
									<span>删除</span>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleCurrentChange"
							:current-page="formQuery.page"
							:default-page-size="formQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="total"
						>
						</el-pagination>
					</div>
				</div>
			</div>
		</div>

		<!-- 发送邮箱弹窗 -->
		<el-dialog
			title="发送邮箱"
			width="600px"
			v-model="emailDialog"
			center
			@close="handleEmailDialogClose"
		>
			<el-form
				ref="formRef"
				:rules="emailFormRules"
				label-width="95px"
				:model="emailForm"
			>
				<el-form-item prop="email" label="邮箱地址：">
					<el-autocomplete
						v-model="emailForm.email"
						:fetch-suggestions="queryEmailSearch"
						clearable
						placeholder="请选择/输入邮箱"
						class="input-width"
						size="large"
						filterable
						:trigger-on-focus="true"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button size="large" @click="emailDialog = false">取 消</el-button>
					<el-button
						size="large"
						@click="postEmailForm"
						type="primary"
						v-preventClick
						>确 定
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 删除弹窗 -->
		<DelDialog
			@confirm="confirmDel"
			:title="'删除租赁记录'"
			ref="delDialogRef"
		/>
	</div>
</template>

<script setup lang="ts" name="userList">
import { ref, reactive } from 'vue';
import * as ToolApi from '@/request/api/tool';
import { ElMessage } from 'element-plus';
import _ from 'lodash';

const formQuery = reactive({
	keyword: '',
	page: 1,
	pageNum: 10,
	state: null, // 状态 0未处理  1已处理
});
const list = ref([]);
const total = ref(0);
const emailList = ref([]);
const emailDialog = ref(false);
const emailForm = reactive({
	id: '',
	email: '',
});

const emailFormRules = reactive({
	email: { required: true, message: '请输入邮箱', trigger: ['click', 'change'] },
});

const formRef = ref(null);

// 租赁列表
const getRecordList = async () => {
	const { data: res } = await ToolApi.leaseRecordList(formQuery);
	if (res.code == 200) {
		let data = res.data;
		list.value = data.list;
		total.value = data.total;
	} else {
		list.value = [];
		total.value = 0;
	}
};
getRecordList();

// 邮箱列表
const getEmailList = async () => {
	const { data: res } = await ToolApi.emailList();
	if (res.code == 200) {
		if (res.data && res.data.length) {
			let newlist = res.data.map((item) => {
				return { value: item };
			});
			emailList.value = newlist;
		} else {
			emailList.value = [];
		}
	} else {
		emailList.value = [];
	}
};
getEmailList();

const showSendEmailDialog = (item: any) => {
	if (item && item.id) {
		emailForm.id = item.id;
		emailDialog.value = true;
	} else {
		ElMessage.warning('id不存在');
	}
};

const handleCurrentChange = (page: number) => {
	formQuery.page = page;
	getRecordList();
};

const postEmailForm = () => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		const { data: res } = await ToolApi.leaseSendEmail(emailForm);
		if (res.code == 200) {
			ElMessage.success('发送成功');
			emailDialog.value = false;
			getRecordList();
			getEmailList();
		} else {
			ElMessage.warning(res.data);
			emailDialog.value = false;
		}
	});
};

const handleEmailDialogClose = () => {
	emailForm.id = '';
	emailForm.email = '';
	formRef.value?.resetFields();
};

const queryEmailSearch = (queryString: string, cb: any) => {
	if (queryString) {
		let newlist = emailList.value.filter((item) => {
			if (item) {
				return String(item.value).indexOf(queryString) > -1;
			} else {
				return false;
			}
		});
		cb(newlist);
	} else {
		cb(emailList.value);
	}
};

// 删除
const delDialogRef = ref(null);
const showDelDialog = (id: number) => {
	delDialogRef.value.open(id);
};

const confirmDel = async (delId) => {
	if (delId) {
		const { data: res } = await ToolApi.leaseRecordDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getRecordList();
			getEmailList();
		} else {
			ElMessage.warning('删除失败');
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

.note {
	cursor: pointer;
}
</style>
