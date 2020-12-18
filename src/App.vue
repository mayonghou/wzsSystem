<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
	name: 'app',
	mounted() {
		var httpUrl = "192.168.0.27:18001";
		var httpMall = "192.168.0.27:18001";
		var httpUrlSocket = "192.168.0.27:18001";
		sessionStorage.setItem("url","http://"+httpUrl+"/service/");
		sessionStorage.setItem("urlMall","http://"+httpMall+"/service/");
		sessionStorage.setItem("urlSocket","http://"+httpUrlSocket+"/service/");
		sessionStorage.setItem("ws","ws://"+httpUrlSocket+"/service/");
		/* var httpUrl = "system.zhiangshengwu.com";
		var httpUrlSocket = "socket.zhiangshengwu.com";
		sessionStorage.setItem("url","http://"+httpUrl+"/service/");
		sessionStorage.setItem("urlSocket","http://"+httpUrlSocket+"/service/");
		sessionStorage.setItem("ws","ws://"+httpUrlSocket+"/service/"); */
	}
};
</script>

<style>
	#app{
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>