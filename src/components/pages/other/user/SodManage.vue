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
		<el-table :data="userData" border style="width: 100%">
			<el-table-column prop="C_ON" label="订单编号" width="120"></el-table-column>
			<el-table-column prop="TAB_USER_UC" label="用户账号" width="120"></el-table-column>
			<el-table-column prop="I_SODNUM" label="购买数量" width="120"></el-table-column>
			<el-table-column prop="SYS_USER_UC" label="客服账号" width="120"></el-table-column>
			<el-table-column prop="D_TIME" label="申请时间" width="160"></el-table-column>
			<el-table-column prop="STATEMES" label="审核状态" width="120"></el-table-column>
			<el-table-column prop="D_UPDATE_TIME" label="审核时间" width="160"></el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button v-show="scope.row.I_STATE == 0" @click="but_shenhe(scope.row)" type="text" size="small">审核</el-button>
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
		<el-dialog title="SOD审核" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="订单编号" :label-width="formLabelWidth">
					<el-input v-model="sodon" readonly></el-input>
				</el-form-item>
				<el-form-item label="充值账号" :label-width="formLabelWidth">
					<el-input v-model="soduc" readonly></el-input>
				</el-form-item>
				<el-form-item label="收益额度" :label-width="formLabelWidth">
					<el-input v-model="sodnum" readonly></el-input>
				</el-form-item>
				<el-form-item label="审核状态">
				    <el-radio-group v-model="sodstate">
						<el-radio label="1">审核通过</el-radio>
						<el-radio label="2">审核不通过</el-radio>
				    </el-radio-group>
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
			xzsta: 'shz',
			userData: [],
			counts: 0,
			page: 1,
			rows: 10,
			sodid: '',
			sodon: '',
			sodnum: 0,
			soduc: '',
			sodstate: "1",
			uc: '',
			dialogFormVisible: false,
			formLabelWidth: '120px'
		};
	},
	mounted() {
		this.getSysUserSodUser();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getSysUserSodUser();
		},
		next_click(e) {
			this.page = e;
			this.getSysUserSodUser();
		},
		current_change(e) {
			this.page = e;
			this.getSysUserSodUser();
		},
		but_ucuser(){
			this.page = 1;
			this.getSysUserSodUser();
		},
		sub_shenhe() {
			this.$confirm('是否确定审核订单【' + this.sodon + '】?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					sodid: this.sodid,
					sodstate: this.sodstate
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setSysUserSodStateUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getSysUserSodUser();
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
		but_shenhe(row) {
			this.sodid = row.C_ID;
			this.sodon = row.C_ON;
			this.sodnum = row.I_SODNUM;
			this.soduc = row.TAB_USER_UC;
			this.dialogFormVisible = true;
		},
		getSysUserSodUser() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getSysUserSodUser?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&usuc=' + this.uc + '&xzsta=' + this.xzsta)
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
