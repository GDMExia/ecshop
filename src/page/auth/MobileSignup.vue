<template>
	<div class="container">
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
			>注册</gk-button
		>
		<div class="link-wrapper">
			<span class="left-text">点击注册表示同意</span>
			<span class="right-text" @click="onAgreement">《用户协议》</span>
		</div>
	</div>
</template>

<script>
import { HeaderItem, CountdownButton, Button } from '../../components/common'
import { Toast, Indicator } from 'mint-ui'
import { mapMutations } from 'vuex'
import * as authMobile from '../../api/auth-mobile'
import * as site from '../../api/site'
import { authMobileVerify } from '../../api/auth-mobile'
export default {
	name: 'MobileSignup',
	data() {
		return {
			username: '',
			code: '',
			password: '',
			confirmPassword: '',
			aggrementUrl: ''
		}
	},
	mounted() {},
	created: function() {
		site.siteGet().then(
			response => {
				if (response && response.site_info) {
					this.aggrementUrl = response.site_info.terms_url
				}
			},
			error => {}
		)
	},
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
		goProfileAdd() {
			this.$router.push({ name: 'profileAdd' })
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
		signup() {
			if (!this.check()) {
				return
			}
			let invite_code = this.$cookie.get('r') // 获取邀请人id
			Indicator.open()
			authMobile
				.authMobileSignup(this.username, this.code, this.password, invite_code)
				.then(
					response => {
						this.saveToken({ token: response.token })
						Indicator.close()
						this.saveUser(response.user)
						if (response.user && response.user.is_completed) {
							Toast('注册成功')
							this.goProfile()
						} else {
							this.goProfileAdd()
						}
					},
					error => {
						Indicator.close()
						Toast(error.errorMsg)
					}
				)
		},
		onSubmit() {
			this.signup()
		},
		onAgreement() {
			this.$router.push({
				name: 'webPage',
				query: { url: this.aggrementUrl, title: '注册协议' }
			})
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
	.link-wrapper {
		height: 44px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: stretch;
		span {
			font-size: 14px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
		.left-text {
			color: #c3c3c3;
		}
		.right-text {
			color: $primaryColor;
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
	color: $formDescColor;
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
