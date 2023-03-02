<template>
	<div class="edit-wrapper">
		<div class="form-wrapper">
			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="网站配置" name="first">
					<el-form
						ref="webConfigFormRef"
						label-width="110px"
						:model="formData"
						:rules="formDataRules"
					>
						<el-form-item label="网站logo：" prop="logo">
							<UploadFile
								:fileList="formDataArr.websiteLogo"
								:type="'img'"
								@fileChange="handleWebsiteLogoChange"
							></UploadFile>
						</el-form-item>
						<el-form-item label="宣传视频：" prop="companyVideo">
							<UploadFile
								:fileList="formDataArr.companyVideoArr"
								:type="'video'"
								@fileChange="handleCompanyVideoChange"
							></UploadFile>
						</el-form-item>
						<el-form-item label="公司电话：" prop="phone">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入公司电话"
								v-model="formData.companyMsg.phoneNumber"
							/>
						</el-form-item>
						<el-form-item label="招聘热线：" prop="joinPhone">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入招聘热线"
								v-model="formData.companyMsg.joinPhone"
							/>
						</el-form-item>
						<el-form-item label="招聘热线备注：" prop="joinPhoneNote">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入招聘热线备注"
								v-model="formData.companyMsg.joinPhoneNote"
							/>
						</el-form-item>
						<el-form-item label="公司地址：" prop="location">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入公司地址"
								v-model="formData.companyMsg.address"
							/>
						</el-form-item>
						<el-form-item label="版权信息：" prop="copyright">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入版权信息"
								v-model="formData.companyMsg.copyright"
							/>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="首页轮播配置" name="fourth">
					<el-form
						ref="webConfigFormRef"
						label-width="110px"
						:model="formData"
						:rules="formDataRules"
					>
						<div class="code-table code-swiper-table">
							<div class="every1">首页轮播(pc端)</div>
							<div class="every2">首页轮播(移动端)</div>
							<div class="every3">跳转链接</div>
							<div class="every4">操作</div>
						</div>
						<div class="code-table code-swiper-table">
							<div class="every1">
								<UploadFile
									class="upload-file justify-center"
									:fileList="swiperObj.indexImgPcArr"
									:isUploadForm="swiperObj.indexImgPc ? false : true"
									:type="'img'"
									@fileChange="handleIndexImgPcChange"
								></UploadFile>
							</div>
							<div class="every2">
								<UploadFile
									class="upload-file justify-center"
									:fileList="swiperObj.indexImgMobileArr"
									:type="'img'"
									:isUploadForm="swiperObj.indexImgMobile ? false : true"
									@fileChange="handleIndexImgMobileChange"
								></UploadFile>
							</div>
							<div class="every3">
								<el-input
									size="large"
									clearable
									placeholder="请输入链接"
									v-model="swiperObj.indexLink"
								/>
							</div>
							<div class="every4">
								<div class="btn-row" style="cursor: pointer">
									<el-icon :size="23" color="#0c7063" @click="addSwiper"
										><CirclePlus
									/></el-icon>
								</div>
							</div>
						</div>
						<draggable
              v-if="swiperList && swiperList.length"
							:list="swiperList"
							item-key="index"
							animation="300"
							class="flex-wrap"
							@end="handleChangeSwiperData"
						>
							<template #item="{ element }">
								<div class="code-table code-swiper-table">
									<div class="every1">
										<UploadFile
											class="upload-file justify-center"
											:fileList="element.indexImgPcArr"
											:isUploadForm="element.indexImgPc ? false : true"
											:swiperIndex="element.index"
											:type="'img'"
											@fileChange="handleIndexImgListPcChange"
										></UploadFile>
									</div>
									<div class="every2">
										<UploadFile
											class="upload-file justify-center"
											:fileList="element.indexImgMobileArr"
											:type="'img'"
											:isUploadForm="element.indexImgMobile ? false : true"
											:swiperIndex="element.index"
											@fileChange="handleIndexImgListMobileChange"
										></UploadFile>
									</div>
									<div class="every3">
										<el-input
											size="large"
											clearable
											placeholder="请输入链接"
											v-model="element.indexLink"
										/>
									</div>
									<div class="every4">
										<div class="btn-row" style="cursor: pointer">
                      <el-icon :size="23" color="#0c7063" style="margin-right: 20px"><Rank /></el-icon>
											<el-icon
												:size="23"
												color="#0c7063"
												@click.stop="delSwiper(element.index)"
												><Delete
											/></el-icon>
										</div>
									</div>
								</div>
							</template>
						</draggable>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="客服配置" name="second">
					<el-form
						ref="webConfigFormRef"
						label-width="110px"
						:model="formData"
						:rules="formDataRules"
					>
						<el-form-item label="企点id：" prop="serviceId">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入企点id"
								v-model="formData.serviceMsg.serviceId"
							/>
						</el-form-item>
						<el-form-item label="企点代码：" prop="serviceCode">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入企点代码"
								v-model="formData.serviceMsg.serviceCode"
							/>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="微盟配置" name="third">
					<el-form
						ref="webConfigFormRef"
						label-width="110px"
						:model="formData"
						:rules="formDataRules"
					>
						<el-form-item label="客户端id：" prop="clientId">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入客户端id"
								v-model="formData.weimobMsg.clientId"
							/>
						</el-form-item>
						<el-form-item label="客户端秘钥：" prop="clientSecret">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入客户端秘钥"
								v-model="formData.weimobMsg.clientSecret"
							/>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="邮箱配置" name="five">
					<el-form
						ref="webConfigFormRef"
						label-width="110px"
						:model="formData"
						:rules="formDataRules"
					>
						<el-form-item label="发件人昵称：" prop="sendNickname">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入发件人昵称"
								v-model="formData.emailMsg.sendNickname"
							/>
						</el-form-item>
						<el-form-item label="smtp地址：" prop="sendSmtp">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入发件人smtp地址"
								v-model="formData.emailMsg.sendSmtp"
							/>
						</el-form-item>
						<el-form-item label="邮箱地址：" prop="sendAddress">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入发件人邮箱地址"
								v-model="formData.emailMsg.sendAddress"
							/>
						</el-form-item>
						<el-form-item label="验证地址：" prop="authAddress">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入验证地址(和发件人邮箱地址一样)"
								v-model="formData.emailMsg.authAddress"
							/>
						</el-form-item>
						<el-form-item label="授权密码：" prop="authPassword">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入授权密码"
								v-model="formData.emailMsg.authPassword"
							/>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="网点信息" name="six">
					<div class="code-table">
						<div class="every1">公司名</div>
						<div class="every2">公司地址</div>
						<div class="every3">联系方式</div>
						<div class="every4">操作</div>
					</div>
					<div class="code-table">
						<div class="every1">
							<el-input
								size="large"
								v-model="noteObj.companyName"
								autosize
								type="text"
								placeholder="请输入公司名称"
								clearable
							/>
						</div>
						<div class="every2">
							<el-input
								size="large"
								v-model="noteObj.address"
								autosize
								type="text"
								placeholder="请输入公司地址"
								clearable
							/>
						</div>
						<div class="every3">
							<el-input
								size="large"
								v-model="noteObj.phoneNumber"
								autosize
								type="text"
								placeholder="请输入公司联系方式"
								clearable
							/>
						</div>
						<div class="every4">
							<div class="btn-row" style="cursor: pointer">
								<el-icon :size="23" color="#0c7063" @click="addNote"
									><CirclePlus
								/></el-icon>
							</div>
						</div>
					</div>

					<div
						class="code-table"
						v-if="noteList && noteList.length"
						v-for="(item, index) in noteList"
						:key="index"
					>
						<div class="every1">
							<el-input
								size="large"
								v-model="item.companyName"
								autosize
								type="text"
								@change="handleCompanyNameChange(index, item.companyName)"
								placeholder="请输入公司名称"
								clearable
							/>
						</div>
						<div class="every2">
							<el-input
								size="large"
								v-model="item.address"
								@change="handleAddressChange(index, item.address)"
								autosize
								type="text"
								placeholder="请输入公司地址"
								clearable
							/>
						</div>
						<div class="every3">
							<el-input
								size="large"
								v-model="item.phoneNumber"
								autosize
								type="text"
								@change="handlePhoneChange(index, item.phoneNumber)"
								placeholder="请输入公司联系方式"
								clearable
							/>
						</div>
						<div class="every4">
							<div class="btn-row" style="cursor: pointer">
								<el-icon :size="23" color="#0c7063" @click="delNote(index)"
									><Delete
								/></el-icon>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="联系我们" name="seven">
					<el-form
						ref="webConfigFormRef"
						label-width="220px"
						:model="formData"
						:rules="formDataRules"
					>
						<el-form-item label="整机商城小程序appId：" prop="appId">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入整机商城小程序appId"
								v-model="formData.contactMsg.appId"
							/>
						</el-form-item>
						<el-form-item label="整机商城小程序appSecret：" prop="appSecret">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入整机商城小程序appSecret"
								v-model="formData.contactMsg.appSecret"
							/>
						</el-form-item>
						<el-form-item label="android下载地址：" prop="androidLink">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入android App下载地址"
								v-model="formData.contactMsg.androidLink"
							/>
						</el-form-item>
						<el-form-item label="ios下载地址：" prop="iosLink">
							<el-input
								class="input-width"
								size="large"
								clearable
								placeholder="请输入ios App下载地址"
								v-model="formData.contactMsg.iosLink"
							/>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
			<div class="btn-fixed-bottom">
				<el-button
					size="large"
					type="primary"
					class="post-btn"
					v-preventClick
					style="width: 150px"
					@click="postFormData"
					>提 交</el-button
				>
			</div>
		</div>
	</div>
