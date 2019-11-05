<template>
	<div class="container">
		<mt-header class="header" title="积分商城">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="list">
			<integral-product-list
				:items="hotProductList"
				title="热销商品"
				v-if="hotProductList && hotProductList.length > 0"
			></integral-product-list>

			<!-- 无限加载滚动列表 -->
			<div
				class="flex-wrapper"
				v-infinite-scroll="getMore"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10"
				infinite-scroll-immediate-check = false
			>
				<integral-product-list
					:items="productList"
					title="全部商品"
					v-if="productList && productList.length > 0"
				></integral-product-list>
				<div class="loading-wrapper">
					<p v-if="!isMore">没有更多商品了</p>
					<mt-spinner
						type="triple-bounce"
						color="#FA800A"
						v-if="isMore"
					></mt-spinner>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { HeaderItem } from '../../components/common'
import { Header, Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import IntegralProductList from './child/IntegralProductList'

export default {
	name: 'integralMall',
	data() {
		return {
			params: {
				brand: this.$route.query.brand ? this.$route.query.brand : '',
				category: this.$route.query.category ? this.$route.query.category : '',
				shop: this.$route.query.shop ? this.$route.query.shop : '',
				is_exchange: 1,
				is_hot: 0,
				activity: null, // TODO: 确认activity的值
				sort_key: this.$route.query.sort_key ? this.$route.query.sort_key : 0,
				sort_value: 2,
				page: 1,
				per_page: 10
			},
			loading: false, //是否加载更多
			isMore: true //是否有更多
		}
	},
	components: {
		IntegralProductList
	},
	computed: {
		...mapState({
			productList: state => state.integralmall.productList,
			hotProductList: state => state.integralmall.hotProductList,
		})
	},
	mounted() {},
	created: function() {
		this.getHotProductList()
		this.getProductList(false)
	},
	methods: {
		...mapActions({
			fetchIntegralMallProductList: 'fetchIntegralMallProductList',
			fetchIntegralMallHotProductList: 'fetchIntegralMallHotProductList',
		}),
		goBack() {
			this.$router.go(-1)
		},

		getHotProductList() {
			let data = this.params
			this.fetchIntegralMallHotProductList()
		},

		/*
		 * getProductList: 获取商品列表
		 * @param：  ispush ？ true ：false 是否需要向商品列表追加数据
		 */
		getProductList(ispush) {
			let data = this.params
			this.fetchIntegralMallProductList(data).then(res => {
				this.isMore = res.paged.more == 1 ? true : false
			})
		},

		getMore() {
			this.loading = true
			this.params.page = ++this.params.page
			if (this.isMore) {
				this.loading = false
				this.getProductList(true)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	height: auto;
	position: absolute;
	bottom: 0px;
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

	.loading-wrapper {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 44px;
		p {
			color: #b0b0b0;
			font-size: 12px;
			font-weight: 'Regular';
			padding: 0px;
			margin: 0px;
		}
		span {
			display: inline-block;
		}
	}
}
</style>
