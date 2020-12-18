<template>
	<div id="usermanage">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="xzsta" placeholder="---请选择---">
				<el-option label="全部" value="all"></el-option>
				<el-option label="未处理" value="wcl"></el-option>
				<el-option label="已完成" value="ywc"></el-option>
				<el-option label="处理失败" value="clsb"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="txon" placeholder="订单编号"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_ucuser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="float: left;padding-left: 60px;">
			<el-button @click="but_edittx" type="warning" icon="el-icon-edit">批量处理</el-button>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_excel" type="success" icon="el-icon-download">导出Excel表</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="userData" @selection-change="handleSelectionChange" border style="width: 100%">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="C_ON" label="订单编号" width="120"></el-table-column>
			<el-table-column prop="STAMES" label="处理状态" width="120"></el-table-column>
			<el-table-column prop="D_TIME" label="申请时间" width="160"></el-table-column>
			<el-table-column prop="I_ZEBNUM" label="提现金额" width="120"></el-table-column>
			<el-table-column prop="I_MONEY" label="打款金额" width="120"></el-table-column>
			<el-table-column prop="SKMES" label="银行信息" width="260"></el-table-column>
			<el-table-column prop="ZFBMES" label="支付宝信息" width="260"></el-table-column>
			<el-table-column prop="UCMES" label="账号信息" width="200"></el-table-column>
			<el-table-column prop="D_STATIME" label="处理时间" width="160"></el-table-column>
			<el-table-column prop="STATEMES" label="打款方式" width="120"></el-table-column>
			<el-table-column prop="SYSUC" label="处理人" width="120"></el-table-column>
			<el-table-column fixed="right" label="操作" width="120">
				<template slot-scope="scope">
					<el-button v-show="scope.row.I_STA == 0" @click="but_chuli(scope.row)" type="text" size="small">审核处理</el-button>
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
		<el-dialog title="审核订单" :visible.sync="dialogFormVisible">
			<el-form :model="txform">
				<el-form-item label="订单编号" :label-width="formLabelWidth">
					<el-input v-model="txform.txon" readonly></el-input>
				</el-form-item>
				<el-form-item label="账号信息" :label-width="formLabelWidth">
					<el-input v-model="txform.txucmes" readonly></el-input>
				</el-form-item>
				<el-form-item label="银行信息" :label-width="formLabelWidth">
					<el-input v-model="txform.txyhk" readonly></el-input>
				</el-form-item>
				<el-form-item label="支付宝" :label-width="formLabelWidth">
					<el-input v-model="txform.txzfb" readonly></el-input>
				</el-form-item>
				<el-form-item label="打款金额" :label-width="formLabelWidth">
					<el-input v-model="txform.txdz" readonly></el-input>
				</el-form-item>
				<el-form-item label="打款方式" :label-width="formLabelWidth">
					<el-select v-model="txform.txsta" placeholder="---请选择---">
						<el-option label="---请选择---" value=""></el-option>
						<el-option label="支付宝" value="1"></el-option>
						<el-option label="银行卡" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核状态" :label-width="formLabelWidth">
					<el-select v-model="txform.txstate" placeholder="---请选择---">
						<el-option label="---请选择---" value=""></el-option>
						<el-option label="已打款" value="1"></el-option>
						<el-option label="打款失败" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="失败原因" :label-width="formLabelWidth">
					<el-input v-model="txform.txstatemes" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_shenhe">确 定</el-button>
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
			userData: [],
			selectDate: [],
			counts: 0,
			page: 1,
			rows: 10,
			txon: '',
			xzsta: '',
			dialogFormVisible: false,
			formLabelWidth: '120px',
			txform: {
				txid: 0,
				txon: '',
				txyhk:'',
				txzfb: '',
				txucmes: '',
				txje: 0,
				txdz: 0,
				txsta: "",
				txstate: "",
				txstatemes: ""
			},
			rowData: {}
		};
	},
	mounted() {
		this.getTiXian();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getTiXian();
		},
		next_click(e) {
			this.page = e;
			this.getTiXian();
		},
		current_change(e) {
			this.page = e;
			this.getTiXian();
		},
		but_ucuser(){
			this.page = 1;
			this.getTiXian();
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
			this.$axios.post(sessionStorage.getItem('url') + 'util/excel/tiXianUtil?token=' + sessionStorage.getItem('token'), data, {responseType: 'blob'}).then(res => {
				loading.close();
				if (res.status == 200) {
					const blob = new Blob([res.data], {
						type: "application/vnd.ms-excel"
					});
					var data = new Date();
					var month =data.getMonth() < 9 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
					var date = data.getDate() <= 9 ? "0" + data.getDate() : data.getDate();
					var datetime = data.getFullYear() + "-" + month + "-" + date;
					let fileName = "tixian"+datetime+".xls";
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
		but_edittx(){
			if(this.selectDate.length > 0){
				var ids = "";
				for (let i = 0; i < this.selectDate.length; i++) {
					if(i == 0){
						ids = this.selectDate[i].C_ID;
					}else{
						ids += ","+this.selectDate[i].C_ID;
					}
				}
				let data = {
					ids: ids
				};
				this.$confirm('是否确定批量处理?', '温馨提示', {
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
					this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setPlTiXian?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.getTiXian();
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
			}else{
				this.$message({
					showClose: true,
					message: '请选择【处理的数据】',
					type: 'warning'
				});
				return false;
			}
		},
		handleSelectionChange(val) {
			this.selectDate = val;
		},
		sub_shenhe() {
			if (this.txform.txstate == '') {
				this.$message({
					showClose: true,
					message: '请选择【审核状态】',
					type: 'warning'
				});
				return false;
			} else if (this.txform.txstate == 2) {
				if(this.txform.txstatemes == ""){
					this.$message({
						showClose: true,
						message: '请填写【失败原因】',
						type: 'warning'
					});
					return false;
				}
			}
			if (this.txform.txsta == '') {
				this.$message({
					showClose: true,
					message: '请选择【打款方式】',
					type: 'warning'
				});
				return false;
			}
			this.$confirm('是否确定处理【' + this.txform.txon + '】订单?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					txid: this.txform.txid,
					txstate: this.txform.txstate,
					txstatemes: this.txform.txstatemes,
					txsta: this.txform.txsta
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setTiXian?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getTiXian();
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
		but_chuli(row) {
			this.txform.txid = row.C_ID;
			this.txform.txon = row.C_ON;
			this.txform.txyhk = row.SKMES;
			this.txform.txzfb = row.ZFBMES;
			this.txform.txucmes = row.UCMES;
			this.txform.txje = row.I_ZEBNUM;
			this.txform.txdz = row.I_MONEY;
			this.dialogFormVisible = true;
		},
		getTiXian() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getTiXian?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&txon=' + this.txon + '&xzsta=' + this.xzsta)
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
