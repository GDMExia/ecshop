<template>
	<div class="container">
		<mt-header class="header" title="设置">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="settings-body">
			<ul>
				<li v-on:click="about()">
					<span>关于我们</span>
					<img src="../../assets/image/change-icon/enter@2x.png" />
				</li>
			</ul>
		</div>
		<gk-button
			class="button"
			type="primary"
			v-on:click="signout"
			v-if="isOnline"
			>退出登录</gk-button
		>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import { mapState, mapMutations } from 'vuex'
import { Header, MessageBox, Switch } from 'mint-ui'
import { siteGet } from '../../api/site'
export default {
	data() {
		return {
			about_url: ''
		}
	},
	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline,
			time: state => state.profile.time,
			type: state => state.profile.type
		}),
		isSwitch: {
			get: function() {
				return this.$store.state.profile.isSwitch
			},
			set: function() {}
		}
	},
	mounted() {
		siteGet().then(
			res => {
				if (res && res.site_info && res.site_info.about_url) {
					this.about_url = res.site_info.about_url
				}
			},
			error => {}
		)
	},
	methods: {
		...mapMutations({
			clearToken: 'signout',
			changeOpen: 'changeOpen',
			clearUnreadInfo: 'clearUnreadInfo'
		}),
		goBack() {
			this.$router.go(-1)
		},
		signout() {
			MessageBox.confirm('确认退出', '').then(action => {
				this.clearToken()
				this.goBack()

				// TODO: 验证清除cookie操作
				// 清除cookie
				let host = window.location.host
				let parts = host.split('.').slice(-2)
				let domain = ''
				for (let i = 0; i < parts.length; i++) {
					const element = parts[i]
					domain = domain + '.' + element
				}

				this.$cookie.remove('o', { domain: domain })
				this.$cookie.remove('t', { domain: domain })

				this.clearUnreadInfo()
			})
		},
		about() {
			let url = this.about_url
			if (url && url.length) {
				this.$router.push({
					name: 'webPage',
					query: { url: url, title: '关于我们' }
				})
			}
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
	background-color: #fff;
	.header {
		@include header;
		@include thin-border();
	}
	.button {
		@include button;
		position: absolute;
		width: 90%;
		left: 5%;
		right: 5%;
		bottom: 36px;
		margin: 0px;
	}
	.text {
		color: #ffffff;
		font-size: 18px;
	}
	.settings-body {
		width: 100%;
		ul {
			li {
				height: 60px;
				display: flex;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				padding: 0px 20px;
				@include thin-border();
				span {
					height: 16px;
					font-size: 15px;
					color: rgba(78, 84, 93, 1);
					line-height: 16px;
				}
				img {
					width: 7px;
					height: 11px;
				}
			}
		}
	}
}
</style>

<style>
.mint-switch-input:checked + .mint-switch-core {
	border-color: #fa800a !important;
	background-color: #fa800a !important;
	height: 18px !important;
	width: 36px !important;
}

.mint-switch-core {
	width: 36px !important;
	height: 18px !important;
}

.mint-switch-core::after {
	height: 16px !important;
	width: 16px !important;
}

.mint-switch-core::before {
	width: 36px !important;
	height: 18px !important;
	background: none !important;
}
</style>
