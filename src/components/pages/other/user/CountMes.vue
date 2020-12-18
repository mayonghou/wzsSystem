<template>
	<div id="home">
		<div style="padding: 20px;">
			<div v-for="(item,index) in listData" :key="index">
				<div style="float: left;">{{item.COUNTMES}}</div>
				<div style="float: left;padding-left: 30px;">{{item.COUNTS}}</div>
				<div style="clear: both;height: 30px;"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'home',
	data() {
		return {
			listData: []
		};
	},
	mounted() {
		this.listNowCounts();
	},
	methods: {
		listNowCounts(){
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/listNowCounts?token=' + sessionStorage.getItem('token'))
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.listData = data.data;
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

<style>
</style>
