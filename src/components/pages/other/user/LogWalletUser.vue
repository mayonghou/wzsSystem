<template>
	<div id="logwalletuser">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="sta">
				<el-option label="积分" value="JF"></el-option>
				<el-option label="SOD" value="SOD"></el-option>
				<el-option label="维C" value="WC"></el-option>
			</el-select>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_loguser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="logData" border style="width: 100%">
			<el-table-column prop="C_SOURCE" label="来源" width="120"></el-table-column>
			<el-table-column prop="I_NUM" label="数量" width="120"></el-table-column>
			<el-table-column prop="I_STAMES" label="状态" width="120"></el-table-column>
			<el-table-column prop="C_MEMO" label="说明" width="200"></el-table-column>
			<el-table-column prop="D_TIME" label="时间" width="140"></el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	name: 'logwalletuser',
	data() {
		return {
			logData: [],
			usid: '',
			sta: 'JF'
		};
	},
	mounted() {
		this.usid = this.$route.query.usid;
		this.getLogWalletUser();
	},
	methods: {
		but_loguser(){
			this.getLogWalletUser();
		},
		getLogWalletUser() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getLogWalletUser?token=' + sessionStorage.getItem('token') + '&usid=' + this.usid +'&sta=' + this.sta)
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.logData = data.data;
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
