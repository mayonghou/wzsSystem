<template>
	<div id="store" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;">
			<el-button @click="but_store" type="success" icon="el-icon-plus">新建</el-button>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="sson" placeholder="搜索条件"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" style="width: 100%">
			<el-table-column prop="C_NAME" label="商品名字" width="100"></el-table-column>
			<el-table-column prop="C_LOWPRICE" label="最低售价" width="100"></el-table-column>
			<el-table-column prop="CATEGORY" label="分类名称" width="100"></el-table-column>
			<el-table-column prop="BRAND" label="品牌名称" width="100"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="创建时间" width="100"></el-table-column>
			<el-table-column prop="UPDATE_TIME" label="更新时间" width="100"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_brand(scope.row)" type="text" size="small">删除</el-button>
					<el-button @click="deploy_attribute(scope.row)" type="text" size="small">配置属性</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" :page-size="10"
		 :total="counts" layout="prev, pager, next">
		</el-pagination>

		<el-dialog title="新建商品" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="stores">
				<el-form-item label="商品名字" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="最低售价" prop="price" :label-width="formLabelWidth">
					<el-input v-model="form.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类名称" prop="classifyID" :label-width="formLabelWidth">
					<el-cascader :options="CategoryList" v-model="form.classifyID" @change="StoreFL" ref="StoreFLData" class="formWidth"
					 :props="propFL" :show-all-levels="false">
					</el-cascader>
				</el-form-item>
				<el-form-item label="品牌名称" prop="BrandID" :label-width="formLabelWidth">
					<el-select v-model="form.BrandID" placeholder="---请选择---" class="formWidth">
						<el-option v-for="item in brandData" :label="item.C_BRNAME" v-if="item.I_BRID != form.I_BRID" :key="item.I_BRID"
						 :value="item.I_BRID">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_store">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改" :visible.sync="dialogFormAccount">
			<el-form :model="formUpdate">
				<el-form-item label="商品名字" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.name" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="最低售价" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类名称" :label-width="formLabelWidth">
					<el-cascader :options="CategoryList" v-model="formUpdate.classifyID" @change="StoreFL" ref="StoreFLData" class="formWidth"
						 :props="propFL" :show-all-levels="false">
					</el-cascader>
				</el-form-item>
				<el-form-item label="品牌名称" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.BrandID" placeholder="---请选择---" class="formWidth">
						<el-option v-for="item in brandData" :label="item.C_BRNAME" v-if="item.I_BRID != form.I_BRID" :key="item.I_BRID"
						 :value="item.I_BRID">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="update_brand">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="配置属性" :visible.sync="dialogFormAttribute">
			<div v-loading="peizhishux" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 1)">
				<el-form :model="formAttribute">
					<el-cascader v-model="formAttribute.SpecListData" :options="SpecList" ref="formAttribute" :props="props" class="formWidth"
					 clearable>
					</el-cascader>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAttribute = false">取 消</el-button>
				<el-button type="primary" @click="attribute">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'store',
		data() {
			return {
				listData: [],
				CategoryList: [],
				brandData: [],
				classifyID:[],
				props: {
					multiple: true,
					value: "C_SCID",
					label: "C_SCNAME"
				},
				propFL: {
					value: "cId",
					label: "name"
				},
				peizhishux: false,
				SpecList: [],
				formLabelWidth: '130px',
				dialogFormVisible: false,
				dialogFormAttribute: false,
				dialogFormAccount: false,
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: this.counts,
				page: 1,
				rows: 10,
				sson: '',
				form: {
					name: '',
					price: '',
					classifyID: '',
					BrandID: ''
				},
				formUpdate: {
					id: '',
					name: '',
					price: '',
					classifyID: '',
					BrandID: ''
				},
				formAttribute: {
					id: '',
					commodityId: '',
					specId: '',
					SpecListData: []
				},
				labelList:''
			};
		},
		mounted() {
			this.getBarndList();
			this.getCategoryList();
			this.getCommodity();
			this.getSpecListAll();
		},
		methods: {
			StoreFL() {
				var storeClass = this.$refs['StoreFLData'].getCheckedNodes();
				var labelList = '';
				for (var i = 0, leng = storeClass.length; i < leng; i++) {
					labelList = storeClass[i].value;
				}
				this.labelList = labelList;
				console.log(this.labelList)
			},
			// 配置属性 弹框
			deploy_attribute(row) {
				this.formAttribute.commodityId = row.C_ID;
				this.dialogFormAttribute = true;
				this.getSpecListAll();
				this.peizhishux = true;
			},
			// 配置属性 提交
			attribute() {
				var nodesObj = this.$refs['formAttribute'].getCheckedNodes();
				var idList = [];
				var labelList = [];
				for (var i = 0, leng = nodesObj.length; i < leng; i++) {
					idList[i] = nodesObj[i].data.C_SCID;
					labelList[i] = nodesObj[i].data.C_SCNAME;
				}
				if (idList.length <= 0) {
					this.$message({
						showClose: true,
						message: '请选择规格',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定绑定【' + labelList + '】规格信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							commodityId: this.formAttribute.commodityId,
							specIds: idList
						};
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/configureCommoditySpec?token=' +
							sessionStorage.getItem(
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
									this.getCommodity();
									this.dialogFormAttribute = false;
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
			// 删除
			del_brand(row) {
				this.$confirm('是否确定删除【' + row.C_NAME + '】账号信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_ID
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delCommodity?token=' + sessionStorage.getItem(
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
								this.getCommodity();
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
				this.formUpdate.name = row.C_NAME;
				this.formUpdate.price = row.C_LOWPRICE;
				this.formUpdate.classifyID = row.GS_CATEGORY_ID;
				this.formUpdate.BrandID = row.GS_BRAND_ID;
				this.dialogFormAccount = true;
			},
			// 修改提交
			update_brand() {
				if (this.formUpdate.name == '') {
					this.$message({
						showClose: true,
						message: '请输入商品名称',
						type: 'warning'
					});
				} else if (this.formUpdate.price == '') {
					this.$message({
						showClose: true,
						message: '请输入商品价格',
						type: 'warning'
					});
				} else if (this.formUpdate.classifyID == '') {
					this.$message({
						showClose: true,
						message: '请输入选择分类',
						type: 'warning'
					});
				} else if (this.formUpdate.BrandID == '') {
					this.$message({
						showClose: true,
						message: '请选择品牌',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定修改【' + this.formUpdate.name + '】商品信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							id: this.formUpdate.id,
							name: this.formUpdate.name,
							lowprice: this.formUpdate.price,
							categoryId: this.labelList,
							BarandId: this.formUpdate.BrandID
						};
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateCommodity?token=' + sessionStorage.getItem(
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
									this.getCommodity();
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
			but_store() {
				this.dialogFormVisible = true;
			},
			// 新建提交
			sub_store() {
				this.$refs.stores.validate((valid) => {
					if (this.form.name == '') {
						this.$message({
							showClose: true,
							message: '请输入商品名称',
							type: 'warning'
						});
					} else if (this.form.price == '') {
						this.$message({
							showClose: true,
							message: '请输入商品价格',
							type: 'warning'
						});
					} else if (this.form.classifyID == '') {
						this.$message({
							showClose: true,
							message: '请选择分类名称',
							type: 'warning'
						});
					} else if (this.form.BrandID == '') {
						this.$message({
							showClose: true,
							message: '请选择品牌',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定新建【' + this.form.name + '】商品信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let data = {
								name: this.form.name,
								lowprice: this.form.price,
								categoryId: this.labelList,
								BarandId: this.form.BrandID
							};
							console.log(data)
							const loading = this.$loading({
								lock: true,
								text: '保存中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addCommodity?token=' + sessionStorage.getItem(
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
										this.getCommodity();
										this.dialogFormVisible = false;
										this.$refs.stores.resetFields();
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
				this.getCommodity();
			},
			next_click(e) {
				this.page = e;
				this.getCommodity();
			},
			current_change(e) {
				this.page = e;
				this.getCommodity();
			},
			but_search() {
				this.page = 1;
				this.getCommodity();
			},

			getCommodity() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getCommodity' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.listData = data.data;
							var messageNum = data.message;
							this.counts = parseInt(messageNum);
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
			// 查询所有分类
			getCategoryList() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getCategoryList' + data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.CategoryList = data.data;
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
			getBarndList() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getBarndList' + data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.brandData = data.data;
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
					this.peizhishux = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.SpecList = data.data;
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
			getSpecValue() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSpecValue' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.SVData = data.data;
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
	.formWidth {
		width: 300px;
	}

	.el-checkbox-button__inner {
		border-left: 1px solid #DCDFE6;
		margin-left: 10px;
	}

	.checkbox {
		float: left;
		margin-left: 10px;
	}
</style>
