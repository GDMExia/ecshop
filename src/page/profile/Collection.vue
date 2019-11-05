<template>
	<div class="container">
		<!-- header -->
		<mt-header class="header" title="我的收藏">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack()">
			</header-item>
		</mt-header>
		<!-- body -->
		<div class="body">
			<mt-cell-swipe
				v-for="(item, index) in collectionList"
				v-bind:key="item.id"
				:right="rightBottom(item.id)"
			>
				<div
					class="ui-collection-body"
					v-on:click="goOrderDetail(item.id, item.shop)"
				>
					<div class="ui-image-wrapper">
						<img
							src="../../assets/image/change-icon/default_image_02@2x.png"
							class="collection-img"
							v-if="item.photos <= 0"
						/>
						<img
							class="collection-img"
							v-bind:src="item.photos[0].thumb"
							v-if="item.photos && item.photos.length > 0"
							data-src="../../../assets/image/change-icon/default_image_02@2x.png"
							v-lazy="item.photos[0].thumb"
						/>
						<span class="wrapper-red" v-if="item.good_stock == 0">无货</span>
						<span v-if="item.good_stock > 0 && item.good_stock <= 10"
							>仅剩{{ item.good_stock }}件</span
						>
					</div>

					<div class="flex-right">
						<h3 class="title" style="-webkit-box-orient:vertical">
							{{ item.name }}
						</h3>
						<p class="sub-title" style="-webkit-box-orient:vertical">
							{{ item.desc }}
						</p>
						<div class="price">
							<span>￥{{ item.current_price }}</span>
							<!-- <span>￥{{ utils.currencyPrice(item.price)}}</span> -->
						</div>
					</div>
				</div>
			</mt-cell-swipe>
			<div
				v-if="collectionList && collectionList.length <= 0"
				class="order-air"
			>
				<img src="../../assets/image/change-icon/favorite_empty@2x.png" />
				<p>暂无商品</p>
				<button class="button" v-on:click="goVisit()">
					<label>随便逛逛</label>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { CellSwipe, MessageBox } from 'mint-ui'
import { productLikedList, productUnlike } from '../../api/product' //已收藏商品 //取消收藏商品
export default {
	data() {
		return {
			collectionList: [],
			orderListParams: { page: 1, per_page: 10 }
		}
	},
	created: function() {
		this.orderCollection()
	},
	methods: {
		rightBottom(productId) {
			return [
				{
					content: '删除',
					style: { background: 'red', color: '#fff' },
					handler: () =>
						MessageBox({
							title: '确认删除',
							message: '是否要删除此商品？',
							showCancelButton: true
						}).then(action => {
							if (action === 'confirm') {
								this.getCancelCollection(productId)
							}
						})
				}
			]
		},
		goBack() {
			this.$router.go(-1)
		},
		// 获取已收藏商品数据
		orderCollection() {
			let data2 = this.orderListParams
			productLikedList(data2.page, data2.per_page).then(
				res => {
					if (res) {
						this.collectionList = res.products
					}
				},
				error => {}
			)
		},
		// 去商品详情
		goOrderDetail(orderId) {
			this.$router.push({ name: 'product', query: { id: orderId } })
		},
		// 取消收藏商品数据
		getCancelCollection(productId) {
			productUnlike(productId).then(res => {
				if (res) {
					this.CancelCollection = res
					this.orderCollection()
				}
			})
		},
		// 随便逛逛
		goVisit() {
			this.$router.push('/home')
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
	.header {
		@include header;
		border-bottom: 1px solid #e8eaed;
		position: fixed;
		width: 100%;
		z-index: 1;
	}
	.body {
		position: absolute;
		top: 44px;
		width: 100%;
		.ui-collection-body {
			display: flex;
			width: auto;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
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
				background: url('../../assets/image/change-icon/default_image_02@2x.png');
				background-size: 100px 100px;
				background-repeat: no-repeat;
				-webkit-background-size: cover;
				-moz-background-size: cover;
				-o-background-size: cover;
				background-size: cover;

				img.collection-img {
					width: 110px;
					height: 110px;
					flex-basis: 110px;
					flex-shrink: 0;
				}
				img.collection-img[lazy='loading'] {
					width: 30px;
					height: 30px;
				}
				img.collection-img[lazy='error'] {
					width: 30px;
					height: 30px;
				}
				img.collection-img[lazy='loaded'] {
					width: 110px;
					height: 110px;
					flex-basis: 110px;
					flex-shrink: 0;
					background: rgba(255, 255, 255, 1);
				}

				span {
					position: absolute;
					height: 20px;
					background: #f3f4f5;
					line-height: 20px;
					text-align: center;
					font-size: 14px;
					color: $primaryColor;
					width: 110px;
					bottom: 0px;
					left: 0px;
				}

				.wrapper-red {
					color: #666666;
				}
			}
			.flex-right {
				padding-left: 14px;
				width: 100%;
				height: 110px;
				.title {
					color: #333333;
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
				}
				.sub-title {
					color: #55595f;
					font-size: 12px;
					height: 12px;

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
					margin-bottom: 10px;
					position: absolute;
					bottom: 0px;
					width: 100%;
					span {
						&:first-child {
							color: #fa800a;
							font-size: 16px;
						}
					}
				}
				.sendway {
					font-size: 12px;
					display: flex;
					align-items: center;
					span {
						color: #7c7f88;
						padding-left: 7px;
						&.self-support {
							font-size: 10px;
							color: $primaryColor;
							border: 1px solid $primaryColor;
							border-radius: 2px;
							width: 32px;
							height: 16px;
							line-height: 16px;
							text-align: center;
							padding: 3px;
						}
					}
					img {
						width: 22px;
						height: 20px;
					}
				}
			}
		}
		.order-air {
			width: 100%;
			vertical-align: middle;
			text-align: center;
			img {
				width: 102px;
				height: 102px;
				box-sizing: border-box;
				margin: 130px auto 20px;
			}
			p {
				font-size: 17px;
				color: rgba(124, 127, 136, 1);
				line-height: 17px;
				text-align: center;
				margin: 0 auto;
			}
			.button {
				width: 180px;
				height: 36px;
				background: $primaryColor;
				border-radius: 2px;
				padding: 0px 55px;
				margin: 28px auto;
				border: none;
			}
			label {
				font-size: 16px;
				color: #fff;
				display: inline-block;
				vertical-align: middle;
				height: 16px;
				line-height: 16px;
			}
		}
	}
}
</style>

<!--Cell Swipe样式覆盖 -->
<style>
.mint-cell-swipe-button {
	width: 90px;
	font-size: 14px;
	display: flex !important;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
}
.mint-cell-wrapper {
	padding: 0px;
}

.mint-cell-wrapper .mint-cell-value {
	width: 100%;
	border-bottom: 1px solid rgba(232, 234, 237, 1);
}
</style>
