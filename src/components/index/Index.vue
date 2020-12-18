<template>
	<div id="index" v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div class="index_head">
			<app-header :username="usernameData" :useruc="userucData" :userjob="userjobData"></app-header>
		</div>
		<div class="index_container">
			<div class="index_left" :style="height_style" style="overflow-y: auto;">
				<app-nav :menuArray="menuData" v-on:listMenuEvent="listMenuChild"></app-nav>
			</div>
			<div class="index_right" :style="height_width_style">
				<el-tabs v-model="editableTabsValue" @tab-click="clickCard" type="card" @tab-remove="removeTab">
					<el-tab-pane v-for="item in editableTabs" :key="item.name" :closable="item.checked" :label="item.title" :name="item.name">
						<router-view :name="item.name" :style="height_router" class="routerview"></router-view>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div style="clear: both;"></div>
		</div>
	</div>
</template>

<script>
	import apphead from '../app/AppHead.vue';
	import appnav from '../app/AppNav.vue';
	export default {
		name: 'index',
		components: {
			'app-header': apphead,
			'app-nav': appnav
		},
		provide() {
			return {
				newCard: this.newCard
			};
		},
		data() {
			return {
				fullscreenLoading: false,
				loadingText: '加载中...',
				height_style: '',
				height_router: '',
				height_width_style: '',
				editableTabsValue: 'home',
				editableTabs: [
					{
						title: '首页',
						name: 'home',
						checked: false
					}
				],
				usernameData: '',
				userucData: '',
				userjobData: '',
				menuData: []
			};
		},
		mounted() {
			let height = window.innerHeight;
			let width = window.innerWidth;
			this.height_style = 'height: ' + (height-60) + 'px;';
			this.height_router = 'height: ' + (height-120) + 'px;';
			this.height_width_style = 'height: '+ (height-60) + 'px;width: '+ (width-260) +'px;';
			this.fullscreenLoading = true;
			this.getSysIdUser();
			this.getMenuUser();
		},
		methods: {
			getSysIdUser(){
				this.$axios
					.get(sessionStorage.getItem('url') + 'system/sys/getSysIdUser?token=' + sessionStorage.getItem('token'))
					.then((res) =>{
						this.fullscreenLoading = false;
						//console.log("--------"+JSON.stringify(res));
						if(res.status == 200){
							var data = res.data;
							if(data.flag){
								this.usernameData = data.data[0].C_NAME;
								this.userucData = data.data[0].C_UC;
								sessionStorage.setItem('sysuc', data.data[0].C_UC);
								sessionStorage.setItem('sysnc', data.data[0].C_NAME);
								this.userjobData = data.data[0].C_JOB;
								//初始化链接websocket
								setTimeout(() => {
									this.$websocket.dispatch('WEBSOCKET_INIT',sessionStorage.getItem('ws')+"socket/websocket/"+data.data[0].C_UC);
								}, 1000);
							} else if(data.code == 1005){
								this.$router.replace('/login');
							} else{
								this.$message({
									showClose: true,
									message: data.message,
									type: 'error'
								});
							}
						}else{
							this.$message({
								showClose: true,
								message: res.message,
								type: 'error'
							});
						}
					});
			},
			getMenuUser(){
				this.$axios
					.get(sessionStorage.getItem('url') + 'system/sys/getMenuUser?token=' + sessionStorage.getItem('token'))
					.then((res) =>{
						this.fullscreenLoading = false;
						//console.log("--------"+JSON.stringify(res));
						if(res.status == 200){
							var data = res.data;
							if(data.flag){
								this.menuData = data.data;
							} else if(data.code == 1005){
								this.$router.replace('/login');
							} else{
								this.$message({
									showClose: true,
									message: data.message,
									type: 'error'
								});
							}
						}else{
							this.$message({
								showClose: true,
								message: res.message,
								type: 'error'
							});
						}
					});
			},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				let activeContent = "/page";
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
								activeContent = nextTab.content;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			listMenuChild(data1,data2) {
				if(data2 == -1){
					let flag = true;
					for (let i = 0; i < this.editableTabs.length; i++) {
						if (this.menuData[data1].menuName == this.editableTabs[i].name) {
							flag = false;
						}
					}
					if (flag) {
						this.editableTabs.push({
							title: this.menuData[data1].menuTitle,
							name: this.menuData[data1].menuName,
							checked: true
						});
					}
					this.editableTabsValue = this.menuData[data1].menuName;
				}else{
					let flag = true;
					for (let i = 0; i < this.editableTabs.length; i++) {
						if (this.menuData[data1].menuItems[data2].menuName == this.editableTabs[i].name) {
							flag = false;
						}
					}
					if (flag) {
						this.editableTabs.push({
							title: this.menuData[data1].menuItems[data2].menuTitle,
							name: this.menuData[data1].menuItems[data2].menuName,
							checked: true
						});
					}
					this.editableTabsValue = this.menuData[data1].menuItems[data2].menuName;
				}
			},
			clickCard(row) {
				this.editableTabsValue = this.editableTabs[row.index].name;
			},
			newCard(data) {
				let flag = true;
				for (let i = 0; i < this.editableTabs.length; i++) {
					if (data.menuName == this.editableTabs[i].name) {
						flag = false;
					}
				}
				if (flag) {
					this.editableTabs.push({
						title: data.menuTitle,
						name: data.menuName,
						checked: true
					});
				}
				this.editableTabsValue = data.menuName;
			}
		}
	};
</script>

<style>
	#index{
		width: 100%;
		height: 100%;
	}
	.index_head{
		height: 60px;
	}
	.index_container{
		width: 100%;
	}
	.index_left{
		position: absolute;
		width: 260px;
		background-color: #545c64;
	}
	.index_right{
		position: absolute;
		width: 600px;
		left: 260px;
	}
	.routerview {
		overflow-y: auto;
	}
</style>
