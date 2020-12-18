<template>
	<div>
		<div>会员注册量和首单使用量</div>
		<div id="mainLine" class="chart"></div>
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
				opinionDataL: [],
				opinionData: []
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
						data: ['会员注册量', '首单SOD使用量'],
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
						name: '首单SOD使用量',
						type: 'line',
						stack: '总量',
						data: this.opinionData
					}, {
						name: '会员注册量',
						type: 'line',
						stack: '总量',
						data: this.opinionDataL
					}]
				})
			},
			getOneWeekMembersNum() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekMembersNum?token=' + sessionStorage.getItem('token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainLine')
								})
								var time = [];
								var opinionData = [];
								this.dataList = data.data;
								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									opinionData[index] = value.COUNTS
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
			getOneWeekFirstSODNum() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/oneWeekFirstSODNum?token=' + sessionStorage.getItem('token') +
						'&usid=' + this.usid + '&sta=' + this.sta)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$nextTick(function() {
									this.drawLine('mainLine')
								})
								var opinionDataL = [];
								this.dataList = data.data;

								this.dataList.forEach(function(value, index, array) {
									array[index] == value;
									opinionDataL[index] = value.I_SOD
								})
								this.opinionDataL = opinionDataL
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
			this.getOneWeekFirstSODNum();
			this.getOneWeekMembersNum();
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
