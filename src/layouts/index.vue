<template>
	<div class="home-container" id="home-container" @click="onPageClick($event)">
		<el-container ref="homePage">
			<el-header :height="headerHeight">
				<div class="main-top-right">
					<div class="left-con">
						<img class="logo-icon" src="@/assets/imgs/logo.png" />
						<p class="title">{{ config.title }}</p>
					</div>
					<div class="right-content">
						<div class="info" @click.stop="updateUserClick">
							<span class="name">{{ userStore.adminInfo.name }}</span>
							<div class="span-img">
                <el-icon size="16" color="#1A1A1A"><ArrowDown /></el-icon>
							</div>
						</div>
						<div class="line"></div>
						<div class="logout-div" @click="loginout">
							<div class="logout-img">
								<img
									class="loginout-icon"
									src="@/assets/imgs/loginout.png"
								/>
							</div>
							<span>退出登录</span>
						</div>
					</div>
					<div class="downbtn" v-if="updateUser == 1">
						<div class="logout-div" @click="pswUpdate">
							<div class="logout-img">
								<img class="nick-icon" src="@/assets/imgs/update-psw1.png" />
							</div>
							<span>修改密码</span>
						</div>
					</div>

					<el-dialog
						class="dialog-box"
						title="修改密码"
						v-model="pswDialogVisible"
						v-if="pswDialogVisible"
						center
						width="520px"
					>
						<div>
							<el-form ref="pswRef" :model="nickData" :rules="pwdRules">
								<el-form-item
									label="旧密码："
									prop="oldPassword"
								>
									<el-input
										size="large"
										v-model="nickData.oldPassword"
										placeholder="请输入旧密码"
									></el-input>
								</el-form-item>
								<el-form-item
									label="新密码："
									prop="newPassword"
								>
									<el-input
										size="large"
										v-model="nickData.newPassword"
										placeholder="请输入新密码"
									></el-input>
								</el-form-item>
							</el-form>
						</div>
						<template #footer>
							<el-button size="large" @click="pswDialogVisible = false"
								>取 消</el-button
							>
							<el-button
								type="primary"
								size="large"
								v-preventClick
								@click="updatePsw"
								>确 定</el-button
							>
						</template>
					</el-dialog>
				</div>
			</el-header>
			<el-container>
				<el-aside width="218px" :style="defaultHeight">
					<Menu />
				</el-aside>
				<el-main
					:style="defaultHeight"
					class="home-container-main"
					id="mainContainer"
				>
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import Menu from './menu/index.vue';
import config from '@/config/index';
import * as Api from '@/request/api/api';

const userStore = useUserStore();
const router = useRouter();

const headerHeight = computed(() => 78 + 'px');

const updateUser = ref(0);
const defaultHeight = reactive({
	height: '',
});
defaultHeight.height = window.innerHeight - 78 + 'px';

// 修改昵称
const nickData = reactive({
	newNick: '',
	oldPassword: '',
	newPassword: '',
});

const pwdRules = reactive({
  oldPassword: {required: true, message: '请输入旧密码', trigger: 'change'},
  newPassword: {required: true, message: '请输入新密码', trigger: 'change'}
})
let pswDialogVisible = ref(false);
// 修改密码
const pswRef = ref();
const pswUpdate = () => {
	nickData.oldPassword = '';
	nickData.newPassword = '';
	pswDialogVisible.value = true;
};
// 确定修改
const updatePsw = () => {
	pswRef.value.validate(async (valid) => {
		if (!valid) return;
		const { data: res } = await Api.pswSave({
			oldPassword: nickData.oldPassword,
			newPassword: nickData.newPassword
		});
		if (res.code == 200) {
			ElMessage.success({
				message: '密码修改成功',
				showClose: true,
				duration: 2000,
			});
			pswDialogVisible.value = false;
      updateUser.value = 0;
      loginout();

		} else {
			ElMessage.error({
				message: res.data,
				showClose: true,
				duration: 2000,
			});
		}
	});
};

const updateUserClick = () => {
	if (updateUser.value == 1) {
		updateUser.value = 0;
	} else if (updateUser.value == 0) {
		updateUser.value = 1;
	}
};

