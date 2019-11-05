<template>
	<div class="container">
		<div style="height:100%;width:100%;position:absolute">
			<mt-button type="primary" style="postition:fixed;width:40px;height:40px;border-radius:50%;color:white;background:#06D5DE;text-align:center;line-height:40px;left:85%;top:80%;z-index:999;" @click="goback">嘻</mt-button>
		</div>
		<home-header class="header"></home-header>
		<div class="list">
			<home-banner
				v-if="banners && banners.length > 0"
				:items="banners"
			></home-banner>
			<home-menu></home-menu>
			<home-product-list
				:items="goodProducts"
				title="热门推荐"
				:type="popular"
				v-if="goodProducts && goodProducts.length > 0"
			></home-product-list>
			<home-product-list
				:items="hotProducts"
				title="销量排行"
				:type="sale"
				v-if="hotProducts && hotProducts.length > 0"
			></home-product-list>
			<home-product-list
				:items="recentlyProducts"
				title="新品上架"
				:type="recently"
				v-if="recentlyProducts && recentlyProducts.length > 0"
			></home-product-list>
		</div>
		<back-top v-if="isshowBacktop" :target="target" :bottom="60"></back-top>
	</div>
</template>

<script>
import { Header, Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import { HeaderItem } from '../../components/common'
import BackTop from '../../components/common/BackTop'
import HomeHeader from './child/HomeHeader'
import HomeBanner from './child/HomeBanner'
import HomeMenu from './child/HomeMenu'
import HomeProductList from './child/HomeProductList'
import { ENUM } from '../../const/enum'
import { recommendBonusInfo } from '../../api/recommend'
import { configGetShare } from '../../api/config'

export default {
	name: 'Home',
	data() {
		return {
			isshowBacktop: false,
			popular: ENUM.SORT_KEY.POPULAR,
			sale: ENUM.SORT_KEY.SALE,
			recently: ENUM.SORT_KEY.DATE,
			shared_link: '',
			share_title: '',
			share_desc: ''
		}
	},
	components: {
		HomeHeader,
		HomeBanner,
		HomeMenu,
		HomeProductList,
		BackTop
	},
	mounted() {
		var element = this.$el
		var that = this
		var dom = document.querySelector('.list')
		if (dom) {
			dom.addEventListener('scroll', event => {
				let params = {
					top: dom.scrollTop,
					height: dom.scrollHeight
				}
				if (params.top >= 100) {
					this.isshowBacktop = true
				} else {
					this.isshowBacktop = false
				}
			})
		}
		this.target = document.querySelector('.list')
		this.saveAuthInfo()
	},
	created: function() {
		this.loadShareConfig()
		if (!(this.banners && this.banners.length)) {
			Indicator.open()
		}
		this.fetchHomeBanner({ page: 1, per_page: 10 }).then(
			response => {
				Indicator.close()
			},
			error => {
				Indicator.close()
				Toast(error.errorMsg)
			}
		)
		this.fetchHomeProduct({}).then(
			response => {
				Indicator.close()
			},
			error => {
				Indicator.close()
				Toast(error.errorMsg)
			}
		)

		this.loadConfig()
		if (this.isOnline) {
			// 获取推荐分成链接
			this.loadBonusData()
		}
	},
	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline,
			config: state => state.config.config,
			banners: state => state.home.banners,
			hotProducts: state => state.home.hotProducts,
			recentlyProducts: state => state.home.recentlyProducts,
			goodProducts: state => state.home.goodProducts
		})
	},
	methods: {
		...mapMutations({
			saveToken: 'saveToken'
		}),
		...mapActions({
			fetchHomeBanner: 'fetchHomeBanner',
			fetchHomeProduct: 'fetchHomeProduct',
			fetchConfig: 'fetchConfig'
		}),
		loadConfig() {
			this.fetchConfig().then(
				response => {
					let wechat = response.config['wechat.web']
					let openid = this.$cookie.get('o')
					var keyword = window.location.href
					if (keyword.indexOf('?u=') >= 0) {
						//判断url地址中是否包含link字符串
						if (!this.isOnline) {
							this.$router.push({
								name: 'signin',
								params: { isFromShare: true }
							})
						}
					}
					// 微信已授权
					if (openid) {
						if (this.isOnline) {
							if (wechat && this.shared_link) {
								this.setWechatConfig(wechat, this.shared_link)
							}
						} else {
							if (wechat) {
								let callbackUrl =
									window.location.protocol +
									'//' +
									window.location.host +
									window.location.pathname
								this.setWechatConfig(wechat, callbackUrl)
							}
						}
					} else {
						if (this.wxApi.isweixin()) {
							let callbackUrl = encodeURIComponent(
								window.location.protocol +
									'//' +
									window.location.host +
									window.location.pathname
							)
							let scope = 'snsapi_base'
							let invite_code = this.$cookie.get('r') // 获取邀请人id
							if (invite_code) {
								let locationRef =
									env.API_HOST +
									'/v2/ecapi.auth.web?vendor=' +
									ENUM.SOCIAL_VENDOR.WEIXIN +
									'&scope=' +
									scope +
									'&referer=' +
									callbackUrl +
									'&invite_code=' +
									invite_code
								window.location.href = locationRef
							} else {
								let locationRef =
									env.API_HOST +
									'/v2/ecapi.auth.web?vendor=' +
									ENUM.SOCIAL_VENDOR.WEIXIN +
									'&scope=' +
									scope +
									'&referer=' +
									callbackUrl
								window.location.href = locationRef
							}
						}
					}
				},
				error => {}
			)
		},
		loadBonusData() {
			recommendBonusInfo().then(
				res => {
					if (res && res.bonus_info) {
						let bonus_info = res.bonus_info
						this.shared_link =
							bonus_info && bonus_info.shared_link
								? bonus_info.shared_link
								: null
						let wechat = this.config ? this.config['wechat.web'] : null
						if (this.shared_link && wechat) {
							console.log('shared_link is ', this.shared_link)
							this.setWechatConfig(wechat, this.shared_link)
						}
					}
				},
				error => {}
			)
		},
		setWechatConfig(config, link) {
			// console.log('====================================');
			// console.log('config is ', config);
			// console.log('link is ', link);
			// console.log('====================================');
			this.wxApi.wxRegister(
				config,
				this.share_title,
				// '推荐分成',
				null,
				this.share_desc,
				// '点击链接关注小店成为推广员，拿取更多分成',
				link
			)
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
		},
		saveAuthInfo() {
			let openid = this.$cookie.get('o')
			let token = this.$cookie.get('t')
			if (openid && token && !self.isOnline) {
				this.saveToken({ token: token })
			}
		},
		goback(){
			location.href='http://pts.suoqoo.com/nh5'
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	height: auto;
	position: absolute;
	bottom: 45px;
	top: 0px;
	width: 100%;
}
.header {
	background-color: #ffffff;
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	border-bottom: 1px solid $lineColor;
}
.list {
	position: absolute;
	top: 44px;
	bottom: 0px;
	overflow-y: auto;
	width: 100%;
}
</style>
