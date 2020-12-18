<template>
	<div id="usermanage"  v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div style="float: left;width: 300px;padding-left: 30px;">
			<el-input v-model="uc" placeholder="请输入内容"></el-input>
		</div>
		<div style="float: left;padding-left: 30px;">
			<el-button @click="but_ucuser" type="primary" icon="el-icon-search">搜索</el-button>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<el-table :data="userData" border style="width: 100%">
			<el-table-column prop="C_UC" label="账号" width="120"></el-table-column>
			<el-table-column prop="C_NICNAME" label="名称" width="120"></el-table-column>
			<el-table-column prop="C_NAME" label="等级" width="120"></el-table-column>
			<el-table-column prop="I_QY" label="区域" width="120"></el-table-column>
			<el-table-column prop="I_STAMES" label="状态" width="120"></el-table-column>
			<el-table-column prop="I_INTEGRAL" label="积分" width="120"></el-table-column>
			<el-table-column prop="I_WC" label="维C" width="120"></el-table-column>
			<el-table-column prop="I_SOD" label="SOD" width="120"></el-table-column>
			<el-table-column prop="C_ATTER" label="密保问题" width="120"></el-table-column>
			<el-table-column prop="C_ANSWER" label="密保答案" width="120"></el-table-column>
			<el-table-column prop="D_END_TIME" label="截至日期" width="160"></el-table-column>
			<el-table-column prop="D_TIME" label="注册时间" width="160"></el-table-column>
			<el-table-column fixed="right" label="操作" width="380">
				<template slot-scope="scope">
					<el-button @click="but_jilu(scope.row)" type="text" size="small">记录详情</el-button>
					<el-button @click="but_tuandui(scope.row)" type="text" size="small">团队信息</el-button>
					<el-button @click="but_yanchang(scope.row)" type="text" size="small">延长奖励</el-button>
					<el-button @click="but_jiangli(scope.row)" type="text" size="small">发放奖励</el-button>
					<el-button v-show="scope.row.I_STA == 1" @click="but_fenghao(scope.row)" style="color: #FF0000;" type="text" size="small">封号</el-button>
					<el-button v-show="scope.row.I_STA == 0" @click="but_jiefeng(scope.row)" style="color: #118408;" type="text" size="small">解封</el-button>
					<el-button @click="but_pwd(scope.row)" type="text" size="small" style="color: #FF6600;">重置密码</el-button>
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
		<el-dialog title="发放奖励" :visible.sync="dialogFormVisible">
			<el-form :model="jlform">
				<el-form-item label="发放账号" :label-width="formLabelWidth">
					<el-input v-model="jlform.usuc" disabled></el-input>
				</el-form-item>
				<el-form-item label="发放类型" :label-width="formLabelWidth">
					<el-select v-model="jlform.sta" placeholder="---请选择---">
						<el-option label="---请选择---" value=""></el-option>
						<el-option label="积分" value="JF"></el-option>
						<el-option label="SOD" value="SOD"></el-option>
						<el-option label="维C" value="WC"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发放数量" :label-width="formLabelWidth">
					<el-input v-model="jlform.num" type="number" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_jiangli">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="记录详情" :visible.sync="log" customClass="customWidth"  width="80%" height="80%"  v-loading="logLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
			<div id="logwalletuser" style="overflow: auto;" :style="height_style">
				<div style="float: left;width: 300px;padding-left: 30px;">
					<el-select v-model="sta">
						<el-option label="积分" value="JF"></el-option>
						<el-option label="SOD" value="SOD"></el-option>
						<el-option label="维C" value="WC"></el-option>
					</el-select>
				</div>
				<div style="float: left;padding-left: 30px;">
					<el-button @click="but_loguser" type="primary" icon="el-icon-search">搜索</el-button>
				</div>
				<div style="clear: both;height: 10px;"></div>
				<el-table :data="logData" border style="width: 100%">
					<el-table-column prop="C_SOURCE" label="来源" width="120"></el-table-column>
					<el-table-column prop="I_NUM" label="数量" width="120"></el-table-column>
					<el-table-column prop="I_STAMES" label="状态" width="120"></el-table-column>
					<el-table-column prop="C_MEMO" label="说明" width="200"></el-table-column>
					<el-table-column prop="D_TIME" label="时间" width="140"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<el-dialog title="团队信息" :visible.sync="td" customClass="customWidth"  width="80%" height="80%"  v-loading="tdLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
			<div id="tuanduiuser"  :style="height_style" style="overflow: auto;">
				<div class="tuanduimessage">
					<div style="display: flex;justify-content: space-between;padding-bottom: 30px;" class="dl_box">
						<dl>
							<dt style="width: 140px;text-align: center;">总业绩</dt>
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_ZYJ}}</dd>
						</dl>                                                                                       
						<dl>
							<dt style="width: 140px;text-align: center;">今日业绩</dt>                               
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_ZYJ_TODAY}}</dd>
						</dl>                                                                                       
						<dl>
							<dt style="width: 140px;text-align: center;">昨日业绩</dt>                               
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_ZYJ_YESTERDAY}}</dd>
						</dl>                                                                                       
																													
						<dl>                                                                                         
							<dt style="width: 150px;text-align: center;">更新时间</dt>                               
							<dd style="width: 150px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.D_TIME}}</dd>
						</dl>                                                                                       
						<dl>                                                                                         
							<dt style="width: 140px;text-align: center;">总人数</dt>                                 
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_ZNUM}}</dd>
						</dl>                                                                                        
						<dl>                                                                                         
							<dt style="width: 140px;text-align: center;">直推人数</dt>                               
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_PNUM}}</dd>
						</dl>                                                                                        
						<dl>                                                                                        
							<dt style="width: 140px;text-align: center;">等级</dt>                                   
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_DJNUM}}</dd>
						</dl>                                                                                       
						<dl>                                                                                        
							<dt style="width: 140px;text-align: center;">是否出局</dt>                               
							<dd style="width: 140px;text-align: center;margin-inline-start: 0px;margin-top: 20px;">{{teamData.I_STATE}}</dd>
						</dl>
					</div>
					<div v-for="(item,index) in tdData" :key="index" class="tuanduimessage_mes">
						<div @click="onc_mes(index)">{{item.I_QY}}{{item.C_UC}}({{item.C_NICNAME}})---{{item.COUNTS}}人---{{item.I_STAMES}}---直招：{{item.PUC}}</div>
						<div v-for="(item,index) in tdAData" :key="index" class="tuanduimessage_mes">
							<div>{{item.I_QY}}---{{item.C_UC}}({{item.C_NICNAME}})---{{item.COUNTS}}人---{{item.I_STAMES}}---直招：{{item.PUC}}</div>
						</div>
					</div>
				</div>
			</div> 
		</el-dialog>
		<el-dialog title="收益时间" :visible.sync="dialogTimeFormVisible">
			<el-form :model="sjform">
				<el-form-item label="方法账号" :label-width="formLabelWidth">
					<el-input v-model="sjform.usuc" disabled></el-input>
				</el-form-item>
				<el-form-item label="收益天数" :label-width="formLabelWidth">
					<el-input v-model="sjform.num" type="number" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTimeFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_yanchang">确 定</el-button>
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
			logData: [],
			usid: '',
			sta: 'JF',
			userData: [],
			counts: 0,
			page: 1,
			rows: 10,
			uc: 'ALL',
			dialogFormVisible: false,
			td: false,
			log: false,
			logLoading: false,
			dialogTimeFormVisible: false,
			formLabelWidth: '120px',
			loadingText: '加载中...',
			fullscreenLoading: true,
			tdLoading: false,
			tdALoading: false,
			tdBLoading: false,
			height_style: '',
			jlform: {
				num: 0,
				sta: '',
				usuc:'',
				usid: ''
			},
			sjform: {
				num: 0,
				usuc:'',
				usid: ''
			},
			rowData: {},
			usid: '',
			teamData: {
				I_ZYJ: '',
				I_ZYJ_TODAY: '',
				I_ZYJ_YESTERDAY: '',
				I_ZNUM: '',
				D_TIME: '',
				I_PNUM: '',
				I_DJNUM: '',
				I_STATE: ''
			},
			tdData: [],
			tdAData: [],
			tdBData: [],
			tdCData: []
		};
	},
	mounted() {
		this.getUser();
		let height = window.innerHeight;
		this.usid = this.$route.query.usid;
		this.height_style = 'height: ' + (height-300) + 'px;';
		//this.getNextMesUser();
	},
	methods: {
		prev_click(e) {
			this.page = e;
			this.getUser();
		},
		next_click(e) {
			this.page = e;
			this.getUser();
		},
		current_change(e) {
			this.page = e;
			this.getUser();
		},
		but_ucuser(){
			if(this.uc == ''){
				this.uc = 'ALL'
			} 
			this.page = 1;
			this.getUser();
		},
		but_pwd(row){
			this.$confirm('是否确定重置【' + row.C_UC + '】的密码?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					usid: row.C_ID
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setPwdUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getUser();
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
		but_jilu(row){
			this.log = true;
			this.usid = row.C_ID;
			this.logLoading = true;
			this.getLogWalletUser();
		},
		but_tuandui(row){
			this.jlform.usid = row.C_ID;
			this.jlform.usuc = row.C_UC;
			this.usid = row.C_ID;
			this.getNextMesUser();
			this.getUserById();
			this.td = true;
			this.tdLoading  = true;
		},
		sub_yanchang(){
			this.$confirm('是否确定延长【' + this.sjform.usuc + '】账号发放时间?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					usid: this.sjform.usid,
					sta: this.sjform.num
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setEndTimeUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getUser();
							this.dialogTimeFormVisible = false;
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
		but_yanchang(row){
			this.sjform.usid = row.C_ID;
			this.sjform.usuc = row.C_UC;
			this.dialogTimeFormVisible = true;
		},
		but_jiefeng(row){
			this.$confirm('是否确定解封【' + row.C_UC + '】账号?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					usid: row.C_ID,
					sta: 1
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setStaUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getUser();
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
		but_fenghao(row){
			this.$confirm('是否确定封【' + row.C_UC + '】账号?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					usid: row.C_ID,
					sta: 0
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setStaUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getUser();
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
		sub_jiangli() {
			if (this.jlform.sta == '') {
				this.$message({
					showClose: true,
					message: '请选择发放奖励类别',
					type: 'warning'
				});
			} else if (this.jlform.num == 0) {
				this.$message({
					showClose: true,
					message: '请填写发放奖励数量',
					type: 'warning'
				});
			} else {
				this.$confirm('是否确定方法奖励给【' + this.jlform.usuc + '】账号?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						usid: this.jlform.usid,
						sta: this.jlform.sta,
						num: this.jlform.num
					};
					const loading = this.$loading({
						lock: true,
						text: '保存中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setWalletUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
								this.getUser();
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
		but_jiangli(row) {
			this.jlform.usid = row.C_ID;
			this.jlform.usuc = row.C_UC;
			this.dialogFormVisible = true;
		},
		getUser() {
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getUser?token=' + sessionStorage.getItem('token') + '&page=' + this.page + '&rows=' + this.rows + '&uc=' + this.uc)
				.then(res => {
					this.fullscreenLoading = false;
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
		},
		onc_mes(e){
			// this.usid = row.C_ID;	
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getNextMesUser?token=' + sessionStorage.getItem('token')+'&usid='+this.usid)
				.then(res => {
					//console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.tdAData = data.data;
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
		getNextMesUser(){	
			this.tdAData = [];
			this.tdBData = [];
			this.tdCData = [];
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getNextMesUser?token=' + sessionStorage.getItem('token')+'&usid='+this.usid)
				.then(res => {
					//console.log(JSON.stringify(res));
					this.tdBLoading = true;
					if(this.tdALoading){
						this.tdLoading  = false;
						this.tdALoading = false;
					}
					
					if (res.status == 200) {
						var data = res.data;
						//console.log(data);
						if (data.flag) {
							this.tdData = data.data;
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
		getUserById(){
			this.teamData= {
				I_ZYJ: '',
				I_ZYJ_TODAY: '',
				I_ZYJ_YESTERDAY: '',
				I_ZNUM: '',
				D_TIME: '',
				I_PNUM: '',
				I_DJNUM: '',
				I_STATE: ''};
			if(this.usid != undefined){
				this.$axios
				    .get(sessionStorage.getItem('url') + 'sys/system/getUserById?token=' + sessionStorage.getItem('token')+'&usid='+this.usid)
					.then(res => {
						this.tdALoading = true;
						if(this.tdBLoading){
							this.tdLoading  = false;
							this.tdBLoading = false;
						}
						//console.log(JSON.stringify(res));
						if (res.status == 200) {
							//console.log(data);
							var data = res.data;
							if(data.data.length <= 0 || data.data.length == undefined){
								return;
							}
							if (data.flag) {
								this.teamData = data.data[0];
								var i = this.teamData.I_STATE;
								if(i == 0){
									this.teamData.I_STATE = "已出局";
								}else{
									this.teamData.I_STATE = "未出局";
								}
								
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
		},
		getLogWalletUser() {
			this.logData = [];
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getLogWalletUser?token=' + sessionStorage.getItem('token') + '&usid=' + this.usid +'&sta=' + this.sta)
				.then(res => {
					//console.log(JSON.stringify(res));
					this.logLoading = false;
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.logData = data.data;
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
		but_loguser(){
			this.logLoading = true;
			this.getLogWalletUser();
		}
	}
};
</script>
<style>
	.tuanduimessage{
		padding-bottom: 30px;
	}
	.tuanduimessage dl{
		margin: 0;
	}
	.tuanduimessage_mes{
		padding: 10px 10px 6px 30px;
		cursor:pointer;
		-moz-user-select:none;/*火狐*/
		-webkit-user-select:none;/*webkit浏览器*/
		-ms-user-select:none;/*IE10*/
		-khtml-user-select:none;/*早期浏览器*/
		user-select:none;
	}
	/* .tuanduimessage_mes:last-child{
		border-bottom: 1px solid #333;
	} */
	.tuanduimessage div dl{
		border-left: 1px solid #333;
	}
	.tuanduimessage div dl:first-child{
		border-left: none;
	}
	.dl_box{
		border-bottom: 1px solid #333;
		margin-bottom: 20px;
	}
</style>