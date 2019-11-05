<template>
	<div class="container">
		<mt-header class="header" title="优惠活动">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="list">
			<discount-header
				v-if="this.discount.id"
				:item="discount"
				v-on:timeLeft="refreshDiscount"
			></discount-header>
			<div class="empty" v-if="!isGoing">
				<img src="../../assets/image/change-icon/empty_end@2x.png" />
				<p v-if="isEnd">活动已结束</p>
				<p v-if="isWaiting">活动未开始</p>
			</div>
			<discount-product-list v-if="isGoing"></discount-product-list>
		</div>
	</div>
</template>

<script>
import { Header, Indicator, Toast } from 'mint-ui'
import { HeaderItem } from '../../components/common'
import DiscountHeader from './child/DiscountHeader'
import DiscountProductList from './child/DiscountProductList'
import { activityDetail } from '../../api/activity'

export default {
	name: 'DiscountDetail',
	data() {
		return {
			discount: {}
		}
	},
	components: {
		DiscountHeader,
		DiscountProductList
	},
	created: function() {
		this.detail()
	},
	computed: {
		isGoing: function() {
			const nowTime = new Date()
			const startTime = new Date(this.discount.start_at * 1000)
			const endTime = new Date(this.discount.end_at * 1000)
			if (this.discount) {
				if (nowTime - startTime > 0 && endTime - nowTime > 0) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		},
		isEnd: function() {
			const nowTime = new Date()
			const endTime = new Date(this.discount.end_at * 1000)
			if (nowTime - endTime > 0) {
				return true
			} else {
				return false
			}
		},
		isWaiting: function() {
			const nowTime = new Date()
			const startTime = new Date(this.discount.start_at * 1000)
			if (startTime - nowTime > 0) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		//活动详情
		detail() {
			Indicator.open()
			activityDetail(this.$route.query.id).then(
				res => {
					Indicator.close()
					if (res) {
						this.discount = res.activity
					}
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
		},

		goBack() {
			this.$router.go(-1)
		},

		refreshDiscount() {
			window.location.reload()
			// 未开始的活动，刷新接口有问题
			// setTimeout(this.detail(), 1000);
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	height: auto;
	position: absolute;
	bottom: 0px;
	top: 0px;
	width: 100%;
}
.header {
	background-color: #ffffff;
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	border-bottom: 1px solid $lineColor;
}
.list {
	position: absolute;
	top: 44px;
	bottom: 0px;
	overflow-y: auto;
	width: 100%;
}
.empty {
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	img {
		width: 75px;
		height: 75px;
	}
	p {
		color: #a4aab3;
		font-size: 17px;
		margin-top: 30px;
	}
}
</style>
