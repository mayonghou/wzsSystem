<template>
	<div id="manage" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;"><el-button @click="but_sysuser" type="success" icon="el-icon-plus">新建</el-button></div>
		<div style="float: left;padding-left: 30px;">
			<el-select v-model="xzsta" placeholder="---请选择---">
				<el-option label="全部" value=""></el-option>
				<el-option label="正常" value="1"></el-option>
				<el-option label="冻结" value="0"></el-option>
				<el-option label="封号" value="4"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;"><el-input v-model="sson" placeholder="快捷搜索条件"></el-input></div>
		<div style="float: left;padding-left: 30px;"><el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button></div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" border style="width: 100%">
			<el-table-column prop="C_UC" label="账号" width="160"></el-table-column>
			<el-table-column prop="ROLENAME" label="角色名称" width="160"></el-table-column>
			<el-table-column prop="C_NAME" label="姓名" width="100"></el-table-column>
			<el-table-column prop="C_PHONE" label="电话" width="100"></el-table-column>
			<el-table-column prop="C_JOB" label="职务" width="180"></el-table-column>
			<el-table-column prop="STATEMES" label="账号状态" width="100"></el-table-column>
			<el-table-column prop="LOGINSTAMES" label="登录授权" width="100"></el-table-column>
			<el-table-column prop="D_TIME" label="创建时间" width="136"></el-table-column>
			<el-table-column prop="PUC" label="创建人账号" width="160"></el-table-column>
			<el-table-column label="操作" width="250" fixed="right" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_login(scope.row)" type="text" size="small">授权登录</el-button>
					<el-button @click="edit_role(scope.row)" type="text" size="small">分配角色</el-button>
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
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
		<el-dialog title="新建账号" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="账号" :label-width="formLabelWidth"><el-input v-model="form.uc" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="密码" :label-width="formLabelWidth"><el-input v-model="form.pwd" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="姓名" :label-width="formLabelWidth"><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="电话" :label-width="formLabelWidth"><el-input v-model="form.phone" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="职务" :label-width="formLabelWidth"><el-input v-model="form.job" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
			<el-form :model="formRole">
				<el-form-item label="账号" :label-width="formLabelWidth"><el-input v-model="formRole.ussysuc" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="角色" :label-width="formLabelWidth">
					<el-select v-model="formRole.ussysroleid" placeholder="---请选择---">
					    <el-option
					      v-for="item in listRoleData"
					      :key="item.C_ID"
					      :label="item.C_NAME"
					      :value="item.C_ID">
					    </el-option>
					  </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRole = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysrole">提交</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="修改账号" :visible.sync="dialogFormAccount">
			<el-form :model="formEdit">
				<el-form-item label="账号" :label-width="formLabelWidth"><el-input v-model="formEdit.uc" autocomplete="off" :readonly="true"></el-input></el-form-item>
				<el-form-item label="密码" :label-width="formLabelWidth"><el-input v-model="formEdit.pwd" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="姓名" :label-width="formLabelWidth"><el-input v-model="formEdit.name" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="电话" :label-width="formLabelWidth"><el-input v-model="formEdit.phone" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="职务" :label-width="formLabelWidth"><el-input v-model="formEdit.job" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="sub_syAccount">提交</el-button>
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
			fullscreenLoading: false,
			loadingText: '加载中...',
			dialogFormVisible: false,
			dialogFormAccount: false,
			dialogFormVisibleRole: false,
			formLabelWidth: '120px',
			counts: 0,
			page: 1,
			rows: 10,
			sson: '',
			xzsta: '',
			form: {
				uc: '',
				pwd: '',
				name: '',
				phone: '',
				job: ''
			},
			formEdit: {
				id: '',
				uc: '',
				pwd: '',
				name: '',
				phone: '',
				job: ''
			},
			formRole: {
				ussysid: '',
				ussysuc: '',
				ussysroleid: ''
			}
		};
	},
	mounted() {
		this.getSysUser();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getSysUser();
		},
		next_click(e) {
			this.page = e;
			this.getSysUser();
		},
		current_change(e) {
			this.page = e;
			this.getSysUser();
		},
		but_search() {
			this.page = 1;
			this.getSysUser();
		},
		edit_role(row){
			this.formRole.ussysid = row.C_ID;
			this.formRole.ussysuc = row.C_UC;
			this.formRole.ussysroleid = row.SYS_ROLE_ID;
			this.dialogFormVisibleRole = true;
			this.getAllSysRole();
		},
		edit_account(row){
			this.formEdit.id = row.C_ID;
			this.formEdit.uc = row.C_UC;
			this.formEdit.name = row.C_NAME;
			this.formEdit.phone = row.C_PHONE;
			this.formEdit.job = row.C_JOB;
			this.dialogFormAccount = true;
		},
		edit_login(row){
			var loginsta = "";
			if(row.I_LOGIN_STA == 1){
				loginsta = 0;
			}else{
				loginsta = 1;
			}
			this.$confirm('是否确定修改【' + row.C_UC + '】账号登录权限?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					id: row.C_ID,
					loginsta: loginsta
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'system/sysUser/setLoginStaSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getSysUser();
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
		del_user(row) {
			this.$confirm('是否确定删除【' + row.C_UC + '】账号信息?', '温馨提示', {
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
				this.$axios.post(sessionStorage.getItem('url') + 'system/sysUser/delSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getSysUser();
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
		but_sysuser() {
			this.dialogFormVisible = true;
		},
		sub_sysuser() {
			if (this.form.uc == '') {
				this.$message({
					showClose: true,
					message: '请输入账号',
					type: 'warning'
				});
			} else if (this.form.pwd == '') {
				this.$message({
					showClose: true,
					message: '请输入密码',
					type: 'warning'
				});
			} else if (this.form.name == '') {
				this.$message({
					showClose: true,
					message: '请输入姓名',
					type: 'warning'
				});
			} else if (this.form.phone == '') {
				this.$message({
					showClose: true,
					message: '请输入电话',
					type: 'warning'
				});
			} else if (this.form.job == '') {
				this.$message({
					showClose: true,
					message: '请输入职务',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定新建【'+this.form.uc+'】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						uc: this.form.uc,
						pwd: this.form.pwd,
						name: this.form.name,
						phone: this.form.phone,
						job: this.form.job
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysUser/setSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.getSysUser();
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
		sub_sysrole(){
			if (this.formRole.ussysroleid == '') {
				this.$message({
					showClose: true,
					message: '请选择角色名称',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定分配【'+this.formRole.ussysuc+'】账号角色信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						ussysid: this.formRole.ussysid,
						ussysroleid: this.formRole.ussysroleid
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysUser/setSysRoleUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.getSysUser();
								this.dialogFormVisibleRole = false;
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
		getSysUser() {
			var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&sson=' + this.sson + '&xzsta=' + this.xzsta;
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysUser/getSysUser' + data).then(res => {
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
		getAllSysRole() {
			var data = '?token=' + sessionStorage.getItem('token');
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysUser/getAllSysRole' + data).then(res => {
				this.fullscreenLoading = false;
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						this.listRoleData = data.data;
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
		getAllSysAccount() {
			var data = '?token=' + sessionStorage.getItem('token');
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysUser/getAllSysRole' + data).then(res => {
				this.fullscreenLoading = false;
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						this.listRoleData = data.data;
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
		sub_syAccount() {
			if (this.formEdit.uc == '') {
				this.$message({
					showClose: true,
					message: '请输入账号',
					type: 'warning'
				});
			} else if (this.formEdit.name == '') {
				this.$message({
					showClose: true,
					message: '请输入姓名',
					type: 'warning'
				});
			} else if (this.formEdit.phone == '') {
				this.$message({
					showClose: true,
					message: '请输入电话',
					type: 'warning'
				});
			} else if (this.formEdit.job == '') {
				this.$message({
					showClose: true,
					message: '请输入职务',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定修改【'+this.formEdit.uc+'】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id:  this.formEdit.id,
						uc: this.formEdit.uc,
						pwd: this.formEdit.pwd,
						name: this.formEdit.name,
						phone: this.formEdit.phone,
						job: this.formEdit.job
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysUser/updateSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
						loading.close();
						//console.log(JSON.stringify(res));
						this.formEdit.pwd = '';
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'success'
								});
								this.getSysUser();
								this.dialogFormAccount = false;
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
