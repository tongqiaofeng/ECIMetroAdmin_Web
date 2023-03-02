<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box flex-between text-left">
				<div class="search-left">
					<el-form inline class="search-query-form">
						<el-form-item>
							<el-input
								size="large"
								style="width: 450px"
								v-model="formQuery.keyword"
								placeholder="请输入机具名称、概述内容"
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
						增加机具
					</el-button>
				</div>
			</div>

			<div class="table-box mt-30">
				<el-table :data="list" border stripe>
					<el-table-column label="机具名称" prop="toolName" align="center" />
					<el-table-column label="图片" prop="imgUrl" align="center">
						<template #default="{ row }">
							<el-image
								:src="
									row.imgUrl
										? config.baseFileUrl + row.imgUrl.split('|')[0]
										: ''
								"
								class="upload-img"
								preview-teleported
								:preview-src-list="previewList(row.imgUrl)"
							/>
						</template>
					</el-table-column>
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

		<el-dialog
			:title="mode == 'add' ? `新增机具` : `编辑机具`"
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
				<el-form-item prop="toolName" label="机具名称：">
					<el-input
						type="text"
						size="large"
						clearable
						v-model="formData.toolName"
						placeholder="请输入机具名称"
					/>
				</el-form-item>
				<el-form-item prop="imgUrl" label="图片：">
					<UploadFile
						:fileList="picArr"
						:type="'img'"
						@fileChange="handleImgChange"
						v-if="dialogStatus"
					></UploadFile>
				</el-form-item>
				<el-form-item prop="dataUrl" label="资料地址：">
					<el-input
						type="text"
						class="input-width"
						placeholder="请填写/上传资料"
						size="large"
						v-model="dataUrl"
						@change="dataUrlInput"
						clearable
					>
						<template #append>
							<el-button @click="copyDataUrl">
								<el-icon size="18"><CopyDocument /></el-icon>
							</el-button>
							<el-button @click="selectDataFile">
								<el-icon size="18"><Upload /></el-icon>
							</el-button>
						</template>
					</el-input>
				</el-form-item>
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

		<!-- 产品选择弹窗 -->
		<SectionProductDialog
			ref="sectionProductRef"
			:title="'产品选择'"
			:list="productList"
			:status="productClickStatus"
			@confirm="getSelectedProductData"
		>
			<template #pagination>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleProductChange"
							:current-page="productFormQuery.page"
							:default-page-size="productFormQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="productFormQuery.total"
						>
						</el-pagination>
					</div>
				</div>
			</template>
		</SectionProductDialog>

		<!-- 山工选择弹窗 -->
		<SectionProductDialog
			ref="sectionIndustryRef"
			:title="'山工设备选择'"
			:list="productList"
			:status="productClickStatus"
			@confirm="getSelectedProductData"
		>
			<template #pagination>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleProductChange"
							:current-page="productFormQuery.page"
							:default-page-size="productFormQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="productFormQuery.total"
						>
						</el-pagination>
					</div>
				</div>
			</template>
		</SectionProductDialog>

		<!-- 二手设备选择弹窗 -->
		<SectionProductDialog
			ref="sectionRecycleRef"
			:title="'二手设备选择'"
			:list="productList"
			:status="productClickStatus"
			@confirm="getSelectedProductData"
		>
			<template #pagination>
				<div class="paginate-box">
					<div class="paginate-wrapper">
						<el-pagination
							@current-change="handleProductChange"
							:current-page="productFormQuery.page"
							:default-page-size="productFormQuery.pageNum"
							layout="total, prev, pager, next, jumper"
							:total="productFormQuery.total"
						>
						</el-pagination>
					</div>
				</div>
			</template>
		</SectionProductDialog>

		<!-- 删除弹窗 -->
		<DelDialog @confirm="confirmDel" :title="'删除机具'" ref="delDialogRef" />
	</div>
</template>

