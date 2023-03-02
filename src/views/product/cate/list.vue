<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box text-left">
				<div class="search-right">
					<el-button type="primary" @click="showDialog('add')" size="large">
						<span class="add-style"> <span>+</span> </span>
						增加分类
					</el-button>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table
					:data="list"
					stripe
					row-key="id"
					:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				>
					<el-table-column
						label="设备分类名称"
						prop="equipmentTypeName"
						align="left"
					/>
					<el-table-column label="图片(电脑端)" prop="imgPc" align="center">
						<template #default="{ row }">
							<el-image
								:src="
									row.imgPc ? config.baseFileUrl + row.imgPc.split('|')[0] : ''
								"
								class="upload-img"
								preview-teleported
								:preview-src-list="previewList(row.imgPc)"
							/>
						</template>
					</el-table-column>
					<el-table-column label="图片(移动端)" prop="imgMobile" align="center">
						<template #default="{ row }">
							<el-image
								:src="
									row.imgMobile
										? config.baseFileUrl + row.imgMobile.split('|')[0]
										: ''
								"
								class="upload-img"
								preview-teleported
								:preview-src-list="previewList(row.imgMobile)"
							/>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="250">
						<template #default="{ row }">
							<div class="btn-row">
								<div class="btn" @click="showDialog('edit', row)">
									<span>编辑</span>
								</div>
								<button
									class="btn del-btn"
									:disabled="limitDel(row.equipmentTypeName)"
									:style="limitDel(row.equipmentTypeName) ? delStyle : {}"
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

		<el-dialog
			:title="mode == 'add' ? `新增分类` : `编辑分类`"
			width="800px"
			v-model="dialogStatus"
			center
			@close="handleDialogClose"
		>
			<el-form
				ref="formRef"
				label-width="120px"
				:model="formData"
				:rules="formDataRules"
			>
				<el-form-item prop="equipmentTypeName" label="分类名称：">
					<el-input
						type="text"
						class="input-width"
						placeholder="请输入产品分类名称"
						size="large"
						clearable
						:disabled="limitDel(formData.equipmentTypeName)"
						v-model="formData.equipmentTypeName"
					/>
				</el-form-item>
				<el-form-item prop="parentId" label="上级分类：">
					<el-tree-select
						class="pid"
						size="large"
						v-model="formData.parentId"
						:data="typeList"
						clearable
						node-key="id"
						:props="{
							label: 'equipmentTypeName',
						}"
						:default-expand-all="true"
						placeholder="请选择上级分类"
						check-strictly
						:disabled="limitDel(formData.equipmentTypeName)"
					/>
				</el-form-item>
				<el-form-item prop="imgPc" label="图片(pc端)：">
					<upload-file
						:fileList="picPcArr"
						:type="'img'"
						@fileChange="handlePcImgChange"
						v-if="dialogStatus"
					></upload-file>
					<span class="notice">提示:请添加4:3比例的图片</span>
				</el-form-item>
				<el-form-item prop="imgMobile" label="图片(移动端)：">
					<upload-file
						:fileList="picMobileArr"
						:type="'img'"
						@fileChange="handleMobileImgChange"
						v-if="dialogStatus"
					></upload-file>
					<span class="notice">提示:请添加4:3比例的图片</span>
				</el-form-item>
				<el-form-item prop="imgSort" label="分类小图：">
					<upload-file
						:fileList="imgSortArr"
						:type="'img'"
						@fileChange="handleImgSortChange"
						v-if="dialogStatus"
					></upload-file>
					<span class="notice">提示:请添加16:9比例的图片</span>
				</el-form-item>
				<!-- <el-form-item prop="video" label="视频：">
					<upload-file
						:fileList="videoArr"
						:type="'video'"
						@fileChange="handleVideoChange"
						v-if="dialogStatus"
					></upload-file>
				</el-form-item> -->
				<el-form-item prop="content" label="内容：">
					<TEdtior ref="editorCpnRef" :content="editorContent" />
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

		<DelDialog @confirm="confirmDel" :title="'删除分类'" ref="delDialogRef" />
	</div>
</template>

<script setup lang="ts" name="productCate">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { resetObjValues } from '@/utils/utils';
import * as ProductApi from '@/request/api/product';
import config from '@/config/index';
import { nextTick } from 'process';

