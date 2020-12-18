<template>
	<div>
		<div>SOD使用量和复购量</div>
		<div id="mainO" class="chartO"></div>
	</div>
</template>
<script>
	import echarts from 'echarts'
	export default {
		name: '',
		data() {
			return {
				time: [],
				charts: '',
				opinionDataS: [],
				opinionDataF: []
			}
		},
		methods: {
			drawLine(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['SOD使用量', '复购SOD量'],
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},

					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.time,
						axisLabel: {
							interval: 0, //横轴信息全部显示    
							rotate: 45, //45度角倾斜显示     
						}

					},
					yAxis: {
						type: 'value'
					},

					series: [{
						name: '复购SOD量',
						type: 'line',
						stack: '总量',
						data: this.opinionDataF
					}, {
						name: 'SOD使用量',
						type: 'line',
						stack: '总量',
						data: this.opinionDataS
					}]
				})
			},
			getOneWeekSODNum() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekSODNum?token=' + sessionStorage.getItem('token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainO')
								})
								var time = [];
								var opinionDataS = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									time[index] = value.DATAMES
									opinionDataS[index] = value.I_SOD
								})
								this.time = time
								this.opinionDataS = opinionDataS
							}
						} else {
							this.$message({
								showClose: true,
								message: '未知错误，请联系客服',
								type: 'error'
							});
						}
					});
			},
			getOneWeekRepeatSODNum() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekRepeatSODNum?token=' + sessionStorage.getItem('token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainO');
								})
								var opinionDataF = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									opinionDataF[index] = value.I_SOD;
								})
								this.opinionDataF = opinionDataF;
							}
						} else {
							this.$message({
								showClose: true,
								message: '未知错误，请联系客服',
								type: 'error'
							});
						}
					});
			},

		},
		//调用
		mounted() {
			this.getOneWeekRepeatSODNum();
			this.getOneWeekSODNum();
		}
	}
</script>
<style scoped>
	* {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chartO {
		width: 600px;
		height: 400px;
	}
</style>
