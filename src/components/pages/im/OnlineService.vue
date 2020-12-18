<template>
	<div id="onlineService" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
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
			<el-table-column prop="C_MES" label="快捷回复内容" width="220"></el-table-column>
			<el-table-column prop="I_NUM" label="排序编号" width="100"></el-table-column>
			<el-table-column prop="TIME" label="时间" width="200"></el-table-column>
			<el-table-column prop="RANGE" label="范围" width="100"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_brand(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" layout="prev, pager, next"
		 :page-size="10" :total="counts"></el-pagination>

		<el-dialog title="新建快捷内容" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="快捷回复内容" :label-width="formLabelWidth">
					<el-input v-model="form.text" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号" :label-width="formLabelWidth">
					<el-input v-model="form.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="范围" :label-width="formLabelWidth">
					<el-select v-model="form.range" autocomplete="off">
						<el-option label="本人" value="1">
						</el-option>
						<el-option label="所有人" value="0">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改快捷内容" :visible.sync="dialogFormAccount">
			<el-form :model="formUpdate">
				<el-form-item label="快捷回复内容" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.text" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="范围" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.range">
						<el-option label="所有人" value="0">
						</el-option>
						<el-option label="本人" value="1">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="sub_update">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'onlineService',
		data() {
			return {
				listData: [],
				formLabelWidth: '120px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: 0,
				page: 1,
				rows: 10,
				sson: '',
				xzsta: '',
				form: {
					text: '',
					createTime: '',
					sort: '',
					range: ''
				},
				formUpdate: {
					id: '',
					text: '',
					createTime: '',
					sort: '',
					range: ''
				}
			};
		},
		mounted() {
			this.getQuickReplyList();
		},
		methods: {
			// 删除
			del_brand(row) {
				this.$confirm('是否确定删除【' + row.C_MES + '】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_ID
					};
					console.log(data)
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlSocket') + 'socket/socket/delQuickReply?token=' + sessionStorage.getItem(
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
								this.getQuickReplyList();
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
				this.formUpdate.id = row.C_ID;
				this.formUpdate.text = row.C_MES;
				this.formUpdate.sort = row.I_NUM;
				// this.formUpdate.range = row.RANGE;
				this.dialogFormAccount = true;
			},
			// 修改提交
			sub_update() {
				if (this.formUpdate.text == '') {
					this.$message({
						showClose: true,
						message: '请输入回复内容',
						type: 'warning'
					});
				} else if (this.formUpdate.sort == '') {
					this.$message({
						showClose: true,
						message: '请输入编号',
						type: 'warning'
					});
				} else if (this.formUpdate.range == '') {
					this.$message({
						showClose: true,
						message: '请输入范围',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定修改【' + this.formUpdate.text + '】回复信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							id: this.formUpdate.id,
							content: this.formUpdate.text,
							sort: this.formUpdate.sort,
							range: this.formUpdate.range
						};
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlSocket') + 'socket/socket/updateQuickReply?token=' + sessionStorage.getItem(
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
									this.dialogFormAccount = false;
									this.getQuickReplyList();
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
				if (this.form.text == '') {
					this.$message({
						showClose: true,
						message: '请输入回复内容',
						type: 'warning'
					});
				} else if (this.form.sort == '') {
					this.$message({
						showClose: true,
						message: '请输入编号',
						type: 'warning'
					});
				} else if (this.form.range == '') {
					this.$message({
						showClose: true,
						message: '请输入范围',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定新建【' + this.form.text + '】回复信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							content: this.form.text,
							range: this.form.range,
							sort: this.form.sort,
						};
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlSocket') + 'socket/socket/addQuickReply?token=' + sessionStorage.getItem(
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
									this.dialogFormVisible = false;
									this.getQuickReplyList();
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
			prev_click(e) {
				this.page = e;
				this.getQuickReplyList();
			},
			next_click(e) {
				this.page = e;
				this.getQuickReplyList();
			},
			current_change(e) {
				this.page = e;
				this.getQuickReplyList();
			},
			but_search() {
				this.page = 1;
				this.getQuickReplyList();
			},
			getQuickReplyList() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlSocket') + 'socket/socket/getQuickReplyList' + data).then(res => {
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
