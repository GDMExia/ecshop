<template>
	<mt-popup v-model="currentValue" popup-transition="popup-fade">
		<div class="container">
			<div class="title-wrapper"><label class="title">提现</label></div>
			<div class="center-wrapper">
				<div class="row-wrapper">
					<label class="subtitle">提现金额</label>
					<label v-if="showTips" class="tips">超过可提现的范围</label>
				</div>
				<div class="input-wrapper">
					<label class="input-title">￥</label>
					<input
						ref="amount"
						class="input"
						v-model="amount"
						@input="onInput"
						type="number"
					/>
				</div>
				<div class="row-wrapper">
					<label class="desc">可提余额￥{{ balance }}</label>
					<div class="action" @click="withdrawAll">全部提现</div>
				</div>
				<div class="textarea-wrapper">
					<textarea
						ref="remark"
						placeholder="请填写银行名称和银行卡号"
						v-model="remark"
					>
					</textarea>
				</div>
			</div>
			<gk-button class="submit" type="primary" @click="confirm">提交</gk-button>
		</div>
	</mt-popup>
</template>

<script>
import { Popup, Indicator, Toast } from 'mint-ui'
import { withdraw } from '../../../api/withdraw'
export default {
	name: 'WithdrawDialog',
	props: {
		balance: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			currentValue: false,
			amount: '',
			remark: '',
			showTips: false
		}
	},
	computed: {},
	methods: {
		show() {
			this.currentValue = true
		},
		hide() {
			this.currentValue = false
		},
		onInput() {
			let amount = this.amount ? parseFloat(this.amount) : 0
			let balance = this.balance ? parseFloat(this.balance) : 0
			if (amount > balance) {
				this.showTips = true
			} else {
				this.showTips = false
			}
		},
		withdrawAll() {
			this.amount = this.balance
		},
		confirm() {
			let amount = this.amount
			let remark = this.remark
			if (amount.length === 0) {
				Toast('请填写提现金额')
				this.$refs.amount.focus()
				return
			}
			if (remark.length === 0) {
				Toast('请填写银行名称和银行卡号')
				this.$refs.remark.focus()
				return
			}
			Indicator.open()
			withdraw(amount, remark).then(
				res => {
					Indicator.close()
					this.hide()
					if (res && res.withdraw) {
						let amount = res.withdraw.cash
						let remark = res.withdraw.member_memo
						this.$router.push({
							name: 'withdrawSuccess',
							query: { amount: amount, remark: remark }
						})
					}
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	width: 300px;
	border-radius: 26px;
}
.mint-popup {
	background: transparent;
}
.center-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.title-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #f7f7f7;
	height: 46px;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
}
.title {
	font-size: 18px;
	color: #333333;
	text-align: center;
}
.row-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 40px;
	margin-left: 15px;
	margin-right: 15px;
}
.subtitle {
	font-size: 14px;
	color: #999999;
}
.tips {
	font-size: 12px;
	color: #cd3b3b;
	text-align: right;
}
.input-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-left: 15px;
	margin-right: 15px;
	border-bottom: 1px solid $lineColor;
	height: 50px;
}
.input-title {
	color: #333333;
	font-size: 36px;
}
.input {
	border: none;
	border-radius: 0px;
	height: -webkit-fill-available;
	outline: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	&:focus {
		outline-style: none;
		outline: none;
	}
	color: #333333;
	font-size: 36px;
	overflow: hidden;
	// margin-bottom: 1px;
}
.amount {
	font-size: 36px;
	color: #333333;
}
.desc {
	font-size: 12px;
	color: #999999;
}
.action {
	font-size: 12px;
	color: #fa800a;
}
.textarea-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	height: 64px;
	margin: 5px 15px 15px 15px;
	textarea {
		flex: 1;
		font-size: 14px;
		color: #4e545d;
		background-color: #f7f8fa;
		padding: 10px;
		border: none;
		border-radius: 2px;
		&:focus {
			outline-style: none;
		}
	}
}
.submit {
	height: 44px;
	margin-left: 0px;
	margin-right: 0px;
	border-bottom-left-radius: 6px;
	border-bottom-right-radius: 6px;
}
</style>
