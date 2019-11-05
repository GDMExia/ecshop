<template>
	<div class="container">
		<mt-header class="header" fixed title="绑定手机">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="section-wrapper top-wrapper">
			<div class="input-wrapper">
				<input v-model="username" placeholder="请输入手机号" maxlength="11" />
			</div>
			<div class="input-wrapper">
				<input
					class="bottom-input"
					v-model="code"
					placeholder="请输入手机验证码"
					maxlength="6"
				/>
				<countdown-button ref="timer" class="countdown" v-on:onclick="onVerify">
				</countdown-button>
			</div>
		</div>
		<div class="section-wrapper bottom-wrapper">
			<div class="input-wrapper">
				<input
					type="password"
					v-model="password"
					placeholder="设置密码"
					maxlength="20"
				/>
			</div>
			<div class="input-wrapper">
				<input
					type="password"
					class="bottom-input"
					v-model="confirmPassword"
					placeholder="确认密码"
					maxlength="20"
				/>
			</div>
		</div>
		<label class="tips">6-20位数字/字母/符号</label>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>完成</gk-button
		>
	</div>
</template>

<script>
import { HeaderItem, CountdownButton, Button } from '../../components/common'
import { Toast, Indicator } from 'mint-ui'
import { mapMutations } from 'vuex'
import * as authMobile from '../../api/auth-mobile'
import { authMobileVerify } from '../../api/auth-mobile'
export default {
	name: 'Bind',
	data() {
		return {
			username: '',
			code: '',
			password: '',
			confirmPassword: ''
		}
	},
	mounted() {},
	methods: {
		...mapMutations({
			saveToken: 'signin',
			saveUser: 'saveUser'
		}),
		goBack() {
			this.$router.go(-1)
		},
		goProfile() {
			this.$router.go(-2)
		},
		onVerify() {
			let code = '86'
			let username = this.username
			if (username.length === 0) {
				Toast('请输入手机号')
				return
			}
			if (!this.validator.isNumber(username)) {
				Toast('请输入正确格式的手机号')
				return
			}
			Indicator.open()
			// 注册时需要先验证手机号是否已存在
			authMobile.authMobileVerify(code, username).then(
				response => {
					this.onSendCode(username)
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
		},
		onSendCode(username) {
			let code = '86'
			authMobile.authMobileSend(code, username).then(
				response => {
					Indicator.close()
					this.$refs.timer.start()
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
					this.$refs.timer.stop()
				}
			)
		},
		check() {
			let username = this.username
			let code = this.code
			let password = this.password
			let confirmPassword = this.confirmPassword
			if (username.length === 0) {
				Toast('请输入手机号')
				return false
			}
			if (code.length === 0) {
				Toast('请输入验证码')
				return false
			}
			if (code.length !== 6) {
				Toast('请输入6位验证码')
				return false
			}
			if (password.length === 0) {
				Toast('请输入密码')
				return false
			}
			if (password.length < 6 || password.length > 20) {
				Toast('请输入6-20个字符的密码')
				return false
			}
			if (confirmPassword.length === 0) {
				Toast('请输入确认密码')
				return false
			}
			if (password.length !== confirmPassword.length) {
				Toast('确认密码与输入密码不一致')
				return false
			}
			if (password !== confirmPassword) {
				Toast('确认密码与输入密码不一致')
				return false
			}
			return true
		},
		bind() {
			if (!this.check()) {
				return
			}
			Indicator.open()
			authMobile
				.authMobileBinding(this.username, this.code, this.password)
				.then(
					response => {
						Indicator.close()
						this.saveToken({ token: response.token, isOnline: 'online' })
						this.saveUser(response.user)
						this.goHome()
					},
					error => {
						Indicator.close()
						Toast(error.errorMsg)
					}
				)
		},
		onSubmit() {
			this.bind()
		},
		goHome() {
			this.$router.push('/home')
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
				flex: 1;
			}
			.bottom-input {
				border-bottom-width: 0px;
			}
		}
	}
}
.top-wrapper {
	margin-top: 54px;
}
.bottom-wrapper {
	margin-top: 10px;
}
.tips {
	color: #babfc6;
	font-size: 12px;
	margin-left: 18px;
	margin-top: 10px;
	text-align: left;
}
.button {
	@include button;
	margin-top: 20px;
}
.countdown {
	width: 112px;
	height: 30px;
	margin-left: 10px;
	margin-right: 10px;
}
</style>
