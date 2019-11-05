<template>
	<div class="container">
		<mt-header class="header" fixed title="登录">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
			<header-item
				slot="right"
				title=""
				v-on:onclick="onSignup"
			></header-item>
		</mt-header>
<!--		<div class="top-wrapper">-->
<!--			<div class="input-wrapper">-->
<!--				<img src="../../assets/image/change-icon/a0_user@2x.png" />-->
<!--				<input-->
<!--					v-model="username"-->
<!--					placeholder="用户名/邮箱/手机号"-->
<!--					type="text"-->
<!--				/>-->
<!--			</div>-->
<!--			<div class="input-wrapper">-->
<!--				<img src="../../assets/image/change-icon/a0_key@2x.png" />-->
<!--				<input-->
<!--					type="password"-->
<!--					class="bottom-input"-->
<!--					v-model="password"-->
<!--					placeholder="请输入密码"-->
<!--					maxlength="20"-->
<!--				/>-->
<!--			</div>-->
<!--		</div>-->
<!--		<gk-button type="primary" class="button" v-on:click="signin"-->
<!--			>登录</gk-button-->
<!--		>-->
<!--		<div class="retrieve-wrapper">-->
<!--			<div class="retrieve-item" @click="onRetrieve">-->
<!--				<label id="retrieve-title">忘记密码？</label>-->
<!--			</div>-->
<!--		</div>-->
<!--		<div class="bottom-wrapper" v-if="isShowAuth">-->
<!--			<div class="auth-title-wrapper">-->
<!--				<div class="auth-line"></div>-->
<!--				<label class="auth-title">第三方登录</label>-->
<!--				<div class="auth-line"></div>-->
<!--			</div>-->
<!--			<div class="auth-bottom-wrapper">-->
<!--				<div class="auth-item" v-if="isShowWechat" @click="onWechat">-->
<!--					<img-->
<!--						class="auth-item-icon"-->
<!--						src="../../assets/image/change-icon/c7_commodity_list_2@2x.png"-->
<!--					/>-->
<!--					<label class="auth-title auth-item-title">微信</label>-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import * as authBase from '../../api/auth-base'
import { Indicator, Toast, Header } from 'mint-ui'
import { mapMutations, mapActions, mapState } from 'vuex'
import { authSocial } from '../../api/auth-social'
import { authWeb } from '../../api/auth-web'
import { ENUM } from '../../const/enum'
import axios from 'axios'
// import { GLOBAL_CONFIG } from '../../config/config.app'
import { userProfileGet } from '../../api/user'
export default {
	name: 'Signin',
	data() {
		return {
			username: '',
			password: ''
		}
	},

	computed: {
		...mapState({
			config: state => state.config.config,
			feature: state => state.config.feature,
			flag: state => state.auth.flag
		}),
		isShowWechat: function() {
			if (this.config && this.config['wechat.web'] && this.wxApi.isweixin()) {
				return true
			}
			return false
		},
		isShowAuth: function() {
			if (this.isShowWechat) {
				return true
			}
			return false
		}
	},
	created: function() {
		this.fetchConfig()
	},
	mounted() {
		// let isTokenInvalid = this.$route.params.isTokenInvalid
		// if (isTokenInvalid) {
		// 	Toast('登录过期')
		// }
	  this.getToken()
		// if (this.flag) {
		//   this.onAuthSuccess();
		//   this.changeFlag(false);
		// }
	},
	methods: {
		...mapMutations({
			saveAuthInfo: 'signin',
			saveToken: 'saveToken',
			saveUser: 'saveUser',
			changeFlag: 'changeFlag'
		}),

		...mapActions({
			fetchConfig: 'fetchConfig'
		}),
		signin() {
			let username = this.username
			let password = this.password
			if (username.length === 0) {
				Toast('请输入用户名/邮箱/手机号')
				return
			}
			// TODO: 用户名（为手机号或邮箱）校验
			if (password.length === 0) {
				Toast('请输入密码')
				return
			}
			if (password.length < 6) {
				Toast('至少输入6位密码')
				return
			}
			Indicator.open()
			authBase.authSignin(username, password).then(
				response => {
					Indicator.close()
					this.saveAuthInfo({ token: response.token, user: response.user })
					this.goHome()
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
		},

		goBack() {
			let isFromInfoEdit = this.$route.params.isFromInfoEdit
			let isFromShare = this.$route.params.isFromShare
			if (isFromInfoEdit || isFromShare) {
				this.$router.push('home')
			} else {
				this.$router.go(-1)
			}
		},

		goHome() {
			this.$router.push('/home')
		},

		onSignup() {
			this.$router.push({ name: 'signup' })
		},

		onRetrieve() {
			this.$router.push({ name: 'retrieve' })
		},

		onWechat() {
			this.wxWebAuth()
		},

		// 获取第三方授权登录数据
		getAuthSocial() {
			authSocial().then(res => {
				if (res) {
					this.authSocial = Object.assign([], this.authSocial)
				}
			})
		},

		wxWebAuth() {
			this.changeFlag(true)
			let invite_code = this.$cookie.get('r') // 获取邀请人id
			let scope = 'snsapi_userinfo' // 允许获取用户信息
			let ref = encodeURIComponent(
				window.location.protocol + '//' + window.location.host
			)
			let locationRef = ''
			if (invite_code) {
				locationRef =
					env.API_HOST +
					'/v2/ecapi.auth.web?vendor=' +
					ENUM.SOCIAL_VENDOR.WEIXIN +
					'&scope=' +
					scope +
					'&referer=' +
					ref +
					'&invite_code=' +
					invite_code
			} else {
				locationRef =
					env.API_HOST +
					'/v2/ecapi.auth.web?vendor=' +
					ENUM.SOCIAL_VENDOR.WEIXIN +
					'&scope=' +
					scope +
					'&referer=' +
					ref
			}

			// window.location.href = locationRef
		},

		onAuthSuccess() {
			let openid = this.$cookie.get('o')
			let token = this.$cookie.get('t')
			if (openid && token) {
				Indicator.open()
				this.saveToken({ token: token })
				userProfileGet().then(
					response => {
						Indicator.close()
						console.log(response)
						if (response && response.user) {
							if (response.user.mobile_binded) {
								this.saveToken({ token: token })
								this.goHome()
							} else {
								this.goBind()
							}
						}
					},
					error => {
						console.log(error)
						Toast(error.errorMsg)
						Indicator.close()
					}
				)
			}
		},

		goBind() {
			this.$router.push({ name: 'bind' })
		},

	  	getToken () {
		  // alert(111)
          let infoToken=this.$store.state.auth.infoToken
		  if (infoToken) {
            // Indicator.open()
			console.log(infoToken)
			let data=new FormData()
			data.append('token', infoToken)
            // authBase.getauthInfo(data).then(res => {
            //
			//   }
            // )
			this.$http.post('http://xgguc.suoqoo.com/index.php/Index/getUserInfo',data).then(res=>{
			  console.log(res.data.accountInfo)
				// res.body.accountInfo
              this.username=res.data.accountInfo.email
              this.password=res.data.accountInfo.password
              this.signin()
			})
            // axios.request({
            //   url: 'http://xgguc.suoqoo.com/index.php/Index/getUserInfo',
            //   data: data,
            //   method: 'post'
            // }).then(res=>{
            //   console.log(res)
			// })
		  }
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
	.top-wrapper {
		margin-top: 54px;
		.input-wrapper {
			display: flex;
			align-content: center;
			align-items: center;
			padding-left: 10px;
			background-color: #fff;
			height: 44px;
			img {
				width: 24px;
				height: 24px;
				margin: 0px;
				padding: 0px;
			}
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
.header {
	@include header;
}
.button {
	@include button;
	margin-top: 40px;
}
.retrieve-wrapper {
	height: 40px;
	margin-top: 10px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
.retrieve-item {
	width: 80px;
	height: 40px;
	margin-right: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}
#retrieve-title {
	color: $primaryColor;
	font-size: 15px;
	text-align: center;
}
.bottom-wrapper {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-end;
	align-items: stretch;
}
.auth-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 260px;
}
.auth-title-wrapper {
	height: 20px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 40px;
}
.auth-title {
	color: #8f8e94;
	font-size: 14px;
}
.auth-line {
	display: flex;
	flex: 1;
	height: 1px;
	background-color: #d8d8d8;
	margin-left: 16px;
	margin-right: 16px;
}
.auth-item {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.auth-item-icon {
	width: 60px;
	height: 60px;
}
.auth-item-title {
	margin-top: 12px;
}
.auth-bottom-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-left: 15px;
	margin-right: 15px;
	margin-bottom: 20px;
}
</style>
