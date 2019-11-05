<template>
	<div>
		<div
			class="product-list-body"
			v-infinite-scroll="getMore"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10"
		>
			<discount-product
				:item="item"
				:index="index"
				v-for="(item, index) in products"
				v-bind:key="index"
			></discount-product>
			<div class="loading-wrapper" v-if="products.length > 0">
				<p v-if="!isMore">没有更多了</p>
				<mt-spinner
					type="triple-bounce"
					color="#FA800A"
					v-if="isMore"
				></mt-spinner>
			</div>
		</div>
		<div class="empty" v-if="products.length <= 0">
			<img src="../../../assets/image/change-icon/empty_goods@2x.png" />
			<p>暂无任何商品</p>
		</div>
	</div>
</template>

<script>
import DiscountProduct from './DiscountProduct'
import { productList } from '../../../api/product' //优惠活动商品

export default {
	name: 'DiscountProductList',
	data() {
		return {
			products: [],
			page: 1,
			loading: false, //是否加载更多
			isMore: true, //是否有更多
			products: []
		}
	},
	components: {
		DiscountProduct
	},
	created: function() {
		this.getProductList(false)
	},
	methods: {
		//获取商品列表
		getProductList(isPush) {
			productList(
				'',
				'',
				'',
				'',
				'',
				this.$route.query.id,
				'',
				'',
				this.page,
				10
			).then(res => {
				if (res) {
					this.buildData(isPush, res)
				}
			})
		},

		/*
		 * getMore: 无限滚动加载
		 */
		getMore() {
			this.loading = true
			this.page = ++this.page
			if (this.isMore) {
				this.loading = false
				this.getProductList(true)
			}
		},

		buildData(ispush, res) {
			if (res) {
				if (ispush) {
					this.products = this.products.concat(res.products)
				} else {
					this.products = res.products
				}
				this.isMore = res.paged.more == 1 ? true : false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.product-list-body {
	background: #ffffff;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}
.loading-wrapper {
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 44px;
	width: 100%;
	p {
		color: #c3c3c3;
		font-size: 12px;
		font-weight: 'Regular';
		padding: 0px;
		margin: 0px;
	}
	span {
		display: inline-block;
	}
}
.empty {
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	img {
		width: 75px;
		height: 75px;
	}
	p {
		color: #a4aab3;
		font-size: 17px;
		margin-top: 30px;
	}
}
</style>
