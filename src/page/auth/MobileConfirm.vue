<template>
	<div class="container">
		<mt-header class="header" fixed title="密码找回">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<label class="tips">您的密码已通过手机找回的方式修改成功</label>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>去登录</gk-button
		>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
export default {
	name: 'MobileConfirm',
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		onSubmit() {
			this.goAuth()
		},
		goAuth() {
			this.$router.push({ name: 'signin' })
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.tips {
	color: #5b636f;
	font-size: 14px;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 84px;
	text-align: center;
}
.button {
	@include button;
	margin-top: 35px;
}
</style>
