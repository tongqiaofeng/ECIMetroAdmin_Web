<template>
	<div class="tinymce-boxz">
		<Editor v-model="content" :init="tiny.init" />
	</div>
</template>

<script setup name="TEditor" lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { reactive, ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import config from '@/config/index';
import { uploadFile } from '@/request/api/api';
import { getUploadFileType } from '@/utils/utils';

import '/public/static/tinymce/tinymce.js';
import '/public/static/tinymce/themes/silver/theme';
import '/public/static/tinymce/icons/default/icons.js';

import '/public/static/tinymce/plugins/advlist/plugin';
import '/public/static/tinymce/plugins/anchor/plugin';
import '/public/static/tinymce/plugins/autolink/plugin';
import '/public/static/tinymce/plugins/autoresize/plugin';
import '/public/static/tinymce/plugins/bbcode/plugin';
import '/public/static/tinymce/plugins/charmap/plugin';
import '/public/static/tinymce/plugins/code/plugin';
import '/public/static/tinymce/plugins/codesample/plugin';
import '/public/static/tinymce/plugins/colorpicker/plugin';
import '/public/static/tinymce/plugins/contextmenu/plugin';
import '/public/static/tinymce/plugins/directionality/plugin';
import '/public/static/tinymce/plugins/emoticons/plugin';
import '/public/static/tinymce/plugins/fullpage/plugin';
import '/public/static/tinymce/plugins/fullscreen/plugin';
import '/public/static/tinymce/plugins/help/plugin';
import '/public/static/tinymce/plugins/hr/plugin';
import '/public/static/tinymce/plugins/image/plugin';
import '/public/static/tinymce/plugins/imagetools/plugin';
import '/public/static/tinymce/plugins/importcss/plugin';
import '/public/static/tinymce/plugins/insertdatetime/plugin';
import '/public/static/tinymce/plugins/legacyoutput/plugin';
import '/public/static/tinymce/plugins/link/plugin';
import '/public/static/tinymce/plugins/lists/plugin';
import '/public/static/tinymce/plugins/media/plugin';
import '/public/static/tinymce/plugins/nonbreaking/plugin';
import '/public/static/tinymce/plugins/noneditable/plugin';
import '/public/static/tinymce/plugins/paste/plugin';
import '/public/static/tinymce/plugins/preview/plugin';
import '/public/static/tinymce/plugins/print/plugin';
import '/public/static/tinymce/plugins/quickbars/plugin';
import '/public/static/tinymce/plugins/save/plugin';
import '/public/static/tinymce/plugins/searchreplace/plugin';
import '/public/static/tinymce/plugins/spellchecker/plugin';
import '/public/static/tinymce/plugins/tabfocus/plugin';
import '/public/static/tinymce/plugins/table/plugin';
import '/public/static/tinymce/plugins/template/plugin';
import '/public/static/tinymce/plugins/textcolor/plugin';
import '/public/static/tinymce/plugins/textpattern/plugin';
import '/public/static/tinymce/plugins/toc/plugin';
import '/public/static/tinymce/plugins/visualblocks/plugin';
import '/public/static/tinymce/plugins/visualchars/plugin';
import '/public/static/tinymce/plugins/wordcount/plugin';
import '/public/static/tinymce/plugins/pagebreak/plugin';
import '/public/static/tinymce/plugins/emoticons/js/emojis.js';

const content = ref('');

const props = defineProps({
	content: {
		type: String,
		default: '',
	},
});

watch(
	() => props.content,
	(value) => {
		content.value = value;
	},
	{
		deep: true,
		immediate: true,
	}
);

onMounted(() => {
	Editor.props.init({});
});

const tiny = reactive({
	apiKey: 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc',
	init: {
		language: 'zh_CN',
		placeholder: '???????????????',
		min_width: 320,
		min_height: 550,
		max_height: 550,
		autoresize_min_height: 550,
		autoresize_max_height: 550,
		fontsize_formats:
			'12px 14px 15px 16px 17px 18px 20px 24px 36px 48px 56px 72px',
		language_url: config.assetsUrl + '/static/tinymce/langs/zh_CN.js',
		skin_url: config.assetsUrl + '/static/tinymce/skins/ui/oxide',
		content_css:
			config.assetsUrl + '/static/tinymce/skins/content/default/content.css',
		resize: 'both', //??????????????????????????????false-???,true-????????????'both'-???????????????????????????
		branding: false,
		default_link_target: '_blank',
		relative_urls: false,
    remove_script_host: false,
    convert_urls: false, // ??????????????????
		link_list: [],
		font_formats:
			'????????????=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;????????????=PingFang SC,Microsoft YaHei,sans-serif;??????=simsun,serif;?????????=FangSong,serif;??????=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //????????????
		plugins:
			'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern emoticons', //???????????? axupimgs indent2em
		toolbar: [
			'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ',
			'styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter',
		],
		menubar: true, // ?????????????????????
		images_upload_credentials: true,
		paste_data_images: true, //?????????????????????
		file_picker_types: 'file image media',
		images_upload_handler: (blobInfo, success, failure) => {
			let files = blobInfo.blob();
			if (files) {
				const _uploadFile = async (file: any) => {
					const res: any = await uploadFile(file);
					if (res.errno == 1) {
						ElMessage.warning(res.message);
						failure(res.message);
					} else {
						let url = res.data.url;
						ElMessage.success('????????????');
						success(config.baseFileUrl + url);
					}
				};
				_uploadFile(files);
			}
		},
		// ?????????????????????
		file_picker_callback: (callback, value, meta) => {
			if (meta.filetype == 'media') {
				const input: any = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'video/*');
				input.onchange = function () {
					const files = this.files[0];
					if (files) {
						const fileType = files.type.split('/')[1];
						const type = getUploadFileType(fileType);
						if (type !== 'video') {
							ElMessage.warning('???????????????????????????');
							return;
						} else {
							const _uploadFile = async (file: any) => {
								const res: any = await uploadFile(file);
								if (res.errno == 1) {
									ElMessage.warning(res.message);
								} else {
									let url = res.data.url;
									ElMessage.success('????????????');
									callback(config.baseFileUrl + url, { title: file.name }); //???url???????????????????????????
								}
							};
							_uploadFile(files);
						}
					}
				};
				input.click(); // ????????????
			} else if (meta.filetype == 'file' || meta.filetype == 'image') {
				// ????????????
				const input: any = document.createElement('input');
				input.setAttribute('type', 'file');
				input.onchange = function () {
					const files = this.files[0];
					if (files) {
						const _uploadFile = async (file: any) => {
							const res: any = await uploadFile(file);
							if (res.errno == 1) {
								ElMessage.warning(res.message);
							} else {
								let url = res.data.url;
								ElMessage.success('????????????');
								callback(config.baseFileUrl + url);
							}
						};
						_uploadFile(files);
					}
				};
				input.click(); // ????????????
			}
		},

		// media_url_resolver: function (data, resolve) {
		// 	try {
		// 		let videoUri = encodeURI(data.url);
		// 		let embedHtml = `<p>
		//       <span
		//         class="mce-object mce-object-video"
		//         data-mce-selected="1"
		//         data-mce-object="video"
		//         data-mce-p-width="100%"
		//         data-mce-p-height="auto"
		//         data-mce-p-controls="controls"
		//         data-mce-p-controlslist="nodownload"
		//         data-mce-p-allowfullscreen="true"
		//         data-mce-p-src=${videoUri} >
		//         <video src=${data.url} width="100%"
		//           height="auto" controls="controls"
		//           controlslist="nodownload"
		//           webkit-playsinline="true"
		//           x-webkit-airplay="allow"
		//         x5-video-player-type="h5"
		//         x5-video-player-fullscreen="true"
		//         x5-video-orientation="portraint"
		//         >
		//         </video>
		//       </span>
		//     </p>`;
		// 		resolve({ html: embedHtml });
		// 	} catch (e) {
		// 		resolve({ html: '' });
		// 	}
		// },
	},
});

const getEditorHtml = () => {
	return content.value;
};

const clearEditorContent = () => {
	content.value = '';
};

defineExpose({
	getEditorHtml,
	clearEditorContent,
});
</script>

<style scoped>
.tinymce-boxz > textarea {
	display: none;
}
</style>
<style>
.tox-notifications-container .tox-notification--warning {
	display: none !important;
}

.tox.tox-tinymce {
	max-width: 100%;
}
</style>
