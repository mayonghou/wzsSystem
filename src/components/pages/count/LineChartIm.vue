<template>
	<div id="lineChart" class="padding" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<LineChart></LineChart>
		<LineChartO></LineChartO>
		<LineChartT></LineChartT>
	</div>
</template>

<script>
import LineChart from '../other/cartogram/LineChart.vue'
import LineChartO from '../other/cartogram/LineChartO.vue'
import LineChartT from '../other/cartogram/LineChartT.vue'
export default {
	components: {
		LineChart,
		LineChartO,
		LineChartT
	},
	name: 'lineChart',
	data() {
		return {
			fullscreenLoading: true,
			loadingText: '加载中...',
		};
	},
	mounted() {
     this.setTimer();
  },
  methods:{
    setTimer: function () {
      this.timer = setInterval( () => {
        this.fullscreenLoading = false;
      }, 3000)
    }
  }
};
</script>

<style>
</style>