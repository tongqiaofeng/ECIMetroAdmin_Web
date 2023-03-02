<template>
	<div class="login-container">
		<div class="login-header">
			<img class="logo-icon" src="../../assets/imgs/logo.png" />
			<p class="logo-title">{{ config.title }}</p>
		</div>
		<div class="login-form-wrapper">
			<div class="login-main">
				<div>
					<span class="font">登录</span>
				</div>
				<div class="login-form">
					<div class="form-item-inline">
						<p>
							<img src="@/assets/imgs/user1.png" class="icon" />
						</p>
						<input
							class="form-item-input"
							type="text"
							v-model="loginForm.employeeNumber"
							placeholder="请输入用户名"
							autofocus="autofocus"
							tabindex="1"
							auto-complete="on"
						/>
					</div>
					<div class="form-item-inline">
						<p>
							<img src="@/assets/imgs/psw1.png" class="icon" />
						</p>
						<input
							class="form-item-input"
							:type="!showPwd ? 'password' : 'text'"
							v-model="loginForm.password"
							placeholder="请输入密码"
							prefix-icon="el-icon-lock"
							tabindex="2"
							auto-complete="on"
						/>
						<p>
							<img
								@click="changePwdStatus"
								v-if="!showPwd"
								src="@/assets/imgs/close_view.png"
								class="eye-icon eye-close-icon icon"
							/>
							<img
								@click="changePwdStatus"
								v-else
								src="@/assets/imgs/view.png"
								class="eye-icon eye-open-icon icon"
							/>
						</p>
					</div>
					<div class="form-item-inline">
						<input
							class="form-item-input verify-input"
							type="text"
							v-model="loginForm.verifyCode"
							placeholder="请输入验证码"
							prefix-icon="el-icon-lock"
							tabindex="2"
							auto-complete="on"
						/>
						<img
							@click="verifyCode"
							class="verify-img"
							:src="verifyImg"
							alt=""
						/>
					</div>
				</div>
				<div class="login-button-wrapper">
					<button @click="login" class="login-btn">登录</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import config from '@/config/index';
import * as Api from '@/request/api/api';

const loginForm = reactive({
	employeeNumber: '',
	password: '',
	uuid: '',
	verifyCode: '',
});
const verifyImg = ref('');
const showPwd = ref(false);
const userStore = useUserStore();
const router = useRouter();

const verifyCode = async () => {
	const { data: res } = await Api.verifyCodeGet();
	if (res.code == 200) {
		const { uuid, img } = res.data;
		verifyImg.value = img;
		loginForm.uuid = uuid;
	}
};
verifyCode();

const changePwdStatus = () => {
	showPwd.value = !showPwd.value;
};

const login = async () => {
	if (!loginForm.employeeNumber || !loginForm.password) {
		ElMessage.warning('账号或密码为空!');
		return;
	}
	if (!loginForm.verifyCode) {
		ElMessage.warning('验证码为空!');
		return;
	}
	try {
		loginForm.verifyCode = loginForm.verifyCode.toUpperCase();
		const { data: res } = await Api.login(loginForm);
		if (res.code === 200) {
			ElMessage.success('登陆成功');
			userStore.setToken(res.data.token);
			userStore.setAdminInfo(res.data);

			if (res.data && res.data.role == 'NORMAL') {
				// 普通用户
				setTimeout(() => {
					router.replace({ path: '/product/list' });
				}, 200);
			} else {
				setTimeout(() => {
					router.replace({ path: '/user/list' });
				}, 200);
			}
		} else if (res.code === 400) {
			ElMessage.error(res.data);
			verifyCode();
		}
	} catch (err) {}
};
</script>

<style lang="scss" scoped>
.login-container {
	.login-header {
		padding-top: 80px;
		margin-left: 5%;
		display: flex;
		align-items: center;

		.logo-title {
			height: 74px;
			line-height: 74px;
			margin: 0 0 0 10px;
			font-style: italic;
			font-size: 30px;
			font-weight: bold;
			color: $font-color;
		}

		.logo-icon {
			width: 123px;
			height: 32px;
		}
	}

	.login-form-wrapper {
		height: 640px;
		margin-top: 60px;
		display: flex;
		justify-content: flex-end;
		background: url('../../assets/imgs/background.jpg') no-repeat;
		background-size: 100% 100%;
		.login-bottom {
			margin-left: 7%;

			.every-img {
				margin-top: 20px;
				position: relative;
				display: flex;
				text-align: center;
				z-index: 1;

				.bottom-img {
					width: 72px;
					height: 72px;
					line-height: 95px;
					background-color: #3ea59a;
					border-radius: 50%;
					text-align: center;
					cursor: pointer;
				}

				.bottom-text {
					width: 72px;
					text-align: center;
					margin-top: 10px;
					color: #3ea59a;
					font-size: 14px;
				}
			}
		}

		.login-main {
			width: 324px;
			height: 360px;
			margin-top: 70px;
			margin-right: 220px;
			padding: 62px 46px;
			border-radius: 16px;
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			.font {
				font-size: 26px;
				color: #000;
				margin-top: 40px;
			}
			.login-form {
				width: 100%;
				margin: 36px 0 50px;

				.form-item-inline {
					width: 100%;
					display: flex;
					border-bottom: 1px solid #c8c8c8;
					margin-top: 30px;
					p {
						margin: 0;
						margin-top: 10px;
					}

					.icon {
						width: 19px;
						height: 19px;
					}
					.eye-icon {
						width: 27px;
						height: 21px;
						cursor: pointer;
					}

					.eye-open-icon {
						width: 27px;
						height: 21px;
					}
				}

				.form-item-input {
					width: 80%;
					height: 40px;
					padding-left: 20px;
					border: 0;
					background: 0;
					outline: none;
					font-size: 18px;
					color: #000;
				}

				.verify-input {
					width: 60%;
				}

				.verify-img {
					flex: 1;
					height: 50px;
					cursor: pointer;
				}
			}
		}

		.login-button-wrapper {
			.login-btn {
				width: 100%;
				height: 50px;
				font-size: 16px;
				color: #fff;
				background-color: $base-color;
				border: 0;
				outline: none;
				border-radius: 50px;
				cursor: pointer;
			}
		}
	}
}

input::-webkit-input-placeholder {
	color: #e4e3e3;
}

input::-moz-placeholder {
	/* Mozilla Firefox 19+ */
	color: #e4e3e3;
}

input:-moz-placeholder {
	/* Mozilla Firefox 4 to 18 */
	color: #e4e3e3;
}

input:-ms-input-placeholder {
	/* Internet Explorer 10-11 */
	color: #e4e3e3;
}

.input-focus {
	border-bottom: 1px solid #0c8563;
	color: #0c8563;
}

.input-onblur {
	border-bottom: 1px solid #c8c8c8;
	color: #fafafa;
}
</style>
