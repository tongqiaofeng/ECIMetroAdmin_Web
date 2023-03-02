<template>
	<div class="upload-wrapper">
		<div v-if="isUploadForm" class="upload-box">
			<form class="upload-form" enctype="multipart/form-data">
				<input
					ref="fileRef"
					@change="handleFileChange($event)"
					type="file"
					name="upload-files"
					:accept="type == 'img' ? 'image/*' : 'video/*'"
					class="upload-input"
					:multiple="multiple"
					:disabled="disabled"
				/>
				<el-icon class="upload-add-icon"><Plus /></el-icon>
			</form>
		</div>

		<draggable
			:list="fileData"
			item-key="index"
			animation="300"
			class="flex-wrap"
			@end="overImgData"
		>
			<template #item="{ element }">
				<div class="item" v-if="element">
					<div class="img-wrapper">
						<span
							v-if="isDelete"
							class="del-icon"
							@click.stop="delImage(element)"
							>x</span
						>
						<!-- 图片 -->
						<el-image
							v-if="fileType(element) == 'img'"
							preview-teleported
							:src="config.baseFileUrl + element"
							class="upload-img"
							:preview-src-list="previewImageList"
						/>

						<!-- 视频 -->
						<div v-else>
							<div class="video-wrap">
								<video
									v-if="element"
									class="upload-video"
									@click="showPlayVideoDialog(config.baseFileUrl + element)"
									:src="config.baseFileUrl + element"
								></video>
							</div>
						</div>
						<el-icon
							@click="showPlayVideoDialog(config.baseFileUrl + element)"
							v-if="fileType(element) == 'video'"
							class="video-play-icon"
							><VideoPlay :color="'#fff'"
						/></el-icon>
					</div>
				</div>
			</template>
		</draggable>
		<!-- 播放视频弹窗 -->
		<el-dialog
			:title="'视频预览'"
			width="800px"
			v-model="playVideoDialog"
			center
			@close="handlePlayDialogClose"
			style="z-index: 999"
		>
			<VideoPlayer
				ref="videoPlayRef"
				:src="playVideoUrl"
				:width="'100%'"
				:height="'450px'"
			/>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadFile } from '@/request/api/api';
import config from '@/config/index';
import draggable from 'vuedraggable';
import { nextTick } from 'process';

const props = defineProps({
	// 上传文件类型 img图片 video视频
	type: {
		type: String,
		default: 'img',
	},

	// 文件列表
	fileList: {
		required: true,
		type: Array,
		default: [],
	},
	// 是否显示删除按钮
	isDelete: {
		type: Boolean,
		default: true,
	},
	// 是否禁止上传
	disabled: {
		type: Boolean,
		default: false,
	},
	// 是否多选
	multiple: {
		type: Boolean,
		default: true,
	},
	// 文件修改索引
	swiperIndex: {
		type: Number,
		default: null,
	},
	// 是否显示上传框
	isUploadForm: {
		type: Boolean,
		default: true,
	},
});

const fileRef = ref(null);
const fileData = ref<Array<string>>([]);
const playVideoDialog = ref(false);
const playVideoUrl = ref(''); // 视频播放地址
const videoPlayRef = shallowRef();

watch(
	() => props.fileList,
	(val: any) => {
		fileData.value = val;
	},
	{ deep: true, immediate: true }
);

const emit = defineEmits(['fileChange']);

const fileType = computed(() => {
	return (filename) => {
		if (filename) {
			let suffix = filename.split('.')[1];
			let type = _checkUploadFileType(suffix.toLocaleLowerCase());
			return type;
		}
	};
});

// 预览图
const previewImageList = computed(() => {
	return fileData.value.map((item) => {
		if (item) {
			return config.baseFileUrl + item;
		}
	});
});

// 选择文件
function handleFileChange(e: any) {
	let files = e.target.files;
	if (!files) {
		return;
	} else {
		for (let i = 0; i < files.length; i++) {
			let type = _getFileType(files[i]['type']);
			if (!type) {
				ElMessage.warning('请选择图片或视频文件');
				break;
			} else {
				if (type == 'img') {
					// 图片(大于2mb,压缩上传)
					if (files[i].size / 1024 > 2050) {
						photoCompress(
							files[i],
							{
								quality: 0.7,
							},
							(base64Codes: any) => {
								let bl = base64UrlToBlob2(base64Codes);
								_uploadFile(bl);
							}
						);
					} else {
						_uploadFile(files[i]);
					}
				} else {
					// 视频
					_uploadFile(files[i]);
				}
			}
		}
	}
}

// 上传文件
const _uploadFile = async (file: any) => {
	const res: any = await uploadFile(file);
	let url = res.data.url;
	if (url) {
		ElMessage.success('文件上传成功');
		fileData.value.push(url);
		fileRef.value.value = '';
		emit('fileChange', {
			img: fileData.value.filter((el) => {
				return el != '';
			}),
			swiperIndex: props.swiperIndex,
		});
	} else {
		ElMessage.warning('上传失败');
	}
};

