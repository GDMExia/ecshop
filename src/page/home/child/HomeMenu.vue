<template>
	<div class="menu">
		<div class="menu-item" @click="activityList">
			<img
				class="menu-item-icon"
				src="../../../assets/image/change-icon/b0_sort@2x.png"
			/>
			<span class="menu-item-title">优惠活动</span>
		</div>
<!--		<div class="menu-item" @click="integralMall">-->
<!--			<img-->
<!--				class="menu-item-icon"-->
<!--				src="../../../assets/image/change-icon/b0_integralmall@2x.png"-->
<!--			/>-->
<!--			<span class="menu-item-title">积分商城</span>-->
<!--		</div>-->
		<div class="menu-item" @click="myOrder">
			<img
				class="menu-item-icon"
				src="../../../assets/image/change-icon/b0_collect@2x.png"
			/>
			<span class="menu-item-title">订单</span>
		</div>
<!--		<div class="menu-item" @click="myCashgift">-->
<!--			<img-->
<!--				class="menu-item-icon"-->
<!--				src="../../../assets/image/change-icon/b0_order@2x.png"-->
<!--			/>-->
<!--			<span class="menu-item-title">红包</span>-->
<!--		</div>-->
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { ENUM } from '../../../const/enum.js'

export default {
	name: 'HomeMenu',
	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline,
			orderStatus: state => state.order.orderStatus
		})
	},
	methods: {
		showLogin() {
			this.$router.push({ name: 'signin' })
		},
		activityList: function() {
			this.$router.push({ name: 'discount' })
		},
		integralMall: function() {
			this.$router.push({ name: 'integralMall' })
		},
		myOrder: function() {
			if (this.isOnline) {
				if (this.orderStatus != 10) {
					this.changeStatus(10)
				}
				this.$router.push({
					name: 'order',
					params: { order: ENUM.ORDER_STATUS.ALL, isFromHome: true }
				})
			} else {
				this.showLogin()
			}
		},
		myCashgift: function() {
			if (this.isOnline) {
				this.$router.push({ name: 'cashgiftList', query: { index: 0 } })
			} else {
				this.showLogin()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.menu {
	width: 100%;
	display: flex;
	justify-content: space-around;
	padding: 16px 0px;
	background: #ffffff;
	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		.menu-item-icon {
			width: 44px;
			height: 44px;
			overflow: hidden;
		}
		.menu-item-title {
			color: #333333;
			font-size: 12px;
			margin-top: 3px;
		}
	}
}
</style>
