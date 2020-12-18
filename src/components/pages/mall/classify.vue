<template>
	<div id="classifyAdmin" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;">
			<el-button @click="but_add" type="success" icon="el-icon-plus">新建主分类</el-button>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="sson" placeholder="快捷搜索条件"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" style="width: 100%;margin-bottom: 20px;" row-key="cId" border default-expand-all
		 :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column prop="name" label="分类名称" width="300"></el-table-column>
			<el-table-column prop="icon" label="图标ICON" width="200">
				<template slot-scope="scope">
					<img width="80" :src="scope.row.icon" />
				</template>
			</el-table-column>
			<el-table-column prop="stare" label="状态" width="100"></el-table-column>
			<el-table-column prop="sort" label="序号" width="136"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button v-show="scope.row.num != 3" @click="add_menu(scope.row)" type="text" size="small">新建分类</el-button>
					<el-button @click="edit_menu(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_menu(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新建分类窗口  -->
		<el-dialog :title="tileMenu" :visible.sync="dialogFormVisibleMenu">
			<el-form :model="formMenu" ref="formadd">
				<el-form-item label="上级名称" :label-width="formLabelWidth">
					<el-input v-model="formMenu.cNamee" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类名称" prop="cName" :label-width="formLabelWidth">
					<el-input v-model="formMenu.cName" maxlength="10" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="序号" prop="cSort" :label-width="formLabelWidth">
					<el-input v-model="formMenu.cSort" maxlength="30" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类图标" prop="cIcon" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :limit='1' :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgUploadSuccess" :file-list="fileupload" :on-remove="removeUpload" ref="upload">
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="状态" prop="cStare" :label-width="formLabelWidth">
					<el-select v-model="formMenu.cStare" autocomplete="off">
						<el-option label="显示" value="1">
						</el-option>
						<el-option label="不显示" value="0">
						</el-option>
					</el-select>
				</el-form-item>
				<div>注：ICON图标获取方式：https://element.eleme.cn/#/zh-CN/component/icon</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="quxiao">取 消</el-button>
				<el-button type="primary" @click="sub_sysMenu()">提交</el-button>
			</div>
		</el-dialog>

		<!-- 修改窗口 -->
		<el-dialog title="修改分类" :visible.sync="dialogFormVisibleEditMenu" @change="closeDialog">
			<el-form :model="formEditMenu" ref="updataFoem">
				<el-form-item label="上级名称" :label-width="formLabelWidth">
					<el-select v-model="formEditMenu.cPid" placeholder="---请选择---">
						<el-option label="主分类" :value="0"></el-option>
						<el-option v-for="item in listData" v-if="item.cId != formEditMenu.cId" :key="item.cId" :label="item.name" :value="item.cId">
						</el-option>
						<el-option v-for="list in updateData" v-if="list.cId != formEditMenu.cId" :key="list.cId" :label="list.name"
						 :value="list.cId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类名称"prop="cName" :label-width="formLabelWidth">
					<el-input v-model="formEditMenu.cName" maxlength="10" show-word-limit autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类图标" prop="cIcon" :label-width="formLabelWidth">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :limit='1' :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgUpdateSuccess" :file-list="fileList" :on-remove="removeUpload" ref="upload">
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="序号" prop="cSort" :label-width="formLabelWidth">
					<el-input v-model="formEditMenu.cSort" maxlength="50" show-word-limit autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="状态" prop="cStare" :label-width="formLabelWidth">
					<el-select v-model="formEditMenu.cStare" autocomplete="off">
						<el-option label="不显示" :value="0">
						</el-option>
						<el-option label="显示" :value="1">
						</el-option>
					</el-select>
				</el-form-item>
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
		name: 'classifyAdmin',
		data() {
			return {
				listData: [],
				tableData: this.tableData,
				updateData: '',
				children: [],
				listRoleData: [],
				fileupload: [],
				fileList: [],
				data: '',
				dialogFormVisibleMenu: false,
				dialogFormVisibleEditMenu: false,
				formLabelWidth: '130px',
				fullscreenLoading: true,
				loadingText: '加载中...',
				tileMenu: '',
				sson: '',
				action: '',
				imgUrl: '',
				formMenu: {
					cId: '',
					cPid: '',
					cName: '',
					cSort: '',
					cStare: '',
					cIcon: '',
					file: {}
				},
				formEditMenu: {
					cId: '',
					cPid: '',
					cNamee: '',
					cName: '',
					cStare: '',
					cSort: '',
					cIcon: this.cIcon,
					file: {}
				},
				loading: '',
				cIcon:'',
				update:'',
				imgData: false
			};
		},
		mounted() {
			this.getCategoryList();
		},
		methods: {
			but_add() {
				this.fileupload = [];
				this.tileMenu = "新建主分类";
				this.formMenu.num = "1";
				this.formMenu.cNamee = "主分类";
				this.dialogFormVisibleMenu = true;
			},
			add_menu(row) {
				this.fileupload = [];
				this.tileMenu = "新建下级分类";
				this.formMenu.cId = row.cId;
				this.formMenu.num = row.num;
				this.formMenu.cNamee = row.name;
				this.dialogFormVisibleMenu = true;
			},
			// 修改 弹框
			edit_menu(row) {
				this.fileList = [];
				this.updateData = this.tableData[row.index].children;
				this.formEditMenu.cId = row.cId;
				this.formEditMenu.cPid = row.cPid;
				this.formEditMenu.num = row.num;
				this.formEditMenu.cName = row.name;
				this.fileList.push({
					url: row.icon
				});
				this.formEditMenu.cNamee = row.cPid;
				this.formEditMenu.cSort = row.sort;
				this.formEditMenu.cStare = row.i_stare;
				this.dialogFormVisibleEditMenu = true;
			},
			closeDialog() {
				this.fileList = [];
			},
			changeUpload(file, fileList) {
				if (fileList.length >= 1) {
					this.uploadDisabled = true;
				}
				var url = window.URL.createObjectURL(file.raw);
				this.formMenu.cIcon = url;
				this.formMenu.file = file;
				this.formEditMenu.cIcon = url;
				this.formEditMenu.file = file;
				this.imgData = true;
				this.action = sessionStorage.getItem('urlMall') + 'utils/oos/uploadGOosp?fileName=' + file.name;
			},
			removeUpload(file, fileList) {
				this.imgData = false;
				this.imgList = fileList;
				this.uploadDisabled = false;
			},
			imgUpdateSuccess(response, file, filelist) {
				if (response.flag) {
					this.update.cIcon = response.data;
					this.updateCategory();
				}
			},
			updateCategory(){
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateCategory?token=' + sessionStorage.getItem(
					'token'), this.update).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.dialogFormVisibleEditMenu = false;
							this.getCategoryList();
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
			imgUploadSuccess(response, file, filelist) {
				if (response.flag) {
					this.data.cIcon = response.data;
					this.addCategory();
					this.getCategoryList();
				}
			},
			addCategory() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addCategory?token=' + sessionStorage.getItem(
					'token'), this.data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.formMenu.cId = '';
							this.formMenu.cIcon = '';
							this.dialogFormVisibleMenu = false;
							this.getCategoryList();
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
			// 新建 提交
			sub_sysMenu() {
				this.$refs.formadd.validate((valid) => {
					if (this.formMenu.cName == "") {
						return this.$message({
							showClose: true,
							message: "分类名称不能为空",
							type: 'error'
						});
					} else if (this.formMenu.cSort == "") {
						return this.$message({
							showClose: true,
							message: "序号不能为空",
							type: 'error'
						});
					} else if (this.formMenu.cStare == "") {
						return this.$message({
							showClose: true,
							message: "状态不能为空",
							type: 'error'
						});
					}
					if (this.formMenu.num == 2) {
						if (this.formMenu.cIcon == "") {
							return this.$message({
								showClose: true,
								message: "分类图标不能为空",
								type: 'error'
							});
						}
					}
					this.$confirm('是否确定新建【' + this.formMenu.cName + '】分类信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							cPid: this.formMenu.cId,
							cName: this.formMenu.cName,
							cIcon: '',
							cStare: this.formMenu.cStare,
							cSort: this.formMenu.cSort
						};
						this.data = data;
						
						const loading = this.$loading({
							lock: true,
							text: '保存中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						console.log(this.formMenu.cIcon)
						console.log("芳姐瓯都市平均分都是")
						if (this.formMenu.cIcon != "") {
							this.$refs.upload.submit();
						} else {
							this.addCategory();
						}
						this.$refs.formadd.resetFields();
						this.dialogFormVisibleMenu = false;
						this.timer = setInterval(() => {
							loading.close();
						}, 4000)
					});
				});
			},

			but_search() {
				this.getCategoryList();
			},
			quxiao() {
				this.$refs.formadd.validate((valid) => {
					this.dialogFormVisibleMenu = false;
					this.$refs.formadd.resetFields();
				});
			},
			// 删除
			del_menu(row) {
				this.$confirm('是否确定删除【' + row.name + '】分类信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						cId: row.cId
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delCategory?token=' + sessionStorage.getItem(
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
								this.getCategoryList();
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
			// 查询
			getCategoryList() {
				var data = '?token=' + sessionStorage.getItem('token') + '&search=' + this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getCategoryList' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.listData = data.data;
							this.tableData = data.data;
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
			// 修改 提交
			sub_sysEditMenu() {
				this.$refs.updataFoem.validate((valid) => {
					if (this.formEditMenu.cName == "") {
						return this.$message({
							showClose: true,
							message: "分类名称不能为空",
							type: 'error'
						});
					} else if (this.formEditMenu.cSort == "" || this.formEditMenu.cSort == null) {
						console.log(this.formEditMenu.cSort)
						return this.$message({
							showClose: true,
							message: "序号不能为空",
							type: 'error'
						});
					} else if(this.formEditMenu.cStare == null || this.formEditMenu.cStare.toString() == ""){
						return this.$message({
							showClose: true,
							message: "状态不能为空",
							type: 'error'
						});
					}
					this.$confirm('是否确定修改【' + this.formEditMenu.cName + '】分类信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let update = {
							cId: this.formEditMenu.cId,
							cPid: this.formEditMenu.cPid,
							cName: this.formEditMenu.cName,
							cSort: this.formEditMenu.cSort,
							cIcon: '',
							cStare: this.formEditMenu.cStare
						};
						this.update = update;
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						if (this.formEditMenu.cIcon != undefined) {
							this.$refs.upload.submit();
						} else {
							this.updateCategory();
						}
						this.dialogFormVisibleEditMenu = false;
						this.$refs.updataFoem.resetFields();
						this.timer = setInterval(() => {
							loading.close();
						}, 4000)
						
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
