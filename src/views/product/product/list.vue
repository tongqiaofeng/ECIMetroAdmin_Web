<template>
	<div id="container">
		<div class="wrapper">
			<div class="search-box">
				<div class="search-left">
					<el-form :model="formQuery" inline class="stock-search-form">
						<el-form-item label="产品类型：" prop="equipmentTypeId">
							<el-select
								size="large"
								v-model="formQuery.equipmentTypeId"
								@change="selectType"
							>
								<el-option
									v-for="(item, index) in typeList"
									:key="index"
									:label="item.equipmentTypeName"
									:value="item.id"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName != '二手设备'"
							prop="series"
							label="系列："
						>
							<el-select
								v-model="formQuery.series"
								size="large"
								clearable
								placeholder="请选择系列"
							>
								<el-option
									v-for="(item, index) in seriesList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName != '二手设备'"
							label="设备应用场景："
							prop="applicationScene"
						>
							<el-select
								size="large"
								clearable
								v-model="formQuery.applicationScene"
								placeholder="请选择设备应用场景"
							>
								<el-option
									v-for="(item, index) in demandObj.applicationSceneList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName != '二手设备'"
							label="作业项目："
							prop="workItems"
						>
							<el-select
								size="large"
								clearable
								v-model="formQuery.workItems"
								placeholder="请选择作业项目"
							>
								<el-option
									v-for="(item, index) in demandObj.workItemsList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item
							prop="bucketCapacityDemand"
							label="斗容需求："
							class="flex-norwrap"
							v-if="equipmentTypeName != '二手设备'"
						>
							<el-select
								size="large"
								v-model="formQuery.bucketCapacityDemand"
								placeholder="请选择斗容需求"
								clearable
							>
								<el-option
									v-for="(item, index) in demandObj.bucketCapacityDemandList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
							<span class="font-tip">m³</span>
						</el-form-item>
						<el-form-item
							prop="maxReach"
							label="最大挖掘深度："
							class="flex-norwrap"
							v-if="equipmentTypeName != '二手设备'"
						>
							<el-select
								size="large"
								v-model="formQuery.maxReach"
								placeholder="请选择挖掘深度"
								clearable
							>
								<el-option
									v-for="(item, index) in demandObj.maxReachRangeList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
							<span class="font-tip">mm</span>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							prop="recyclePrice"
							label="价格："
						>
							<el-select
								v-model="recyclePrice"
								size="large"
								placeholder="请选择二手设备价格"
								clearable
								@change="selectRecyclePrice"
							>
								<el-option
									v-for="(p, pIndex) in recycelPriceList"
									:key="pIndex"
									:label="p"
									:value="p"
								></el-option>
							</el-select>
							<span class="font-tip">￥</span>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							prop="recycleExFactoryYear"
							label="出厂年份："
						>
							<el-date-picker
								v-model="formQuery.recycleExFactoryYear"
								type="year"
								size="large"
								placeholder="请选择二手设备出厂年份"
								format="YYYY"
								value-format="YYYY"
								clearable
							/>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							label="工作小时数："
						>
							<el-select
								v-model="recycleWorkHours"
								size="large"
								placeholder="请选择二手设备工作小时数"
								clearable
								@change="selectWorkHours"
							>
								<el-option
									v-for="(hour, hourIndex) in recycleWorkHoursList"
									:key="hourIndex"
									:label="hour"
									:value="hour"
								></el-option>
							</el-select>
							<span class="font-tip">h</span>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							label="设备吨位："
						>
							<el-select
								v-model="recycleEquipmentTon"
								size="large"
								placeholder="请选择二手设备吨位"
								clearable
								@change="selectEquopmentTon"
							>
								<el-option
									v-for="(hour, hourIndex) in recycleEquipmentTonList"
									:key="hourIndex"
									:label="hour"
									:value="hour"
								></el-option>
							</el-select>
							<span class="font-tip">吨</span>
						</el-form-item>
						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							prop="recycleSellState"
							label="设备销售状态："
						>
							<el-select
								size="large"
								clearable
								v-model="formQuery.recycleSellState"
								placeholder="请选择销售状态"
							>
								<el-option :label="'待销售'" :value="0"></el-option>
								<el-option :label="'已销售'" :value="1"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item
							v-if="equipmentTypeName == '二手设备'"
							prop="recycleArea"
							label="设备所在地："
						>
							<elui-china-area-dht
								:leave="2"
								size="large"
								v-model="areaValue"
								clearable
								placeholder="请选择所在地"
								@change="selectArea"
							></elui-china-area-dht>
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
					<el-button type="primary" @click="goProductEdit('add')" size="large">
						<span class="add-style"> <span>+</span> </span>
						增加产品
					</el-button>
				</div>
			</div>

			<div class="table-box mt-20">
				<el-table :data="list" border stripe style="width: 100%">
					<el-table-column
						label="型号"
						width="180"
						prop="model"
						align="center"
					/>
					<el-table-column label="图片" width="180" align="center">
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
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="厂商零售价"
						prop="retailPrice"
						width="140"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ price(row.retailPrice) }}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="系列"
						width="200"
						prop="series"
						align="center"
					/>
					<el-table-column label="排序" align="center">
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
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="应用场景"
						prop="applicationScene"
						width="200"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="!row.applicationScene">暂无</div>
							<div v-else>
								<el-tag
									type="info"
									class="ml-5"
									v-for="(tag, tagIndex) in row.applicationScene.split('|')"
									:key="tagIndex"
									>{{ tag }}</el-tag
								>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="斗容需求"
						prop="bucketCapacityDemand"
						align="center"
						width="200"
					>
						<template #default="{ row }">
							<span>{{
								row.bucketCapacityDemand ? row.bucketCapacityDemand : '暂无'
							}}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="最大挖掘深度"
						prop="maxReachRange"
						align="center"
						width="200"
					>
						<template #default="{ row }">
							<span>{{ row.maxReachRange ? row.maxReachRange : '暂无' }}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName != '二手设备'"
						label="作业项目"
						width="180"
						prop="workItems"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="!row.workItems">暂无</div>
							<div v-else>
								<el-tag
									type="info"
									class="ml-5"
									v-for="(tag, tagIndex) in row.workItems.split('|')"
									:key="tagIndex"
									>{{ tag }}</el-tag
								>
							</div>
						</template>
					</el-table-column>

					<!-- 二手设备 -->
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="设备编号"
						prop="recycleEquipmentNo"
						align="center"
					/>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="设备报价"
						prop="recyclePrice"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ price(row.recyclePrice) }}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="排序"
						align="center"
					>
						<template #default="{ row }">
							<el-input
								type="text"
								v-model="row.sort"
								:input-style="inputStyle"
								:min="0"
								oninput="value=value.replace(/[^\d]/g,'')"
								@blur="handleSortChange(row)"
							/>
						</template>
					</el-table-column>

					<el-table-column
						label="设备销售状态"
						v-if="equipmentTypeName == '二手设备'"
						prop="recycleSellState"
						align="center"
					>
						<template #default="{ row }">
							<el-tag type="warning" v-if="row.recycleSellState == 0"
								>待销售</el-tag
							>
							<el-tag type="success" v-if="row.recycleSellState == 1"
								>已销售</el-tag
							>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="出厂年份"
						prop="recycleExFactoryYear"
						align="center"
					>
						<template #default="{ row }">
							<span v-if="row.recycleExFactoryYear">{{
								row.recycleExFactoryYear
							}}</span>
							<span v-else>暂无</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="付款方式"
						prop="recyclePaymentType"
						align="center"
					>
						<template #default="{ row }">
							<span v-if="row.recyclePaymentType">{{
								row.recyclePaymentType
							}}</span>
							<span v-else>暂无</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="设备吨位"
						prop="recycleEquipmentTon"
						align="center"
					/>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="工作小时数"
						prop="recycleWorkHours"
						align="center"
					/>
					<el-table-column
						v-if="equipmentTypeName == '二手设备'"
						label="所在地"
						prop="recycleArea"
						align="center"
					/>
					<el-table-column
						label="操作"
						fixed="right"
						align="center"
						width="250"
					>
						<template #default="{ row }">
							<div class="btn-row">
								<div class="btn" @click="goProductEdit('edit', row.id)">
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

		<!-- 删除弹窗 -->
		<DelDialog
			@confirm="confirmDel"
			:title="'删除产品'"
			:desc="'确定删除该产品？删除后不可恢复'"
			ref="delDialogRef"
		/>
	</div>
