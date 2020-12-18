<template>
	<div class="count">
		<!-- 获取所有用户的积分、SOD数 -->
		<div v-for="(item,index) in dataList" key="index">
			<div>积分:{{item.INTEGRAL}}</div>
			<div>SOD:{{item.SOD}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			}
		},
		methods: {
			getUserTotalIntegralAndSOD() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/userTotalIntegralAndSOD?token=' + sessionStorage.getItem('token'))
					.then(res => {
						// this.logLoading = false;
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.dataList = data.data;
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
		},
		mounted() {
			this.getUserTotalIntegralAndSOD();
		}
	}
</script>

<style>
	.count {
		width: 100%;
		height: 100%;
	}
</style>
