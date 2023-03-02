<template>
	<div class="box">
		<div class="row">
			<router-link to="/">返回登录</router-link>
			<!-- <router-link to="/admin">返回首页</router-link> -->
		</div>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.box {
	width: 100%;
	height: 100vh;
	background-image: url('@/assets/imgs/4041.gif');
	background-size: 100% 100%;
	background-repeat: no-repeat;
  position: relative;
  .row {
    padding-top: 15%;
    padding-left: 60%;
  }
	a {
		color: #fff;
    margin-right: 30px;
    margin-top: 200px;
    font-size: 20px;
    
	}
}
</style>