</template>

<script setup lang="ts" name="productList">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as ProductApi from '@/request/api/product';
import config from '@/config/index';
import { EluiChinaAreaDht } from 'elui-china-area-dht';
import { useSaveStore } from '@/store/saveStore';
import { ElMessage } from 'element-plus';
import _ from 'lodash';

const saveStore = useSaveStore();
const router = useRouter();
const equipmentTypeName = ref('挖掘机&非挖'); // 类型名
const formQuery = reactive({
	page: 1,
	pageNum: 10,
	equipmentTypeId: '', // 设备类型id
	applicationScene: '', // 应用场景
	bucketCapacityDemand: '', // 斗容需求范围
	maxReach: '', // 地面最大挖掘半径范围
	series: '', //挖掘机系列
	workItems: '', // 作业项目
	recycleArea: '', // 二手设备-所在地
	recycleExFactoryYear: '', // 二手设备-出厂年份
	recycleSellState: null, // 二手设备-销售状态
	recycleWorkHoursMin: null,
	recycleWorkHoursMax: null, // 二手设备工作小时数
	recycleEquipmentTonMin: null, // 二手设备吨级最小
	recycleEquipmentTonMax: null,
	recyclePriceMin: '',
	recyclePriceMax: '',
	equipmentTypeName: '',
});

