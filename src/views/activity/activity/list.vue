<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box text-left">
				<el-form inline class="stock-search-form">
					<el-form-item label="来源：">
						<el-select size="large" clearable v-model="formQuery.source">
							<el-option :value="0" :label="'自建'"></el-option>
							<el-option :value="1" :label="'服务号推送'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="活动类型：">
						<el-select size="large" clearable v-model="formQuery.type">
							<el-option
								v-for="(item, index) in activityTypeList"
								:key="index"
								:label="item.typeName"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input
							size="large"
							style="width: 450px"
							v-model="formQuery.keyword"
							placeholder="请输入标题、文章内容"
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
				<div class="search-right">
					<el-button type="primary" @click="goActivityEdit('add')" size="large">
						<span class="add-style"> <span>+</span> </span>
						增加活动
					</el-button>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table :data="list" border stripe>
					<el-table-column label="标题" prop="title" align="center" />
					<el-table-column label="封面图" align="center">
						<template #default="{ row }">
							<el-image
								:src="
									row.coverPhoto
										? config.baseFileUrl + row.coverPhoto.split('|')[0]
										: ''
								"
								class="upload-img"
								preview-teleported
								:preview-src-list="previewList(row.coverPhoto)"
							/>
						</template>
					</el-table-column>
					<el-table-column label="来源" align="center">
						<template #default="{ row }">
							<el-tag type="warning" v-if="row.source == 0">自建</el-tag>
							<el-tag type="info" v-if="row.source == 1">服务号推送</el-tag>
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
					<el-table-column label="类型" prop="typeName" align="center" />
					<el-table-column label="操作" align="center" width="250">
						<template #default="{ row }">
							<div class="btn-row">
								<div class="btn" @click="showPreviewDialog(row)">
									<span>预览</span>
								</div>
								<div class="btn" @click="goActivityEdit('edit', row.id)">
									<span>编辑</span>
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

		<DelDialog @confirm="confirmDel" :title="'删除活动'" ref="delDialogRef" />

		<!-- 预览活动弹窗 -->
		<PreviewActivity ref="PreviewActivityRef" :form="previewForm" />
	</div>
</template>

<script setup lang="ts" name="activityList">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import * as ActivityApi from '@/request/api/activity';
import { useRouter } from 'vue-router';
import config from '@/config/index';
import PreviewActivity from './components/preview-activity/index.vue';
import { useSaveStore } from '@/store/saveStore';

const list = ref([]);
const router = useRouter();
const total = ref(0);
const formQuery = reactive({
	keyword: '',
	page: 1,
	pageNum: 10,
	source: '',
	type: '',
});

const activityTypeList = ref([]);

const previewForm = ref({});

const inputStyle: any = {
	textAlign: 'center',
};

const saveStore = useSaveStore();

// 预览图
const previewList = computed(() => {
	return (pics) => {
		if (pics) {
			return pics.split('|').map((item) => config.baseFileUrl + item);
		} else {
			return [];
		}
	};
});

// 活动列表
const getActivityList = async () => {
	const activityParams: any = saveStore.activityParams;
	console.log(activityParams);
	if (activityParams && activityParams.page) {
		formQuery.page = activityParams.page;
		formQuery.keyword = activityParams.keyword;
		formQuery.pageNum = activityParams.pageNum;
		formQuery.source = activityParams.source;
		formQuery.type = activityParams.type;
	}
	const { data: res } = await ActivityApi.articleListGet(formQuery);
	if (res.code == 200) {
		const data = res.data;
		list.value = data.list;
		total.value = data.total;
	} else {
		list.value = [];
		total.value = 0;
	}
};
getActivityList();

// 类型列表
const getActivityCateList = async () => {
	const { data: res } = await ActivityApi.articleTypeListGet();
	if (res.code == 200) {
		activityTypeList.value = res.data;
	} else {
		activityTypeList.value = [];
	}
};
getActivityCateList();

const goActivityEdit = (status: string, id?: number) => {
	saveStore.setActivityParams({
		page: formQuery.page,
		keyword: formQuery.keyword,
		pageNum: formQuery.pageNum,
		source: formQuery.source,
		type: formQuery.type,
	});
	if (status == 'edit' && id) {
		router.push({ path: '/activity/list/edit', query: { id } });
	} else {
		router.push({ path: '/activity/list/edit' });
	}
};

// 删除
const delDialogRef = ref(null);
const showDelDialog = (id: number) => {
	delDialogRef.value.open(id);
};

const confirmDel = async (delId: number) => {
	if (delId) {
		const { data: res } = await ActivityApi.articleDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getActivityList();
		}
	}
};

const handleCurrentChange = (page: number) => {
	formQuery.page = page;
	saveStore.setActivityParams({
		page: formQuery.page,
		keyword: formQuery.keyword,
		pageNum: formQuery.pageNum,
		source: formQuery.source,
		type: formQuery.type,
	});
	getActivityList();
	document.getElementById('container').scrollIntoView({ behavior: 'smooth' });
};

// 展示预览弹窗
const showPreviewDialog = async (row: any) => {
	if (row && row.id) {
		const { data: res } = await ActivityApi.articleInfoGet(row.id);
		if (res.code == 200) {
			previewForm.value = res.data;
		}
	}
};

const handleSortChange = async (item: any) => {
	let params = {
		id: item.id,
		sort: Number(item.sort),
	};
	const { data: res } = await ActivityApi.sortSave(params);
  if (res.code == 200) {
    getActivityList();
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

.upload-img {
	width: 50px;
	height: 40px;
	z-index: 999;
}
</style>
