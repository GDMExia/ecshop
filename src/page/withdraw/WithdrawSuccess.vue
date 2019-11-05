<template>
	<div class="container">
		<mt-header class="header" fixed title="提现">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<div class="top-wrapper">
			<img
				class="icon"
				src="../../assets/image/change-icon/f9_icon_wait@2x.png"
			/>
			<label class="title">提现申请已提交</label>
			<label class="desc">请等待后台人员审核</label>
		</div>
		<div class="center-wrapper">
			<div class="row-item top-row">
				<label class="item-title">提现金额</label>
				<label class="item-value">¥{{ getAmount }}</label>
			</div>
			<div class="row-item">
				<label class="item-title">备 注</label>
				<label class="item-value" style="-webkit-box-orient:vertical">{{
					getRemark
				}}</label>
			</div>
		</div>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>完成</gk-button
		>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import { Indicator, Toast } from 'mint-ui'
export default {
	name: 'WithdrawSuccess',
	computed: {
		getAmount() {
			return this.$route.query ? this.$route.query.amount : ''
		},
		getRemark() {
			return this.$route.query ? this.$route.query.remark : ''
		}
	},
	created() {},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		onSubmit() {
			this.goBack()
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
	width: 75px;
	height: 75px;
	margin-top: 96px;
}
.title {
	color: #333333;
	font-size: 18px;
	margin-top: 50px;
	text-align: center;
}
.desc {
	color: #999999;
	font-size: 14px;
	margin-top: 10px;
	text-align: center;
}
.center-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 16px;
}
.row-item {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
}
.top-row {
	border-bottom: 1px solid $lineColor;
}
.item-title {
	width: 60px;
	margin-top: 12px;
	margin-left: 14px;
	margin-right: 14px;
	font-size: 14px;
	color: #999999;
}
.item-value {
	flex: 1;
	margin-top: 12px;
	margin-bottom: 12px;
	margin-right: 14px;
	font-size: 14px;
	color: #333333;
	@include limit-line(2);
}
.button {
	@include button;
	margin-top: 24px;
}
</style>
