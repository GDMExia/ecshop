<template>
	<div class="container">
		<label
			class="title"
			v-bind:class="{ income: isIncome, expend: !isIncome }"
			>{{ getPrice }}</label
		>
		<label class="subtitle">{{ item.memo }}</label>
		<label class="date">{{ getDate }}</label>
	</div>
</template>

<script>
import { ENUM } from '../../../const/enum'
export default {
	name: 'BalanceItem',
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
		getPrice() {
			let price = ''
			if (this.item && this.item.status === ENUM.BALANCE_STATUS.INCOME) {
				price = '+' + this.item.price
			} else if (
				this.item &&
				this.item.status === ENUM.BALANCE_STATUS.EXPENDITURE
			) {
				price = '-' + this.item.price
			}
			return price
		},
		getDate() {
			let date = ''
			let item = this.item
			if (item && item.create_at) {
				let create_at = new Date(item.create_at * 1000)
				date = this.utils.formatDate(create_at, 'YYYY-MM-DD HH:mm:ss')
			}
			return date
		},
		isIncome() {
			return this.item && this.item.status === ENUM.BALANCE_STATUS.INCOME
				? true
				: false
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	border-bottom: 1px solid #e8eaed;
}
.title {
	font-size: 18px;
	margin-left: 14px;
	margin-top: 14px;
}
.income {
	color: $primaryColor;
}
.expend {
	color: #666666;
}
.subtitle {
	font-size: 12px;
	color: #999999;
	margin-left: 14px;
	margin-top: 8px;
	margin-bottom: 10px;
}
.date {
	color: #999999;
	font-size: 14px;
	position: absolute;
	top: 18px;
	right: 14px;
}
</style>
