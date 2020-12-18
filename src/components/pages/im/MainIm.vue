<template>
	<div id="mainim" v-loading="fullscreenLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
		<div class="mainim_container">
			<div class="mainim_leftA" :style="[{'height': + height_left + 'px'}]">
				<div class="padding">
					<div style="text-align: center;color: #A51C31;">
						等待接入
					</div>
					<div style="clear: both;height: 10px;"></div>
					<div v-for="(imte,index) in listNotData" :key="index">
						<div @dblclick="but_insert(index)" class="not_user">
							<div class="padding">
								<div class="imimg">
									<el-avatar :size="50" :src="imte.US_USER_URL"></el-avatar>
								</div>
								<div class="immes">
									<div style="font-size: 12px;">
										{{imte.US_USER_UC}}
									</div>
									<div style="font-size: 14px;color: #545C64;">
										{{imte.US_USER_NC}}
									</div>
									<div style="font-size: 12px;color: #999999;">
										{{imte.D_CREATE_TIME}}
									</div>
								</div>
								<div v-show="imte.COUNTS > 0" class="imicon">
									{{imte.COUNTS}}
								</div>
								<div style="clear: both;"></div>
							</div>
							<div style="clear: both;"></div>
						</div>
						<div style="clear: both;height: 10px;"></div>
					</div>
					<div style="clear: both;height: 10px;"></div>
				</div>
			</div>
			<div class="mainim_leftB" :style="[{'height': + height_left + 'px'}]">
				<div class="padding">
					<div style="text-align: center;color: #178B2E;">
						已接入
					</div>
					<div style="clear: both;height: 10px;"></div>
					<div v-for="(imte,index) in listYesData" :key="index">
						<div @dblclick="but_mes(index)" class="not_user" :class="imte.state == 1 ? 'imhover' : ''">
							<div class="padding">
								<div class="imimg">
									<el-avatar :size="50" :src="imte.US_USER_URL"></el-avatar>
								</div>
								<div class="immes">
									<div style="font-size: 12px;">
										{{imte.US_USER_UC}}
									</div>
									<div style="font-size: 14px;color: #545C64;">
										{{imte.US_USER_NC}}
									</div>
									<div style="font-size: 12px;color: #999999;">
										{{imte.D_CREATE_TIME}}
									</div>
								</div>
								<div v-show="imte.COUNTS > 0" class="imicon">
									{{imte.COUNTS}}
								</div>
								<div style="clear: both;"></div>
							</div>
							<div style="clear: both;"></div>
						</div>
						<div style="clear: both;height: 10px;"></div>
					</div>
					<div style="clear: both;height: 10px;"></div>
				</div>
			</div>
			<div v-show="workId != ''" class="mainim_leftC" :style="[{'height': + height_left + 'px','width': + width_c + 'px'}]">
				<div class="padding" style="background-color: #545C64;">
					<div style="float: left;">
						<div style="font-size: 12px;color: #FFFFFF;font-size: 18px;">
							<div style="clear: both;height: 10px;"></div>
							{{usnc}}[{{usuc}}]
						</div>
					</div>
					<div style="float: right;padding-right: 10px;">
						<el-button @click="addShowSod" type="primary">申请SOD</el-button>
						<el-button @click="endSession" type="warning">结束会话</el-button>
					</div>
					<div style="clear: both;"></div>
				</div>
				<div style="clear: both;"></div>
				<div id="im_mes" class="padding" :style="[{'height': + height_mes + 'px'}]" style="overflow-y: auto;background-color: #F1F1F1;">
					<div v-for="(imte,index) in listMesData" :key="index">
						<div v-show="imte.ussta == 1" class="padding">
							<div style="float: left;width: 48px;">
								<el-avatar :size="50" :src="imte.usurl"></el-avatar>
							</div>
							<div style="float: left;padding-left: 10px;" :style="[{'max-width': + (width_c-200) + 'px'}]">
								<div v-show="imte.ustype == 'text'">
									<div class="padding" style="background-color: #FFFFFF;border-radius: 4px;color: #000000;">
										{{imte.usmes}}
									</div>
									<div class="padding" style="color: #8799A3;">
										{{imte.usdate}}
									</div>
								</div>
								<div v-show="imte.ustype == 'img'">
									<el-image style="width: 200px; height: 80px;" :src="imte.usmes" :preview-src-list="[imte.usmes]"></el-image>
								</div>
							</div>
							<div style="clear: both;"></div>
						</div>
						<div v-show="imte.ussta == 0" class="padding">
							<div style="float: right;width: 48px;">
								<el-avatar :size="50" :src="imte.usurl"></el-avatar>
							</div>
							<div style="float: right;padding-right: 10px;" :style="[{'max-width': + (width_c-200) + 'px'}]">
								<div v-show="imte.ustype == 'text'">
									<div class="padding" style="background-color: #FFFFFF;border-radius: 4px;color: #000000;text-align: right;">
										{{imte.usmes}}
									</div>
									<div class="padding" style="color: #8799A3;">
										{{imte.usdate}}
									</div>
								</div>
								<div v-show="imte.ustype == 'img'">
									<el-image style="width: 200px; height: 80px;" :src="imte.usmes" :preview-src-list="[imte.usmes]"></el-image>
								</div>
							</div>
							<div style="clear: both;"></div>
						</div>
						<div style="clear: both;height: 10px;"></div>
					</div>
					<div style="clear: both;"></div>
				</div>
				<div style="clear: both;"></div>
				<div style="border-top: solid 1px #999999;">
					<div class="padding">
						<div style="float: left;padding-left: 10px;">
							<i  @click="but_lsjl" class="el-icon-pie-chart" style="font-size: 24px;cursor: pointer;"></i>
						</div>
						<div style="float: left;padding-left: 20px;">
							<div @click="but_kjhf" style="font-size: 16px;cursor: pointer;color: #0074D9;">快捷回复</div>
						</div>
						<div style="float: right;padding-left: 10px;">
							<el-upload ref="upload" :action="uploadUrl" :on-success="uploadSuccess">
							  <i class="el-icon-picture" style="font-size: 24px;cursor: pointer;"></i>
							</el-upload>
						</div>
						<div style="clear: both;"></div>
					</div>
					<div class="padding">
						<el-input type="textarea" v-model="mes_line" ></el-input>
					</div>
					<div class="padding" style="text-align: right;">
						<el-button @click="post_line" type="success">发送</el-button>
					</div>
				</div>
			</div>
			<div style="clear: both;"></div>
		</div>
		<el-dialog title="申请SOD" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="账号" label-width="120px"><el-input v-model="usuc" readonly="true" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="数量" label-width="120px"><el-input v-model="sodnum" type="number" autocomplete="off"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_addSod">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="<strong>快捷回复</strong>" :visible.sync="dialogShow">
			<div style="overflow-y: auto;height: 500px;">
				<div v-for="(item,index) in kjhfData" :key="index">
					<div @dblclick="sub_kjhf(index)" class="imkjhf">
						{{item.C_MES}}
					</div>
				</div>
			</div>
		</el-dialog>
		<el-dialog title="历史记录" :visible.sync="dialogJlShow">
			<div style="overflow-y: auto;height: 500px;">
				<div v-for="(imte,index) in listJlMesData" :key="index">
					<div v-show="imte.ussta == 1" class="padding">
						<div style="float: left;width: 48px;">
							<el-avatar :size="50" :src="imte.usurl"></el-avatar>
						</div>
						<div style="float: left;padding-left: 10px;" :style="[{'max-width': + (width_c-200) + 'px'}]">
							<div v-show="imte.ustype == 'text'">
								<div class="padding" style="background-color: #FFFFFF;border-radius: 4px;color: #000000;">
									{{imte.usmes}}
								</div>
								<div class="padding" style="color: #8799A3;">
									{{imte.usdate}}
								</div>
							</div>
							<div v-show="imte.ustype == 'img'">
								<el-image style="width: 200px; height: 80px;" :src="imte.usmes" :preview-src-list="[imte.usmes]"></el-image>
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
					<div v-show="imte.ussta == 0" class="padding">
						<div style="float: right;width: 48px;">
							<el-avatar :size="50" :src="imte.usurl"></el-avatar>
						</div>
						<div style="float: right;padding-right: 10px;" :style="[{'max-width': + (width_c-200) + 'px'}]">
							<div v-show="imte.ustype == 'text'">
								<div class="padding" style="background-color: #FFFFFF;border-radius: 4px;color: #000000;text-align: right;">
									{{imte.usmes}}
								</div>
								<div class="padding" style="color: #8799A3;">
									{{imte.usdate}}
								</div>
							</div>
							<div v-show="imte.ustype == 'img'">
								<el-image style="width: 200px; height: 80px;" :src="imte.usmes" :preview-src-list="[imte.usmes]"></el-image>
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
					<div style="clear: both;height: 10px;"></div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'mainim',
	data() {
		return {
			dialogShow: false,
			dialogJlShow: false,
			uploadUrl: '',
			title: '后台聊天',
			fullscreenLoading: true,
			loadingText: '加载中...',
			mes_line: '',
			height_left: 0,
			width_c: 0,
			height_mes: 0,
			usuc: '',
			usnc: '',
			usurl: '',
			workId: '',
			sid: '',
			sysnc: '',
			sysuc: '',
			sysurl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg',
			times: '2020-12-02 13:12',
			listNotData: [],
			listYesData: [],
			listMesData: [],
			listJlMesData: [],
			kjhfData: [],
			dialogFormVisible: false,
			sodnum: 0,
			audio: ''
		};
	},
	mounted() {
		let height = window.innerHeight;
		let width = window.innerWidth;
		this.height_left = height-60;
		this.width_c = width-780;
		this.height_mes = height-400;
		this.sysuc = sessionStorage.getItem('sysuc');
		this.sysnc = sessionStorage.getItem('sysnc');
		this.getNotListData();
		this.getQuickReplySocket();
		setTimeout(() => {
			this.getYesListData();
			this.fullscreenLoading = false;
		}, 1000);
		this.uploadUrl = sessionStorage.getItem('url') + 'util/oos/uploadMi';
		this.audio = new Audio();
		this.audio.src = "http://system.zhiangshengwu.com/tishi.mp3";
	},
	methods: {
		but_lsjl(){
			this.dialogJlShow = true;
			const loading = this.$loading({
				lock: true,
				text: '加载中...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			this.$axios.get(sessionStorage.getItem('urlSocket') + 'socket/socket/getOnlineMesSocket?token=' + sessionStorage.getItem('token')+'&usuc='+this.usuc).then(res => {
				loading.close();
				console.log(JSON.stringify(res));
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						if(data.data.length > 0){
							for (let i = 0; i < data.data.length; i++) {
								var listDataArray = data.data[i].listData;
								if(listDataArray.length > 0){
									for (let m = 0; m < listDataArray.length; m++) {
										this.listJlMesData.push(JSON.parse(listDataArray[m].C_WM_JSONDATA));
									}
								}
							}
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
		},
		but_kjhf(){
			this.dialogShow = true;
		},
		sub_kjhf(e){
			this.mes_line = this.kjhfData[e].C_MES;
			this.dialogShow = false;
		},
		addShowSod(){
			//申请SOD
			this.dialogFormVisible = true;
		},
		sub_addSod(){
			if(this.sodnum < 0 && this.sodnum > 100){
				return this.$message({
					showClose: true,
					message: "购买数量必须大于0且小于100个",
					type: 'warning'
				});
			}else{
				//申请SOD提交
				this.$confirm('是否确定提交购买SOD申请?', '温馨提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let data = {
						sysuc: this.sysuc,
						usuc: this.usuc,
						sodnum: this.sodnum
					};
					const loading = this.$loading({
						lock: true,
						text: '提交中...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setSysUserSodUser?token=' + sessionStorage.getItem('token'), data).then(res => {
						loading.close();
						//console.log(JSON.stringify(res));
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.dialogFormVisible = false;
								this.$message({
									showClose: true,
									message: "申请SOD下单成功",
									type: 'success'
								});
								this.sendMes("text","已为您下单购买【"+this.sodnum+"】个SOD,预计5分钟内到账，请稍等...");
								if(data.message != "SUCCESS"){
									this.shehesod(data.message,this.sodnum);
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
				});
			}
		},
		shehesod(sodid,sodnum){
			let data = {
				sodid: sodid,
				sodstate: 1
			};
			const loading = this.$loading({
				lock: true,
				text: '提交中...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			this.$axios.post(sessionStorage.getItem('url') + 'sys/system/setSysUserSodStateUser?token=' + sessionStorage.getItem('token'), data).then(res => {
				loading.close();
				//console.log(JSON.stringify(res));
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: data.message,
							type: 'success'
						});
						this.sendMes("text","您购买的【"+sodnum+"】个SOD已到账，请查收！");
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
		endSession(){
			//结束会话
			this.$confirm('是否确定结束当前会话?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				var jsonData = {
					workId: this.workId,
					sid: this.sid
				};
				this.$websocket.dispatch("WEBSOCKET_SEND",{
					method: "endSession",
					jsonData: jsonData
				});
				this.workId = "";
				this.getYesListData();
			});
		},
		uploadSuccess(response, file, fileList) {
			//上传图片
			console.log(response.flag);
			if(response.flag){
				this.sendMes("img",response.data);
				this.$refs.upload.clearFiles();
			}else{
				this.$message({
					showClose: true,
					message: response.message,
					type: 'warning'
				});
			}
		},
		post_line(){
			//发送文档消息
			if(this.mes_line.trim() != ""){
				this.sendMes("text",this.mes_line);
				this.mes_line = "";
			}
		},
		sendMes(type,mes){
			//发送消息
			var jsonData = {
				workId: this.workId,
				usuc: this.sysuc,
				usnc: this.sysnc,
				usurl: this.sysurl,
				ustype: type,
				usmes: mes,
				usdate: this.getDate(),
				ussta: 0,
				sid: this.sid
			};
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "sendMesKfKh",
				jsonData: jsonData
			});
			this.listMesData.push(jsonData);
			this.scrollTo();
		},
		getNotListData(){
			var jsonData={};
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "getNotListData",
				jsonData:jsonData,
			});
		},
		getYesListData(){
			var jsonData={
				sysuc: this.sysuc
			};
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "getYesListData",
				jsonData:jsonData,
			});
		},
		but_insert(e){
			var jsonData={
				workId: this.listNotData[e].C_ID,
				usuc: this.listNotData[e].US_USER_UC,
				sid: this.listNotData[e].US_USER_UC,
				sysuc: this.sysuc,
				sysnc: this.sysnc,
				sysurl: this.sysurl
			};
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "sendInsert",
				jsonData:jsonData,
			});
			this.getNotListData();
			setTimeout(() => {
				this.getYesListData();
			}, 1000);
		},
		but_mes(e){
			var jsonData={
				workId: this.listYesData[e].C_ID
			};
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "sendSave",
				jsonData:jsonData,
			});
			this.$websocket.dispatch("WEBSOCKET_SEND",{
				method: "getIdListWorkMesAllData",
				jsonData:jsonData,
			});
			this.workId = this.listYesData[e].C_ID;
			this.sid = this.listYesData[e].US_USER_UC;
			this.usuc = this.listYesData[e].US_USER_UC;
			this.usnc = this.listYesData[e].US_USER_NC;
			this.listYesData[e].COUNTS = 0;
		},
		getDate(){
			var date1=new Date();
			var year=date1.getFullYear();
			var month=date1.getMonth()+1;
			if(month < 10){
				month = "0"+month;
			}
			var day=date1.getDate();
			if(day < 10){
				day = "0"+day;
			}
			var hours=date1.getHours();
			if(hours < 10){
				hours = "0"+hours;
			}
			var minutes=date1.getMinutes();
			if(minutes < 10){
				minutes = "0"+minutes;
			}
			var seconds=date1.getSeconds();
			if(seconds < 10){
				seconds = "0"+seconds;
			}
			return year+"-"+month+"-"+day+" "+hours+":"+minutes;
		},
		scrollTo(){
			setTimeout(() => {
				let ele = document.getElementById('im_mes');
				ele.scrollTop = ele.scrollHeight;
			}, 500);
		},
		getQuickReplySocket(){
			this.$axios.get(sessionStorage.getItem('urlSocket') + 'socket/socket/getQuickReplySocket?token=' + sessionStorage.getItem('token')).then(res => {
				//console.log(JSON.stringify(res));
				if (res.status == 200) {
					var data = res.data;
					if (data.flag) {
						this.kjhfData = data.data;
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
	computed:{
		errorCont() {
			//错误
			return this.$websocket.getters.onEvent('error');
		},
		alertCont() {
			//心跳检查
			return this.$websocket.getters.onEvent('pant');
		},
		getNotListDataSuccess() {
			//未接入列表
			return this.$websocket.getters.onEvent('getNotListDataSuccess');
		},
		getYesListDataSuccess() {
			//已接入列表
			return this.$websocket.getters.onEvent('getYesListDataSuccess');
		},
		getIdListWorkMesAllDataSuccess() {
			//根据通道ID获取所有聊天记录
			return this.$websocket.getters.onEvent('getIdListWorkMesAllDataSuccess');
		},
		sendMesKhKf(){
			//接收客户发送的消息
			return this.$websocket.getters.onEvent('sendMesKhKf');
		}
	},
	watch: {
		errorCont(a, b) {
			if (a !== b && a) {
				console.log("pant="+a);
				var jsonData = JSON.parse(a);
				this.$message({
					showClose: true,
					message: jsonData.mes,
					type: 'warning'
				});
			}
		},
		alertCont(a, b) {
			if (a !== b && a) {
				console.log("pant="+a);
			}
		},
		getNotListDataSuccess(a, b) {
			if (a !== b && a) {
				console.log("getNotListDataSuccess="+a);
				var jsonData = JSON.parse(a);
				if(jsonData.listMap.length>0){
					this.audio.play();
				}
				this.listNotData = jsonData.listMap;
			}
		},
		getYesListDataSuccess(a, b) {
			if (a !== b && a) {
				console.log("getYesListDataSuccess="+a);
				var jsonData = JSON.parse(a);
				this.listYesData = jsonData.listMap;
			}
		},
		getIdListWorkMesAllDataSuccess(a, b) {
			if (a !== b && a) {
				console.log("getIdListWorkMesAllDataSuccess="+a);
				this.listMesData = [];
				var jsonData = JSON.parse(a);
				if(jsonData.listMap.length > 0){
					for (let i = 0; i < jsonData.listMap.length; i++) {
						console.log("====="+jsonData.listMap[i].C_WM_JSONDATA);
						this.listMesData.push(JSON.parse(jsonData.listMap[i].C_WM_JSONDATA));
					}
					this.scrollTo();
				}
			}
		},
		sendMesKhKf(a, b) {
			this.audio.play();
			if (a !== b && a) {
				console.log("sendMesKhKf="+JSON.stringify(a));
				if(a.workId == this.workId){
					this.listMesData.push(a);
					this.scrollTo();
					var jsonData={
						workId: this.workId
					};
					this.$websocket.dispatch("WEBSOCKET_SEND",{
						method: "sendSave",
						jsonData:jsonData,
					});
				}else{
					for (let i = 0; i < this.listYesData.length; i++) {
						if(this.listYesData[i].C_ID == a.workId){
							this.listYesData[i].COUNTS = this.listYesData[i].COUNTS + 1;
						}
					}
				}
			}
		}
	}
};
</script>

<style>
	#mainim{
		width: 100%;
		height: 100%;
	}
	.mainim_container{
		width: 100%;
	}
	.mainim_leftA{
		position: absolute;
		width: 260px;
		background-color: #FFF2F5;
		overflow-y: auto;
	}
	.mainim_leftB{
		position: absolute;
		width: 260px;
		left: 260px;
		background-color: #EAFFF2;
		overflow-y: auto;
	}
	.mainim_leftC{
		position: absolute;
		left: 520px;
	}
	.routerview {
		overflow-y: auto;
	}
	.not_user{
		border: solid 1px #EBEBEB;
		border-radius: 6px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		cursor: pointer;
		-moz-user-select:none;/*火狐*/
		-webkit-user-select:none;/*webkit浏览器*/
		-ms-user-select:none;/*IE10*/
		-khtml-user-select:none;/*早期浏览器*/
		user-select:none;
	}
	.not_user:hover{
		background-color: #DEF5FF;
	}
	.padding{
		padding: 10px;
	}
	.imimg{
		float: left;
		width: 48px;
	}
	.immes{
		float: left;
		width: 130px;
		padding-left: 10px;
	}
	.imicon{
		float: right;
		width: 30px;
		text-align: center;
		line-height: 48px;
		color: #D12A4F;
	}
	.imhover{
		background-color: #B4FFC4;
	}
	.imkjhf{
		padding: 10px;
		border-bottom: solid 1px #999999;
		cursor: pointer;
	}
</style>