<template>
	<div class="container">
		<div class="section-wrapper top-wrapper">
			<div class="input-wrapper">
				<input
					class="bottom-input"
					v-model="username"
					placeholder="用户名"
					maxlength="25"
				/>
			</div>
		</div>
		<label class="tips">用户名为3-25位，可以包含英文与数字</label>
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
		<div class="section-wrapper top-wrapper">
			<div class="input-wrapper">
				<input class="bottom-input" v-model="email" placeholder="邮箱地址" />
			</div>
		</div>
		<label class="tips">请输入邮箱地址</label>
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
import { Button } from '../../components/common'
import { Toast, Indicator } from 'mint-ui'
import { mapMutations } from 'vuex'
import * as authDefault from '../../api/auth-default'
import * as site from '../../api/site'
export default {
	name: 'EmailSignup',
	data() {
		return {
			username: '',
			password: '',
			confirmPassword: '',
			aggrementUrl: '',
			email: ''
		}
	},
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
		check() {
			let username = this.username
			let password = this.password
			let confirmPassword = this.confirmPassword
			let email = this.email
			if (username.length === 0) {
				Toast('请输入3-25个字符的用户名')
				return false
			}
			if (username.length < 3 || username.length > 25) {
				Toast('请输入3-25个字符的用户名')
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
		signup() {
			if (!this.check()) {
				return
			}
			let invite_code = this.$cookie.get('r') // 获取邀请人id
			Indicator.open()
			authDefault
				.authDefaultSignup(
					this.username,
					this.email,
					this.password,
					invite_code
				)
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
</style>
