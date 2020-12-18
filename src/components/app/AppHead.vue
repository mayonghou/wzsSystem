<template>
	<div id="apphead" class="header-message">
		<div class="header-logo"><img src="../../assets/logo.png" /></div>
		<div class="header-title">{{ title }}</div>
		<div class="header-mes">
			<div style="height: 10px;"></div>
			<div class="header-mes-job">{{ userjob }}</div>
			<div @click="exitLogin" class="header-mes-user" style="color: #F56C6C;cursor: pointer;">安全退出</div>
			<div class="header-mes-user">{{ username }}（{{ useruc }}）</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'apphead',
	data() {
		return {
			title: 'dome-system后台模板'
		};
	},
	props:['userjob','username','useruc'],
	mounted() {},
	methods: {
		exitLogin(){
			this.$confirm('是否确定退出登录?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(() => {
				this.$router.replace("/login");
			});
		}
	}
};
</script>

<style>
.header-message {
	width: 100%;
}
.header-logo {
	float: left;
}
.header-logo img {
	padding: 10px;
	height: 30px;
}
.header-title {
	float: left;
	padding-left: 10px;
	padding-top: 4px;
	font-size: 20px;
	line-height: 40px;
}
.header-mes {
	float: right;
	font-size: 12px;
	padding-right: 20px;
}
.header-mes-job {
	float: left;
}
.header-mes-user {
	float: right;
	padding-left: 20px;
}
</style>
