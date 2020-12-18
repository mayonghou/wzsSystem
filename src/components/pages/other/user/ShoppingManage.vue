<template>
	<div id="usermanage">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="xzsta" placeholder="---请选择---">
				<el-option label="全部" value=""></el-option>
				<el-option label="未发货" value="wfh"></el-option>
				<el-option label="已发货" value="yfh"></el-option>
				<el-option label="重填信息" value="ctxx"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="uc" placeholder="请输入搜索账号"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_ucuser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_excel" type="success" icon="el-icon-download">导出Excel表</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="userData" border style="width: 100%">
			<el-table-column prop="C_ON" label="订单编号" width="120"></el-table-column>
			<el-table-column prop="STAMES" label="套餐名称" width="120"></el-table-column>
			<el-table-column prop="I_MONEY" label="投资金额" width="120"></el-table-column>
			<el-table-column prop="I_JFNUM" label="总收益" width="120"></el-table-column>
			<el-table-column prop="I_SYNUM" label="已获收益" width="120"></el-table-column>
			<el-table-column prop="I_NUMBER" label="速率" width="120"></el-table-column>
			<el-table-column prop="FHSTAMES" label="发货状态" width="120"></el-table-column>
			<el-table-column prop="USMES" label="账号信息" width="200"></el-table-column>
			<el-table-column prop="D_STATETIME" label="收益时间" width="160"></el-table-column>
			<el-table-column prop="D_TIME" label="下单时间" width="160"></el-table-column>
			<el-table-column prop="D_FHTIME" label="发货时间" width="160"></el-table-column>
			<el-table-column prop="C_SHNAME" label="收货姓名" width="120"></el-table-column>
			<el-table-column prop="C_SHPHONE" label="收货电话" width="120"></el-table-column>
			<el-table-column prop="C_SHAREA" label="收货地区" width="120"></el-table-column>
			<el-table-column prop="C_SHADDRESS" label="详情地址" width="200"></el-table-column>
			<el-table-column fixed="right" align="center" label="操作" width="200">
				<template slot-scope="scope">
					<el-button @click="but_erdu(scope.row)" type="text" size="small">设置额度</el-button>
					<el-button v-show="scope.row.I_FHSTA == 0" @click="but_fahuo(scope.row)" type="text" size="small">确定发货</el-button>
					<el-button v-show="scope.row.I_FHSTA == 0" @click="but_chontian(scope.row)" type="text" size="small">重填信息</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@prev-click="prev_click"
			@next-click="next_click"
			@current-change="current_change"
			layout="prev, pager, next"
			:page-size="10"
			:total="counts"
		></el-pagination>
		<el-dialog title="设置额度" :visible.sync="dialogFormVisible">
			<el-form :model="spform">
				<el-form-item label="订单编号" :label-width="formLabelWidth">
					<el-input v-model="spform.spon" readonly></el-input>
				</el-form-item>
				<el-form-item label="收益额度" :label-width="formLabelWidth">
					<el-input v-model="spform.jfnum" readonly></el-input>
				</el-form-item>
				<el-form-item label="获得收益" :label-width="formLabelWidth">
					<el-input v-model="spform.synum" readonly></el-input>
				</el-form-item>
				<el-form-item label="更改收益" :label-width="formLabelWidth">
					<el-input v-model="spform.newsynum" type="number" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_erdu">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'usermanage',
	inject:['newCard'],
	data() {
		return {
			xzsta: '',
			userData: [],
			counts: 0,
			page: 1,
			rows: 10,
			uc: '',
			dialogFormVisible: false,
			formLabelWidth: '120px',
			spform: {
				spid: '',
				spon: '',
				jfnum:0,
				synum: 0,
				newsynum: 0
			},
			rowData: {}
		};
	},
	mounted() {
		this.getShopping();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getShopping();
		},
		next_click(e) {
			this.page = e;
			this.getShopping();
		},
		current_change(e) {
			this.page = e;
			this.getShopping();
		},
		but_ucuser(){
			this.page = 1;
			this.getShopping();
		},
		but_excel(){
			const loading = this.$loading({
				lock: true,
				text: '导出中...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			let data = {
				xzsta: this.xzsta
			};
			this.$axios.post(sessionStorage.getItem('url') + 'util/excel/orderUtil?token=' + sessionStorage.getItem('token'), data, {responseType: 'blob'}).then(res => {
				loading.close();
				if (res.status == 200) {
					const blob = new Blob([res.data], {
						type: "application/vnd.ms-excel"
					});
					var data = new Date();
					var month =data.getMonth() < 9 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
					var date = data.getDate() <= 9 ? "0" + data.getDate() : data.getDate();
					var datetime = data.getFullYear() + "-" + month + "-" + date;
					let fileName = "order"+datetime+".xls";
					if ("download" in document.createElement("a")) {
						const elink = document.createElement("a");
						elink.download = fileName;
						elink.style.display = "none";
						elink.href = URL.createObjectURL(blob);
						document.body.appendChild(elink);
						elink.click();
						URL.revokeObjectURL(elink.href); // 释放URL 对象
						document.body.removeChild(elink);
					} else {
						navigator.msSaveBlob(blob, fileName);
					}
					this.$message({
						showClose: true,
						message: "导出成功",
						type: 'success'
					});
				} else {
					this.$message({
						showClose: true,
						message: '未知错误，请联系客服',
						type: 'error'
					});
				}
			});
		},
		sub_erdu() {
			if (this.spform.newsynum == '') {
				this.$message({
					showClose: true,
					message: '输入【获得收益】额度',
					type: 'warning'
				});
			}else if (this.spform.newsynum > this.spform.jfnum) {
				this.$message({
					showClose: true,
					message: '输入【获得收益】额度不能大于【总收益】',
					type: 'warning'
				});
			}else {
				this.$confirm('是否确定修改订单【' + this.spform.spon + '】额度?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						spid: this.spform.spid,
						newsynum: this.spform.newsynum
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setShopping?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.getShopping();
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
			}
		},
		but_erdu(row) {
			this.spform.spid = row.C_ID;
			this.spform.spon = row.C_ON;
			this.spform.jfnum = row.I_JFNUM;
			this.spform.synum = row.I_SYNUM;
			this.spform.newsynum = row.I_SYNUM;
			this.dialogFormVisible = true;
		},
		but_chontian(row){
			this.sub_shopping_sta(row,"让客户重填收货信息该订单",2);
		},
		but_fahuo(row){
			this.sub_shopping_sta(row,"已发货该订单",1);
		},
		sub_shopping_sta(row,mes,stat){
			this.$confirm('是否确定'+mes+'【' + row.C_ON + '】?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					spid: row.C_ID,
					stat: stat
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setFhStaShopping?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getShopping();
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
		getShopping() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getShopping?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&usuc=' + this.uc + '&xzsta=' + this.xzsta)
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.userData = data.data;
							this.counts = data.message * 1;
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

<style></style>
