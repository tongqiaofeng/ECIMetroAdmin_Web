<template>
	<div class="edit-wrapper">
		<div class="back-img" @click="goBack">
			<img class="back-icon" src="@/assets/imgs/back_icon.png" />
			<span class="font">返回</span>
		</div>
		<div class="form-wrapper mt-30">
			<el-form
				ref="formRef"
				label-width="120px"
				:model="formData"
				:rules="formDataRules"
			>
				<el-form-item prop="title" label="标题：">
					<el-input
						type="text"
						class="input-width"
						placeholder="请输入文章标题"
						size="large"
						v-model="formData.title"
						clearable
					/>
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
				<el-form-item prop="coverPhoto" label="封面图：">
					<upload-file
						:fileList="pics"
						:type="'img'"
						@fileChange="handleFileChange"
					>
					</upload-file>
				</el-form-item>

				<el-form-item prop="source" label="来源：">
					<el-radio-group v-model="formData.source">
						<el-radio :label="0">自建</el-radio>
						<el-radio :label="1">服务号推送</el-radio>
					</el-radio-group>
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
				<el-form-item prop="type" label="活动类型：">
					<el-select class="input-width" size="large" v-model="formData.type">
						<el-option
							v-for="(item, index) in activityTypeList"
							:key="index"
							:label="item.typeName"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="formData.source == 1"
					label="服务号链接："
					prop="link"
					:rules="{ required: true, message: '请输入服务号链接' }"
				>
					<el-input
						size="large"
						class="input-width"
						placeholder="请输入服务号链接"
						v-model="formData.link"
					/>
				</el-form-item>
				<el-form-item
					v-if="formData.source == 0"
					prop="editorContent"
					label="活动内容："
				>
					<TEdtior ref="editorCpnRef" :content="editorContent" />
				</el-form-item>

				<div class="btn-bottom-wrap text-center">
					<el-button
						size="large"
						type="primary"
						class="post-btn"
						@click="postFormData"
						>提 交</el-button
					>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup name="activityEdit" lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as ActivityApi from '@/request/api/activity';
import { ElMessage } from 'element-plus';
import config from '@/config/index';
import { getDateNow } from '@/utils/utils';
import { nextTick } from 'process';

const formData = reactive({
	id: '',
	title: '',
	createTime: getDateNow(),
	coverPhoto: '', // 封面图
	source: 0, // 来源 0自建 1服务号推送
	type: '', // 类型
	content: '',
	editorContent: '',
  link: '', // 服务号链接
  sort: 100, // 排序
});
const pics = ref([]);
const editorContent = ref('');

const formDataRules = reactive({
	title: { required: true, message: '请输入标题', trigger: 'change' },
	createTime: { required: true, message: '请选择发布时间', trigger: 'change' },
	coverPhoto: { required: true, message: '请选择封面图', trigger: 'change' },
	source: { required: true, message: '请选择来源', trigger: 'change' },
	type: { required: true, message: '请选择类型', trigger: 'change' },
});

const formRef = ref(null);
const activityTypeList = ref([]);
// 编辑器实例
const editorCpnRef = ref(null);

const router = useRouter();
const route = useRoute();
if (route.query && route.query.id) {
	let id = route.query.id;
	nextTick(() => {
		getActivityDetail(id);
	});
}

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

const getActivityDetail = async (id: any) => {
	const { data: res } = await ActivityApi.articleInfoGet(id);
	let data = res.data;
	formData.id = data.id;
	formData.title = data.title;
	formData.source = data.source;
	formData.type = data.type;
  formData.createTime = data.createTime;
  formData.sort = data.sort;
	if (data.coverPhoto) {
		formData.coverPhoto = data.coverPhoto;
		pics.value = data.coverPhoto.split('|');
	}
	if (data.source == 0) {
		formData.editorContent = data.content.replaceAll(
			config.editorReplaceFlag,
			config.baseFileUrl
		);
		editorContent.value = formData.editorContent;
	} else {
		// 链接
		formData.link = data.content;
	}
};

const handleFileChange = (files) => {
	pics.value = files.img;
	formData.coverPhoto = files.img.join('|');
};

const postFormData = () => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		if (!checkContent()) return;
		if (formData.source == 1 && formData.link) {
			formData.content = formData.link;
		} else {
			let html = editorCpnRef.value.getEditorHtml();
			if (html) {
				formData.content = html.replaceAll(
					config.baseFileUrl,
					config.editorReplaceFlag
				);
				editorContent.value = html;
			} else {
				formData.content = '';
				editorContent.value = '';
			}
		}
		const { data: res } = await ActivityApi.articleSave(formData);
		if (res.code == 200) {
			if (!formData.id) {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			router.replace({ path: '/activity/list' });
		} else if (res.code == 400) {
			ElMessage.error(res.data);
		}
	});
};

const checkContent = () => {
	if (formData.source == 1 && !formData.link) {
		ElMessage.warning('请输入服务号链接');
		return false;
	} else {
		if (editorCpnRef.value) {
			let html = editorCpnRef.value.getEditorHtml();
			if (formData.source == 0 && !html) {
				ElMessage.warning('请输入活动内容');
				return false;
			}
		}
	}
	return true;
};

const goBack = () => {
	router.go(-1);
};
</script>

<style lang="scss" scoped>
.edit-wrapper {
	margin: 20px;
	padding: 20px;
	background-color: #fff;
	border-radius: 10px;
	.btn-bottom-wrap {
		.post-btn {
			width: 150px;
			height: 45px;
			line-height: 45px;
			margin: 15px 0;
		}
	}
}
</style>