<script name="macheineList" lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import * as ToolApi from '@/request/api/tool';
import * as ProductApi from '@/request/api/product';
import config from '@/config/index';
import { nextTick } from 'process';
import SectionProductDialog from './components/section-product-dialog/index.vue';
import { resetObjValues } from '@/utils/utils';
import { uploadFile } from '@/request/api/api';
import useClipboard from 'vue-clipboard3';

const formQuery = reactive({
	keyword: '',
	page: 1,
	pageNum: 10,
});
const list = ref([]);
const total = ref(0);

const editorCpnRef = ref(null);
const dialogStatus = ref(false);
const mode = ref('add');
const formRef = ref(null);
const formData = reactive({
	id: '',
	toolName: '',
	imgUrl: '',
	videoUrl: '',
	productIdList: [], // 关联挖掘机id列表
	industryIdList: [], // 关联山工设备id列表
	recycleIdList: [], // 关联二手设备id列表
	dataUrl: '', // 资料
	content: '',
});
const dataUrl = ref('');
const editorContent = ref('');

const formDataRules = reactive({
	toolName: {
		required: true,
		message: '请输入机具名称',
		trigger: ['click', 'blur'],
	},
	imgUrl: { required: true, message: '请选择图片', trigger: ['click', 'blur'] },
	content: {
		required: true,
		message: '请输入内容',
		trigger: 'click',
	},
});

const picArr = ref([]);
const videoArr = ref([]);

const activeNames = ref('');

const { toClipboard } = useClipboard();

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

// 工具列表
const getToolList = async () => {
	const { data: res } = await ToolApi.toolListGet(formQuery);
	if (res.code == 200) {
		let data = res.data;
		list.value = data.list;
		total.value = data.total;
	} else {
		list.value = [];
		total.value = 0;
	}
};
getToolList();

const typeList = ref([]); // 设备类型列表
const typeNameArr = ['挖掘机&非挖', '山工设备', '二手设备'];
const productTypeId = ref(null); // 产品(挖掘机&非挖)类型id
const industryTypeId = ref(null); // 山工设备id
const recycleTypeId = ref(null); // 二手设备id

const getProductCateList = async () => {
	const { data: res } = await ProductApi.equipmentTypeListGet();
	if (res.code == 200) {
		if (res.data && res.data.length) {
			const newlist = res.data.filter((item) =>
				typeNameArr.includes(item.equipmentTypeName)
			);
			if (newlist && newlist.length) {
				newlist.forEach((item) => {
					switch (item.equipmentTypeName) {
						case '挖掘机&非挖':
							productTypeId.value = item.id;
							break;
						case '山工设备':
							industryTypeId.value = item.id;
							break;
						case '二手设备':
							recycleTypeId.value = item.id;
					}
				});
				typeList.value = newlist;
			}
		} else {
			typeList.value = [];
		}
	}
};
getProductCateList();

// 产品数据
const productFormQuery = reactive({
	page: 1,
	pageNum: 6,
	equipmentTypeId: 1, // 设备类型id
	total: 0,
});

const productClickStatus = ref(''); // 弹窗展开的值
const productList = ref([]); // 产品数据

const selectProductTable = ref([]); // 选择的产品
const selectIndustryTable = ref([]); // 选择的山工
const selectRecycleTable = ref([]); // 选择的二手设备

const sectionProductRef = ref(null);
const sectionIndustryRef = ref(null);
const sectionRecycleRef = ref(null);

const searchProduct = (status: string) => {
	productClickStatus.value = status;
	productFormQuery.page = 1;
	if (status == 'product') {
		productFormQuery.equipmentTypeId = productTypeId.value;
		sectionProductRef.value.open();
	} else if (status == 'industry') {
		productFormQuery.equipmentTypeId = industryTypeId.value;
		sectionIndustryRef.value.open();
	} else if (status == 'recycle') {
		// 二手
		productFormQuery.equipmentTypeId = recycleTypeId.value;
		sectionRecycleRef.value.open();
	}

	nextTick(() => {
		getProductList();
	});
};

