<template>
	<div id="noticemanage">
		<div style="padding: 20px;">
			<el-input maxlength="200"
			  type="textarea"
			  :autosize="{ minRows: 3}"
			  placeholder="请输入公告内容"
			  v-model="noticemes">
			</el-input>
			<div style="height: 30px;"></div>
			<el-button @click="sub_notic" type="primary">保存公告</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'noticemanage',
	data() {
		return {
			noticemes: ''
		};
	},
	mounted() {
		this.getNoticeUser();
	},
	methods: {
		sub_notic(){
			this.$confirm('是否确定保存公告信息?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					mes: this.noticemes
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setNoticeUser?token=' + sessionStorage.getItem('token'), data).then(res => {
					loading.close();
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
						} else if (data.code == 1005) {
							this.$router.replace('/login');
						} else {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'error'
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: '未知错误，请联系客服',
							type: 'error'
						});
					}
				});
			});
		},
		getNoticeUser() {
			console.log(sessionStorage.getItem('url'));
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getNoticeUser?token=' + sessionStorage.getItem('token'))
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.noticemes = data.data;
						} else if (data.code == 1005) {
							this.$router.replace('/login');
						} else {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'error'
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: '未知错误，请联系客服',
							type: 'error'
						});
					}
				}); 
		}
	}
};
</script>

<style></style>
