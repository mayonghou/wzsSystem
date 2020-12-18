<template>
	<div class="count">
		<!-- 积分展示 -->
		<div id="mainIntegal" class="chart"></div>
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
				opinionData: [],
				opinionData1: [],
				opinionData2: [],
				dataList: []
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
						data: ['新增业绩', '团队业绩', '每日业务'],
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
							rotate: 15, //45度角倾斜显示     
						}
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						name: '新增业绩',
						type: 'line',
						stack: '总量',
						data: this.opinionData
					}, {
						name: '团队业绩',
						type: 'line',
						stack: '总量',
						data: this.opinionData1
					}, {
						name: '每日业务',
						type: 'line',
						stack: '总量',
						data: this.opinionData2
					}]
				})
			},
			getOneWeekIntegralBySource() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekIntegralBySource?token=' + sessionStorage.getItem(
						'token') + "&source=新增业绩")
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainIntegal')
								})
								var time = [];
								var opinionData = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									opinionData[index] = value.I_NUM
									time[index] = value.DATAMES
								})
								this.time = time
								this.opinionData = opinionData
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
			getOneIntegralBySource() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekIntegralBySource?token=' + sessionStorage.getItem(
						'token') + "&source=团队业绩")
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainIntegal')
								})
								var time = [];
								var opinionData1 = [];
								this.dataList1 = data.data;
								this.dataList1.forEach(function(value, index, array) {
									array[index] == value;
									opinionData1[index] = value.I_NUM
									time[index] = value.DATAMES
								})
								this.time = time
								this.opinionData1 = opinionData1
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
			getOneIntegral() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekIntegralBySource?token=' + sessionStorage.getItem(
						'token') + "&source=每日业务")
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainIntegal')
								})
								var time = [];
								var opinionData2 = [];
								this.dataList2 = data.data;
								this.dataList2.forEach(function(value, index, array) {
									array[index] == value;
									opinionData2[index] = value.I_NUM
									time[index] = value.DATAMES
								})
								this.time = time
								this.opinionData2 = opinionData2
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
		//调用
		mounted() {
			this.getOneWeekIntegralBySource();
			this.getOneIntegralBySource();
			this.getOneIntegral();
		}
	}
</script>
<style scoped>
	* {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chart {
		width: 650px;
		height: 400px;
	}

	.count {
		width: 100%;
		height: 100%;
	}
</style>