const getProductList = async () => {
	const { data: res } = await ProductApi.productSearch(productFormQuery);
	if (res.code == 200) {
		let data = res.data;
		productFormQuery.total = data.total;
		productList.value = data.list;
		_setDefaultSelectedProductList(data.list);
	}
};

const handleProductChange = (page) => {
	productFormQuery.page = page;
	getProductList();
};

// 获取选择产品数据
const getSelectedProductData = (data: []) => {
	if (productClickStatus.value == 'product') {
		selectProductTable.value = data;
		sectionProductRef.value.close();
	} else if (productClickStatus.value == 'recycle') {
		selectRecycleTable.value = data;
		sectionRecycleRef.value.close();
	} else if (productClickStatus.value == 'industry') {
		selectIndustryTable.value = data;
		sectionIndustryRef.value.close();
	}
};

// 选择资料
const selectDataFile = () => {
	const input: any = document.createElement('input');
	input.setAttribute('type', 'file');
	input.onchange = function () {
		const files = this.files[0];
		if (files) {
			_uploadFile(files);
		} else {
			ElMessage.warning('请选择上传文件');
		}
	};
	input.click();
};

const showDialog = async (status: string, item?: any) => {
	mode.value = status;
	dialogStatus.value = true;
	if (status == 'edit') {
		let id = item.id;
		const { data: res } = await ToolApi.toolInfoGet(id);
		if (res.code == 200) {
			let data = res.data;
			Object.assign(formData, data);
			if (data.imgUrl) {
				picArr.value = data.imgUrl.split('|');
			}
			if (data.videoUrl) {
				videoArr.value = data.videoUrl.split('|');
			}
			if (data.content) {
				formData.content = data.content.replaceAll(
					config.editorReplaceFlag,
					config.baseFileUrl
				);
				editorContent.value = formData.content;
			}
			if (data.productList && data.productList.length) {
				selectProductTable.value = data.productList;
				sectionProductRef.value.setDefaultSelected(data.productList);
				formData.productIdList = data.productList.map((item) => item.id);
			} else {
				formData.productIdList = [];
			}

			if (data.recycleList && data.recycleList.length) {
				selectRecycleTable.value = data.recycleList;
				sectionRecycleRef.value.setDefaultSelected(data.recycleList);
				formData.recycleIdList = data.recycleList.map((item) => item.id);
			} else {
				formData.recycleIdList = [];
			}
			if (data.industryList && data.industryList.length) {
				selectIndustryTable.value = data.industryList;
				sectionIndustryRef.value.setDefaultSelected(data.industryList);
				formData.industryIdList = data.industryList.map((item) => item.id);
			} else {
				formData.industryIdList = [];
			}
			if (data.dataUrl) {
				dataUrl.value = data.dataUrl.replaceAll(
					config.editorReplaceFlag,
					config.baseFileUrl
				);
			} else {
				dataUrl.value = '';
			}
		}
	} else {
		resetObjValues(formData);
		formData.content = '';
		dataUrl.value = '';
		editorContent.value = '';
	}
};

const handleImgChange = (files) => {
	picArr.value = files.img;
	formData.imgUrl = files.img.join('|');
};

const handleVideoChange = (files) => {
	videoArr.value = files.img;
	formData.videoUrl = files.img.join('|');
};

const handleDialogClose = () => {
	formRef.value.resetFields();
	resetObjValues(formData);
	editorContent.value = '';
	dataUrl.value = '';
	picArr.value = [];
	videoArr.value = [];
	selectProductTable.value = [];
	selectIndustryTable.value = [];
	selectRecycleTable.value = [];
	activeNames.value = '';
};

