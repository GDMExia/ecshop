<template>
	<div class="container">
		<div class="section-wrapper top-wrapper">
			<div class="input-wrapper">
				<input
					class="bottom-input"
					v-model="email"
					placeholder="请输入您的邮箱"
				/>
			</div>
		</div>
		<label class="tips">我们将发送密码修改链接到您绑定的邮箱</label>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>发送邮件</gk-button
		>
	</div>
</template>

<script>
import { Button } from '../../components/common'
import { Toast, Indicator } from 'mint-ui'
import * as authDefault from '../../api/auth-default'
export default {
	name: 'EmailRetrieve',
	data() {
		return {
			email: ''
		}
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		check() {
			let email = this.email
			if (email.length === 0) {
				Toast('请输入邮箱')
				return false
			}
			if (!this.validator.isEmail(email)) {
				Toast('邮箱地址不正确')
				return false
			}
			return true
		},
		retrieve() {
			if (!this.check()) {
				return
			}
			Indicator.open()
			authDefault.authDefaultReset(this.email).then(
				response => {
					Indicator.close()
					this.goEmailConfirm()
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
		},
		onSubmit() {
			this.retrieve()
		},
		goEmailConfirm() {
			this.$router.push({ name: 'emailConfirm', query: { email: this.email } })
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
	.section-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		background-color: #ffffff;
		border-top: 1px solid $lineColor;
		border-bottom: 1px solid $lineColor;
		.input-wrapper {
			display: flex;
			flex-direction: row;
			align-content: flex-start;
			align-items: center;
			background-color: #fff;
			height: 44px;
			padding-left: 10px;
			input {
				@include input;
				text-align: center;
				flex: 1;
			}
			.bottom-input {
				border-bottom-width: 0px;
			}
		}
	}
}
.top-wrapper {
	margin-top: 10px;
}
.bottom-wrapper {
	margin-top: 10px;
}
.tips {
	color: #5b636f;
	font-size: 14px;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 14px;
	text-align: center;
}
.button {
	@include button;
	margin-top: 16px;
}
</style>
