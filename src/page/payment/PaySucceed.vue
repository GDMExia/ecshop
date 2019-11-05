<template>
	<div class="container">
		<mt-header class="header" title="购买成功">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="wrapper">
			<img
				class="photo"
				v-if="this.isExchange"
				src="../../assets/image/change-icon/h2_icon_gift@2x.png"
			/>
			<img
				class="photo"
				v-else
				src="../../assets/image/change-icon/e2_order_ok@2x.png"
			/>
			<label class="title" v-if="this.isExchange">恭喜您，兑换成功</label>
			<label class="title" v-else>订单提交成功</label>
			<gk-button class="button left-button" type="primary" v-on:click="goDetail"
				>订单详情</gk-button
			>
		</div>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import { Header, MessageBox } from 'mint-ui'
import { ENUM } from '../../const/enum'
export default {
	data() {
		return {
			isExchange: this.$route.query.isExchange
				? this.$route.query.isExchange
				: false
		}
	},
	methods: {
		goBack() {
			this.$router.push({
				name: 'order',
				params: { order: ENUM.ORDER_STATUS.PAID }
			})
		},
		goDetail() {
			let order = this.$cookie.get('orderid')
			let orderId = order ? order : null
			this.$router.push({
				name: 'orderDetail',
				query: { id: orderId, isFromPay: true }
			})
		},
		goShopping() {
			this.$router.push('/home')
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
	background-color: $mainbgColor;
}
.header {
	@include header;
}
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 40%;
}
.photo {
	width: 75px;
	height: 75px;
}
.title {
	color: #a4aab3;
	font-size: 17px;
	margin-top: 27px;
	text-align: center;
}
.button {
	@include button;
	width: 180px;
	height: 36px;
	margin-top: 24px;
}
</style>
