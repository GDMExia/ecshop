<!-- ProductListBody.vue -->
<template>
	<div class="ui-product-body">
		<div class="list" v-on:click="goDetail()">
			<div class="ui-image-wrapper">
				<img
					src="../../../assets/image/change-icon/default_image_02@2x.png"
					class="product-img"
					v-if="isPhotoEmpty(item)"
				/>
				<img
					class="product-img"
					v-bind:src="getPhotoUrl(item)"
					v-if="!isPhotoEmpty(item)"
					data-src="../../../assets/image/change-icon/default_image_02@2x.png"
					v-lazy="getPhotoUrl(item)"
				/>
				<span v-if="item.good_stock == 0">已售罄</span>
				<span v-if="item.good_stock > 0 && item.good_stock <= 10"
					>仅剩{{ item.good_stock }}件</span
				>
			</div>

			<div class="flex-right">
				<div class="product-header">
					<img
						class="promos-icon"
						v-if="item.promos && item.promos.length > 0"
						src="../../../assets/image/change-icon/c0_sale@2x.png"
					/>
					<h3 class="title clear-bottom" style="-webkit-box-orient:vertical">
						{{ item.name }}
					</h3>
				</div>
				<span class="sub-title" style="-webkit-box-orient:vertical">{{
					item.desc
				}}</span>
				<div class="price">
					<span>￥{{ item.current_price }}</span>
					<span>￥{{ utils.currencyPrice(item.price) }}</span>
				</div>
				<div class="sendway">
					<span v-if="item.self_employed" class="self-support">自营</span>
					<span>{{ item.review_rate }}好评</span>
					<span>销量{{ item.sales_count }}</span>
					<img
						src="../../../assets/image/change-icon/b1_add_cart@2x.png"
						@click.stop="addShopping(true)"
					/>
				</div>
			</div>
		</div>
		<shopping v-if="isShowcartInfo" :isShowcartInfo="isShowcartInfo"></shopping>

		<!-- 加入购物车显示动画 -->
		<div class="ui-cart-animation" v-if="isAnimation">
			<mt-spinner type="snake" color="#FA800A"></mt-spinner>
		</div>
	</div>

</template>

<script>
import { Toast, Indicator } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import { cartAdd, productGet } from '../../../api/cart'
import shopping from './Shopping'

export default {
	data() {
		return {
			isAnimation: false, //加入购物车成功之后是否显示动画
			productDetail: {},
		}
	},
	components: {
		shopping
	},
	props: ['item', 'productId', 'requestparams'],

	computed: {
		...mapState({
			//是否显示购物车浮层
			isShowcartInfo: state => state.detail.isShowcartInfo,
			isOnline: state => state.auth.isOnline
		})
	},
	created() {
		this.saveCartState(false)
		this.$on('start-addcart-animation', () => {
			this.isAnimation = true
		})
		this.$on('end-addcart-animation', () => {
			this.isAnimation = false
			this.saveCartState(false)
		})
	},

	methods: {
		...mapMutations({
			saveCartState: 'saveCartState',
			changeType: 'changeType',
			setCurrentProductId: 'setCurrentProductId',
			saveExchangeScoreState: 'saveExchangeScoreState',
			saveInfo: 'saveDetailInfo',
		}),
		...mapActions({
			fetchConfig: 'fetchConfig'
		}),
		isPhotoEmpty(item) {
			let url = this.getPhotoUrl(item)
			return url && url.length ? false : true
		},
		getPhotoUrl(item) {
			let default_photo = item.default_photo
			if (default_photo) {
				if (default_photo.large) {
					return default_photo.large
				} else if (default_photo.thumb) {
					return default_photo.thumb
				}
			}
			return null
		},
		goDetail() {
			let data = Object.assign({}, { id: this.productId }, this.requestparams)
			this.$router.push({ name: 'product', query: { id: this.productId } })
		},

		// 加入购物车
		addShopping(value) {
			this.getDetail(value)
		},
		/*
				getDetail: 获取商品详情， 并且存入状态管理
			*/
		getDetail(value) {
			this.setCurrentProductId(this.productId)
			productGet(this.productId).then(res => {
				if (res) {
					this.productDetail = res.product
					this.saveInfo(res.product)
					this.saveExchangeScoreState(this.productDetail.exchange_score)
					this.saveCartState(value)
					this.changeType('确定')
				}
			})
		},

		/*
		 * cartAdd: 加入购物车
		 * @param： product： 商品id
		 */
		_cartAdd(product) {
			if (this.isOnline) {
				cartAdd(product, '', 1).then(
					res => {
						if (res) {
							this.$parent.$emit('get-cart-quantity')
							Toast({ message: '加入成功', position: 'middle', duration: 5000 })
						}
					},
					error => {
						Toast(error.errorMsg)
					}
				)
			} else {
				this.$router.push({ name: 'signin' })
			}
		}
	}
}
</script>