</template>

<script name="setting" lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import * as ToolApi from '@/request/api/tool';
import TxMap from '@/utils/txMap';
import { resetObjValues, deepCopy } from '@/utils/utils';
import draggable from 'vuedraggable';

const webConfigFormRef = ref(null);

const formData: any = reactive({
	id: null,
	// 网站配置
	companyMsg: {
		websiteLogo: '',
		phoneNumber: '',
		address: '',
		copyright: '',
		companyVideo: '', // 宣传视频
		companyVideoCoverImg: '', // 宣传视频封面
		joinPhone: '', // 招聘热线
		joinPhoneNote: '', // 招聘热线备注
	},
	// 客服配置
	serviceMsg: {
		serviceId: '', // 企点id
		serviceCode: '', // 企点代码
	},
	// 微盟配置
	weimobMsg: {
		clientId: '', // 客户端id
		clientSecret: '', // 客户端秘钥
	},
	// 首页配置
	indexMsg: '',

	// 网点信息 (公司名 电话 公司地址 经纬度)
	nodeMsg: '',

	// 邮箱配置
	emailMsg: {
		sendSmtp: '', // 发件人的邮箱的 SMTP 地址
		sendAddress: '', // 邮箱地址
		authAddress: '', // 验证地址 -和发件人邮箱地址一样
		authPassword: '', // 授权密码
		sendNickname: '', // 发件人昵称
	},
	// 联系我们
	contactMsg: {
		appId: '', // 整机商城小程序appid
		appSecret: '', // 整机商城小程序appSecret
		androidLink: '', // AndroidApp下载地址
		iosLink: '', // iosApp下载链接
	},
});

