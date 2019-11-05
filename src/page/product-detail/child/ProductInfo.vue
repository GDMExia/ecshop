<template>
	<!-- 商品 -->
	<div class="commodity-wrapper">
		<!-- 轮播图 -->
		<info-goods-swipe></info-goods-swipe>
		<!-- 商品信息 -->
		<info-item></info-item>
		<!-- 促销信息 -->
		<info-promotions v-if="!this.isExchange"></info-promotions>
		<!-- 促销商品的活动结束时间 -->
		<info-promos-time></info-promos-time>
		<!-- 购买 -->
		<info-buy></info-buy>
		<!-- 联系客服-->
		<!-- <info-contact></info-contact> -->
		<!-- 评论 -->
		<info-goods-review></info-goods-review>
		<!-- 点赞 -->
		<!-- <info-like></info-like> -->
		<!-- 推荐商品  -->
		<recommend-item v-if="!this.isExchange"></recommend-item>
		<!-- 商品搭配 -->
		<accessory-item v-if="!this.isExchange"></accessory-item>
		<div style="height: 5px; background-color: #F0F2F5"></div>
	</div>
</template>

<script>
import InfoGoodsSwipe from './InfoGoodsSwipe'
import InfoItem from './InfoItem'
import InfoPromotions from './InfoPromotions'
import InfoPromosTime from './InfoPromosTime'
import InfoBuy from './InfoBuy'
import InfoContact from './InfoContact'
import InfoLike from './InfoLike'
import InfoGoodsReview from './InfoGoodsReview'
import RecommendItem from './RecommendItem'
import AccessoryItem from './AccessoryItem'

import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {}
	},

	created() {},

	components: {
		InfoGoodsSwipe,
		InfoItem,
		InfoPromotions,
		InfoPromosTime,
		InfoBuy,
		InfoContact,
		InfoLike,
		InfoGoodsReview,
		RecommendItem,
		AccessoryItem
	},

	computed: mapState({
		isExchange: state => state.score.isExchange
	}),

	mounted() {},

	methods: {}
}
</script>

<style lang="scss" scoped>
.commodity-wrapper {
	height: 100%;
}
</style>
