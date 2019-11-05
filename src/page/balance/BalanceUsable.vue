<template>
	<div class="container">
		<mt-header class="header" fixed title="可用资金">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<div class="top-wrapper">
			<img
				class="icon"
				src="../../assets/image/change-icon/f9_icon_coins@2x.png"
			/>
			<label class="desc">可用资金（¥）</label>
			<label class="title">{{ balance }}</label>
		</div>
		<gk-button
			type="primary"
			class="button top-button"
			v-on:click="onWithdrawSuccess"
			>提现</gk-button
		>
		<gk-button
			type="default"
			class="button bottom-button"
			v-on:click="onWithdrawHistory"
			>提现记录</gk-button
		>
		<div class="bottom-wrapper">
			<div class="bottom-item" @click="onBalanceHistory">查看资金明细</div>
		</div>
		<withdraw-dialog ref="dialog" :balance="balance"></withdraw-dialog>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import { balanceTotal } from '../../api/balance'
import { Indicator, Toast } from 'mint-ui'
import WithdrawDialog from '../withdraw/child/WithdrawDialog'
export default {
	name: 'BalanceUsable',
	components: {
		WithdrawDialog
	},
	data() {
		return {
			balance: ''
		}
	},
	created() {
		Indicator.open()
		balanceTotal().then(
			res => {
				Indicator.close()
				if (res && res.amount) {
					this.balance = res.amount
				}
			},
			error => {
				Indicator.close()
				Toast(error.errorMsg)
			}
		)
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		onWithdrawSuccess() {
			this.$refs.dialog.show()
		},
		onWithdrawHistory() {
			this.$router.push({ name: 'withdrawHistory' })
		},
		onBalanceHistory() {
			this.$router.push({ name: 'balanceHistory' })
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
	height: 100%;
}
.top-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.icon {
	width: 110px;
	height: 110px;
	margin-top: 64px;
}
.desc {
	color: #a4aab3;
	font-size: 16px;
	margin-top: 16px;
	text-align: center;
}
.title {
	color: $primaryColor;
	font-size: 50px;
	margin-top: 5px;
	text-align: center;
}
.button {
	@include button;
}
.top-button {
	margin-top: 25px;
}
.bottom-button {
	margin-top: 12px;
}
.bottom-wrapper {
	position: absolute;
	left: 0px;
	bottom: 0px;
	right: 0px;
	height: 44px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.bottom-item {
	font-size: 14px;
	color: #666666;
	text-align: center;
}
</style>