const postFormData = async () => {
	if (selectProductTable.value && selectProductTable.value.length) {
		let productIds = selectProductTable.value.map((item) => item.id);
		formData.productIdList = productIds;
	} else {
		formData.productIdList = [];
	}
	if (selectIndustryTable.value && selectIndustryTable.value.length) {
		let industryIds = selectIndustryTable.value.map((item) => item.id);
		formData.industryIdList = industryIds;
	} else {
		formData.industryIdList = [];
	}
	if (selectRecycleTable.value && selectRecycleTable.value.length) {
		let recycleIds = selectRecycleTable.value.map((item) => item.id);
		formData.recycleIdList = recycleIds;
	} else {
		formData.recycleIdList = [];
	}
	if (dataUrl.value) {
		formData.dataUrl = dataUrl.value.replaceAll(
			config.baseFileUrl,
			config.editorReplaceFlag
		);
	}
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
		const { data: res } = await ToolApi.toolSave(formData);
		if (res.code == 200) {
			if (!formData.id && mode.value == 'add') {
				ElMessage.success('添加成功');
			} else {
				ElMessage.success('编辑成功');
			}
			dialogStatus.value = false;
			getToolList();
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
		const { data: res } = await ToolApi.toolDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getToolList();
		}
	}
};

const handleCurrentChange = (page: number) => {
	formQuery.page = page;
	getToolList();
	document.getElementById('container').scrollIntoView({ behavior: 'smooth' });
};

// 设置默认选中的产品数据
const _setDefaultSelectedProductList = (list: []) => {
	// 产品
	if (productClickStatus.value == 'product') {
		if (selectProductTable.value && selectProductTable.value.length) {
			let defaultSelectRows = _getDefaultSelectRows(
				list,
				selectProductTable.value
			);
			sectionProductRef.value.setDefaultSelected(defaultSelectRows);
		}
	} else if (productClickStatus.value == 'industry') {
		// 山工
		if (selectIndustryTable.value && selectIndustryTable.value.length) {
			let defaultSelectRows = _getDefaultSelectRows(
				list,
				selectIndustryTable.value
			);
			sectionIndustryRef.value.setDefaultSelected(defaultSelectRows);
		}
	} else if (productClickStatus.value == 'recycle') {
		// 二手
		if (selectRecycleTable.value && selectRecycleTable.value.length) {
			let defaultSelectRows = _getDefaultSelectRows(
				list,
				selectRecycleTable.value
			);
			sectionRecycleRef.value.setDefaultSelected(defaultSelectRows);
		}
	}
};

// 获取默认选中的行
const _getDefaultSelectRows = (list: any, oldList: any) => {
	const oldIds = oldList.map((item) => item.id);
	const selectRows = list.filter((item) => {
		return oldIds.includes(item.id);
	});
	return selectRows;
};

// 上传文件
const _uploadFile = async (file: any) => {
	const res: any = await uploadFile(file);
	let url = res.data.url;
	if (url) {
		ElMessage.success('上传成功');
		dataUrl.value = config.baseFileUrl + url;
		formData.dataUrl = dataUrl.value.replaceAll(
			config.baseFileUrl,
			config.editorReplaceFlag
		);
	} else {
		ElMessage.error('上传失败');
		formData.dataUrl = '';
		dataUrl.value = '';
	}
};

const dataUrlInput = (value) => {
  if (value) {
		formData.dataUrl = value.replaceAll(config.baseFileUrl, config.editorReplaceFlag);
	} else {
		formData.dataUrl = '';
	}
};

const copyDataUrl = async () => {
	if (dataUrl.value) {
		await toClipboard(dataUrl.value);
		ElMessage.success('复制成功');
  } else {
    ElMessage.warning('请选择文件');
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

.pos-wrapper {
	position: relative;
	display: flex;
	justify-content: space-between;
	.search-btn-option {
		width: 70px;
	}
}

.upload-img {
	width: 50px;
	height: 40px;
	z-index: 99;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

:deep(.el-collapse-item__header) {
	height: 40px;
}

.search-box {
	:deep(.el-form-item) {
		margin-bottom: 0;
	}
}
</style>