const formDataArr = reactive({
	websiteLogo: [],
	indexImgPc: [],
	indexImgMobile: [],
	companyVideoArr: [],
	companyVideoCoverImgArr: [],
});

const activeName = ref('first');

const formDataRules = reactive({});

const noteObj = reactive({
	companyName: '',
	address: '',
	phoneNumber: '',
	lat: '',
	lng: '',
});

const noteList = ref([]); // 网点信息
// 轮播信息
const swiperList = ref([]);

const swiperObj = reactive({
	indexImgPc: '',
	indexImgMobile: '',
	indexLink: '',
	indexImgPcArr: [],
	indexImgMobileArr: [],
});

const handleWebsiteLogoChange = (files) => {
	formDataArr.websiteLogo = files.img;
	formData.companyMsg.websiteLogo = files.img.join('|');
};

const handleIndexImgPcChange = (files) => {
	if (files.img && files.img.length) {
		swiperObj.indexImgPcArr = files.img;
		swiperObj.indexImgPc = files.img.join('|');
	} else {
		swiperObj.indexImgPc = '';
		swiperObj.indexImgPcArr = [];
	}
};

const handleIndexImgMobileChange = (files) => {
	if (files.img && files.img.length) {
		swiperObj.indexImgMobileArr = files.img;
		swiperObj.indexImgMobile = files.img.join('|');
	} else {
		swiperObj.indexImgMobile = '';
		swiperObj.indexImgMobileArr = [];
	}
};

const handleIndexImgListPcChange = (files) => {
	let index = files.swiperIndex;
	if (files.img && files.img.length) {
		swiperList.value[index]['indexImgPc'] = files.img.join('|');
		swiperList.value[index]['indexImgPcArr'] = files.img;
	} else {
		swiperList.value[index]['indexImgPc'] = '';
		swiperList.value[index]['indexImgPcArr'] = [];
	}
};

