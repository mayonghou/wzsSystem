<template>
	<div id="brand" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
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
			<el-table-column prop="C_BRNAME" label="品牌名称" width="160"></el-table-column>
			<el-table-column prop="C_BRICON" label="图片" width="100">
				<template slot-scope="scope">
					<img width="80" :src="scope.row.C_BRICON" />
				</template>
			</el-table-column>
			<el-table-column prop="C_BRNUM" label="序号" width="100"></el-table-column>
			<el-table-column prop="STATE" label="状态" width="100"></el-table-column>
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
			:page-size="10"
			:total="counts"
			layout="prev, pager, next"
			>
		</el-pagination>
		 

		<el-dialog title="新建品牌" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="brand">
				<el-form-item label="品牌" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="品牌图片" prop="imageUrl" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :file-list="fileList" :action="action" :limit='1' list-type="picture-card"
					 :on-change="changeUpload" :auto-upload="false" :on-success="imgUploadSuccess" :on-remove="removeUpload" ref="upload"
					 multiple>
						<!-- <img width="100%" height="100%" v-if="formdata.imageUrl" :src="formdata.imageUrl" class="avatar"> -->
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="序号" prop="sort" :label-width="formLabelWidth">
					<el-input v-model="form.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="stare" :label-width="formLabelWidth">
					<el-select v-model="form.stare">
						<el-option label="显示" value="1">
						</el-option>
						<el-option label="不显" value="0">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_sysuser">提交</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改" :visible.sync="dialogFormAccount" @close="closeDialog">
			<el-form :model="formUpdate" ref="brandUpdate">
				<el-form-item label="品牌" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="品牌图片" prop="imageUrl" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :file-list="fileList" :action="action" :limit='1' list-type="picture-card"
					 :on-change="changeUpload" :auto-upload="false" :on-success="imgUpdateSuccess" :on-remove="removeUpload" ref="upload"
					 multiple>
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="序号" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.stare" autocomplete="off">
						<el-option label="显示" :value="1">
						</el-option>
						<el-option label="不显" :value="0">
						</el-option>
					</el-select>
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
		name: 'brand',
		data() {
			return {
				listData: [],
				fileList:[],
				icon:'',
				formLabelWidth: '130px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				updatedata:'',
				counts: this.counts,
				action: '',
				page: 1,
				rows: 10,
				sson: '',
				data:'',
				form: {
					name: '',
					imageUrl: '',
					sort: '',
					stare: ''
				},
				formUpdate: {
					id: '',
					name: '',
					imageUrl: '',
					sort: '',
					stare: ''
				}
			};
		},
		mounted() {
			this.getBarndList();
		},
		methods: {
			closeDialog() {
				this.fileList = [];
			},
			changeUpload(file, fileList) {
				if (fileList.length >= 1) {
					this.uploadDisabled = true;
				}
				var url = window.URL.createObjectURL(file.raw);
				this.form.imageUrl = url;
				this.form.file = file;
				this.formUpdate.imageUrl = url;
				this.formUpdate.file = file;
				this.imgData = true;
				this.action = sessionStorage.getItem('urlMall') + 'utils/oos/uploadGOosp?fileName=' + file.name;
			},
			removeUpload(file, fileList) {
				this.imgData = false;
				this.imgList = fileList;
				this.uploadDisabled = false;
			},
			imgUploadSuccess(response, file, filelist) {
				if (response.flag) {
					this.data.icon = response.data;
					this.addBrand();
				}
			},
			addBrand(){
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addBrand?token=' + sessionStorage.getItem(
					'token'), this.data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.getBarndList();
							this.dialogFormVisible = false;
							// this.$refs.brand.resetFields();
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
			imgUpdateSuccess(response, file, filelist) {
				if (response.flag) {
					this.updatedata.icon = response.data;
					this.updateBarand();
				}
			},
			updateBarand(){
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateBarand?token=' + sessionStorage.getItem(
					'token'), this.updatedata).then(res => {
					console.log(this.updatedata);
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.getBarndList();
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
			},
			// 删除
			del_brand(row) {
				this.$confirm('是否确定删除【' + row.C_BRNAME + '】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						brandId: row.I_BRID
					};
					console.log(data)
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delBarand?token=' + sessionStorage.getItem(
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
								this.getBarndList();
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
				this.formUpdate.id = row.I_BRID;
				this.formUpdate.name = row.C_BRNAME;
				this.formUpdate.imageUrl = row.C_BRICON;
				this.fileList.push({
					url: row.icon
				});
				this.formUpdate.sort = row.C_BRNUM;
				this.formUpdate.stare = row.I_BRSTATE;
				this.dialogFormAccount = true;
			},
			// 修改提交
			update_brand() {
				this.$refs.brandUpdate.validate((valid) => {
					if (this.formUpdate.name == '') {
						this.$message({
							showClose: true,
							message: '请输入品牌名称',
							type: 'warning'
						});
					} else if (this.formUpdate.imageUrl == '') {
						this.$message({
							showClose: true,
							message: '请选择图片',
							type: 'warning'
						});
					} else if (this.formUpdate.sort == '') {
						this.$message({
							showClose: true,
							message: '请输入序号',
							type: 'warning'
						});
					} else if (this.formUpdate.stare.toString() == '') {
						this.$message({
							showClose: true,
							message: '请输入状态',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定修改【' + this.formUpdate.name + '】品牌信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let updatedata = {
								id: this.formUpdate.id,
								name: this.formUpdate.name,
								icon: '',
								sort: this.formUpdate.sort,
								stare: this.formUpdate.stare
							};
							this.updatedata = updatedata;
							const loading = this.$loading({
								lock: true,
								text: '修改中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$refs.upload.submit();
							
							this.timer = setInterval(() => {
								loading.close();
							}, 4000)
						});
					}
				});
			},
			// 新建
			but_sysuser() {
				this.dialogFormVisible = true;
			},
			// 新建提交
			sub_sysuser() {
				this.$refs.brand.validate((valid) => {
					if (this.form.name == '') {
						this.$message({
							showClose: true,
							message: '请输入品牌名称',
							type: 'warning'
						});
					} else if (this.form.sort == '') {
						this.$message({
							showClose: true,
							message: '请输入序号',
							type: 'warning'
						});
					} else if (this.form.imageUrl == '') {
						this.$message({
							showClose: true,
							message: '请选择图片',
							type: 'warning'
						});
					} else if (this.form.stare == '') {
						this.$message({
							showClose: true,
							message: '请输入状态',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定新建【' + this.form.name + '】品牌信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let data = {
								name: this.form.name,
								icon: '',
								sort: this.form.sort,
								stare: this.form.stare
							};
							this.data = data;
							const loading = this.$loading({
								lock: true,
								text: '保存中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$refs.upload.submit();
							this.$refs.brand.resetFields();
							this.dialogFormVisibleMenu = false;
							this.timer = setInterval(() => {
								loading.close();
							}, 4000)
							
						});
					}
				});
			},
			prev_click(e) {
				this.page = e;
				this.getBarndList();
			},
			next_click(e) {
				this.page = e;
				this.getBarndList();
			},
			current_change(e) {
				this.page = e;
				this.getBarndList();
			},
			but_search() {
				this.page = 1;
				this.getBarndList();
			},
			getBarndList() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getBarndList' + data).then(res => {
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
