<template>
	<div id="fqmanage">
		<div class="nva">
			<div @click="but_add" class="nvames" style="color: #0074D9;">
				<i class="el-icon-plus"></i>
				新建
			</div>
			<div style="clear: both;"></div>
		</div>
		<el-table :data="fqData" border style="width: 100%">
			<el-table-column prop="C_PROBLEM" label="问题"></el-table-column>
			<el-table-column prop="ANSWER" label="答案"></el-table-column>
			<el-table-column prop="I_NUM" label="排序" width="100"></el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="but_del(scope.row)" type="text" size="small" style="color: #FF6600;">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="新增系统账号" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="问题" label-width="80px">
					<el-input v-model="form.problem" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="答案" label-width="80px">
					<el-input v-model="form.answer" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="序号" label-width="80px">
					<el-input type="number" v-model="form.num" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="sub_fq">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'fqmanage',
	data() {
		return {
			usid: '',
			fqData: [],
			dialogFormVisible: false,
			form: {
				problem: '',
				answer: '',
				num: 1
			}
		};
	},
	mounted() {
		this.usid = this.$route.query.usid;
		this.getFqUser();
	},
	methods: {
		sub_fq(){
			if (this.form.problem == '') {
				this.$message({
					showClose: true,
					message: '请输入问题',
					type: 'warning'
				});
			} else if (this.form.pwd == '') {
				this.$message({
					showClose: true,
					message: '请输入答案',
					type: 'warning'
				});
			} else if (this.form.answer == '') {
				this.$message({
					showClose: true,
					message: '请输入序号',
					type: 'warning'
				});
			} else if (this.form.num == '') {
				this.$message({
					showClose: true,
					message: '请输入电话',
					type: 'warning'
				});
			} else {
				let data = {
					problem: this.form.problem,
					answer: this.form.answer,
					num: this.form.num
				};
				const loading = this.$loading({
				  lock: true,
				  text: '保存中...',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/addFqUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getFqUser();
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
			}
		},
		but_add(){
			this.dialogFormVisible = true;
		},
		but_del(row){
			this.$confirm('是否确定删除【' + row.C_PROBLEM + '】问题?', '温馨提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					fqid: row.I_ID
				};
				const loading = this.$loading({
					lock: true,
					text: '保存中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				this.$axios.post(sessionStorage.getItem('url') + 'sys/system/delFqUser?token=' + sessionStorage.getItem('token'), data).then(res => {
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
							this.getFqUser();
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
		getFqUser(){
			this.$axios
				.get(sessionStorage.getItem('url') + 'sys/system/getFqUser?token=' + sessionStorage.getItem('token'))
				.then(res => {
					console.log(JSON.stringify(res));
					if (res.status == 200) {
						var data = res.data;
						if (data.flag) {
							this.fqData = data.data;
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
		createHtml(){
			function onc_mes(){
				 console.log('完美解决');
			 }
		}
	}
};
</script>

<style>
	.nva {
		background-color: #ecf4ff;
		padding: 6px;
	}
	.nvames {
		float: left;
		padding: 4px 10px 4px 10px;
		cursor: pointer;
		font-size: 14px;
	}
</style>
