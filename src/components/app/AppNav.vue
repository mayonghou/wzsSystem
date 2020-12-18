<template>
	<div id="appnav">
		<el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64"
		 text-color="#fff" active-text-color="#ffd04b">
			<label v-for="(item,index) in menuArray" :key="index">
				<el-submenu v-if="item.menuItems.length>0" :index="item.menuId">
					<template slot="title">
						<i :class="item.menuIcon"></i>
						<span>{{item.menuTitle}}</span>
					</template>
					<label v-for="(item,indexa) in item.menuItems" :key="indexa">
						<el-menu-item @click="clickMenuTwoArray(index,indexa)" :index="item.menuId">{{item.menuTitle}}</el-menu-item>
					</label>
				</el-submenu>
				<el-menu-item @click="clickMenuOneArray(index)" v-else :index="item.menuId">
					<i :class="item.menuIcon"></i>
					<span slot="title">{{item.menuTitle}}</span>
				</el-menu-item>
			</label>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name: 'appnav',
		data() {
			return {

			};
		},
		props: ['menuArray'],
		mounted() {

		},
		methods: {
			clickMenuOneArray(e) {
				this.$emit("listMenuEvent", e,-1);
			},
			clickMenuTwoArray(e1,e2) {
				this.$emit("listMenuEvent", e1,e2);
			}
		}
	};
</script>

<style>
</style>
