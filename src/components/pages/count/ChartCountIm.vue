<template>
	<div id="chartCountIm" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<MemberChart></MemberChart>
		<SetMealChart></SetMealChart>
	</div>
</template>

<script>
import MemberChart from '../other/cartogram/MemberChart.vue'
import SetMealChart from '../other/cartogram/SetMeal_Chart.vue'
export default {
	components: {
		MemberChart,
		SetMealChart
	},
	name: 'chartCountIm',
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
