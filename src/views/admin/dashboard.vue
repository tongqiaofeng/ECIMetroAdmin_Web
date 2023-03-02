<template>
	<div class="admin-container">
		<el-row>
			<el-col :span="17" :lg="18" :md="24" :sm="24">
				<div class="admin-wrapper">
					<div class="admin-main">
						<router-link to="/user/list" tag="div" class="main-every every01">
							<p class="every-title">用户数</p>
							<p class="every-num"><span class="font-tip color1">20</span>位</p>
						</router-link>
						<router-link to="/product/list" tag="div" class="main-every every02">
							<p class="every-title">产品数</p>
							<p class="every-num"><span class="font-tip color2">30</span>个</p>
						</router-link>
						<router-link to="/machine/list" tag="div" class="main-every every03">
							<p class="every-title">工装机具数</p>
							<p class="every-num"><span class="font-tip color3">4</span>块</p>
						</router-link>
						<router-link to="/activity/list" tag="div" class="main-every every04">
							<p class="every-title">活动数</p>
							<p class="every-num"><span class="font-tip color4">12</span>个</p>
						</router-link>
						<router-link to="/service/cate" tag="div" class="main-every every05">
							<p class="every-title">服务支持数</p>
							<p class="every-num"><span class="font-tip color2">12</span>个</p>
						</router-link>
						<router-link to="/lease/list" tag="div" class="main-every every04">
							<p class="every-title">设备租赁数</p>
							<p class="every-num"><span class="font-tip color4">12</span>个</p>
						</router-link>
					</div>
					<div class="user-chart" ref="userChart"></div>
				</div>
			</el-col>
			<el-col :span="7" :lg="6" :md="24" :sm="24">
				<div class="index-right">
					<div class="right-title">快速查看</div>
					<div class="right-main">
						<div v-for="(item, index) in rightList" :key="index">
							<router-link
								:to="item.path"
								:class="[
									'right-every',
									index != rightList.length - 1 ? 'border-bottom' : '',
								]"
								>{{ item.name }}</router-link
							>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script name="adminIndex" lang="ts" setup>
import { ref, onMounted } from 'vue';
import echarts from '@/utils/echart';
const rightList = [
	{ name: '用户管理', path: '/user/list' },
	{ name: '产品管理', path: '/product/list' },
	{ name: '工装机具管理', path: '/machine/list' },
	{ name: '活动分享管理', path: '/activity/list' },
	{ name: '服务支持管理', path: '/service/list' },
	{ name: '设备租赁管理', path: '/lease/list' },
	{ name: '招聘管理', path: '/join/list' },
];

const leaseData = [
	{ time: '2022-10-01', num: 10 },
	{ time: '2022-10-02', num: 2 },
	{ time: '2022-10-03', num: 3 },
	{ time: '2022-10-04', num: 4 },
	{ time: '2022-10-05', num: 5 },
];

const userChart = ref(null);
let option = {
	title: {
		text: '设备租赁增长统计表',
		x: 'center',
		y: '15px',
	},

	xAxis: {
		type: 'category',
		data: [
			'2022-10-01',
			'2022-10-02',
			'2022-10-03',
			'2022-10-05',
			'2022-10-06',
		],
		axisLine: {
			lineStyle: {
				color: '#000', //x轴颜色
			},
		},
	},
	yAxis: {
		type: 'value',
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'line',
		},
	},
	lineStyle: {
		color: 'red', // 折线颜色
	},
	series: [
		{
			name: '人数',
			data: [2, 4, 4, 5, 5, 4, 5, 10],
			type: 'line',
			smooth: true,
			itemStyle: {
				color: 'red',
			},
		},
	],
};
onMounted(() => {
	let myUserChart = echarts.init(userChart.value);
	myUserChart.setOption(option);
});

</script>

<style lang="scss" scoped>
.admin-container {
	display: flex;
	justify-content: space-between;
	padding: 20px;
	a {
		text-decoration: none;
		color: #000;
	}
	.admin-wrapper {
		margin-right: 24px;
		p {
			margin: 0;
		}

		.user-chart {
			width: 100%;
			height: 350px;
			background-color: #fff;
			margin-top: 30px;
			border-radius: 10px;
		}

		.admin-main {
			padding: 40px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			background-color: #fff;
			border-radius: 10px;

			.main-every {
				width: 277px;
				height: 98px;
				padding: 24px;
				margin-bottom: 24px;
				text-align: center;
				cursor: pointer;
				.every-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #1c2026;
					font-size: 16px;
				}

				.every-num {
					margin-top: 10px;
					text-align: left;
					font-size: 14px;
					color: #1c2026;
				}

				.every-price {
					margin-top: 17px;
					color: #494d52;
					font-size: 14px;
					text-align: left;
				}
			}

			.every01 {
				background: url('../../assets/imgs/index/state01.png') no-repeat;
			}

			.every02 {
				background: url('../../assets/imgs/index/state02.png') no-repeat;
			}
			.every03 {
				background: url('../../assets/imgs/index/state03.png') no-repeat;
			}
			.every04 {
				background: url('../../assets/imgs/index/state04.png') no-repeat;
			}
			.every05 {
				background: url('../../assets/imgs/index/state05.png') no-repeat;
			}
			.every06 {
				background: url('../../assets/imgs/index/state06.png') no-repeat;
			}
			.every07 {
				background: url('../../assets/imgs/index/state07.png') no-repeat;
			}
		}

		.index-jump {
			display: flex;
			justify-content: space-between;

			.jump-every {
				width: 50%;
				padding: 34px 40px;
				margin-top: 24px;
				background-color: #fff;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.jump-every-left {
					display: flex;
					align-items: center;
					.left-img {
						width: 64px;
						height: 64px;
						margin-right: 24px;
					}
					.left-font {
						color: #1c2026;
						font-size: 20px;
						font-weight: 500;
					}
				}

				.jump-every-right {
					width: 11px;
					height: 16px;
				}
			}
		}
	}

	.index-right {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;

		.right-title {
			height: 64px;
			line-height: 64px;
			background-color: $base-color;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			text-align: center;
			font-family: 'Microsoft YaHei-Regular';
			color: #fff;
			font-size: 16px;
		}

		.right-main {
			padding: 14px 8px;
			background-color: #fff;

			.right-every {
				width: 318px;
				height: 64px;
				padding-left: 37px;
				display: inline-block;
				line-height: 64px;
				font-size: 16px;
				color: #1c2026;
			}

			.line {
				width: 318px;
				height: 2px;
				margin: 0 auto;
				background-color: #f2f3f5;
			}
		}
	}

	.font-tip {
		font-size: 26px;
		font-weight: bold;
		margin-right: 3px;
	}
	.color1 {
		color: #eb6b2f;
	}

	.color2 {
		color: #1b55b3;
	}

	.color3 {
		color: #436ac2;
	}

	.color4 {
		color: #0c7063;
	}

	.color5 {
		color: #1b55b3;
	}

	.color6 {
		color: #0c7063;
	}
	.mr-24 {
		margin-right: 24px;
	}

	.border-bottom {
		border-bottom: 1px solid #f2f3f5;
	}
}

@media screen and (max-width: 1100px) {
	.index-right {
		margin-right: 24px;
		margin-top: 30px;
	}
}
</style>
