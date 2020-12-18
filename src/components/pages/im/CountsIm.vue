<template>
	<div id="countsIm" class="padding">
		在线人数：{{counts}}
	</div>
</template>

<script>
export default {
	name: 'countsIm',
	data() {
		return {
			title: '统计在线人数',
			counts: 0
		};
	},
	mounted() {},
	computed:{
		CountsSuccess() {
			//统计在线人数
			return this.$websocket.getters.onEvent('CountsSuccess');
		}
	},
	watch: {
		CountsSuccess(a, b) {
			if (a !== b && a) {
				console.log("pant="+a);
				var jsonData = JSON.parse(a);
				this.counts = jsonData.mes;
			}
		}
	}
};
</script>

<style>
</style>