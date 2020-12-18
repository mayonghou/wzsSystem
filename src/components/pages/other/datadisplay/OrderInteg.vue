<template>
	<div id="orderInteg">
		<div v-for="(item,index) in ListData" :key="index">
			<span>{{item.NAME}}</span>:<span>{{item.NUM}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'orderInteg',
		data() {
			return {
				fullscreenLoading: true,
				loadingText: '加载中...',
				ListData: []
			}
		},
		methods: {
			getUnfOrderAndIntegra() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/unfOrderAndIntegra?token=' + sessionStorage.getItem('token'))
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.ListData = data.data;
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
			this.getUnfOrderAndIntegra();
		}
	}
</script>

