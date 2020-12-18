<template>
    <div>
		<div>套餐饼状图</div>
		<div ref = 'myEchart' style="width:500px;height:400px"></div>
	</div>
</template>

<script>
import echarts from 'echarts'
export default {
   data() {
        return {
			obj:'',
            dataList:[]
        }
    },
    methods: {
        // 图表初始化数据
        initChart(){
            let myChart = echarts.init(this.$refs.myEchart);
            myChart.setOption({
                tooltip: {
                    trigger:'item',
                    formatter: "{a} <br/>{b} ({d}%)"
                },
                series : [
                    {
                        name:'',
                        type: 'pie',
                        radius : '80%',
                        center: ['52%', '53%'],
                        avoidLabelOverlap: false,
                        data: this.dataList,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 5,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }
                ]
            })
        },
		getTotalPackage () {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/statistics/totalPackage?token=' + sessionStorage.getItem('token') + '&usid=' + this.usid +'&sta=' + this.sta)
				.then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.dataList = data.data;
							if(this.obj){
							    this.initChart();
							}
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
    mounted () {
        this.obj = this.$refs.myEchart;
        this.getTotalPackage();
    }
}
</script>
