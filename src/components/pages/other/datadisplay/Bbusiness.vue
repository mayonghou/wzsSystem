<template>
	<div class="count">
		<div>
			<el-date-picker v-model="value1" type="date" id="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="changeTime">
			</el-date-picker>
		</div>
		<!-- 每日业务发放积分 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="C_UC" label="账号" width="180">
			</el-table-column>
			<el-table-column prop="C_NICNAME" label="昵称" width="180">
			</el-table-column>
			<el-table-column prop="I_NUM" label="积分">
			</el-table-column>
			<el-table-column prop="NAME" label="等级">
			</el-table-column>
		</el-table>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				value1: '',
				tableData: [],
				time: ''
			}
		},
		mounted() {
			this.changeTime();
		},
		methods: {
			changeTime(date) {
				if (date != null || date != undefined) {
					this.time = date;
				} else {
					var date = new Date();
					this.value1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
					this.time = this.value1;
				}
				this.getUserIntegralSortTopTen();
			},
			getUserIntegralSortTopTen() {
				this.$axios
					.get(sessionStorage.getItem('url') + 'sys/statistics/userIntegralSortTopTen?token=' + sessionStorage.getItem(
						'token') + '&date=' + this.time)
					.then(res => {
						if (res.status == 200) {
							var data = res.data;
							if (data.flag) {
								this.tableData = data.data;
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
	}
</script>

<style>
	.count {
		width: 100%;
		height: 100%;
	}

	tbody td {
		text-align: center;
	}
</style>