// 删除图片
function delImage(item: string) {
	for (let i = fileData.value.length; i >= 0; i--) {
		if (fileData.value[i] == item) {
			fileData.value.splice(i, 1);
		}
	}
	emit('fileChange', {
		img: fileData.value.filter((el) => {
			return el != '';
		}),
		swiperIndex: props.swiperIndex,
	});
}

// 拖拽移动图片后
function overImgData(data: Array<string>) {
	emit('fileChange', {
		img: fileData.value.filter((el) => {
			return el != '';
		}),
		swiperIndex: props.swiperIndex,
	});
}

const showPlayVideoDialog = (url: string) => {
	if (url) {
		playVideoUrl.value = url;
		playVideoDialog.value = true;
		nextTick(() => {
			videoPlayRef.value?.play();
		});
	} else {
		nextTick(() => {
			videoPlayRef.value?.pause();
		});
	}
};

const handlePlayDialogClose = () => {
	playVideoUrl.value = '';
};

// 压缩图片
function photoCompress(file: any, obj: any, callback: any) {
	let ready = new FileReader();
	ready.readAsDataURL(file);
	ready.onload = (event: any) => {
		let res = event.target.result;
		canvasDataURL2(res, obj, callback);
	};
}

// 图片转base64
function canvasDataURL2(path: any, obj: any, callback: any) {
	let img: any = new Image();
	img.src = path;
	img.onload = function () {
		let that = this;
		let w = that.width,
			h = that.height,
			scale = w / h;
		w = obj.width || w;
		h = obj.height || w / scale;
		let quality = 0.7;
		let canvas = document.createElement('canvas');
		let ctx: any = canvas.getContext('2d');

		// 创建节点属性
		let anw = document.createAttribute('width');
		anw.nodeValue = w;
		let anh = document.createAttribute('height');
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, w, h);
		ctx.drawImage(that, 0, 0, w, h);
		if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
			quality = obj.quality;
		}
		let base64 = canvas.toDataURL('image/jpeg', quality);
		callback(base64);
	};
}

function base64UrlToBlob2(urlData: any) {
	let arr = urlData.split(',');
	let mime = arr[0].match(/:(.*?);/)[1];
	let bstr = window.atob(arr[1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	let filename = Date.parse(new Date() + '') + '.jpg';
	return new File([u8arr], filename, {
		type: mime,
	});
}

// 获取上传文件类型
const _getFileType = (type: string) => {
	if (!type) return;
	const suffix = type.split('/')[1];
	return _checkUploadFileType(suffix);
};

// 检查文件类型是否是图片或视频
const _checkUploadFileType = (suffix: string) => {
	let imgArr = [
		'jpg',
		'png',
		'gif',
		'jpeg',
		'tiff',
		'tif',
		'bmp',
		'jfif',
		'JPG',
		'PNG',
	];
	let videoArr = [
		'avi',
		'wmv',
		'mpg',
		'mpeg',
		'3gp',
		'mov',
		'mp4',
		'rmvb',
		'mkv',
		'dv',
		'mov',
		'mod',
		'ogg',
	];
	if (imgArr.includes(suffix)) {
		return 'img';
	} else if (videoArr.includes(suffix)) {
		return 'video';
	}
	return null;
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
	width: 100%;
	position: relative;
	display: flex;

	.upload-box {
		width: 100px;
		height: 100px;
		margin-right: 10px;
		position: relative;
		border: 1px solid #ddd;
		border-radius: 5px;
		display: flex;
		.upload-form {
			width: 100px;
			height: 100px;
		}

		.upload-add-icon {
			width: 15px;
			height: 15px;
			position: absolute;
			top: 42px;
			left: 42px;
			z-index: 1;
		}

		.upload-input {
			position: absolute;
			display: block;
			width: 100px;
			height: 100px;
			opacity: 0;
			cursor: pointer;
			z-index: 999;
		}
	}

	.img-wrapper {
		width: 100px;
		height: 100px;
		margin-right: 10px;
		margin-bottom: 10px;
		position: relative;
		cursor: pointer;

		.del-icon {
			width: 15px;
			height: 15px;
			position: absolute;
			top: 1px;
			right: 1px;
			text-align: center;
			line-height: 0.9;
			background-color: rgb(221, 221, 221);
			color: rgb(255, 255, 255);
			border: 1px solid rgb(221, 221, 221);
			border-radius: 50%;
			z-index: 99;
			cursor: pointer;
		}
		.video-play-icon {
			font-size: 30px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
		}

		.upload-img,
		.upload-video {
			width: 100px;
			height: 100px;
			border-radius: 5px;
			object-fit: cover;
		}
	}
}

.flex-wrap {
	display: flex;
	flex-wrap: wrap;
}

.video-wrap {
	position: relative;
	.upload-video {
		position: relative;
	}
}
</style>
