<template>
	<div id="suk" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;padding-left: 10px;">
			<el-button @click="but_SUK" type="success" icon="el-icon-plus">新建</el-button>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="sson" placeholder="搜索条件"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_search" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" style="width: 100%">
			<el-table-column prop="C_SKUON" label="库存编号" width="100"></el-table-column>
			<el-table-column prop="C_SPU_NAME" label="商品名称" width="100"></el-table-column>
			<el-table-column prop="I_PRICE" label="销售价格" width="100"></el-table-column>
			<el-table-column prop="I_MARKET_PRICE" label="市场价格" width="100"></el-table-column>
			<el-table-column prop="I_STOCK" label="库存" width="100"></el-table-column>
			<el-table-column prop="SHOP" label="商铺名称" width="100"></el-table-column>
			<el-table-column prop="C_FMURL" label="封面图片" width="100">
				<template slot-scope="scope">
					<img width="80" :src="scope.row.C_FMURL" />
				</template>
			</el-table-column>
			<el-table-column prop="STATE" label="上架状态" width="100"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="创建时间" width="100"></el-table-column>
			<el-table-column prop="UPDATE_TIME" label="更新时间" width="100"></el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template slot-scope="scope">
					<el-button @click="edit_account(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="del_SUK(scope.row)" type="text" size="small">删除</el-button>
					<el-button @click="edit_rests(scope.row)" type="text" size="small">配置规格</el-button>
					<el-button @click="img_exhibition(scope.row)" type="text" size="small">展示图集</el-button>
					<el-button @click="img_ex(scope.row)" type="text" size="small">商品介绍</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" :page-size="10"
		 :total="counts" layout="prev, pager, next">
		</el-pagination>

		<el-dialog title="新建库存" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="formadd">
				<el-form-item label="库存编号" prop="skuNumber" :label-width="formLabelWidth">
					<el-input v-model="form.skuNumber" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品名称" prop="skuName" :label-width="formLabelWidth">
					<el-select v-model="form.skuName" @change="selectGet" placeholder="---请选择商品---" class="formWidth">
						<el-option v-for="item in Commodity" :label="item.C_NAME" v-if="item.C_ID != form.C_ID" :key="item.C_ID" :value="item.C_ID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销售价格" prop="price" :label-width="formLabelWidth">
					<el-input v-model="form.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="市场价格" prop="marketPrice" :label-width="formLabelWidth">
					<el-input v-model="form.marketPrice" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="库存" prop="stock" :label-width="formLabelWidth">
					<el-input v-model="form.stock" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商铺名称" prop="shopId" :label-width="formLabelWidth" @change="selectWorkName()">
					<el-select v-model="form.shopId" placeholder="---请选择商铺---" class="formWidth">
						<el-option v-for="item in Shoplist" :label="item.C_SPNAME" v-if="item.C_SPID != form.C_SPID" :key="item.C_SPID"
						 :value="item.C_SPID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主页封面图片" :label-width="formLabelWidth" prop="imageUrl">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :limit='1' :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgUploadSuccess" :file-list="fileupload" :on-remove="removeUpload" ref="upload">
						<!-- <img width="100%" height="100%" v-if="formdata.imageUrl" :src="formdata.imageUrl" class="avatar"> -->
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="上架状态" prop="state" :label-width="formLabelWidth">
					<el-select v-model="form.state" autocomplete="off">
						<el-option label="已上架" value="1">
						</el-option>
						<el-option label="未上架" value="0">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_SUK">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改" :visible.sync="dialogFormAccount" @close="closeDialog">
			<el-form :model="formUpdate" ref="Update">
				<el-form-item label="库存编号" prop="skuNumber" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.skuNumber" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品名称" prop="skuName" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.skuName" @change="selectUp" placeholder="---请选择商品---" class="formWidth">
						<el-option v-for="item in Commodity" :label="item.C_NAME" v-if="item.C_ID != form.C_ID" :key="item.C_ID" :value="item.C_ID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销售价格" prop="price" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="市场价格" prop="marketPrice" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.marketPrice" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="库存" prop="stock" :label-width="formLabelWidth">
					<el-input v-model="formUpdate.stock" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商铺名称" prop="shopId" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.shopId" placeholder="---请选择商铺---" class="formWidth">
						<el-option v-for="item in Shoplist" :label="item.C_SPNAME" v-if="item.C_SPID != form.C_SPID" :key="item.C_SPID"
						 :value="item.C_SPID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主页封面图片" :label-width="formLabelWidth" prop="imageUrl">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :limit='1' :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgUpadte" :file-list="fileList" :on-remove="removeUpload" ref="upload"
					 multiple>
						<!-- <img width="100%" height="100%" v-if="formdata.imageUrl" :src="formdata.imageUrl" class="avatar"> -->
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="上架状态" prop="state" :label-width="formLabelWidth">
					<el-select v-model="formUpdate.state" autocomplete="off">
						<el-option label="已上架" :value="1">
						</el-option>
						<el-option label="未上架" :value="0">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAccount = false">取 消</el-button>
				<el-button type="primary" @click="update_SUK">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="配置属性" width="1200px" :visible.sync="dialogFormAttributes" @close="closeDialog">
			<div v-loading="peizhishux" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 1)">
			<div style="float: left;padding-left: 10px;">
				<el-button @click="SUK_standValue" type="success" icon="el-icon-plus">新建</el-button>
			</div>
			<el-table :data="SpecValueList" style="width: 100%" >
				<el-table-column prop="GS_SPEC_VALUE" label="规格" width="250"></el-table-column>
				<el-table-column prop="I_SSV_PRICE" label="价格"></el-table-column>
				<el-table-column prop="I_SSV_STOCK" label="库存"></el-table-column>
				<el-table-column prop="CREATE_TIME" label="创建时间"></el-table-column>
				<el-table-column prop="UPDATE_TIME" label="更新时间"></el-table-column>
				<el-table-column label="操作" width="250" align="center">
					<template slot-scope="scope">
						<el-button @click="edit_SKUvalue(scope.row)" type="text" size="small">修改</el-button>
						<el-button @click="del_SKUvalue(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			</div>
		</el-dialog>
		<el-dialog title="新建规格属性" :visible.sync="StandValue">
			<el-form :model="formAttribute" ref="Attributeref">
				<el-form-item label="选择规格/规格值" prop="SpecListData" :label-width="formLabelWidth">
					<el-cascader v-model="formAttribute.SpecListData" :options="SpecList" ref="Attributes" :props="props" class="formWidth"
					 @change="SpecValueID" clearable>
					</el-cascader>
				</el-form-item>
				<el-form-item label="价格" prop="price" :label-width="formLabelWidth">
					<el-input v-model="formAttribute.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="库存" prop="stock" :label-width="formLabelWidth">
					<el-input v-model="formAttribute.stock" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="StandValue = false">取 消</el-button>
				<el-button type="primary" @click="SUK_Attribute">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改规格属性" :visible.sync="UpdateStandValue" @close="closeDialog">
			<el-form :model="formUpdateAttribute">
				<el-form-item label="选择规格/规格值" :label-width="formLabelWidth">
					<el-cascader v-model="formUpdateAttribute.SpecListUP" :options="SpecList" ref="UpdateAttribute" :props="props" class="formWidth"
					 @change="SpecValueLabel" clearable>
					</el-cascader>
				</el-form-item>
				<el-form-item label="价格" :label-width="formLabelWidth">
					<el-input v-model="formUpdateAttribute.price" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="库存" :label-width="formLabelWidth">
					<el-input v-model="formUpdateAttribute.stock" class="formWidth" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="StandValue = false">取 消</el-button>
				<el-button type="primary" @click="update_SUK_USV">提交</el-button>
			</div>
		</el-dialog>


		<el-dialog title="展示图集介绍" :visible.sync="ShowAtlas" @change="closeDialog">
			<div v-loading="peizhishux" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 1)">
			<el-form :model="formImgexhibition" ref="ImgShowAtlas">
				<el-form-item label="展示图集" :label-width="formLabelWidth" prop="imageUrl">
					<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :on-change="changeUpload"
					 :auto-upload="false" :on-success="imgAtlas" :file-list="fileList" :on-remove="removeUpload" ref="upload" multiple>
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="ShowAtlas = false">取 消</el-button>
				<el-button type="primary" @click="SUK_ImgAtlas">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="商品介绍图集" :visible.sync="ShowAtlasdata" @change="closeDialog">
			<div v-loading="peizhishux" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 1)">
				<el-form :model="formImgexhibitiondata" ref="ImgShowAtlasdata">
					<el-form-item label="商品介绍" prop="sojsImgs" :label-width="formLabelWidth">
						<el-upload class="avatar-uploader" :action="action" list-type="picture-card" :on-change="changeUpload"
						 :auto-upload="false" :on-success="imgAtlasdataList" :file-list="fileData" :on-remove="removeUpload" ref="upload" multiple>
							<i class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="ShowAtlasdata = false">取 消</el-button>
				<el-button type="primary" @click="SUK_ImgAtlasdata">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'suk',
		data() {
			return {
				listData: [],
				fileupload: [],
				dataUpload: [],
				Shoplist: [],
				SpecList: [],
				SpecValue: [],
				Commodity: [],
				fileList: [],
				fileData: [],
				SUKOther: [],
				peizhishux: false,
				SpecValueList: [],
				action: 'http://192.168.0.200:7070/api/expand/upload/image',
				StandValue: false,
				labelDate: [],
				props: {
					multiple: true,
					lazy: true,
					lazyLoad: this.getSpecValueById
				},
				imgData: false,
				data: [],
				id: '',
				formLabelWidth: '130px',
				dialogFormVisible: false,
				dialogFormAccount: false,
				dialogFormAttributes: false,
				fullscreenLoading: true,
				UpdateStandValue: false,
				ShowAtlas: false,
				ShowAtlasdata:false,
				imgexhibitiondialog: false,
				loadingText: '加载中...',
				counts: this.counts,
				page: 1,
				rows: 10,
				sson: '',
				form: {
					skuNumber: '',
					skuName: '',
					price: '',
					marketPrice: '',
					stock: '',
					shopId: '',
					imageUrl: '',
					state: '',
					file: {}
				},
				formUpdate: {
					id: '',
					skuNumber: '',
					skuName: '',
					price: '',
					marketPrice: '',
					stock: '',
					shopId: '',
					imageUrl: '',
					spuId: '',
					state: '',
					file: {}
				},
				formAttribute: {
					id: '',
					skuId: '',
					storeId: this.storeId,
					SpecListData: '',
					price: '',
					stock: ''
				},
				formUpdateAttribute: {
					id: '',
					skuId: '',
					SpecListUP: '',
					price: '',
					stock: ''
				},
				formImgexhibition: {
					id: '',
					imageUrl: '',
					sojsImgs: '',
					file: {},
				},
				formImgexhibitiondata:{
					id: '',
					imageUrl: '',
					sojsImgs: '',
					file: {}
				},
				name: '',
				fmUrl: '',
				UPname: '',
				specVLabel: this.specVLabel,
				imgUrl: [],
				dataImg: '',
				imgAtlasList: [],
				imgArr: '',
				specVLabeldata: this.specVLabeldata,
				loading:'',
				SojsImg:[],
				SUKOtherdata:[]

			};
		},
		mounted() {
			this.getSKU();
			this.getShopAll();
			this.getCommodityAll();
		},
		methods: {
			img_ex(row){
				this.ShowAtlasdata = true;
				this.fileData = [];
				this.formImgexhibitiondata.id = row.C_SKUID;
				this.getSKUOtherdata();
				this.peizhishux = true;
			},
			SUK_ImgAtlasdata(){
				this.$refs.ImgShowAtlasdata.validate((valid) => {
					if (this.formImgexhibitiondata.sojsImgs == '') {
						this.$message({
							showClose: true,
							message: '请选择商品展示图',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定商品介绍为【' + this.formImgexhibitiondata.sojsImgs + '】其他信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const loading = this.$loading({
								lock: true,
								text: '保存中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$refs.upload.submit();
							this.$refs.ImgShowAtlasdata.resetFields();
							this.ShowAtlasdata = false;
							this.timer = setInterval(() => {
								loading.close();
							}, 4000)
						});
					}
				});
			},
			closeDialog() {
				this.fileList = [];
			},
			changeUpload(file, fileList) {
				this.imgList = fileList
				if (fileList.length >= 1) {
					this.uploadDisabled = true;
				}
				var url = window.URL.createObjectURL(file.raw);
				this.form.imageUrl = url;
				this.form.file = file;
				this.formImgexhibition.imageUrl = url;
				this.formImgexhibition.file = file;
				this.formImgexhibitiondata.sojsImgs = url;
				this.formImgexhibitiondata.file = file;
				this.formUpdate.imageUrl = url;
				this.formUpdate.file = file;
				this.imgData = true;
				this.action = sessionStorage.getItem('urlMall') + 'utils/oos/uploadGOosp?fileName=' + file.name;
			},
			// 上传图片是删除
			removeUpload(file, fileList) {
				this.imgData = false;
				this.imgList = fileList;
				this.uploadDisabled = false;
			},
			// 其他信息展示
			// 图集图片上传成功的回掉
			imgAtlas(response, file, filelist) {
				if (response.flag) {
					this.imgUrl.push(response.data || '')
					if (this.imgUrl.length >= this.imgList.length) {
						var imgAtlasList = '';
						imgAtlasList = {
							id: this.formImgexhibition.id,
							sojsImgs: this.imgUrl.join(','),
							sozsImgs:''
						}
						this.imgAtlasList = imgAtlasList;
						this.addSKUOther();
					}
				}
			},
			addSKUOther() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSKUOther?token=' + sessionStorage.getItem(
					'token'), this.imgAtlasList).then(res => {
						this.imgAtlasList= '';
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.ShowAtlas = false;
							this.getSKUOther();
							this.peizhishux = true;
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
			imgAtlasdataList(response, file, filelist) {
				if (response.flag) {
					this.imgUrl.push(response.data || '')
					if (this.imgUrl.length >= this.imgList.length) {
						var sozsImgs = {
							id: this.formImgexhibitiondata.id,
							sojsImgs:'',
							sozsImgs: this.imgUrl.join(',')
						}
						this.sozsImgs = sozsImgs;
						this.addSKUOtherdata();
					}
				}
			},
			getSKUOtherdata() {
				var data = '?token=' + sessionStorage.getItem('token') + '&id=' + this.formImgexhibitiondata.id;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSKUOther' + data).then(res => {
					if (res.status == 200) {
						this.peizhishux = false;
						var data = res.data;
						if (data.flag) {
							this.SUKOtherdata = data.data;
							var SojsImg = [];
							this.SUKOtherdata.forEach(function(val, index, array) {
								SojsImg = val.C_SOZSIMGS;
							})
							 SojsImg = SojsImg.split(",");
							for (var index in SojsImg) {
								this.fileData.push({
									url: SojsImg[index]
								});
							}
							this.SojsImg = '';
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
			addSKUOtherdata() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSKUOther?token=' + sessionStorage.getItem(
					'token'), this.sozsImgs).then(res => {
						this.sozsImgs = '';
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.ShowAtlasdata = false;
							this.getSKUOtherdata();
							this.peizhishux = true;
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
			
			// 图集提交
			SUK_ImgAtlas() {
				this.$refs.ImgShowAtlas.validate((valid) => {
					if (this.formImgexhibition.imageUrl == '') {
						this.$message({
							showClose: true,
							message: '请选择商品展示图',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定商品介绍为【' + this.formImgexhibition.imageUrl + '】其他信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const loading = this.$loading({
								lock: true,
								text: '保存中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$refs.upload.submit();
							console.log(this.$refs.upload.fileList)
							// this.$refs.upload.clearFiles();
							this.$refs.upload.fileList = '';
							this.$refs.ImgShowAtlas.resetFields();
							// this.ShowAtlas = false;
							this.timer = setInterval(() => {
								loading.close();
							}, 4000)
						});
					}
				});
			},
			// 其他信息弹框
			img_exhibition(row) {
				this.fileList = [];
				this.formImgexhibition.id = row.C_SKUID;
				this.ShowAtlas = true;
				this.getSKUOther();
				this.peizhishux = true;
			},
			getSKUOther() {
				var data = '?token=' + sessionStorage.getItem('token') + '&id=' + this.formImgexhibition.id;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSKUOther' + data).then(res => {
					if (res.status == 200) {
						this.peizhishux = false;
						var data = res.data;
						if (data.flag) {
							this.SUKOther = data.data;
							var imgArr = [];
							this.SUKOther.forEach(function(val, index, array) {
								imgArr = val.C_SOJSIMGS;
							})
							imgArr = imgArr.split(",");
							for (var index in imgArr) {
								this.fileList.push({
									url: imgArr[index]
								});
							}
							this.imgArr = '';
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

			// sku规格值删除
			del_SKUvalue(row) {
				this.$confirm('是否确定删除编号为【' + row.GS_SPEC_VALUE + '】规格信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_SSV_ID
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delSKUValue?token=' + sessionStorage.getItem(
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
								this.getSKUValue();
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
			// sku规格值的修改弹框
			edit_SKUvalue(row) {
				this.formUpdateAttribute.SpecListUP = row.GS_SPEC_VALUE;
				this.formUpdateAttribute.skuId = row.GS_SKU_ID;
				this.formUpdateAttribute.id = row.C_SSV_ID;
				this.formUpdateAttribute.price = row.I_SSV_PRICE;
				this.formUpdateAttribute.stock = row.I_SSV_STOCK;
				this.UpdateStandValue = true;
			},
			SpecValueLabel: function(newData) {
				var SpecValLabel = this.$refs.UpdateAttribute.getCheckedNodes();
				console.log(SpecValLabel)
				let specIdLIst = [];
				let a = [];
				let specVLabeldata = '';
				for (var i = 0; i < SpecValLabel.length; i++) {
					a[i] = SpecValLabel[i].pathLabels;
					if(a[i].length > 1){
						specIdLIst[i] = a[i].join("/");
						specVLabeldata += specIdLIst[i] + ',';
					}
				}
				this.specVLabeldata = specVLabeldata;
			},
			// sku规格值的修改提交
			update_SUK_USV() {
				if (this.formUpdateAttribute.SpecListUP == '') {
					this.$message({
						showClose: true,
						message: '请选择规格值',
						type: 'warning'
					});
				} else if (this.formUpdateAttribute.price == '') {
					this.$message({
						showClose: true,
						message: '请输入出售价格',
						type: 'warning'
					});
				} else if (this.formUpdateAttribute.stock == '') {
					this.$message({
						showClose: true,
						message: '请输入库存',
						type: 'warning'
					});
				} else {
					this.$confirm('是否确定绑定【' + this.specVLabeldata + '】规格值信息?', '温馨提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let dataUpdate = {
							id: this.formUpdateAttribute.id,
							skuId: this.formUpdateAttribute.skuId,
							specValue: this.specVLabeldata,
							price: this.formUpdateAttribute.price,
							stock: this.formUpdateAttribute.stock
						};
						const loading = this.$loading({
							lock: true,
							text: '修改中...',
							spinner: 'el-icon-loading',
							background: 'rgba(0, 0, 0, 0.7)'
						});
						this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateSKUValue?token=' + sessionStorage.getItem(
							'token'), dataUpdate).then(res => {
							loading.close();
							if (res.status == 200) {
								var data = res.data;
								if (data.flag) {
									this.$message({
										showClose: true,
										message: data.message,
										type: 'success'
									});
									this.UpdateStandValue = false;
									this.getSKUValue();
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
			// sku属性值的新建弹框
			SUK_standValue() {
				this.StandValue = true;
			},
			// 配置其他属性
			edit_rests(row) {
				// 商品id
				this.formAttribute.storeId = row.GS_SPU_ID;
				this.storeId = this.formAttribute.storeId;
				// 库存id
				this.formAttribute.id = row.C_SKUID;
				this.dialogFormAttributes = true;
				this.getCommoditySpec();
				this.getSKUValue();
				this.peizhishux = true;
			},
			// 拿到规格值id label值
			SpecValueID: function(newData) {
				var SpecValeid = this.$refs['Attributes'].getCheckedNodes();
				let specIdLIst = [];
				let a = [];
				let specVLabel = '';
				for (var i = 0; i < SpecValeid.length; i++) {
					a[i] = SpecValeid[i].pathLabels;
					if(a[i].length > 1){
						specIdLIst[i] = a[i].join("/");
						specVLabel += specIdLIst[i] + ',';
					}
				}
				this.specVLabel = specVLabel;
			},
			// 新建配置属性提交
			SUK_Attribute() {
				this.$refs.Attributeref.validate((valid) => {
					if (this.formAttribute.SpecListData == '') {
						this.$message({
							showClose: true,
							message: '请选择规格值',
							type: 'warning'
						});
					} else if (this.formAttribute.price == '') {
						this.$message({
							showClose: true,
							message: '请输入出售价格',
							type: 'warning'
						});
					} else if (this.formAttribute.stock == '') {
						this.$message({
							showClose: true,
							message: '请输入库存',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定绑定【' + this.specVLabel + '】规格值信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let data = {
								skuId: this.formAttribute.id,
								specValue: this.specVLabel,
								price: this.formAttribute.price,
								stock: this.formAttribute.stock
							};
							const loading = this.$loading({
								lock: true,
								text: '保存中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSKUValue?token=' + sessionStorage.getItem(
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
										this.StandValue = false;
										this.getSKUValue();
										// this.dialogFormAttribute = false;
										this.$refs.Attributeref.resetFields();
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
			// 查询库存规格值
			getSKUValue() {
				var data = '?token=' + sessionStorage.getItem('token') + '&skuId=' + this.formAttribute.id;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSKUValue' + data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.SpecValueList = data.data;
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
			// 获取商品的规格
			getCommoditySpec() {
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getCommoditySpec?token=' + sessionStorage.getItem(
					'token') + '&id=' + this.storeId).then(res => {
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

			// 根据规格id查询规格值
			getSpecValueById(node, resolve) {
				var data = '?token=' + sessionStorage.getItem('token') + '&id=' + node.value;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSpecValueById' + data).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.SpecValue = data.data;
							resolve(this.SpecValue);
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


			// 图片上传成功回调
			imgUploadSuccess(response, file, filelist) {
				if (response.flag) {
					this.dataUpload.fmUrl = response.data;
					this.addSKU();
					this.getSKU();
				}
			},
			addSKU() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/addSKU?token=' + sessionStorage.getItem(
					'token'), this.dataUpload).then(res => {
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.$message({
								showClose: true,
								message: data.message,
								type: 'success'
							});
							this.dialogFormVisible = false;
							this.getSKU();
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
			// 修改上传的回掉
			imgUpadte(response, file, filelist) {
				console.log(response.flag)
				if (response.flag) {
					this.data.fmUrl = response.data;
					console.log(this.data.fmUrl)
					this.updateSKU();
					this.getSKU();
				}
			},
			updateSKU() {
				this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/updateSKU?token=' + sessionStorage.getItem(
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
							this.getSKU();
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
			del_SUK(row) {
				this.$confirm('是否确定删除编号为【' + row.C_SKUON + '】库存信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_SKUID
					};
					const loading = this.$loading({
						lock: true,
						text: '删除中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/delSKU?token=' + sessionStorage.getItem(
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
								this.getSKU();
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
				this.formUpdate.id = row.C_SKUID;
				this.formUpdate.skuNumber = row.C_SKUON;
				this.formUpdate.skuName = row.C_SPU_NAME;
				this.formUpdate.price = row.I_PRICE;
				this.formUpdate.marketPrice = row.I_MARKET_PRICE;
				this.formUpdate.stock = row.I_STOCK;
				this.formUpdate.shopId = row.GS_SHOP_ID;
				this.formUpdate.spuId = row.GS_SPU_ID;
				this.fileList.push({
					url: row.C_FMURL
				});
				this.formUpdate.state = row.I_SKU_STA;
				this.dialogFormAccount = true;
			},
			selectUp(id) {
				let obj2 = {};
				obj2 = this.Commodity.find((item) => {
					return item.C_ID === id;
				});
				var UPname = obj2.C_NAME;
				this.UPname = UPname;
			},
			// 修改提交
			update_SUK() {
				this.$refs.Update.validate((valid) => {
					if (this.formUpdate.skuNumber == '') {
						this.$message({
							showClose: true,
							message: '请输入库存编号',
							type: 'warning'
						});
					} else if (this.formUpdate.skuName == '') {
						this.$message({
							showClose: true,
							message: '请选择商品名称',
							type: 'warning'
						});
					} else if (this.formUpdate.price == '') {
						this.$message({
							showClose: true,
							message: '请输入销售价格',
							type: 'warning'
						});
					} else if (this.formUpdate.marketPrice == '') {
						this.$message({
							showClose: true,
							message: '请输入市场价格',
							type: 'warning'
						});
					} else if (this.formUpdate.stock == '') {
						this.$message({
							showClose: true,
							message: '请输入库存',
							type: 'warning'
						});
					} else if (this.formUpdate.shopId == '') {
						this.$message({
							showClose: true,
							message: '请选择商品',
							type: 'warning'
						});
					} else if (this.formUpdate.state.toString() == '') {
						this.$message({
							showClose: true,
							message: '请选择状态',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定修改编号为【' + this.formUpdate.skuNumber + '】库存信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let data = {
								id: this.formUpdate.id,
								skuNumber: this.formUpdate.skuNumber,
								skuName: this.UPname,
								price: this.formUpdate.price,
								marketPrice: this.formUpdate.marketPrice,
								stock: this.formUpdate.stock,
								shopId: this.formUpdate.shopId,
								spuId: this.formUpdate.spuId,
								fmUrl: '',
								state: this.formUpdate.state
							};
							this.data = data;
							console.log(data)
							if (this.imgData) {
								this.$refs.upload.submit();
							} else {
								this.updateSKU();
							}
							const loading = this.$loading({
								lock: true,
								text: '修改中...',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});
							this.timer = setInterval(() => {
								loading.close();
							}, 3000)
						});
					}
				});
			},
			// 新建
			but_SUK() {
				this.dialogFormVisible = true;
				this.fileupload = [];
			},
			selectGet(vId) {
				let obj = {};
				obj = this.Commodity.find((item) => {
					return item.C_ID === vId;
				});
				var name = obj.C_NAME;
				this.name = name;
			},
			// 新建提交
			sub_SUK() {
				this.$refs.formadd.validate((valid) => {
					if (this.form.skuNumber == '') {
						this.$message({
							showClose: true,
							message: '请输入库存编号',
							type: 'warning'
						});
					} else if (this.form.skuName == '') {
						this.$message({
							showClose: true,
							message: '请选择商品名称',
							type: 'warning'
						});
					} else if (this.form.price == '') {
						this.$message({
							showClose: true,
							message: '请输入销售价格',
							type: 'warning'
						});
					} else if (this.form.marketPrice == '') {
						this.$message({
							showClose: true,
							message: '请输入市场价格',
							type: 'warning'
						});
					} else if (this.form.stock == '') {
						this.$message({
							showClose: true,
							message: '请输入库存',
							type: 'warning'
						});
					} else if (this.form.shopId == '') {
						this.$message({
							showClose: true,
							message: '请选择商品',
							type: 'warning'
						});
					} else if (this.form.imageUrl == '') {
						this.$message({
							showClose: true,
							message: '请上传图片',
							type: 'warning'
						});
					} else if (this.form.state == '') {
						this.$message({
							showClose: true,
							message: '请选择状态',
							type: 'warning'
						});
					} else {
						this.$confirm('是否确定新建编号为【' + this.form.skuNumber + '】库存信息?', '温馨提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let dataUpload = {
								skuNumber: this.form.skuNumber,
								skuName: this.name,
								price: this.form.price,
								marketPrice: this.form.marketPrice,
								stock: this.form.stock,
								shopId: this.form.shopId,
								spuId: this.form.skuName,
								fmUrl: '',
								state: this.form.state
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
					}
				});
			},
			prev_click(e) {
				this.page = e;
				this.getSKU();
			},
			next_click(e) {
				this.page = e;
				this.getSKU();
			},
			current_change(e) {
				this.page = e;
				this.getSKU();
			},
			but_search() {
				this.page = 1;
				this.getSKU();
			},
			// 库存
			getSKU() {
				var data = '?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&search=' +
					this.sson;
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getSKU' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						var messageNum = data.message;
						this.counts = parseInt(messageNum);
						if (data.flag) {
							this.listData = data.data;
							this.counts = this.listData.length
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
			// 所有店铺
			getShopAll() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getShopAll' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.Shoplist = data.data;
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
			// 所有商品
			getCommodityAll() {
				var data = '?token=' + sessionStorage.getItem('token');
				this.$axios.get(sessionStorage.getItem('urlMall') + 'goods/system/getCommodityAll' + data).then(res => {
					this.fullscreenLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.Commodity = data.data;
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

		}
	};
</script>

<style>
	.formWidth {
		width: 300px;
	}
	.form-footer{
		float: right;
	}
</style>