const onPageClick = (event) => {
	let e = event || window.event;
	let className = e.target.className;
	if (
		className !== 'downbtn' &&
		className !== 'right-div' &&
		className !== 'span1' &&
		className !== 'span-img' &&
		className !== 'img-self'
	) {
		if (updateUser.value == 1) {
			updateUser.value = 0;
		}
	}
};

const loginout = () => {
	userStore.loginout();
	setTimeout(() => {
		router.replace({ path: '/' });
	}, 100);
};
</script>

<style lang="scss" scoped>
ul li {
	list-style: none;
	text-align: left;
	cursor: pointer;
}

ul li a {
	text-decoration: none;
}

.font {
	width: 57px;
	margin: 0;
	margin-right: 10px;
	font-size: 14px;
	line-height: 40px;
}

.home-container {
	height: 100%;
	position: relative;

	.main-top-right {
		width: 100%;
		height: 78px;
		position: relative;

		.left-con {
			position: absolute;
			left: 40px;
			display: flex;
			align-items: center;

			.title {
				margin: 0;
				margin-left: 15px;
				line-height: 78px;
				font-size: $header-title-size;
				font-weight: 600;
				color: $header-title-color;

			}
		}

		.line {
			width: 2px;
			height: 13px;
			margin: 0 44px;
			background-color: $font-color;
		}

		.right-content {
			position: absolute;
			top: 0;
			right: 175px;
			display: flex;
			align-items: center;
			.info {
				line-height: 78px;
				padding: 0;
				display: flex;
				align-items: center;
				cursor: pointer;

				.name {
					display: inline-block;
					font-size: 16px;
					color: $font-color;
					overflow: hidden;
					word-break: keep-all;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.span-img {
					img {
						width: 12px;
						margin-left: 10px;
					}
          :deep(.el-icon) {
            margin-left: 6px;
          }
				}
			}
		}

		.downbtn {
			width: 120px;
			padding: 0;
			line-height: 50px;
			position: absolute;
			top: 78px;
			right: 320px;
			background-color: #fff;
			border: 1px solid #ddd;
			border-radius: 10px;
			z-index: 999;
		}
		.logout-div {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
      color: $font-color;
			.logout-img {
				display: flex;
				align-items: center;
				margin-right: 5px;
				.loginout-icon {
					width: 16px;
					height: 16px;
				}
				.nick-icon {
					width: 17px;
					height: 20px;
				}
			}

			span {
				font-size: 15px;
			}
		}
	}

	.aside-ul-dad {
		padding: 30px 0 30px 10px;
		margin: 0;
		color: $font-color;

		p {
			margin: 0;
		}

		.dad-li {
			margin-top: 30px;

			.dad-li-font {
				font-size: 12px;
				color: #6f84a8;
			}

			.aside-ul-son {
				padding: 20px 0 0 0;

				.son-li {
					height: 46px;
					line-height: 46px;
					padding-right: 20px;
					display: flex;
					justify-content: space-between;

					.son-li-line {
						width: 4px;
						height: 46px;
						background-color: #0c7063;
					}

					.son-li-center {
						display: flex;

						.center-img-div {
							padding-top: 3px;
							margin-right: 10px;

							.center-img {
								width: 18px;
								height: 18px;
							}
						}

						.center-font {
							font-size: 14px;
							color: #b7bdc6;
						}
					}
				}
			}
		}
	}
	.mr-8 {
		margin-right: 8px;
	}

	.logo-icon {
		width: 90px;
		height: 32px;
		object-fit: contain;
	}
}
</style>
<style lang="scss">
#home-container {
	.el-dialog__body {
		padding-bottom: 30px;
	}

	.el-header {
		position: relative;
		width: 100%;
		height: 78px;
		padding: 0;
		background-color: $header-color;
	}

	.el-aside {
		position: absolute;
		left: 0;
		top: 78px;
		bottom: 0;
		display: block;
		background-color: $slide-color;
    z-index: 99;
	}

	.el-aside::-webkit-scrollbar {
		display: none;
	}

	.el-menu::-webkit-scrollbar {
		display: none;
	}

	.el-menu {
		border-right: none;
	}

	.el-main {
		position: absolute;
		left: 218px;
		right: 0;
		top: 78px;
		bottom: 0;
		overflow-y: scroll;
		padding: 0;
		background-color: #ececec;
	}
}
</style>
