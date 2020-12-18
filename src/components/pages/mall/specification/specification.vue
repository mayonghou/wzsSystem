<template>
	<div id="specification" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;">
			<el-button @click="but_sysuser" type="success" icon="el-icon-plus">新建</el-button>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="sson" placeholder="搜索条件"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" style="width: 100%">
			<el-table-column prop="C_SCNAME" label="规格名称" width="200"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="创建时间" width="200"></el-table-column>
			<el-table-column prop="UPDATE_TIME" label="更新时间" width="200"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_brand(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" layout="prev, pager, next"
		 :page-size="10" :total="counts"></el-pagination>


		<el-dialog title="新建规格" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="formgg">
				<el-form-item label="规格名称:" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改规格" :visible.sync="dialogFormAccount">
			<el-form :model="formUpdate">
				<el-form-item label="规格名称:" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.name" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="update_brand">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'specification',
		data() {
			return {
				listData: [],
				formLabelWidth: '120px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: this.counts,
				page: 1,
				rows: 10,
				sson: '',
				xzsta: '',
				form: {
					name: ''
				},
				formUpdate: {
					id: '',
					name: ''
				}
			};
		},
		mounted() {
			this.getSpecList();
		},
		methods: {
			// 删除
			del_brand(row) {
				this.$confirm('是否确定删除【' + row.C_SCNAME + '】规格信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_SCID
					};
					console.log(data)
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delSpec?token=' + sessionStorage.getItem(
						'token'), data).then(res => {
						loading.close();
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.$message({
									showClose: true,
									message: data.message,
									type: 'success'
								});
								this.getSpecList();
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
			// 修改弹框
			edit_account(row) {
				this.formUpdate.id = row.C_SCID;
				this.formUpdate.name = row.C_SCNAME
				this.dialogFormAccount = true;
			},
			// 修改提交
			update_brand() {
				if (this.formUpdate.name == '') {
					this.$message({
						showClose: true,
						message: '请输入品牌名称',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定修改【' + this.formUpdate.name + '】规格信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							id: this.formUpdate.id,
							name: this.formUpdate.name
						};
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateSpec?token=' + sessionStorage.getItem(
							'token'), data).then(res => {
							loading.close();
							if (res.status == 200) {
								var data = res.data;
								if (data.flag) {
									this.$message({
										showClose: true,
										message: data.message,
										type: 'success'
									});
									this.getSpecList();
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

			},
			// 新建
			but_sysuser() {
				this.dialogFormVisible = true;
			},
			// 新建提交
			sub_sysuser() {
				this.$refs.formgg.validate((valid) => {
				if (this.form.name == '') {
					this.$message({
						showClose: true,
						message: '请输入品牌名称',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定新建【' + this.form.name + '】规格信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							name: this.form.name
						};
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSpec?token=' + sessionStorage.getItem(
							'token'), data).then(res => {
							loading.close();
							if (res.status == 200) {
								var data = res.data;
								if (data.flag) {
									this.$message({
										showClose: true,
										message: data.message,
										type: 'success'
									});
									this.getSpecList();
									this.dialogFormVisible = false;
									this.$refs.formgg.resetFields();
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
				});
			},
			prev_click(e) {
				this.page = e;
				this.getSpecList();
			},
			next_click(e) {
				this.page = e;
				this.getSpecList();
			},
			current_change(e) {
				this.page = e;
				this.getSpecList();
			},
			but_search() {
				this.page = 1;
				this.getSpecList();
			},
			getSpecList() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSpecList' + data).then(res => {
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
