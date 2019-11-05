<template>
	<div class="container">
		<div class="info">
			<div class="title">{{ getTitle }}</div>
			<div class="time">{{ getDate }}</div>
		</div>
		<div v-if="this.isOptain() == true" class="number">{{ getNumber }}</div>
		<div v-if="this.isOptain() == false" class="diture">{{ getNumber }}</div>
	</div>
</template>

<script>
import { ENUM } from '../../../const/enum'
export default {
	props: {
		item: {
			type: Object
		}
	},
	computed: {
		getTitle() {
			let title = ''
			if (this.isOptain()) {
				title = this.item.reason ? this.item.reason : '获得积分'
			} else {
				title = this.item.reason ? this.item.reason : '支付积分'
			}
			return title
		},
		getNumber() {
			let number = ''
			if (this.isOptain()) {
				number = '+' + (this.item ? this.item.change : '')
			} else {
				number = this.item ? this.item.change : ''
			}
			// let numberType = number;
			return number
		},
		getDate: function() {
			let date = ''
			let item = this.item
			if (item && item.created_at) {
				let created_at = new Date(item.created_at * 1000)
				date = this.utils.formatDate(created_at, 'YYYY-MM-DD HH:mm:ss')
			}
			return date
		}
	},
	methods: {
		isOptain() {
			let isOptain = false
			if (this.item) {
				let status = this.item.status
				switch (status) {
					case ENUM.SCORE_STATUS.OPTAIN: // 收入
						isOptain = true
						break
					case ENUM.SCORE_STATUS.DEDUCT: // 支出
						isOptain = false
						break

					default:
						isOptain = false
						break
				}
			}
			return isOptain
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #fff;
	border-bottom: 1px solid #e8eaed;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 11px 15px;
	.info {
		.title {
			font-size: 16px;
			color: rgba(51, 51, 51, 1);
		}
		.time {
			font-size: 14px;
			color: rgba(153, 153, 153, 1);
			margin-top: 5px;
		}
	}
	.number {
		font-size: 26px;
		color: rgba(250, 128, 10, 1);
	}
	.diture {
		font-size: 26px;
		color: rgba(102, 102, 102, 1);
	}
}
</style>