const recycleWorkHoursList = [
	'0-1000',
	'1000-2000',
	'2000-3000',
	'3000-4000',
	'4000-5000',
	'5000以上',
];
const recycleEquipmentTonList = ['0-10', '10-20', '20-30', '30以上'];

const recycelPriceList = [
	'面议',
	'30万以下',
	'30-50万',
	'50-80万',
	'80-100万',
	'100-200万',
	'200万以上',
];

const recycleWorkHours = ref(''); // 二手设备 工作小时数
const recycleEquipmentTon = ref(''); // 二手设备吨位
const recyclePrice = ref(''); // 二手设备价格

// 需求数据
const demandObj = reactive({
	applicationSceneList: [], // 设备应用场景列表
	bucketCapacityDemandList: [], // 斗容需求范围列表
	maxReachRangeList: [], // 地面最大挖掘半径范围列表
	workItemsList: [], // 作业项目列表
});

const list = ref([]);
const total = ref(0);
const typeList = ref([]);
const seriesList = ref([]);
const filterDialog = ref(false);
const areaValue = ref([]); //'510000', '510100'

const num = 0;
const inputStyle: any = {
	textAlign: 'center',
};

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

const price = computed(() => {
	return (value) => {
		if (value) {
			if (value != '面议') {
				if (!isNaN(Number(value))) {
					// let price = value / 10000;
					return value + '万';
				}
			}
			return value;
		}
		return value;
	};
});

// 设备类型列表
const typeNameArr = ['挖掘机&非挖', '山工机械', '二手设备'];
const getProductCateList = async () => {
	const { data: res } = await ProductApi.equipmentTypeListGet();
	if (res.code == 200) {
		if (res.data && res.data.length) {
			const newlist = res.data.filter((item) =>
				typeNameArr.includes(item.equipmentTypeName)
			);
			if (newlist && newlist.length) {
				if (!formQuery.equipmentTypeId) {
					equipmentTypeName.value = newlist[0]['equipmentTypeName'];
					formQuery.equipmentTypeId = newlist[0]['id'];
				}
				typeList.value = newlist;
			}
		} else {
			typeList.value = [];
		}
		const productSearchParams: any = saveStore.productSearchParams;
		if (productSearchParams) {
			let equipmentTypeId = productSearchParams.equipmentTypeId;
			if (equipmentTypeId) {
				equipmentTypeName.value = productSearchParams.equipmentTypeName;
				Object.assign(formQuery, productSearchParams);
				recycleWorkHours.value = productSearchParams.recycleWorkHours;
				recycleEquipmentTon.value = productSearchParams.recycleEquipmentTon;
				recyclePrice.value = productSearchParams.recyclePrice;
				areaValue.value = productSearchParams.areaValue;
			}
		}
		getSeriesList();
		getDemandList();
		getProductList();
	}
};
getProductCateList();

// 产品列表
const getProductList = async () => {
	const { data: res } = await ProductApi.productSearch(formQuery);
	if (res.code == 200) {
		let data = res.data;
		total.value = data.total;
		// list.value = data.list;
		list.value = data.list.map((item) => {
			return item;
		});
	}
};

// 需求列表
const getDemandList = async () => {
	const { data: res } = await ProductApi.allDemandGet(
		formQuery.equipmentTypeId
	);
	let data = res.data;
	demandObj.applicationSceneList = data.applicationSceneList;
  demandObj.bucketCapacityDemandList = data.bucketCapacityDemandList;
  demandObj.maxReachRangeList = data.maxReachRangeList.map((item, index) => {
    if (item) {
      return item;
    }
	});
	demandObj.workItemsList = data.workItemsList;
};

// 系列列表
const getSeriesList = async () => {
	const { data: res } = await ProductApi.seriesListGet(
		formQuery.equipmentTypeId
	);
	if (res.data) {
		seriesList.value = res.data;
	} else {
		seriesList.value = [];
	}
};

// 选择类型
const selectType = (value) => {
	const typeTarget = typeList.value.find((item) => item.id == value);
	if (typeTarget) {
		saveStore.setProductSearchParams({
			equipmentTypeId: typeTarget.id,
			equipmentTypeName: typeTarget.equipmentTypeName,
		});
		equipmentTypeName.value = typeTarget.equipmentTypeName;
		formQuery.page = 1;
		formQuery.applicationScene = '';
		formQuery.bucketCapacityDemand = '';
		formQuery.maxReach = '';
		formQuery.series = '';
		formQuery.workItems = '';
		formQuery.recycleArea = '';
		formQuery.recycleExFactoryYear = '';
		formQuery.recycleSellState = null;
		formQuery.recycleWorkHoursMin = null;
		formQuery.recycleWorkHoursMax = null;
		formQuery.recycleEquipmentTonMin = null;
		formQuery.recycleEquipmentTonMax = null;
		formQuery.recyclePriceMin = '';
		formQuery.recyclePriceMax = '';
		formQuery.equipmentTypeName = '';
		recycleWorkHours.value = '';
		recycleEquipmentTon.value = '';
		recyclePrice.value = '';
		areaValue.value = [];
		getProductList();
		getSeriesList();
		getDemandList();
	}
};

