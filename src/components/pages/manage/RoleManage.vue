<template>
	<div id="manage" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;"><el-button @click="but_sysRole" type="success" icon="el-icon-plus">新建</el-button></div>
		<div style="float: left;width: 300px;padding-left: 30px;"><el-input v-model="sson" placeholder="快捷搜索条件"></el-input></div>
		<div style="float: left;padding-left: 30px;"><el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button></div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" border style="width: 100%">
			<el-table-column prop="C_NAME" label="角色名称" width="160"></el-table-column>
			<el-table-column prop="D_TIME" label="创建时间" width="136"></el-table-column>
			<el-table-column prop="C_UC" label="创建人账号" width="206"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_menu(scope.row)" type="text" size="small">分配菜单</el-button>
					<el-button @click="edit_user(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_user(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@prev-click="prev_click"
			@next-click="next_click"
			@current-change="current_change"
			layout="prev, pager, next"
			:page-size="10"
			:total="counts"
		></el-pagination>
		<el-dialog title="新建角色" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="角色名称" :label-width="formLabelWidth"><el-input v-model="roleName" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysRole">提交</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="修改角色" :visible.sync="dialogFormEdit">
			<el-form>
				<el-form-item label="角色名称" :label-width="formLabelWidth"><el-input v-model="formEdit.name" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormEdit = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysEditRole">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="菜单分配" :visible.sync="dialogFormVisibleMenu">
			<el-form :model="formMenu">
				<div>{{formMenu.rolename}}</div>
				<div style="height: 10px;"></div>
				<div v-for="(item,index) in listMenuData" :key="index" style="border-bottom: solid 1px #EBEBEB;">
					<div style="height: 15px;"></div>
					<el-checkbox @change="oneMenu(item.C_ID,index)" :label="item.C_ID" :checked="item.STAS == 1 ? true : false">{{item.C_NAME}}</el-checkbox>
					<div style="margin: 15px;">
						<el-checkbox @change="twoMenu(itema.C_ID,index,indexa)" v-for="(itema,indexa) in item.listMap" :checked="itema.STAS == 1 ? true : false" :label="itema.C_ID" :key="indexa">{{itema.C_NAME}}</el-checkbox>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleMenu = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysmenu">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'manage',
	data() {
		return {
			listData: [],
			listMenuData: [],
			listAllMenuData: [],
			listYesMenuData: [],
			fullscreenLoading: true,
			dialogFormEdit: false,
			loadingText: '加载中...',
			dialogFormVisible: false,
			dialogFormVisibleMenu: false,
			formLabelWidth: '120px',
			counts: this.counts,
			page: 1,
			rows: 10,
			sson: '',
			roleName: '',
			formEdit: {
				id: '',
				name: ''
			},
			formMenu: {
				roleid: '',
				rolename: ''
			},
			timer: ''
		};
	},
	mounted() {
		this.getSysRole();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getSysRole();
		},
		next_click(e) {
			this.page = e;
			this.getSysRole();
		},
		current_change(e) {
			this.page = e;
			this.getSysRole();
		},
		but_search() {
			this.page = 1;
			this.getSysRole();
		},
		edit_menu(row) {
			this.formMenu.roleid = row.C_ID;
			this.formMenu.rolename = row.C_NAME;
			this.dialogFormVisibleMenu = true;
			this.getAllSysMenu();
		},
		oneMenu(id,index){
			if(this.listMenuData[index].STAS == 0){
				this.listMenuData[index].STAS = 1;
			}else{
				this.listMenuData[index].STAS = 0;
				this.NextMenu(index);
			}
			console.log("twoMenu==="+id+"-------"+index);
		},
		twoMenu(id,index,indexa){
			if(this.listMenuData[index].listMap[indexa].STAS == 0){
				this.listMenuData[index].listMap[indexa].STAS = 1;
			}else{
				this.listMenuData[index].listMap[indexa].STAS = 0;
			}
			this.fistMenu(index);
			console.log("twoMenu==="+id+"-------"+index+"-------"+indexa);
		},
		NextMenu(index){
			let bool = false;
			for (let i = 0; i < this.listMenuData[index].listMap.length; i++) {
				this.listMenuData[index].listMap[i].STAS = 0;
			}
			var editMenuData = this.listMenuData;
			this.listMenuData = [];
			this.timer = setTimeout(() => {
				this.listMenuData = editMenuData;
			}, 1);
		},
		fistMenu(index){
			let bool = false;
			for (let i = 0; i < this.listMenuData[index].listMap.length; i++) {
				if(this.listMenuData[index].listMap[i].STAS == 1){
					bool = true;
				}
			}
			if(bool){
				if(this.listMenuData[index].STAS == 0){
					this.listMenuData[index].STAS = 1;
				}
			}else{
				if(this.listMenuData[index].STAS == 1){
					this.listMenuData[index].STAS = 0;
				}
			}
			var editMenuData = this.listMenuData;
			this.listMenuData = [];
			this.timer = setTimeout(() => {
				this.listMenuData = editMenuData;
			}, 1);
		},
		del_user(row) {
			this.$confirm('是否确定删除【' + row.C_NAME + '】角色信息?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					id: row.C_ID
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'system/sysRole/delSysRole?token=' + sessionStorage.getItem('token'), data).then(res => {
					loading.close();
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.getSysRole();
						} else if (data.code == 1005) {
							this.$router.replace('/login');
						} else {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'error'
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: '未知错误，请联系客服',
							type: 'error'
						});
					}
				});
			});
		},
		but_sysRole() {
			
			this.dialogFormVisible = true;
		},
		edit_user(row) {
			this.formEdit.id = row.C_ID;
			this.formEdit.name = row.C_NAME;	
			this.dialogFormEdit = true;
		},
		sub_sysRole() {
			if (this.roleName == '') {
				this.$message({
					showClose: true,
					message: '请输入角色名称',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定新建【' + this.formMenu.rolename + '】角色信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						name: this.roleName
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysRole/setSysRole?token=' + sessionStorage.getItem('token'), data).then(res => {
						loading.close();
						//console.log(JSON.stringify(res));
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'success'
								});
								this.getSysRole();
								this.dialogFormVisible = false;
							} else if (data.code == 1005) {
								this.$router.replace('/login');
							} else {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'error'
								});
							}
						} else {
							this.$message({
								showClose: true,
								message: '未知错误，请联系客服',
								type: 'error'
							});
						}
					});
				});
			}
		},
		sub_sysmenu() {
			let menuids = "";
			for (let i = 0; i < this.listMenuData.length; i++) {
				if(this.listMenuData[i].STAS == 1){
					menuids += ","+this.listMenuData[i].C_ID;
				}
				for (let n = 0; n < this.listMenuData[i].listMap.length; n++) {
					if(this.listMenuData[i].listMap[n].STAS == 1){
						menuids += ","+this.listMenuData[i].listMap[n].C_ID;
					}
				}
			}
			if(menuids != ""){
				menuids = menuids.substring(1,menuids.length);
			}
			this.$confirm('是否确定分配【' + this.formMenu.rolename + '】角色菜单?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					roleid: this.formMenu.roleid,
					menuids: menuids
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'system/sysRole/setSysMenuRole?token=' + sessionStorage.getItem('token'), data).then(res => {
					loading.close();
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.getSysRole();
							this.dialogFormVisibleMenu = false;
						} else if (data.code == 1005) {
							this.$router.replace('/login');
						} else {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'error'
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: '未知错误，请联系客服',
							type: 'error'
						});
					}
				});
			});
		},
		getSysRole() {
			var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&sson=' + this.sson;
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysRole/getSysRole' + data).then(res => {
				this.fullscreenLoading = false;
				if (res.status == 200) {
					var data = res.data;
					var messageNum = data.message;
					this.counts = parseInt(messageNum);
					if (data.flag) {
						this.listData = data.data;
					} else if (data.code == 1005) {
						this.$router.replace('/login');
					} else {
						this.$message({
							showClose: true,
							message: data.message,
							type: 'error'
						});
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
		getAllSysMenu() {
			this.listMenuData = [];
			var data = '?token=' + sessionStorage.getItem('token');
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysRole/getAllSysMenu' + data).then(res => {
				this.fullscreenLoading = false;
				if (res.status == 200) {
					//console.log(JSON.stringify(res));
					var data = res.data;
					if (data.flag) {
						this.listAllMenuData = data.data;
						this.getIdSysMenu();
					} else if (data.code == 1005) {
						this.$router.replace('/login');
					} else {
						this.$message({
							showClose: true,
							message: data.message,
							type: 'error'
						});
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
		getIdSysMenu() {
			var data = '?token=' + sessionStorage.getItem('token') + '&roleid=' + this.formMenu.roleid;
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysRole/getIdSysMenu' + data).then(res => {
				this.fullscreenLoading = false;
				if (res.status == 200) {
					//console.log(JSON.stringify(res));
					var data = res.data;
					if (data.flag) {
						this.listYesMenuData = data.data,
						this.roleAndMenu();
					} else if (data.code == 1005) {
						this.$router.replace('/login');
					} else {
						this.$message({
							showClose: true,
							message: data.message,
							type: 'error'
						});
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
		roleAndMenu() {
			for (let i = 0; i < this.listAllMenuData.length; i++) {
				for (let m = 0; m < this.listYesMenuData.length; m++) {
					if(this.listAllMenuData[i].C_ID == this.listYesMenuData[m].SYS_MENU_ID){
						this.listAllMenuData[i].STAS = 1;
					}
				}
				for (let n = 0; n < this.listAllMenuData[i].listMap.length; n++) {
					for (let k = 0; k < this.listYesMenuData.length; k++) {
						if(this.listAllMenuData[i].listMap[n].C_ID == this.listYesMenuData[k].SYS_MENU_ID){
							this.listAllMenuData[i].listMap[n].STAS = 1;
						}
					}
				}
			}
			this.listMenuData = this.listAllMenuData;
		},
		sub_sysEditRole() {
			if (this.formEdit.name == '') {
				this.$message({
					showClose: true,
					message: '请输入角色名称',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定修改【' + this.formEdit.name + '】角色信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: this.formEdit.id,
						name: this.formEdit.name
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysRole/updateRole?token=' + sessionStorage.getItem('token'), data).then(res => {
						loading.close();
						//console.log(JSON.stringify(res));
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'success'
								});
								this.getSysRole();
								this.dialogFormEdit = false;
							} else if (data.code == 1005) {
								this.$router.replace('/login');
							} else {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'error'
								});
							}
						} else {
							this.$message({
								showClose: true,
								message: '未知错误，请联系客服',
								type: 'error'
							});
						}
					});
				});
			}
		}
	}
};
</script>

<style>
.nva {
	background-color: #ecf4ff;
	padding: 6px;
}
.nvames {
	float: left;
	padding: 4px 10px 4px 10px;
	cursor: pointer;
	font-size: 14px;
}
</style>
