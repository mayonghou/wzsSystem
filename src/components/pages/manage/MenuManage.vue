<template>
	<div id="manage" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;">
			<el-button @click="but_add" type="success" icon="el-icon-plus">新建主菜单</el-button>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="xzsta" placeholder="---请选择---">
				<el-option label="全部" value=""></el-option>
				<el-option label="正常" value="1"></el-option>
				<el-option label="维护" value="0"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="sson" placeholder="快捷搜索条件"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" style="width: 100%;margin-bottom: 20px;" row-key="C_ID" border default-expand-all
		 :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column prop="C_NAME" label="菜单名称" width="300"></el-table-column>
			<el-table-column prop="C_URL" label="菜单路径" width="240"></el-table-column>
			<el-table-column prop="C_ICON" label="图标ICON" width="200"></el-table-column>
			<el-table-column prop="STATEMES" label="状态" width="100"></el-table-column>
			<el-table-column prop="D_TIME" label="创建时间" width="136"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button v-show="scope.row.P_ID == 'FIRST'" @click="add_menu(scope.row)" type="text" size="small">新建菜单</el-button>
					<el-button @click="edit_menu(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_menu(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新建菜单窗口  -->
		<el-dialog :title="tileMenu" :visible.sync="dialogFormVisibleMenu">
			<el-form :model="formMenu">
				<el-form-item label="上级名称" :label-width="formLabelWidth">
					<el-input v-model="formMenu.pmuname" :readonly="true" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单名称" :label-width="formLabelWidth">
					<el-input v-model="formMenu.muname" maxlength="10" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标ICON" v-show="formMenu.mupid == 'FIRST'" :label-width="formLabelWidth">
					<el-input v-model="formMenu.muicon" maxlength="30" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单路径" v-show="formMenu.mupid != 'FIRST'" :label-width="formLabelWidth">
					<el-input v-model="formMenu.muurl" maxlength="50" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<div>注：ICON图标获取方式：https://element.eleme.cn/#/zh-CN/component/icon</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleMenu = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysMenu()">提交</el-button>
			</div>
		</el-dialog>

		<!-- 修改菜单窗口 -->
		<el-dialog title="修改菜单" :visible.sync="dialogFormVisibleEditMenu">
			<el-form :model="formEditMenu">
				<el-form-item label="上级名称" :label-width="formLabelWidth">
					<el-select v-model="formEditMenu.mupid" placeholder="---请选择---">
						<el-option label="主菜单" value="FIRST"></el-option>
						<el-option v-for = "item in listData" v-if="item.C_ID != formEditMenu.muid" :key="item.C_ID" :label="item.C_NAME"
						 :value="item.C_ID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单名称" :label-width="formLabelWidth">
					<el-input v-model="formEditMenu.muname" maxlength="10" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标ICON" v-show="formEditMenu.mupid == 'FIRST'" :label-width="formLabelWidth">
					<el-input v-model="formEditMenu.muicon" maxlength="30" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="菜单路径" v-show="formEditMenu.mupid != 'FIRST'" :label-width="formLabelWidth">
					<el-input v-model="formEditMenu.muurl" maxlength="50" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<div>注：ICON图标获取方式：https://element.eleme.cn/#/zh-CN/component/icon</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleEditMenu = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysEditMenu()">提交</el-button>
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
				listRoleData: [],
				dialogFormVisibleMenu: false,
				dialogFormVisibleEditMenu: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				formLabelWidth: '120px',
				tileMenu: '',
				sson: '',
				xzsta: '',
				formMenu: {
					mupid: '',
					pmuname: '',
					muname: '',
					muurl: '',
					muicon: ''
				},
				formEditMenu: {
					muid: '',
					mupid: '',
					pmuname: '',
					muname: '',
					muurl: '',
					muicon: ''
				}
			};
		},
		mounted() {
			this.getSysMenu();
		},
		methods: {
			but_add() {
				this.tileMenu = "新建主菜单";
				this.formMenu.mupid = "FIRST";
				this.formMenu.pmuname = "主菜单";
				this.dialogFormVisibleMenu = true;
			},
			add_menu(row) {
				this.tileMenu = "新建下级菜单";
				this.formMenu.mupid = row.C_ID;
				this.formMenu.pmuname = row.C_NAME;
				this.dialogFormVisibleMenu = true;
			},
			edit_menu(row) {
				this.formEditMenu.muid = row.C_ID;
				this.formEditMenu.mupid = row.P_ID;
				this.formEditMenu.muname = row.C_NAME;
				this.formEditMenu.muurl = row.C_URL;
				this.formEditMenu.muicon = row.C_ICON;
				this.formEditMenu.pmuname = row.P_ID;
				this.dialogFormVisibleEditMenu = true;
			},
			sub_sysMenu() {
				if (this.formMenu.muname == "") {
					return this.$message({
						showClose: true,
						message: "菜单名称不能为空",
						type: 'error'
					});
				}
				if (this.formMenu.mupid == "FIRST") {
					if (this.formMenu.muicon == "") {
						return this.$message({
							showClose: true,
							message: "图标ICON不能为空",
							type: 'error'
						});
					}
				} else {
					if (this.formMenu.muurl == "") {
						return this.$message({
							showClose: true,
							message: "菜单路径不能为空",
							type: 'error'
						});
					}
				}
				this.$confirm('是否确定新建【' + this.formMenu.muname + '】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						mupid: this.formMenu.mupid,
						muname: this.formMenu.muname,
						muurl: this.formMenu.muurl,
						muicon: this.formMenu.muicon
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysMenu/setSysMenu?token=' + sessionStorage.getItem(
						'token'), data).then(res => {
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
								this.getSysMenu();
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
			but_search() {

			},
			del_menu(row) {
				this.$confirm('是否确定删除【' + row.C_NAME + '】菜单信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						muid: row.C_ID
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysMenu/delSysMenu?token=' + sessionStorage.getItem(
						'token'), data).then(res => {
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
								this.getSysMenu();
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
			getSysMenu() {
				var data = '?token=' + sessionStorage.getItem('token') + '&sson=' + this.sson + '&xzsta=' + this.xzsta;
				this.$axios.get(sessionStorage.getItem('url') + 'system/sysMenu/getSysMenu' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
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
			sub_sysEditMenu() {
				if (this.formEditMenu.muname == "" || this.formEditMenu.muname == undefined) {
					return this.$message({
						showClose: true,
						message: "菜单名称不能为空",
						type: 'error'
					});
				}
				if (this.formEditMenu.mupid == "FIRST") {
					this.formEditMenu.muurl = '';
					if (this.formEditMenu.muicon == "" || this.formEditMenu.muicon == undefined) {
						return this.$message({
							showClose: true,
							message: "图标ICON不能为空",
							type: 'error'
						});
					}
				} else {
					this.formEditMenu.muicon = '';
					if (this.formEditMenu.muurl == "" || this.formEditMenu.muurl == undefined) {
						return this.$message({
							showClose: true,
							message: "菜单路径不能为空",
							type: 'error'
						});
					}
				}
				this.$confirm('是否确定修改【' + this.formEditMenu.muname + '】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						muid: this.formEditMenu.muid,
						mupid: this.formEditMenu.mupid,
						muname: this.formEditMenu.muname,
						muurl: this.formEditMenu.muurl,
						muicon: this.formEditMenu.muicon
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysMenu/updateSysMenu?token=' + sessionStorage.getItem(
						'token'), data).then(res => {
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
								this.getSysMenu();
								this.dialogFormVisibleEditMenu = false;
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
