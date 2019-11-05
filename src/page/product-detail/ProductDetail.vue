<!-- 商品详情 -->
<template>
	<div class="product-detail-wrapper" v-if="productDetail">
		<div style="height:100%;width:100%;position:absolute">
			<mt-button type="primary" style="postition:fixed;width:40px;height:40px;border-radius:50%;color:white;background:#06D5DE;text-align:center;line-height:40px;left:85%;top:80%;z-index:999;" @click="goback">嘻</mt-button>
		</div>
		<!-- header  -->
		<detail-header v-if="!isPreviewPicture"></detail-header>
		<!-- body -->
		<detail-body :isStock="productDetail.good_stock"></detail-body>
		<!-- footer -->
		<detail-footer v-if="!isPreviewPicture"></detail-footer>
		<!-- 预览图片 -->
		<preview-picture
			v-if="isPreviewPicture"
			:defaultindex="swipeId"
			:isshow="isPreviewPicture"
		></preview-picture>
		<!-- 促销信息 -->
		<promotion-popup
			v-if="promoPopstatus"
			:promo-popstatus="promoPopstatus"
		></promotion-popup>
	</div>
</template>

<script>
import DetailHeader from './DetailHeader'
import DetailBody from './DetailBody'
import DetailFooter from './DetailFooter'
import PreviewPicture from './child/PreviewPicture'
import PromotionPopup from './child/PromotionPopup'
import { productGet } from '../../api/product'
import { scoreGet } from '../../api/score'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
	data() {
		return {
			productId: this.$route.query.id ? this.$route.query.id : '',
			isExchange: this.$route.query.isExchange
				? this.$route.query.isExchange
				: false,
			productDetail: {},
			hideFooter: false,
			popupVisible: true,
			currentScore: 0
		}
	},

	components: {
		DetailHeader,
		DetailBody,
		DetailFooter,
		PreviewPicture,
		PromotionPopup
	},

	created() {
		this.getDetail()
		this.saveCartState(false)
		this.saveIsExchangedState(this.isExchange)

		if (this.isExchange) {
			scoreGet().then(
				response => {
					this.currentScore = response.score
					this.saveCurrentScoreState(this.currentScore)
				},
				error => {}
			)
		}
	},

	computed: mapState({
		isPreviewPicture: state => state.detail.isPreviewPicture,
		swipeId: state => state.detail.swipeId,
		promoPopstatus: state => state.detail.promoPopstatus,
		config: state => state.config.config
	}),

	mounted() {
		this.$nextTick(() => {})
	},

	beforeRouteUpdate(to, from, next) {
		next()
		window.location.reload()
	},

	methods: {
		...mapMutations({
			saveInfo: 'saveDetailInfo',
			saveCartState: 'saveCartState',
			setCurrentProductId: 'setCurrentProductId',
			saveIsExchangedState: 'saveIsExchangedState',
			saveCurrentScoreState: 'saveCurrentScoreState',
			saveExchangeScoreState: 'saveExchangeScoreState'
		}),
		...mapActions({
			fetchConfig: 'fetchConfig'
		}),

		/*
				getDetail: 获取商品详情， 并且存入状态管理
			*/
		getDetail() {
			this.setCurrentProductId(this.productId)
			productGet(this.productId).then(res => {
				if (res) {
					this.productDetail = res.product
					this.saveInfo(res.product)
					this.saveExchangeScoreState(this.productDetail.exchange_score)
					let title = this.productDetail.name
					let imgUrl = ''
					let desc = ''
					if (res.product.photos && res.product.photos.length > 0) {
						imgUrl = res.product.photos[0].thumb
					}
					if (this.productDetail.desc) {
						desc = this.productDetail.desc
					}
					let name = res.product.name
					let link = res.product.share_url
						? res.product.share_url
						: res.product.share_link
					if (!this.config) {
						this.loadConfig(imgUrl, name, link)
					} else {
						let wechat = this.config['wechat.web']
						this.setWechatConfig(wechat, imgUrl, name, link)
					}
				}
			})
		},
		loadConfig(imgUrl, desc, link) {
			this.fetchConfig().then(
				response => {
					let wechat = response.config['wechat.web']
					// let openid = this.$cookie.get('o')
					// 微信已授权
					if (wechat) {
						this.setWechatConfig(wechat, imgUrl, desc, link)
					}
				},
				error => {}
			)
		},
		setWechatConfig(config, imgUrl, desc, link) {
			this.wxApi.wxRegister(config, '商品详情', imgUrl, desc, link)
		},
		goback(){
			location.href='http://pts.suoqoo.com/nh5'
		}
	}
}
</script>

<style lang="scss" scoped>
.product-detail-wrapper {
	height: 100%;
	width: auto;
}
</style>
