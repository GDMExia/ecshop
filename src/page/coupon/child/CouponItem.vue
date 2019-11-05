<template>
	<div class="coupon-item-container" @click="onclick">
		<img class="top-img" v-bind:src="getTopBg" />
		<div>
			<label
				class="title"
				:class="{ enableText: isAvaiable, disableText: !isAvaiable }"
				>{{ getName }}</label
			>
			<label
				class="price"
				:class="{ enableText: isAvaiable, disableText: !isAvaiable }"
				>¥{{ getPrice }}</label
			>
		</div>

		<label class="subtitle">满{{ getCondition }}元可使用</label>
		<div class="desc-wrapper">
			<label v-for="(item, index) in getTypeItems" :key="index">{{
				item
			}}</label>
			<div class="row-wrapper">
				<label>{{ getDuration }}</label>
			</div>
		</div>
		<img
			class="indicator"
			v-if="isSelected"
			src="../../../assets/image/change-icon/d1_ticket_sel@2x.png"
		/>
	</div>
</template>

<script>
import { ENUM } from '../../../const/enum'
export default {
	props: {
		item: {
			type: Object
		},
		isSelected: {
			type: Boolean
		}
	},
	computed: {
		isAvaiable: function() {
			return this.item && this.item.status === ENUM.COUPON_STATUS.AVAILABLE
				? true
				: false
		},
		getTopBg: function() {
			let img = null
			if (this.isAvaiable) {
				img = require('../../../assets/image/change-icon/f5_coupon@2x.png')
			} else {
				img = require('../../../assets/image/change-icon/f5_coupon_gray@2x.png')
			}
			return img
		},
		getName: function() {
			let name = ''
			if (this.item) {
				name = this.item.name
			}
			return name
		},
		getPrice: function() {
			let name = ''
			if (this.item) {
				name = this.item.value
			}
			return name
		},
		getCondition: function() {
			let name = ''
			if (this.item) {
				name = this.item.condition
			}
			return name
		},
		getTypeItems: function() {
			let items = []
			if (this.item && this.item.infos) {
				items = this.item.infos
			}
			return items
		},
		getDuration: function() {
			let duration = ''
			let item = this.item
			if (item && item.effective && item.expires) {
				let start_at = new Date(item.effective * 1000)
				let end_at = new Date(item.expires * 1000)
				duration =
					this.utils.formatDate(start_at, 'YYYY-MM-DD') +
					' ~ ' +
					this.utils.formatDate(end_at, 'YYYY-MM-DD')
			}
			return duration
		}
	},
	methods: {
		onclick() {
			this.$emit('onclick')
		}
	}
}
</script>

<style lang="scss" scoped>
.coupon-item-container {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	margin: 10px 10px 0px 10px;
	.desc-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		margin-bottom: 10px;
		label {
			width: 100%;
			color: #8c8f93;
			font-size: 12px;
			margin-right: 10px;
			text-align: right;
		}
		.row-wrapper {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		.state {
			text-align: left;
			flex: 1;
			margin-left: 10px;
		}
	}
}
.top-img {
	margin-top: 0px;
	margin-left: 0px;
	margin-right: 0px;
	height: 4px;
}
.title {
	margin-top: 10px;
	margin-left: 14px;
	font-size: 18px;
	float: left;
}
.price {
	margin-top: 10px;
	margin-right: 14px;
	font-size: 18px;
	float: right;
}
.enableText {
	color: $primaryColor;
}
.disableText {
	color: #fa800a;
}
.subtitle {
	margin-top: 4px;
	margin-left: 14px;
	margin-right: 8px;
	color: #8c8f93;
	font-size: 12px;
}
.indicator {
	width: 36px;
	height: 36px;
	position: absolute;
	left: 0px;
	bottom: 0px;
}
</style>