<style lang="scss">
.ui-product-body {
	border-bottom: 1px solid rgba(232, 234, 237, 1);
	.list {
		display: flex;
		width: auto;
		align-items: center;
		justify-content: space-between;
		margin: 11px 10px;
		position: relative;
		div.ui-image-wrapper {
			width: 110px;
			height: 110px;
			position: relative;

			display: flex;
			justify-content: center;
			align-content: center;
			align-items: center;
			flex-basis: 110px;
			flex-shrink: 0;

			background-position: center center !important;
			background: url('../../../assets/image/change-icon/default_image_02@2x.png');
			background-size: 100px 100px;
			background-repeat: no-repeat;
			-webkit-background-size: cover;
			-moz-background-size: cover;
			-o-background-size: cover;
			background-size: cover;

			img.product-img {
				width: 110px;
				height: 110px;
				flex-basis: 110px;
				flex-shrink: 0;
			}
			img.product-img[lazy='loading'] {
				width: 30px;
				height: 30px;
			}
			img.product-im[lazy='error'] {
				width: 30px;
				height: 30px;
			}
			img.product-img[lazy='loaded'] {
				width: 110px;
				height: 110px;
				flex-basis: 110px;
				flex-shrink: 0;
				background: rgba(255, 255, 255, 1);
			}

			span {
				position: absolute;
				height: 20px;
				background: rgba(243, 244, 245, 1);
				line-height: 20px;
				text-align: center;
				font-size: 14px;
				color: $primaryColor;
				width: 110px;
				bottom: 0px;
				left: 0px;
			}
		}

		span.promos {
			position: absolute;
			background: url('../../../assets/image/change-icon/label@2x.png')
				no-repeat;
			width: 36px;
			height: 19px;
			color: #ffffff;
			font-size: 10px;
			top: 0px;
			left: 0px;
			background-size: cover;
			font-weight: 100;
			line-height: 19px;
			text-align: left;
			padding-left: 5px;
		}
		.flex-right {
			padding-left: 14px;
			width: 100%;
			.title {
				color: #4e545d;
				font-size: 16px;
				font-weight: normal;

				display: -moz-box;
				display: -webkit-box;
				display: box;

				-webkit-line-clamp: 2;
				-moz-line-clamp: 2;

				-moz-box-orient: vertical;
				-webkit-box-orient: vertical;
				box-orient: vertical;

				overflow: hidden;
				margin-bottom: 8px;
				&.clear-bottom {
					margin-bottom: 0px;
				}
			}

			.product-header {
				display: flex;
				align-items: center;
			}
			.promos-icon {
				width: 16px;
				height: 16px;
				margin-right: 4px;
			}
			.sub-title {
				color: #55595f;
				font-size: 12px;

				display: -moz-box;
				display: -webkit-box;
				display: box;

				-webkit-line-clamp: 1;
				-moz-line-clamp: 1;

				-moz-box-orient: vertical;
				-webkit-box-orient: vertical;
				box-orient: vertical;

				overflow: hidden;
				margin-bottom: 8px;
			}
			.price {
				margin-bottom: 8px;
				span {
					&:first-child {
						color: $primaryColor;
						font-size: 16px;
					}
					&:last-child {
						color: #a4aab3;
						font-size: 12px;
						text-decoration: line-through;
					}
				}
			}
			.sendway {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 12px;
				font-weight: 'Regular';
				span {
					color: #7c7f88;
					&.self-support {
						font-size: 10px;
						color: $primaryColor;
						border: 1px solid $primaryColor;
						border-radius: 2px;
						width: 32px;
						height: 16px;
						line-height: 16px;
						text-align: center;
					}
				}
				img {
					width: 22px;
					height: 20px;
				}
			}
		}
	}
}
</style>
