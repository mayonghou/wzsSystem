<template>
	<div id="specification_value" v-loading="fullscreenLoading" :element-loading-text="loadingText"
	 element-loading-background="rgba(0, 0, 0, 0.7)">
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
			<el-table-column prop="SPEC" label="规格名称" width="200"></el-table-column>
			<el-table-column prop="C_SCVE_VALUE" label="规格值名称" width="200"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="创建时间" width="200"></el-table-column>
			<el-table-column prop="UPDATE_TIME" label="更新时间" width="200"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_brand(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@prev-click="prev_click"
			@next-click="next_click"
			@current-change="current_change"
			layout="prev, pager, next"
			:page-size="10"
			:total="counts">
		</el-pagination>


		<el-dialog title="新建规格值" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="formggz">
				<el-form-item label="规格名称:" prop="name" :label-width="formLabelWidth">
					<el-select v-model="form.name" placeholder="---请选择---" @change="specId">
						<el-option v-for="item in List" :label="item.C_SCNAME" :key="item.C_SCID" :value="item.C_SCID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规格值:" prop="value" :label-width="formLabelWidth">
					<el-input v-model="form.value" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改规格值" :visible.sync="dialogFormAccount">
			<el-form :model="formUpdate">
				<el-form-item label="规格名称:" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.specId" placeholder="---请选择---">
						<el-option v-for="item in List" :label="item.C_SCNAME" :key="item.C_SCID" :value="item.C_SCID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规格值:" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.value" autocomplete="off"></el-input>
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
		name: 'specification_value',
		data() {
			return {
				listData: this.listData,
				List: this.List,
				formLabelWidth: '120px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: this.counts,
				message:'',
				page: 1,
				rows: 10,
				sson: '',
				xzsta: '',
				form: {
					specId: this.specId,
					name: '',
					value: ''
				},
				formUpdate: {
					id: '',
					name: '',
					value: '',
					specId: ''
				}
			};
		},
		mounted() {
			this.getSpecValue();
			this.getSpecListAll();
		},
		methods: {
			specId(id) {
				var obj = {};
				obj = this.List.find((item) => {
					 return item.C_SCID === id;
				})
				var specId = obj.C_SCID;
				this.specId = specId;
			},
			// 删除
			del_brand(row) {
				this.$confirm('是否确定删除【' + row.C_SCVE_VALUE + '】规格值信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_SCVE_ID
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delSpecValue?token=' + sessionStorage.getItem(
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
								this.getSpecValue();
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
				this.formUpdate.specId = row.GS_SPEC_ID;
				this.formUpdate.id = row.C_SCVE_ID;
				this.formUpdate.value = row.C_SCVE_VALUE;
				this.dialogFormAccount = true;
			},
			// 修改提交
			update_brand() {
				if (this.formUpdate.value == '') {
					this.$message({
						showClose: true,
						message: '请输入规格值',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定修改【' + this.formUpdate.value + '】规格值信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							id: this.formUpdate.id,
							value: this.formUpdate.value,
							specId: this.formUpdate.specId
						};
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateSpecValue?token=' + sessionStorage.getItem(
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
									this.getSpecValue();
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
				this.$refs.formggz.validate((valid) => {
				if (this.form.value == '') {
					this.$message({
						showClose: true,
						message: '请输入规格值',
						type: 'warning'
					});
				} else if (this.form.specId == '') {
					this.$message({
						showClose: true,
						message: '请输入规格ID',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定新建【' + this.form.value + '】规格值信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							specId: this.specId,
							value: this.form.value
						};
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSpecValue?token=' + sessionStorage.getItem(
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
									this.getSpecValue();
									this.$refs.formggz.resetFields();
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
				this.getSpecValue();
			},
			next_click(e) {
				this.page = e;
				this.getSpecValue();
			},
			current_change(e) {
				this.page = e;
				this.getSpecValue();
			},
			but_search() {
				this.page = 1;
				this.getSpecValue();
			},
			getSpecValue() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSpecValue' + data).then(res => {
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
			getSpecListAll() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSpecListAll' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.List = data.data;
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
