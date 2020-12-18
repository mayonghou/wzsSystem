<template>
	<div id="tuanduiuser">
		<div class="tuanduimessage">
			<div v-for="(item,index) in tdData" :key="index" class="tuanduimessage_mes">
				<div @dblclick="onc_mes(index)">C{{item.I_QY}}---{{item.C_UC}}({{item.C_NICNAME}})---{{item.COUNTS}}人---{{item.I_STAMES}}---直招：{{item.PUC}}</div>
				<div v-for="(item,index) in tdAData" :key="index" class="tuanduimessage_mes">
					<div>C{{item.I_QY}}---{{item.C_UC}}({{item.C_NICNAME}})---{{item.COUNTS}}人---{{item.I_STAMES}}---直招：{{item.PUC}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'tuanduiuser',
	data() {
		return {
			usid: '',
			tdData: [],
			tdAData: [],
			tdBData: [],
			tdCData: []
		};
	},
	mounted() {
		this.usid = this.$route.query.usid;
		this.getNextMesUser();
	},
	methods: {
		onc_mes(e){
			this.usid = this.tdData[e].C_ID;
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
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getNextMesUser?token=' + sessionStorage.getItem('token')+'&usid='+this.usid)
				.then(res => {
					//console.log(JSON.stringify(res));
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
		}
	}
};
</script>

<style>
	.tuanduimessage{
		padding: 20px;
	}
	.tuanduimessage_mes{
		padding: 6px 10px 6px 30px;
		cursor:pointer;
		-moz-user-select:none;/*火狐*/
		-webkit-user-select:none;/*webkit浏览器*/
		-ms-user-select:none;/*IE10*/
		-khtml-user-select:none;/*早期浏览器*/
		user-select:none;
	}
</style>
