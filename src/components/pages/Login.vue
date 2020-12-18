<template>
	<div id="login" v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<!--flex弹性盒子模型，justify-content：主抽 -->
		<div class="login">
			<div style="height: 20%;"></div> 
			<el-card style="width: 400px;display: inline-block;">
				<div slot="header" class="clearfix"><span>管理员登录</span></div>
				<div class="demo-input-suffix">
					<div style="float: left;width: 80px;text-align: right;line-height: 40px;">账号：</div>
					<div style="float: left;width: 260px"><el-input v-model="username" placeholder="请输入账号"></el-input></div>
				</div>
				<div style="height: 20px;clear: both;"></div>
				<div class="demo-input-suffix">
					<div style="float: left;width: 80px;text-align: right;line-height: 40px;">密码：</div>
					<div style="float: left;width: 260px"><el-input type="password" v-model="password" placeholder="请输入密码"></el-input></div>
				</div>
				<div style="height: 30px;clear: both;"></div>
				<div class="demo-input-suffix" style="text-align: center;"><el-button style="width: 320px" type="primary" @click="but_login">登 录</el-button></div>
			</el-card>
		</div>
	</div>
</template>

<script>
export default {
	name: 'login',
	data() {
		return {
			username: 'system',
			password: 'system',
			fullscreenLoading: false,
			loadingText: '登录中...',
			timer: '',
			timenum: 0,
			code: ''
		};
	},
	mounted() {
		sessionStorage.removeItem('token');
		let self = this;
		document.onkeydown = function(e) {
			let ev = document.all ? window.event : e;
			if (ev.keyCode === 13) {
				self.but_login();
			}
		};
	},
	methods: {
		but_login() {
			if (this.username == '') {
				this.$message({
					showClose: true,
					message: '请输入登录账号',
					type: 'warning'
				});
			} else if (this.password == '') {
				this.$message({
					showClose: true,
					message: '请输入登录密码',
					type: 'warning'
				});
			}else{
				//sessionStorage.setItem('token', "1111111111111");
				//this.$router.replace('/index');
				this.fullscreenLoading = true;
				this.$axios
					.get(sessionStorage.getItem('url') + 'system/sys/loginUser?uc=' + this.username + '&pwd=' + this.password)
					.then((res) =>{
						this.fullscreenLoading = false;
						console.log(JSON.stringify(res));
						if(res.status == 200){
							var data = res.data;
							if(data.flag){
								this.$message({
									showClose: true,
									message: data.message,
									type: 'success'
								});
								sessionStorage.setItem('token', data.data);
								this.$router.replace('/index');
							}else{
								if(data.code == 1403){
									this.loadingText = "等待终端授权";
									this.fullscreenLoading = true;
									this.code = data.data;
									this.timer = setInterval(this.timerLogin, 6000);
								}else{
									this.$message({
										showClose: true,
										message: data.message,
										type: 'error'
									});
								}
							}
						}else{
							this.$message({
								showClose: true,
								message: "未知错误，请联系客服",
								type: 'error'
							});
						}
					});
			}
		},
		timerLogin(){
			if(this.timenum >= 20){
				clearInterval(this.timer);
				this.fullscreenLoading = false;
			}else{
				this.timenum ++;
				this.$axios
					.get(sessionStorage.getItem('url') + 'system/sys/timerCodeUser?code=' + this.code)
					.then((res) =>{
						//console.log(JSON.stringify(res));
						if(res.status == 200){
							var data = res.data;
							if(data.flag){
								if(data.code == 200){
									clearInterval(this.timer);
									this.fullscreenLoading = false;
									this.$message({
										showClose: true,
										message: data.message,
										type: 'success'
									});
									sessionStorage.setItem('token', data.data);
									this.$router.replace('/index');
								}
							}else{
								clearInterval(this.timer);
								this.fullscreenLoading = false;
								this.$message({
									showClose: true,
									message: data.message,
									type: 'error'
								});
							}
						}else{
							this.$message({
								showClose: true,
								message: "未知错误，请联系客服",
								type: 'error'
							});
						}
					});
			}
		}
	}
};
</script>

<style>
.login {
	position: fixed;
	text-align: center;
	width: 100%;
	height: 100%;
	background-image: url(../../assets/login_bag.jpg);
	background-size: 100% 100%;
}
</style>
