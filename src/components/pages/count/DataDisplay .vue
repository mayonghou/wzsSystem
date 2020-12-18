<template>
	<div v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="发放积分" name="first"><Integral></Integral></el-tab-pane>
			<el-tab-pane label="每日业务" name="second"><Bbusiness></Bbusiness></el-tab-pane>
			<el-tab-pane label="积分订单数" name="third"><OrderInteg></OrderInteg></el-tab-pane>
			<el-tab-pane label="8天总积分数" name="fourth"><CountInteg></CountInteg></el-tab-pane>
			<el-tab-pane label="积分SOD数" name="SOD"><IntegSOD></IntegSOD></el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import Integral from "../other/datadisplay/Integral.vue"
	import Bbusiness from "../other/datadisplay/Bbusiness.vue"
	import OrderInteg from "../other/datadisplay/OrderInteg.vue"
	import CountInteg from "../other/datadisplay/CountInteg.vue"
	import IntegSOD from "../other/datadisplay/IntegSOD.vue"
	export default {
		components: {
			Integral,
			Bbusiness,
			OrderInteg,
			CountInteg,
			IntegSOD
		},
		name: 'display',
		data() {
			return {
				fullscreenLoading: true,
				loadingText: '加载中...',
				activeName: 'first'
			};
    },
    mounted() {
      this.setTimer();
    },
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
      },
     setTimer: function () {
      this.timer = setInterval( () => {
          this.fullscreenLoading = false;
      }, 3000);
    },
		}
	};
</script>
