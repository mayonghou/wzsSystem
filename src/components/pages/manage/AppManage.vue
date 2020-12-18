<template>
	<div id="manage" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" border style="width: 100%">
			<el-table-column prop="C_REMARKS" label="备注设备" width="200"></el-table-column>
			<el-table-column prop="C_BRAND" label="手机品牌" width="100"></el-table-column>
			<el-table-column prop="C_MODEL" label="手机型号" width="100"></el-table-column>
			<el-table-column prop="C_PLATFORM" label="操作系统" width="100"></el-table-column>
			<el-table-column prop="STATEMES" label="授权状态" width="100"></el-table-column>
			<el-table-column prop="D_STATE_TIME" label="授权时间" width="136"></el-table-column>
			<el-table-column prop="D_TIME" label="创建时间" width="136"></el-table-column>
			<el-table-column prop="C_IMEI" label="IMEI" width="246"></el-table-column>
			<el-table-column prop="C_IMSI" label="IMSI" width="246"></el-table-column>
			<el-table-column prop="C_UUID" label="UUID" width="246"></el-table-column>
			<el-table-column label="操作" width="180" fixed="right" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_app(scope.row)" type="text" size="small">授权设备</el-button>
					<el-button @click="del_user(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="授权设备" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="授权状态">
				    <el-radio-group v-model="sysappstate">
						<el-radio label="0">未授权</el-radio>
						<el-radio label="1">已授权</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="备注信息">
					<el-input type="textarea" v-model="sysappremarks"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_app">提交</el-button>
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
			loadingText: '加载中...',
			loadingText: '加载中...',
			dialogFormVisible: false,
			formLabelWidth: '120px',
			rolename: '',
			timer: '',
			sysappstate: '',
			sysappremarks: '',
			sysappid: ''
		};
	},
	mounted() {
		this.getAllMesSysApp();
	},
	methods: {
		del_user(row) {
			this.$confirm('是否确定删除【' + row.C_REMARKS + '】设备信息吗?', '温馨提示', {
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
				this.$axios.post(sessionStorage.getItem('url') + 'system/sysApp/setDelMesSysApp?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getAllMesSysApp();
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
		edit_app(row) {
			this.sysappstate = row.I_STATE;
			this.sysappremarks = row.C_REMARKS;
			this.sysappid = row.C_ID;
			this.dialogFormVisible = true;
		},
		sub_app() {
			if (this.sysappremarks == undefined) {
				this.$message({
					showClose: true,
					message: '请填写设备备注',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定授权该设备?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						sysappstate: this.sysappstate,
						sysappremarks: this.sysappremarks,
						sysappid: this.sysappid
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'system/sysApp/setStateMesSysApp?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.dialogFormVisible = false;
								this.getAllMesSysApp();
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
		getAllMesSysApp() {
			var data = '?token=' + sessionStorage.getItem('token');
			this.$axios.get(sessionStorage.getItem('url') + 'system/sysApp/getAllMesSysApp' + data).then(res => {
				this.fullscreenLoading = false;
				console.log(JSON.stringify(res));
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
