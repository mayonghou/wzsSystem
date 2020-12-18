<template>
	<div id="usermanage">
		<div class="nva">
			<div @click="but_sysuser" class="nvames" style="color: #0074D9;">
				<i class="el-icon-plus"></i>
				新建
			</div>
			<div style="clear: both;"></div>
		</div>
		<el-table :data="userData" border style="width: 100%">
			<el-table-column prop="I_ID" label="账号ID" width="120"></el-table-column>
			<el-table-column prop="C_UC" label="账号" width="120"></el-table-column>
			<el-table-column prop="C_NAME" label="姓名" width="120"></el-table-column>
			<el-table-column prop="C_PHONE" label="电话" width="120"></el-table-column>
			<el-table-column prop="D_TIME" label="注册时间" width="200"></el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="del_user(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="新增系统账号" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="账号" :label-width="formLabelWidth"><el-input v-model="form.uc" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="密码" :label-width="formLabelWidth"><el-input v-model="form.pwd" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="姓名" :label-width="formLabelWidth"><el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="电话" :label-width="formLabelWidth"><el-input v-model="form.phone" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'usermanage',
	data() {
		return {
			userData: [],
			dialogFormVisible: false,
			formLabelWidth: '120px',
			form: {
				uc: '',
				pwd: '',
				name: '',
				phone: ''
			}
		};
	},
	mounted() {
		this.getSysUser();
	},
	methods: {
		del_user(row) {
			this.$confirm('是否确定删除【'+row.C_UC+'】账号信息?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(() => {
				let data = {
					id: row.I_ID
				};
				const loading = this.$loading({
				  lock: true,
				  text: '保存中...',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/delSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
			} else {
				let data = {
					uc: this.form.uc,
					pwd: this.form.pwd,
					name: this.form.name,
					phone: this.form.phone
				};
				const loading = this.$loading({
				  lock: true,
				  text: '保存中...',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setSysUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
			}
		},
		getSysUser() {
			this.$axios.get(sessionStorage.getItem('url') + 'sys/system/getSysUser?token=' + sessionStorage.getItem('token')).then(res => {
				//console.log(JSON.stringify(res));
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						this.userData = data.data;
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
