<template>
	<div id="banner" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
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
			<el-table-column prop="I_NUM" label="序号"></el-table-column>
			<el-table-column prop="C_RNNAME" label="轮播名称" width="160"></el-table-column>
			<el-table-column prop="C_IMG" label="轮播图片" width="160">
				<template slot-scope="scope">
					<img width="80" :src="scope.row.C_IMG" />
				</template>
			</el-table-column>
			<el-table-column prop="STA" label="跳转准许"></el-table-column>
			<el-table-column prop="C_RNURL" label="跳转地址"></el-table-column>
			<el-table-column prop="TZSTA" label="跳转方式"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="上传时间" width="100"></el-table-column>
			<el-table-column prop="STATE" label="状态" width="100"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_brand(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" :current-page="page"
		 :page-size="10" :total="counts" layout="prev, pager, next">
		</el-pagination>

		<el-dialog title="新建轮播" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="formadd">
				<el-form-item label="轮播名称" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="上传轮播图片" prop="imageUrl" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :limit='1' :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgUploadSuccess"  :on-remove="removeUpload" ref="upload">
						<!-- <img width="100%" height="100%" v-if="formdata.imageUrl" :src="formdata.imageUrl" class="avatar"> -->
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="序号" prop="sort" :label-width="formLabelWidth">
					<el-input v-model="form.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="state" :label-width="formLabelWidth">
					<el-select v-model="form.state" autocomplete="off">
						<el-option label="已上线" value="1">
						</el-option>
						<el-option label="未上线" value="0">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否准许跳转" prop="sta" :label-width="formLabelWidth">
					<el-select v-model="form.sta" autocomplete="off">
						<el-option label="准许" value="1">
						</el-option>
						<el-option label="不准许" value="0">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转路劲" prop="jumpUrl" v-show="form.sta == 1" :label-width="formLabelWidth">
					<el-input v-model="form.jumpUrl" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="跳转方式" prop="jumpMode" v-show="form.sta == 1" :label-width="formLabelWidth">
					<el-select v-model="form.jumpMode" autocomplete="off">
						<el-option label="外部网页跳转" value="1">
						</el-option>
						<el-option label="内部APP跳转" value="0">
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
			<el-form :model="formUpdate" ref="formupdate">
				<el-form-item label="轮播名称" prop="name" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="上传轮播图片" prop="imageUrl" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :file-list="fileList" :action="action" :limit='1' list-type="picture-card"
					 :on-change="changeUpload" :auto-upload="false" :on-success="imgUpdateSuccess" :on-remove="removeUpload" ref="upload"
					 multiple>
						<!-- <img width="100%" height="100%" v-if="formdata.imageUrl" :src="formdata.imageUrl" class="avatar"> -->
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="序号" prop="sort" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.sort" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="state" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.state" autocomplete="off">
						<el-option label="已上线" :value= "1">
						</el-option>
						<el-option label="未上线" :value= "0">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否准许跳转" prop="sta" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.sta" autocomplete="off">
						<el-option label="准许" :value= "1">
						</el-option>
						<el-option label="不准许" :value= "0">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转路径" prop="jumpUrl" v-show="formUpdate.sta == 1" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.jumpUrl" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="跳转方式" prop="jumpMode" v-show="formUpdate.sta == 1" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.jumpMode" autocomplete="off">
						<el-option label="外部网页跳转" :value= "1">
						</el-option>
						<el-option label="内部APP跳转" :value= "0">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="update_banner">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'banner',
		data() {
			return {
				listData: [],
				imageUrl: '',
				imgData: false,
				fileList: [],
				formLabelWidth: '130px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: this.counts,
				page: 1,
				rows: 10,
				sson: '',
				imgUrl: '',
				imgList: [],
				fileupload: [],
				imgId: [],
				action: '',
				dataUpload: {},
				data:{},
				dialogImageUrl: '',
				dialogVisible: false,
				disabled: false,
				form: {
					name: '',
					imageUrl: '',
					sort: '',
					state: '',
					sta: '',
					jumpMode: '',
					jumpUrl: '',
					file: {}
				},
				formUpdate: {
					id: '',
					name: '',
					imageUrl: '',
					sort: '',
					state: '',
					sta: '',
					jumpUrl: '',
					jumpMode: '',
					file: {}
				}
			};
		},
		mounted() {
			this.getRotationChartList();
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
					this.dataUpload.imgUrl = response.data;
					this.addRotationChart();
					// this.getRotationChartList();
				}
			},
			addRotationChart() {
				var data = this.dataUpload;
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addRotationChart?token=' + sessionStorage.getItem(
					'token'), this.dataUpload).then(res => {
					console.log(this.dataUpload);
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.getRotationChartList();
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
					this.data.imgUrl = response.data;
					this.updateRotationChart();
				}
			},
			updateRotationChart() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateRotationChart?token=' + sessionStorage.getItem(
					'token'), this.data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.dialogFormAccount = false;
							this.getRotationChartList();
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
				this.$confirm('是否确定删除【' + row.C_RNNAME + '】轮播信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.I_RNID
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delRotationChart?token=' + sessionStorage.getItem(
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
								this.getRotationChartList();
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
				this.fileList = [];
				this.formUpdate.id = row.I_RNID;
				this.formUpdate.name = row.C_RNNAME;
				this.fileList.push({
					url: row.C_IMG
				});
				this.formUpdate.sort = row.I_NUM;
				this.formUpdate.state = row.I_STATE;
				this.formUpdate.sta = row.I_STA;
				this.formUpdate.jumpUrl = row.C_RNURL;
				this.formUpdate.jumpMode = row.I_TZSTA;
				this.dialogFormAccount = true;
			},
			// 修改 提交
			update_banner() {
				this.$refs.formupdate.validate((valid) => {
					if (this.formUpdate.name == '') {
						return this.$message({
							showClose: true,
							message: "轮播名称不能为空",
							type: 'error'
						});
					} else if (this.formUpdate.sort == '') {
						return this.$message({
							showClose: true,
							message: "序号不能为空",
							type: 'error'
						});
					} else if (this.formUpdate.state.toString() == '') {
						return this.$message({
							showClose: true,
							message: "状态不能为空",
							type: 'error'
						});
					} else if (this.formUpdate.sta == 1) {
						if (this.formUpdate.jumpUrl == '') {
							return this.$message({
								showClose: true,
								message: "跳转路径不能为空",
								type: 'error'
							});
						} else if (this.formUpdate.jumpMode.toString() == '') {
							return this.$message({
								showClose: true,
								message: "跳转方式不能为空",
								type: 'error'
							});
						}
					}
					this.$confirm('是否确定修改【' + this.formUpdate.name + '】轮播信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						var data = {
							id: this.formUpdate.id,
							name: this.formUpdate.name,
							jumpUrl: this.formUpdate.jumpUrl,
							sort: this.formUpdate.sort,
							state: this.formUpdate.state,
							sta: this.formUpdate.sta,
							jumpMode: this.formUpdate.jumpMode,
							imgUrl: ''
						}
						this.data = data;
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						if (this.imgData) {
							this.$refs.upload.submit();
							
						} else {
							this.updateRotationChart();
						}
						this.timer = setInterval(() => {
							loading.close();
						}, 4000)
					});
				});
			},
			// 新建 弹框
			but_sysuser() {
				this.dialogFormVisible = true;
				this.fileupload = [];
			},
			// 新建提交
			sub_sysuser() {
				this.$refs.formadd.validate((valid) => {
					if (this.form.name == '') {
						return this.$message({
							showClose: true,
							message: "轮播名称不能为空",
							type: 'error'
						});
					} else if (this.form.imageUrl == '') {
						return this.$message({
							showClose: true,
							message: "轮播图片不能为空",
							type: 'error'
						});
					} else if (this.form.sort == '') {
						return this.$message({
							showClose: true,
							message: "序号不能为空",
							type: 'error'
						});
					} else if (this.form.state == '') {
						return this.$message({
							showClose: true,
							message: "状态不能为空",
							type: 'error'
						});
					} else if (this.form.sta == '') {
						return this.$message({
							showClose: true,
							message: "跳转允许不能为空",
							type: 'error'
						});
					} else if (this.form.sta == 1) {
						if (this.form.jumpUrl == '') {
							return this.$message({
								showClose: true,
								message: "跳转路径不能为空",
								type: 'error'
							});
						} else if (this.form.jumpMode == '') {
							return this.$message({
								showClose: true,
								message: "跳转方式不能为空",
								type: 'error'
							});
						}
					}
					this.$confirm('是否确定新建【' + this.form.name + '】品牌信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						var dataUpload = {
							name: this.form.name,
							jumpUrl: this.form.jumpUrl,
							sort: this.form.sort,
							state: this.form.state,
							sta: this.form.sta,
							jumpMode: this.form.jumpMode,
							imgUrl: ''
						};
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.dataUpload = dataUpload;
						this.$refs.upload.submit();
						this.dialogFormVisible = false;
						this.$refs.formadd.resetFields();
						this.timer = setInterval(() => {
							loading.close();
						}, 4000)
					});
				});
			},
			prev_click(e) {
				this.page = e;
				this.getRotationChartList();
			},
			next_click(e) {
				this.page = e;
				this.getRotationChartList();
			},
			current_change(e) {
				this.page = e;
				this.getRotationChartList();
			},
			but_search() {
				this.page = 1;
				this.getRotationChartList();
			},
			getRotationChartList() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows +
					'&search=' + this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getRotationChartList' + data).then(res => {
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

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}

	.avatar {
		width: 148px;
		height: 148px;
		display: block;
	}
</style>
