<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box flex-justify-between text-left">
				<div class="search-left">
					<el-form inline class="search-query-form">
						<el-form-item label="招聘状态：" prop="state">
							<el-select
								size="large"
								placeholder="请选择状态"
								v-model="formQuery.state"
								clearable
							>
								<el-option :label="'招聘中'" :value="0"></el-option>
								<el-option :label="'已完成'" :value="1"></el-option>
								<el-option :label="'已撤销'" :value="-1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-input
								size="large"
								style="width: 300px"
								v-model="formQuery.keyword"
								placeholder="搜索职位名称、描述、学历、工作地点"
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
				<div class="search-right">
					<el-button type="primary" @click="showDialog('add')" size="large">
						<span class="add-style"> <span>+</span> </span>
						增加职位
					</el-button>
				</div>
			</div>

			<div class="table-box mt-30">
				<el-table :data="list" border stripe>
					<el-table-column label="职位名称" prop="name" align="center" />
					<el-table-column label="学历" prop="major" align="center" />
					<el-table-column label="招聘状态" prop="state" align="center">
						<template #default="{ row }">
							<el-tag type="warning" v-if="row.state == 0">招聘中</el-tag>
							<el-tag type="success" v-if="row.state == 1">已完成</el-tag>
							<el-tag type="info" v-if="row.state == -1">已撤销</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" align="center" width="120">
						<template #default="{ row }">
							<el-input
								type="text"
								v-model="row.sort"
								:input-style="inputStyle"
								:min="0"
								:maxlength="4"
								oninput="value=value.replace(/[^\d]/g,'')"
								@blur="handleSortChange(row)"
							/>
						</template>
					</el-table-column>
					<el-table-column label="职位类别" prop="jobCategory" align="center" />
					<el-table-column
						sortable
						label="发布时间"
						prop="createTime"
						align="center"
					/>
					<el-table-column label="操作" align="center" width="250">
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

		<el-dialog
			:title="mode == 'add' ? `新增招聘` : `编辑招聘`"
			width="800px"
			v-model="dialogStatus"
			center
			@close="handleDialogClose"
		>
			<el-form
				ref="formRef"
				label-width="110px"
				:model="formData"
				:rules="formDataRules"
			>
				<el-form-item prop="name" label="职位名称：">
					<el-input
						type="text"
						size="large"
						class="input-width"
						clearable
						v-model="formData.name"
						placeholder="请输入职位名称"
					/>
				</el-form-item>
				<el-form-item v-if="mode == 'edit'" prop="state" label="招聘状态：">
					<el-radio-group v-model="formData.state">
						<el-radio :label="0">招聘中</el-radio>
						<el-radio :label="1">已完成</el-radio>
						<el-radio :label="-1">已撤销</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="major" label="学历：">
					<el-select
						size="large"
						v-model="formData.major"
						placeholder="请选择学历"
					>
						<el-option
							v-for="item in majorlist"
							:key="item"
							:label="item"
							:value="item"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="createTime" label="发布时间：">
					<el-date-picker
						v-model="formData.createTime"
						type="date"
						size="large"
						placeholder="请选择发布时间"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item prop="srot" label="排序：">
					<el-input
						type="number"
						class="input-width"
						placeholder="请输入排序"
						size="large"
						v-model="formData.sort"
					>
					</el-input>
				</el-form-item>
				<el-form-item prop="jobCategory" label="职位类别：">
					<el-input
						type="text"
						size="large"
						class="input-width"
						clearable
						v-model="formData.jobCategory"
						placeholder="请输入职位类别(如:维修类)"
					/>
				</el-form-item>
				<el-form-item prop="workLocation" label="工作地点：">
					<el-input
						type="text"
						size="large"
						class="input-width"
						clearable
						v-model="formData.workLocation"
						placeholder="请输入工作地点"
					/>
				</el-form-item>
				<el-form-item prop="content" label="招聘介绍：">
					<el-input
						type="textarea"
						class="input-width"
						size="large"
						v-model="formData.content"
						placeholder="请输入招聘介绍"
						:rows="5"
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
						type="primary"
						v-preventClick
						@click="postFormData"
						>确 定
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 删除弹窗 -->
		<DelDialog
			@confirm="confirmDel"
			:title="'删除招聘记录'"
			ref="delDialogRef"
		/>
	</div>
