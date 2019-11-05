<template>
	<div class="container">
		<div class="row-wrapper">
			<label class="status" :style="getStatusStyle">{{ getStatusTitle }}</label>
			<label class="order-sn">订单号：{{ item.order_sn }}</label>
			<div class="top-line"></div>
		</div>
		<div class="bottom-wrapper">
			<div class="column-wrapper">
				<label class="title">现金</label>
				<label class="value">{{ item.cash ? item.cash : 0.0 }}</label>
			</div>
			<div class="vertical-line"></div>
			<div class="column-wrapper right-item">
				<label class="title">{{ getScoreTitle }}</label>
				<label class="value">{{ item.score ? item.score : 0 }}</label>
			</div>
			<div class="right-wrapper">
				<label class="desc">{{ getTypeTitle }}</label>
				<label class="desc">{{ getDate }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import { ENUM } from '../../../const/enum'
import { Button } from '../../../components/common'
export default {
	name: 'BonusItem',
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
			return this.item.status === ENUM.WITHDRAW_STATUS.NO_CONFIRMED
				? true
				: false
		},
		getStatusTitle() {
			let status = ''
			switch (this.item.status) {
				case ENUM.BONUS_STATUS.WAIT:
					status = '审核中'
					break
				case ENUM.BONUS_STATUS.FINISH:
					status = '已分成'
					break
				case ENUM.BONUS_STATUS.CANCEL:
					status = '已取消'
					break
				case ENUM.BONUS_STATUS.REVOKE:
					status = '已撤销'
					break

				default:
					break
			}
			return status
		},
		getStatusStyle() {
			let color = '#999999'
			switch (this.item.status) {
				case ENUM.BONUS_STATUS.WAIT:
					color = '#999999'
					break
				case ENUM.BONUS_STATUS.FINISH:
					color = '#FA800A'
					break
				case ENUM.BONUS_STATUS.CANCEL:
					color = '#FC2E39'
					break
				case ENUM.BONUS_STATUS.REVOKE:
					color = '#FC2E39'
					break

				default:
					break
			}
			return {
				color: color
			}
		},
		getTypeTitle() {
			return this.item.type === ENUM.BONUS_TYPE.SIGNUP
				? '推荐注册分成'
				: '推荐订单分成'
		},
		getScoreTitle() {
			return this.item.type === ENUM.BONUS_TYPE.SIGNUP ? '等级积分' : '消费积分'
		},
		getDate() {
			let date = ''
			let item = this.item
			if (item && item.time) {
				let time = new Date(item.time * 1000)
				date = this.utils.formatDate(time, 'YYYY-MM-DD HH:mm:ss')
			}
			return date
		},
		isIncome() {
			return this.item && this.item.status === ENUM.BALANCE_STATUS.INCOME
				? true
				: false
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
}
.row-wrapper {
	height: 36px;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.status {
	font-size: 16px;
	color: #5296db;
	margin-left: 15px;
}
.title {
	font-size: 14px;
	color: #666666;
	margin-left: 15px;
	margin-top: 10px;
}
.value {
	font-size: 16px;
	color: #333333;
	margin-left: 14px;
	margin-top: 5px;
}
.order-sn {
	font-size: 14px;
	color: #333333;
	margin-right: 15px;
}
.subtitle {
	font-size: 12px;
	color: #999999;
	margin-right: 15px;
	margin-top: 5px;
	margin-bottom: 10px;
}
.top-line {
	position: absolute;
	left: 15px;
	bottom: 0px;
	right: 0px;
	height: 1px;
	background-color: $lineColor;
}
.bottom-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
	border-bottom: 1px solid $lineColor;
	padding-bottom: 5px;
}
.column-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.right-item {
	flex: 1;
}
.vertical-line {
	width: 1px;
	background-color: $lineColor;
	margin-top: 10px;
	margin-left: 15px;
	margin-bottom: 10px;
}
.right-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
}
.desc {
	font-size: 12px;
	color: #999999;
	margin-right: 15px;
	margin-top: 4px;
	text-align: right;
}
</style>
