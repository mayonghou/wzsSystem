<template>
	<div id="shipments" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="xzsta" class="select" placeholder="---请选择---">
				<el-option label="全部" value=""></el-option>
				<el-option label="未发货" value="0"></el-option>
				<el-option label="已发货" value="1"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="uc" placeholder="请输入搜索原订单编号"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_ucuser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="userData" border style="width: 100%">
			<el-table-column prop="OR_INFO_ON" label="原订单编号" width="150"></el-table-column>
			<el-table-column prop="CREATE_TIME" label="创建时间" width="160"></el-table-column>
			<el-table-column prop="SHOP" label="店铺" width="120"></el-table-column>
			<el-table-column prop="STATE" label="结算状态" width="120"></el-table-column>
			<el-table-column prop="ISSTAT" label="发货状态" width="120"></el-table-column>
			<el-table-column prop="FH_TIME" label="发货时间" width="160"></el-table-column>
			<el-table-column prop="SH_STA" label="收货状态" width="120"></el-table-column>
			<el-table-column prop="SH_TIME" label="收货时间" width="160"></el-table-column>
			<el-table-column prop="SH_STATE" label="收货方式" width="120"></el-table-column>
			<el-table-column prop="I_ISTOTAL" label="拆分后订单总额" width="120"></el-table-column>
			<el-table-column prop="I_ISNUM" label="拆分后商品个数" width="120"></el-table-column>
			<el-table-column fixed="right" align="center" label="操作" width="200">
				<template slot-scope="scope">
					<el-button v-show="scope.row.I_FH_STA != 1" @click="confirmFH(scope.row)" type="text" size="small">确定发货</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @prev-click="prev_click" @next-click="next_click" @current-change="current_change" layout="prev, pager, next"
		 :page-size="10" :total="counts"></el-pagination>
	</div>
</template>

<script>
	export default {
		name: 'shipments',
		inject: ['newCard'],
		data() {
			return {
				xzsta: '',
				userData: [],
				fullscreenLoading: true,
				loadingText: '加载中...',
				counts: this.counts,
				page: 1,
				rows: 10,
				uc: '',
				formLabelWidth: '120px'
			};
		},
		mounted() {
			this.getDeliveryList();
		},
		methods: {
			// 确定发货
			confirmFH(row) {
				this.$confirm('是否确定发原订单编号为【' + row.OR_INFO_ON + '】货物信息?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						id: row.C_ISID
					};
					const loading = this.$loading({
						lock: true,
						text: '发货中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('urlMall') + 'goods/system/confirmShipment?token=' + sessionStorage.getItem(
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
								this.getDeliveryList();
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
			prev_click(e) {
				this.page = e;
				this.getDeliveryList();
			},
			next_click(e) {
				this.page = e;
				this.getDeliveryList();
			},
			current_change(e) {
				this.page = e;
				this.getDeliveryList();
			},
			but_ucuser() {
				this.page = 1;
				this.getDeliveryList();
			},
			getDeliveryList() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'goods/system/getDeliveryList?token=' + sessionStorage.getItem('token') +
						'&page=' + this.page + '&rows=' + this.rows + '&search=' + this.uc + '&fhSta=' + this.xzsta).then(res => {
						this.fullscreenLoading = false;
						if (res.status == 200) {
							var data = res.data;
							var messageNum = data.message;
							this.counts = parseInt(messageNum);
							if (data.flag) {
								this.userData = data.data;
								// this.counts = data.message * 1;
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
	/* .el-input__inner {
		width: 400px;
	} */
	/* 	.select{
		width: 100px;
	} */
	.tupianfd {
		width: 150px;
		height: 150px;
	}

	.tupianfd img {
		width: 100%;
		height: 100%;
	}

	.tupian_dangda {
		width: 400px;
		height: 500px;
	}

	.tupian_dangda img {
		width: 100%;
		height: 100%;
	}
</style>