const handleIndexImgListMobileChange = (files) => {
	let index = files.swiperIndex;
	if (files.img && files.img.length) {
		swiperList.value[index]['indexImgMobile'] = files.img.join('|');
		swiperList.value[index]['indexImgMobileArr'] = files.img;
	} else {
		swiperList.value[index]['indexImgMobile'] = '';
		swiperList.value[index]['indexImgMobileArr'] = [];
	}
};

// 添加网点
const addNote = async () => {
	if (!noteObj.companyName) {
		ElMessage.warning('请填写公司名称');
		return;
	}
	if (!noteObj.address) {
		ElMessage.warning('请填写公司地址');
		return;
	}
	const locationRes: any = await TxMap.getLal(noteObj.address);
	if (locationRes.status == 0) {
		let location = locationRes.result.location;
		noteObj.lat = location.lat;
		noteObj.lng = location.lng;
		noteList.value.push(deepCopy(noteObj));
		noteObj.lat = '';
		noteObj.lng = '';
		noteObj.companyName = '';
		noteObj.address = '';
		noteObj.phoneNumber = '';
	} else if (locationRes.status == 347) {
		ElMessage.warning('未查询到当前地址坐标!');
		noteObj.address = '';
	}
};

const delNote = (index: number) => {
	for (let i = noteList.value.length; i >= 0; i--) {
		if (i === index) {
			noteList.value.splice(i, 1);
		}
	}
};

// 添加轮播
const addSwiper = () => {
	if (!swiperObj.indexImgPc) {
		ElMessage.warning('请填写电脑端轮播');
		return;
	}
	if (!swiperObj.indexImgMobile) {
		ElMessage.warning('请填写移动端轮播');
		return;
	}

	swiperList.value.push(deepCopy(swiperObj));
	swiperObj.indexImgPc = '';
	swiperObj.indexImgMobile = '';
	swiperObj.indexLink = '';
	swiperObj.indexImgPcArr = [];
	swiperObj.indexImgMobileArr = [];
};

const delSwiper = (findIndex) => {
	if (findIndex > -1) {
		for (let i = swiperList.value.length; i >= 0; i--) {
			if (i === findIndex) {
        swiperList.value.splice(i, 1);
        _updateSwiperList();
			}
		}
	}
};

const handleAddressChange = async (index: number, address: string) => {
	if (address) {
		const locationRes: any = await TxMap.getLal(address);
		if (locationRes.status == 0) {
			let location = locationRes.result.location;
			noteList.value[index]['lat'] = location.lat;
			noteList.value[index]['lng'] = location.lng;
			noteList.value[index]['address'] = address;
		} else if (locationRes.status == 347) {
			ElMessage.warning('未查询到当前地址坐标!');
			noteList.value[index]['lat'] = '';
			noteList.value[index]['lng'] = '';
			noteList.value[index]['address'] = '';
		}
	} else {
		ElMessage.warning('请填写公司地址');
		noteList.value[index]['lat'] = '';
		noteList.value[index]['lng'] = '';
		noteList.value[index]['address'] = '';
		return;
	}
};

const handleCompanyNameChange = (index: number, value: string) => {
	noteList.value[index]['companyName'] = value;
};

const handlePhoneChange = (index: number, value: string) => {
	noteList.value[index]['phoneNumber'] = value;
};

const handleCompanyVideoChange = (files) => {
	formDataArr.companyVideoArr = files.img;
	formData.companyMsg.companyVideo = files.img.join('|');
};