</template>

<script setup lang="ts" name="productCate">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getDateNow } from '@/utils/utils';
import * as ToolApi from '@/request/api/tool';
import { resetObjValues } from '@/utils/utils';
const list = ref([]);

const formQuery = reactive({
	keyword: '',
	page: 1,
	pageNum: 10,
	state: null, // 状态 0:招聘中 1：招聘完成 -1：撤销招聘
});
const total = ref(0);

const formData = reactive({
	id: '',
	name: '', // 职位名称
	state: 0, // 修改传；0:招聘中 1：招聘完成 -1：撤销招聘
	createTime: getDateNow(),
	major: '', // 学历
	workLocation: '', // 工作地点
	jobCategory: '', // 职位类别；例如：维修类
	content: '',
	sort: 100,
});
const majorlist = [
	'小学',
	'初中',
	'高中',
	'大学专科',
	'大学本科',
	'研究生',
	'博士',
];

const formDataRules = reactive({
	name: {
		required: true,
		message: '请输入职位名称',
		trigger: ['click', 'blur'],
	},
	major: { required: true, message: '请选择学历', trigger: ['click', 'blur'] },
	state: {
		required: true,
		message: '请选择招聘状态',
		trigger: ['click', 'blur'],
	},
	createTime: {
		required: true,
		message: '请选择发布时间',
		trigger: ['click', 'blur'],
	},
	jobCategory: {
		required: true,
		message: '请输入职位类别',
		trigger: ['click', 'blur'],
	},
	workLocation: {
		required: true,
		message: '请输入工作地点',
		trigger: ['click', 'blur'],
	},
	content: {
		required: true,
		message: '请输入招聘介绍',
		trigger: ['click', 'blur'],
	},
});

const dialogStatus = ref(false);
const mode = ref('add');
const formRef = ref(null);

const inputStyle: any = {
	textAlign: 'center',
};

// 招聘列表
const getJoinList = async () => {
	const { data: res } = await ToolApi.joinSearch(formQuery);
	if (res.code == 200) {
		let data = res.data;
		list.value = data.list;
		total.value = data.total;
	} else {
		list.value = [];
		total.value = 0;
	}
};
getJoinList();

const showDialog = (status: string, item?: any) => {
	mode.value = status;
	dialogStatus.value = true;
	if (status == 'edit') {
		Object.assign(formData, item);
	} else {
		resetObjValues(formData);
		formData.state = 0;
		formData.createTime = getDateNow();
	}
};

const handleCurrentChange = (page: number) => {
	formQuery.page = page;
	getJoinList();
	document.getElementById('container').scrollIntoView({ behavior: 'smooth' });
};

const handleDialogClose = () => {
	formRef.value?.resetFields();
	resetObjValues(formData);
};

const postFormData = () => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		const { data: res } = await ToolApi.joinSave(formData);
		if (res.code == 200) {
			if (!formData.id && mode.value == 'add') {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			dialogStatus.value = false;
			getJoinList();
		} else if (res.code == 400) {
			ElMessage.error(res.data);
		}
	});
};

// 删除
const delDialogRef = ref(null);
const showDelDialog = (id: number) => {
	delDialogRef.value.open(id);
};

const confirmDel = async (delId) => {
	if (delId) {
		const { data: res } = await ToolApi.joinDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getJoinList();
		} else {
			ElMessage.warning('删除失败');
		}
	}
};

const handleSortChange = async (item: any) => {
	let params = {
		id: item.id,
		sort: Number(item.sort),
	};
	const { data: res } = await ToolApi.joinSortSave(params);
	if (res.code == 200) {
		getJoinList();
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

.search-box {
	:deep(.el-form-item) {
		margin-bottom: 0;
	}
}
</style>
