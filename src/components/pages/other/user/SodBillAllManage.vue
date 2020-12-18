<template>
	<div id="usermanage">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-select v-model="xzsta" placeholder="---请选择---">
				<el-option label="全部" value=""></el-option>
				<el-option label="审核中" value="shz"></el-option>
				<el-option label="已通过" value="ytg"></el-option>
				<el-option label="未通过" value="wtg"></el-option>
			</el-select>
		</div>
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="uc" placeholder="请输入搜索账号"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_ucuser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="listData" border style="width: 100%">
			<el-table-column prop="C_SUSB_ON" label="订单编号" width="120"></el-table-column>
			<el-table-column prop="I_SUSB_SUM" label="订单总数" width="120"></el-table-column>
			<el-table-column prop="I_SUSB_SOD_SUM" label="SOD总数" width="120"></el-table-column>
			<el-table-column prop="SYS_USER_UC" label="客服账号" width="120"></el-table-column>
			<el-table-column prop="D_TIME" label="申请时间" width="160"></el-table-column>
			<el-table-column prop="STATEMES" label="审核状态" width="120"></el-table-column>
			<el-table-column prop="D_STATE_TIME" label="审核时间" width="160"></el-table-column>
			<el-table-column prop="C_STATE_MES" label="审核备注" width="300"></el-table-column>
			<el-table-column fixed="right" label="操作" width="200" align="center">
				<template slot-scope="scope">
					<el-button v-show="scope.row.I_STATE == 0" @click="but_shenhe(scope.row)" type="text" size="small">对账审核</el-button>
					<el-button @click="but_like(scope.row)" type="text" size="small">对账详情</el-button>
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
		<el-dialog title="对账详情" :visible.sync="dialogFormVisible">
			<el-table :data="listAllData" style="width: 100%" height="400" border>
				<el-table-column prop="C_ON" label="订单编号" width="120"></el-table-column>
				<el-table-column prop="TAB_USER_UC" label="用户账号" width="120"></el-table-column>
				<el-table-column prop="I_SODNUM" label="购买数量" width="120"></el-table-column>
				<el-table-column prop="SYS_USER_UC" label="客服账号" width="120"></el-table-column>
				<el-table-column prop="D_TIME" label="申请时间" width="160"></el-table-column>
				<el-table-column prop="STATEMES" label="审核状态" width="120"></el-table-column>
				<el-table-column prop="D_UPDATE_TIME" label="审核时间" width="160"></el-table-column>
			</el-table>
		</el-dialog>
		<el-dialog title="SOD审核" :visible.sync="shenHeVisible">
			<el-form>
				<el-form-item label="订单编号" :label-width="formLabelWidth">
					<el-input v-model="billon" readonly></el-input>
				</el-form-item>
				<el-form-item label="SOD总数" :label-width="formLabelWidth">
					<el-input v-model="billnum" readonly></el-input>
				</el-form-item>
				<el-form-item label="到账总额" :label-width="formLabelWidth">
					<el-input v-model="billmoney" readonly></el-input>
				</el-form-item>
				<el-form-item label="审核状态">
				    <el-radio-group v-model="billstate">
						<el-radio label="1">审核通过</el-radio>
						<el-radio label="2">审核不通过</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="备注信息" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="billmes"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="shenHeVisible = false">取 消</el-button>
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
			xzsta: 'shz',
			listData: [],
			listAllData: [],
			counts: 0,
			page: 1,
			rows: 10,
			billid: '',
			billon: '',
			billnum: 0,
			billmoney: 0,
			billstate: "1",
			billmes: '',
			uc: '',
			dialogFormVisible: false,
			shenHeVisible: false,
			formLabelWidth: '120px'
		};
	},
	mounted() {
		this.getSysUserSodBillStateUser();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getSysUserSodBillStateUser();
		},
		next_click(e) {
			this.page = e;
			this.getSysUserSodBillStateUser();
		},
		current_change(e) {
			this.page = e;
			this.getSysUserSodBillStateUser();
		},
		but_ucuser(){
			this.page = 1;
			this.getSysUserSodBillStateUser();
		},
		sub_shenhe(){
			if(this.billstate == 2 && this.billmes == ""){
				return this.$message({
					showClose: true,
					message: '选择审核不通过时，必须填写备注信息',
					type: 'error'
				});
			}else{
				this.$confirm('是否确认审核【'+this.billon+'】订单号?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						billid: this.billid,
						billmes: this.billmes,
						billstate: this.billstate
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setSysUserSodBillStateUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.shenHeVisible = false;
								this.getSysUserSodBillStateUser();
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
		but_shenhe(row){
			this.billid = row.C_SUSB_ID;
			this.billon = row.C_SUSB_ON;
			this.billnum = row.I_SUSB_SOD_SUM;
			this.billmoney = row.I_SUSB_SOD_SUM*1000;
			this.shenHeVisible = true;
		},
		but_like(row) {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getAllSysUserSodUser?token=' + sessionStorage.getItem('token') + '&susbid=' + row.C_SUSB_ID)
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.listAllData = data.data;
							this.dialogFormVisible = true;
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
		getSysUserSodBillStateUser() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getSysUserSodBillStateUser?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&usuc=' + this.uc + '&xzsta=' + this.xzsta)
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.listData = data.data;
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