// 选择二手设备工作小时数
const selectWorkHours = (value) => {
	if (value) {
		if (value.indexOf('以上') == -1) {
			let hourArr = value.split('-');
			formQuery.recycleWorkHoursMin = Number(hourArr[0]);
			formQuery.recycleWorkHoursMax = Number(hourArr[1]);
		} else {
			let hourArr = value.split('以上');
			formQuery.recycleWorkHoursMin = Number(hourArr[0]);
		}
	} else {
		formQuery.recycleWorkHoursMin = null;
		formQuery.recycleWorkHoursMax = null;
	}
};

// 选择二手设备吨位
const selectEquopmentTon = (value) => {
	if (value) {
		if (value.indexOf('以上') == -1) {
			let arr = value.split('-');
			formQuery.recycleEquipmentTonMin = Number(arr[0]);
			formQuery.recycleEquipmentTonMax = Number(arr[1]);
		} else {
			let arr = value.split('以上');
			formQuery.recycleEquipmentTonMin = Number(arr[0]);
		}
	} else {
		formQuery.recycleEquipmentTonMin = null;
		formQuery.recycleEquipmentTonMax = null;
	}
};

const goProductEdit = (status: string, id?: number) => {
	formQuery.equipmentTypeName = equipmentTypeName.value;
	let data: any = _.cloneDeep(formQuery);
	data.recycleWorkHours = recycleWorkHours.value;
	data.recycleEquipmentTon = recycleEquipmentTon.value;
	data.recyclePrice = recyclePrice.value;
	data.areaValue = areaValue.value;
	saveStore.setProductSearchParams(data);
	if (status == 'add') {
		router.push({ path: '/product/list/edit' });
	} else if (status == 'edit' && id) {
		router.push({ path: '/product/list/edit', query: { id } });
	}
};

const handleCurrentChange = (page: number) => {
	formQuery.page = page;
	getProductList();
	filterDialog.value = false;
	document.getElementById('container').scrollIntoView({ behavior: 'smooth' });

	saveStore.setProductSearchParams({
		equipmentTypeId: formQuery.equipmentTypeId,
		equipmentTypeName: equipmentTypeName.value,
		page: page,
	});
};

// 选择省市地区
const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;
const selectArea = (e) => {
	if (!e) {
		formQuery.recycleArea = null;
		areaValue.value = null;
	} else {
		const oneObj = chinaData[e[0]];
		const twoObj = chinaData[e[1]];
		const area = `${oneObj.label}(${twoObj.label})`;
		formQuery.recycleArea = area;
	}
};

// 选择二手设备价格
const selectRecyclePrice = (value) => {
	if (value) {
		// 非面议
		if (value != '面议') {
			let f = 1;
			if (value == '30万以下') {
				formQuery.recyclePriceMax = String(30 * f);
				formQuery.recyclePriceMin = '';
			} else if (value == '200万以上') {
				formQuery.recyclePriceMin = String(200 * f);
				formQuery.recyclePriceMax = '';
			} else {
				let str = value.replace('万', '');
				let arr = str.split('-');
				formQuery.recyclePriceMin = String(arr[0] * f);
				formQuery.recyclePriceMax = String(arr[1] * f);
			}
		} else {
			formQuery.recyclePriceMin = '面议';
			formQuery.recyclePriceMax = '面议';
		}
	} else {
		formQuery.recyclePriceMax = '';
		formQuery.recyclePriceMin = '';
	}
};

// 删除
const delDialogRef = ref(null);
const showDelDialog = (id: number) => {
	delDialogRef.value.open(id);
};

const confirmDel = async (delId) => {
	if (delId) {
		const { data: res } = await ProductApi.productDel(delId);
		if (res.code == 200) {
			ElMessage.success('删除成功');
			delDialogRef.value.close();
			getProductList();
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
	const { data: res } = await ProductApi.productSortSave(params);
	if (res.code == 200) {
		getProductList();
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
	width: 40px;
	height: 40px;
	z-index: 999;
}

.ml-5 {
	margin-left: 5px;
}

.flex-norwrap {
	:deep(.el-form-item__content) {
		display: flex;
		flex-wrap: nowrap !important;
	}
}
</style>
