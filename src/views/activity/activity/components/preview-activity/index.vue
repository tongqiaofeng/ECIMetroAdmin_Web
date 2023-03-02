<template>
	<!-- 预览文章 -->
	<div class="preview-activity">
		<PreviewDialog
			ref="previewRef"
			:confirmBtnText="'关 闭'"
      :title="'预览活动'"
			@cancel="handleClose"
			@confirm="handleClose"
			@close="handleClose"
		>
			<template #content>
				<el-form
					ref="formRef"
					label-width="120px"
					:model="formData"
					:rules="formDataRules"
				>
					<el-form-item prop="title" label="标题：">
						<el-input
							disabled
							type="text"
							class="input-width"
							placeholder="请输入文章标题"
							size="large"
							v-model="formData.title"
						/>
					</el-form-item>
					<el-form-item prop="createTime" label="发布时间：">
						<el-date-picker
							disabled
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
							:isDelete="false"
							:disabled="true"
						>
						</upload-file>
					</el-form-item>
					<el-form-item prop="source" label="来源：">
						<el-radio-group disabled v-model="formData.source">
							<el-radio :label="0">自建</el-radio>
							<el-radio :label="1">服务号推送</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop="type" label="活动类型：">
						<el-select
							disabled
							class="input-width"
							size="large"
							v-model="formData.type"
						>
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
							disabled
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
				</el-form>
			</template>
		</PreviewDialog>
	</div>
</template>

<script setup name="previewActivity" lang="ts">
import { nextTick } from 'process';
import { ref, reactive, watch } from 'vue';
import { resetObjValues } from '@/utils/utils';
import config from '@/config/index';
import * as ActivityApi from '@/request/api/activity';

const props = defineProps({
	form: {
		type: Object,
		default() {
			return {};
		},
	},
});

const formData = reactive({
	id: '',
	title: '',
	createTime: '',
	coverPhoto: '', // 封面图
	source: 0, // 来源 0自建 1服务号推送
	type: '', // 类型
	content: '',
	editorContent: '',
	link: '', // 服务号链接
});

const formDataRules = reactive({
	title: { required: true, message: '请输入标题', trigger: 'change' },
	createTime: { required: true, message: '请选择发布时间', trigger: 'change' },
	coverPhoto: { required: true, message: '请选择封面图', trigger: 'change' },
	source: { required: true, message: '请选择来源', trigger: 'change' },
	type: { required: true, message: '请选择类型', trigger: 'change' },
});

const pics = ref([]);
const editorContent = ref('');

const previewRef = ref(null);
const activityTypeList = ref([]);
watch(
	() => props.form,
	(data) => {
		if (data) {
			nextTick(() => {
				Object.assign(formData, data);
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
				previewRef.value.open();
			});
		}
	},
	{
		deep: true,
	}
);

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

const handleClose = () => {
	resetObjValues(formData);
};
</script>

<style lang="scss" scoped></style>