const list = ref([]);
const typeList = ref([]);

const formData = reactive({
	id: '',
	equipmentTypeName: '',
	parentId: '',
	video: '',
	content: '',
	imgPc: '',
	imgMobile: '',
	imgSort: '',
});
const editorContent = ref('');

const formDataRules = reactive({
	equipmentTypeName: {
		required: true,
		message: '请输入分类名称',
		trigger: 'click',
	},
	parentId: { required: true, message: '请选择上级分类', trigger: 'click' },
	imgPc: { required: true, message: '请选择pc端图片', trigger: 'click' },
	imgMobile: { required: true, message: '请选择移动端图片', trigger: 'click' },
});

const picPcArr = ref([]);
const picMobileArr = ref([]);
const videoArr = ref([]);
const imgSortArr = ref([]);

const dialogStatus = ref(false);
const mode = ref('add');
const formRef = ref(null);

const delStyle = {
	cursor: 'not-allowed',
};

// 限制操作
const typeNameArr = ['挖掘机&非挖', '山工机械', '二手设备'];
const limitDel = computed(() => {
	return (value) => {
		if (value) {
			return typeNameArr.includes(value);
		} else {
			return false;
		}
	};
});

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

const getProductCateList = async () => {
	const { data: res } = await ProductApi.equipmentTypeListGet();
	if (res.code == 200) {
		list.value = res.data;
	} else {
		list.value = [];
	}
	const result = [];
	result[0] = { equipmentTypeName: '顶级', id: -1, parentId: -1 };
	result[0]['children'] = list.value;
  typeList.value = result;
};
getProductCateList();

const showDialog = (status: string, item?: any) => {
	mode.value = status;
	dialogStatus.value = true;
	picPcArr.value = [];
	picMobileArr.value = [];
	videoArr.value = [];
	imgSortArr.value = [];

	if (status == 'edit') {
		nextTick(() => {
			Object.assign(formData, item);
			if (item.content) {
				formData.content = item.content.replaceAll(
					config.editorReplaceFlag,
					config.baseFileUrl
				);
				editorContent.value = formData.content;
			}
			if (item.imgPc) {
				picPcArr.value = item.imgPc.split('|');
			}
			if (item.imgMobile) {
				picMobileArr.value = item.imgMobile.split('|');
			}
			if (item.video) {
				videoArr.value = item.video.split('|');
			}
			if (item.imgSort) {
				imgSortArr.value = item.imgSort.split('|');
			}
		});
	} else {
		resetObjValues(formData);
		formData.content = '';
		editorContent.value = '';
	}
};

const handlePcImgChange = (files) => {
	picPcArr.value = files.img;
	formData.imgPc = files.img.join('|');
};

const handleMobileImgChange = (files) => {
	picMobileArr.value = files.img;
	formData.imgMobile = files.img.join('|');
};

const handleVideoChange = (files) => {
	videoArr.value = files.img;
	formData.video = files.img.join('|');
};

const handleImgSortChange = (files) => {
	imgSortArr.value = files.img;
	formData.imgSort = files.img.join('|');
};

const handleDialogClose = () => {
	formRef.value.resetFields();
	picPcArr.value = [];
	picMobileArr.value = [];
	videoArr.value = [];
	imgSortArr.value = [];
	editorContent.value = '';
	resetObjValues(formData);
};

const editorCpnRef = ref(null);
const postFormData = () => {
	const html = editorCpnRef.value.getEditorHtml();
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
	formRef.value?.validate(async (valid) => {
		if (!valid) return;
		const { data: res } = await ProductApi.equipmentTypeSave(formData);
		if (res.code == 200) {
			if (!formData.id && mode.value == 'add') {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			dialogStatus.value = false;
			getProductCateList();
		} else if (res.code == 400) {
			ElMessage.warning(res.data);
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
		const { data: res } = await ProductApi.equipmentTypeDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getProductCateList();
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

.upload-img {
	width: 50px;
	height: 40px;
	z-index: 99;
}

.notice {
	font-size: 12px;
	color: rgb(236, 57, 57);
}

.btn-row {
	.del-btn {
		background: none;
		border: none;
		// cursor: not-allowed;
	}
}

.table-box {
	padding: 0 60px;
}
</style>
