<template>
	<div>
		<div>积分发放</div>
		<div id="mainT" class="chart"></div>
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
				opinionDataJ: []
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
           
						data: ['发放的积分'],
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
							name: '发放的积分',
							type: 'line',
							stack: '总量',
							data: this.opinionDataJ
						}
					]
				})
			},
			getOneWeekIntegralNum() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekIntegralNum?token=' + sessionStorage.getItem('token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainT');
								})
								var time = [];
								var opinionDataJ = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									time[index] = value.DATAMES
									opinionDataJ[index] = value.I_NUM
								})
								this.time = time;
								this.opinionDataJ = opinionDataJ;
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
			this.getOneWeekIntegralNum();
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
</style>
