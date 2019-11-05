<template>
	<div class="container">
		<div class="top-wrapper">
			<div class="left-wrapper">
				<label class="status" :style="getStatusStyle">{{
					getStatusTitle
				}}</label>
				<label class="title">商家备注：{{ item.admin_memo }}</label>
			</div>
			<div class="right-wrapper">
				<label class="price">￥{{ item.cash }}</label>
				<label class="subtitle">提现金额</label>
			</div>
			<div class="top-line"></div>
		</div>
		<div class="center-wrapper">
			<label class="desc">申请时间：{{ getDate }}</label>
			<label class="desc">会员备注：{{ item.member_memo }}</label>
		</div>
		<div v-if="isPending" class="bottom-wrapper">
			<gk-button type="negative" class="cancel" v-on:click="submit"
				>取消提现</gk-button
			>
		</div>
	</div>
</template>

<script>
import { ENUM } from '../../../const/enum'
import { Button } from '../../../components/common'
export default {
	name: 'WithdrawItem',
	props: {
		item: {
			type: Object
		},
		isSelected: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isPending() {
			return this.item.status === ENUM.WITHDRAW_STATUS.WAIT ? true : false
		},
		getStatusTitle() {
			let status = ''
			switch (this.item.status) {
				case ENUM.WITHDRAW_STATUS.WAIT:
					status = '待处理'
					break
				case ENUM.WITHDRAW_STATUS.FINISH:
					status = '提现成功'
					break
				case ENUM.WITHDRAW_STATUS.CANCEL:
					status = '已取消'
					break
				case ENUM.WITHDRAW_STATUS.FAILED:
					status = '提现失败'
					break

				default:
					break
			}
			return status
		},
		getStatusStyle() {
			let color = '#5296DB'
			switch (this.item.status) {
				case ENUM.WITHDRAW_STATUS.WAIT:
					color = '#5296DB'
					break
				case ENUM.WITHDRAW_STATUS.FINISH:
					color = '#23B801'
					break
				case ENUM.WITHDRAW_STATUS.CANCEL:
					color = '#999999'
					break
				case ENUM.WITHDRAW_STATUS.FAILED:
					color = '#FC2E39'
					break

				default:
					break
			}
			return {
				color: color
			}
		},
		getDate() {
			let date = ''
			let item = this.item
			if (item && item.create_at) {
				let create_at = new Date(item.create_at * 1000)
				date = this.utils.formatDate(create_at, 'YYYY-MM-DD HH:mm:ss')
			}
			return date
		}
	},
	methods: {
		submit() {
			this.$emit('onclick', this.item)
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
	// margin-top: 8px;
}
.top-wrapper {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
}
.left-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.right-wrapper {
	// width: 80px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.status {
	font-size: 16px;
	color: #5296db;
	margin-left: 15px;
	margin-top: 13px;
}
.title {
	font-size: 14px;
	color: #666666;
	margin-left: 15px;
	margin-top: 5px;
	margin-right: 10px;
	margin-bottom: 4px;
}
.price {
	font-size: 18px;
	color: #333333;
	margin-right: 15px;
	margin-top: 10px;
	text-align: right;
}
.subtitle {
	// width: 80px;
	font-size: 12px;
	color: #999999;
	margin-right: 15px;
	margin-top: 5px;
	margin-bottom: 10px;
	text-align: right;
}
.top-line {
	position: absolute;
	left: 15px;
	bottom: 0px;
	right: 0px;
	height: 1px;
	background-color: $lineColor;
}
.desc {
	color: #999999;
	font-size: 14px;
	margin-left: 15px;
	margin-top: 5px;
}
.center-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	border-bottom: 1px solid $lineColor;
	padding-bottom: 5px;
}
.bottom-wrapper {
	height: 48px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	margin-right: 15px;
}
.cancel {
	width: 84px;
	height: 32px;
	border-radius: 2px;
}
</style>
