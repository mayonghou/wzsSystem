<template>
	<div class="count">
		<div id="brokenLine" class="chart"></div>
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
						data: ['提现数量', '到账金额'],
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
							name: '提现数量',
							type: 'line',
							stack: '总量',
							data: this.opinionData1
						},
						{
							name: '到账金额',
							type: 'line',
							stack: '总量',
							data: this.opinionData2
						}
					]
				})
			},
			getTopEightTotalIntegral() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/topEightTotalIntegral?token=' + sessionStorage.getItem(
							'token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('brokenLine');
								});
								var time = [];
								var opinionData1 = [];
								var opinionData2 = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									time[index] = value.TIME
									opinionData1[index] = value.ZEBNUM
									opinionData2[index] = value.MONEY
								})
								this.time = time;
								console.log(this.time)
								this.opinionData1 = opinionData1;
								this.opinionData2 = opinionData2;
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
			this.getTopEightTotalIntegral();
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
		width: 750px;
		height: 400px;
	}

	.count {
		width: 100%;
		height: 100%;
	}
</style>