const getConfigDetail = async () => {
	const { data: res } = await ToolApi.websiteConfigGet();
	let data = res.data;
	if (data.id) {
		formData.id = data.id;
	}
	formData.companyMsg.websiteLogo = data.companyMsg.websiteLogo;
	formData.companyMsg.phoneNumber = data.companyMsg.phoneNumber;
	formData.companyMsg.joinPhone = data.companyMsg.joinPhone;
	formData.companyMsg.joinPhoneNote = data.companyMsg.joinPhoneNote;
	formData.companyMsg.address = data.companyMsg.address;
	formData.companyMsg.copyright = data.companyMsg.copyright;
	formData.serviceMsg.serviceId = data.serviceMsg.serviceId;
	formData.serviceMsg.serviceCode = data.serviceMsg.serviceCode;
	formData.emailMsg.sendSmtp = data.emailMsg.sendSmtp;
	formData.emailMsg.sendAddress = data.emailMsg.sendAddress;
	formData.emailMsg.authAddress = data.emailMsg.authAddress;
	formData.emailMsg.authPassword = data.emailMsg.authPassword;
	formData.emailMsg.sendNickname = data.emailMsg.sendNickname;
	formData.weimobMsg.clientId = data.weimobMsg.clientId;
	formData.weimobMsg.clientSecret = data.weimobMsg.clientSecret;
	formData.companyMsg.companyVideo = data.companyMsg.companyVideo;
	formData.companyMsg.companyVideoCoverImg =
		data.companyMsg.companyVideoCoverImg;

	if (data.companyMsg.websiteLogo) {
		formDataArr.websiteLogo = data.companyMsg.websiteLogo.split('|');
	} else {
		formDataArr.websiteLogo = [];
	}
	if (data.companyMsg.companyVideoCoverImg) {
		formDataArr.companyVideoCoverImgArr =
			data.companyMsg.companyVideoCoverImg.split('|');
	} else {
		formDataArr.companyVideoCoverImgArr = [];
	}
	if (data.companyMsg.companyVideo) {
		formDataArr.companyVideoArr = data.companyMsg.companyVideo.split('|');
	} else {
		formDataArr.companyVideoArr = [];
	}
	if (data.indexMsg && data.indexMsg.length) {
		swiperList.value = data.indexMsg.map((ele, index) => {
			ele['index'] = index;
			return ele;
		});
	} else {
		swiperList.value = [];
	}
	if (data.nodeMsg && data.nodeMsg.length) {
		noteList.value = data.nodeMsg;
	} else {
		noteList.value = [];
	}
	formData.contactMsg.appId = data.contactMsg.appId;
	formData.contactMsg.appSecret = data.contactMsg.appSecret;
	formData.contactMsg.androidLink = data.contactMsg.androidLink;
	formData.contactMsg.iosLink = data.contactMsg.iosLink;
};
getConfigDetail();

const postFormData = () => {
	webConfigFormRef.value?.validate(async (valid) => {
		if (!valid) return;
		if (formData.emailMsg.authAddress != formData.emailMsg.sendAddress) {
			ElMessage.warning('验证地址与发件人邮箱地址不一致!');
			return;
		}
		if (noteList.value && noteList.value.length) {
			if (!_checkNoteList(noteList.value)) {
				ElMessage.warning('网点信息有空内容存在');
				return;
			}
			formData.nodeMsg = JSON.stringify(noteList.value);
		} else {
			formData.nodeMsg = '';
		}
		if (swiperList.value && swiperList.value.length) {
			formData.indexMsg = JSON.stringify(swiperList.value);
		} else {
			formData.indexMsg = '';
		}

		let data = {
			id: formData.id,
			companyMsg: JSON.stringify(formData.companyMsg),
			serviceMsg: JSON.stringify(formData.serviceMsg),
			weimobMsg: JSON.stringify(formData.weimobMsg),
			indexMsg: formData.indexMsg,
			nodeMsg: formData.nodeMsg,
			emailMsg: JSON.stringify(formData.emailMsg),
			contactMsg: JSON.stringify(formData.contactMsg),
		};
		const { data: res } = await ToolApi.websiteConfigSave(data);
		if (res.code == 200) {
			ElMessage.success('保存成功');
			resetObjValues(noteObj);
			getConfigDetail();
		} else if (res.code == 400) {
			ElMessage.warning(res.data);
		}
	});
};

const handleChangeSwiperData = () => {
  _updateSwiperList();
};

/**
 * 检查网点提交数据 是否有空
 * @param noteList
 */
const _checkNoteList = (noteList: any) => {
	let flag = true;
	for (let i = 0; i < noteList.length; i++) {
		if (noteList[i]['companyName'] == '' || noteList[i]['address'] == '') {
			flag = false;
			break;
		}
	}
	return flag;
};

const _updateSwiperList = () => {
	swiperList.value = swiperList.value.map((ele, index) => {
		ele['index'] = index;
		return ele;
	});
};
</script>

<style lang="scss" scoped>
.edit-wrapper {
	margin: 20px 20px 40px 20px;
	padding: 20px 20px 40px 20px;
	background-color: #fff;
	border-radius: 10px;
}

.btn-fixed-bottom {
	width: calc(100% - 238px);
	height: 70px;
	position: fixed;
	bottom: 30px;
	right: 30px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	z-index: 99;
	padding-right: 20px;
	.post-btn {
		position: relative;
	}
	.upload-file {
		display: flex;
		justify-content: center !important;
		:deep(.upload-wrapper .img-wrapper) {
			width: 60px;
			height: 60px;
		}
	}

	.code-swiper-table {
		width: 60% !important;
	}
}
</style>
