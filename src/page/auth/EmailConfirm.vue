<template>
	<div class="container">
		<mt-header class="header" fixed title="密码找回">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<label class="tips">密码修改链接已发送至</label>
		<label class="email">{{ getFormatEmail }}</label>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>去登录</gk-button
		>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
export default {
	name: 'EmailConfirm',
	computed: {
		getFormatEmail() {
			let email = this.$route.query.email
			if (email && email.length && email.length > 4) {
				let subStr = email.substr(4, email.length / 5)
				if (subStr && subStr.length) {
					email = email.replace(subStr, '****')
				}
			}
			return email
		}
	},
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
	margin-top: 72px;
	text-align: center;
}
.email {
	color: #5b636f;
	font-size: 18px;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 10px;
	text-align: center;
}
.button {
	@include button;
	margin-top: 28px;
}
</style>
