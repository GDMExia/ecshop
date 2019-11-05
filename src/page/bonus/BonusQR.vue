<template>
	<div class="container">
		<mt-header class="header" fixed title="我的推广二维码">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<div class="info-wrapper">
			<div class="content-wrapper">
				<div class="title-wrapper">
					<div class="title">{{ username }}</div>
					<img
						class="title-img"
						src="../../assets/image/change-icon/f1_qcode@2x.png"
					/>
				</div>
				<div class="qr-wrapper">
					<div id="qrcode"></div>
					<label class="scan-desc">扫描二维码，关注我的小店</label>
					<img
						class="decorate"
						src="../../assets/image/change-icon/f1_decoration@2x.png"
					/>
					<div class="share" v-if="isShowWechat">
						<label class="share-desc" v-on:click="wechatShare">分享小店</label>
						<img class="line" />
						<label
							class="share-desc"
							v-on:click="getCopy"
							:data-clipboard-text="this.shared_link"
							>复制链接</label
						>
					</div>
					<div class="share" v-if="!isShowWechat">
						<label
							class="share-desc"
							v-on:click="getCopy"
							style="border-radius:2px;border:1px solid rgba(250,128,10,1);padding: 4px 40px;"
							:data-clipboard-text="this.shared_link"
							>复制链接</label
						>
					</div>
				</div>
			</div>
		</div>
		<div class="overlay" v-if="iscover" v-on:click="wechatShare">
			<img
				class="overlay-show"
				src="../../assets/image/change-icon/f1_share_wechat@2x.png"
			/>
		</div>
	</div>
</template>

<script>
import { HeaderItem } from '../../components/common'
import { recommendBonusInfo } from '../../api/recommend'
// import { mapState, mapMutations } from 'vuex'
import QRCode from 'qrcodejs2'
import Clipboard from 'clipboard'
import { Header, Indicator, Toast, MessageBox } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import { configGetShare } from '../../api/config'
export default {
	name: 'BonusQR',
	components: {},
	data() {
		return {
			username: '',
			shared_link: '',
			iscover: false,
			share_title: '',
			share_desc: ''
		}
	},

	created() {
		this.loadShareConfig()
		this.loadData()
	},
	computed: {
		...mapState({
			user: state => state.auth.user,
			config: state => state.config.config
		}),
		isShowWechat: function() {
			if (this.wxApi.isweixin()) {
				return true
			}
			return false
		}
	},
	methods: {
		...mapActions({
			fetchConfig: 'fetchConfig'
		}),
		goBack() {
			this.$router.go(-1)
		},
		loadConfig() {
			this.fetchConfig().then(
				response => {
					let wechat = response.config['wechat.web']
					let openid = this.$cookie.get('o')
					// 微信已授权
					if (wechat) {
						this.setWechatConfig(wechat)
					}
				},
				error => {}
			)
		},
		setWechatConfig(config) {
			this.wxApi.wxRegister(
				config,
				this.share_title,
				// '推荐分成',
				null,
				this.share_desc,
				// '点击链接关注小店成为推广员，拿取更多分成',
				this.shared_link
			)
		},
		loadData() {
			this.username = this.user.nickname
				? this.user.nickname
				: this.user.username
			recommendBonusInfo().then(
				res => {
					if (res && res.bonus_info) {
						let bonus_info = res.bonus_info
						this.shared_link =
							bonus_info && bonus_info.shared_link
								? bonus_info.shared_link
								: null
						this.qrcode()
						if (!this.config) {
							this.loadConfig()
						} else {
							let wechat = this.config['wechat.web']
							this.setWechatConfig(wechat)
						}
					}
				},
				error => {}
			)
		},
		qrcode() {
			let qrcode = new QRCode('qrcode', {
				width: 192,
				height: 192, // 高度
				text: this.shared_link // 二维码内容
			})
			console.log(qrcode)
		},
		wechatShare() {
			this.iscover = !this.iscover
		},

		// 复制
		getCopy() {
			var clipboard = new Clipboard('.share-desc')
			clipboard.on('success', e => {
				console.log('复制成功')
				// 释放内存
				clipboard.destroy()
			})
			clipboard.on('error', e => {
				// 不支持复制
				console.log('该浏览器不支持自动复制')
				// 释放内存
				clipboard.destroy()
			})

			MessageBox({
				title: '复制链接',
				message: '已为您生成推广链接</br>' + this.shared_link,
				confirmButtonText: '确认'
			})
		},
		loadShareConfig(){
			configGetShare().then(
				res => {
					if (res) {
						this.share_title = res.share_title
						this.share_desc = res.share_desc
					}
				},
				error => {}
			)
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
	width: 100%;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.info-wrapper {
	margin-top: 44px;
	position: relative;
	width: 100%;
	height: 192px;
	background: url('../../assets/image/change-icon/bg_qcode@2x.png') no-repeat;
	align-content: center;
	background-size: cover;
}
.content-wrapper {
	width: 70%;
	margin-top: 68px;
	margin-left: 15%;
	margin-right: 15%;
	position: absolute;

	.title-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		align-items: center;

		.title {
			font-size: 18px;
			font-family: PingFangSC-Semibold;
			color: rgba(255, 255, 255, 1);
			line-height: 16px;
		}
		.title-img {
			width: 26px;
			height: 26px;
		}
	}
}

.qr-wrapper {
	height: 63%;
	background: white;
	margin-top: 18px;
	padding: 24px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	margin-bottom: 16%;
	.scan-desc {
		color: #333333;
		font-size: 13px;
		margin-top: 18px;
	}
	.decorate {
		position: absolute;
		width: 120%;
		margin-top: 240px;
		height: 30px;
	}
	.share {
		width: 100%;
		height: 24px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-content: center;
		align-items: center;
		margin-top: 60px;
		.share-desc {
			color: $primaryColor;
			font-size: 13px;
		}
		.line {
			width: 1px;
			height: 24px;
			background-color: $lineColor;
		}
	}
}
.overlay {
	position: absolute;
	display: block;
	background-color: black;
	opacity: 0.7;
	width: 100%;
	height: 100vh;
	top: 0%;
	left: 0%;
	z-index: 100;
	padding-bottom: 28%;

	.overlay-show {
		width: 86%;
		height: 470px;
		margin-left: 7%;
		margin-right: 7%;
	}
}
</style>
