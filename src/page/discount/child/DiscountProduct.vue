<template>
	<div
		class="product-info"
		v-bind:style="getProductStyle"
		v-bind:class="{ border: showRightBorder }"
		@click="productClick"
	>
		<img
			class="product-icon"
			v-bind:style="getProductIconStyle"
			src="../../../assets/image/change-icon/default_image_02@2x.png"
			v-bind:src="item.default_photo.large"
			v-if="item.default_photo"
			v-lazy="item.default_photo.thumb"
		/>
		<img
			class="product-icon"
			v-bind:style="getProductIconStyle"
			src="../../../assets/image/change-icon/default_image_02@2x.png"
			v-else
		/>
		<span class="product-title"
			><img src="../../../assets/image/change-icon/c0_sale.png" />{{
				item.name
			}}</span
		>
		<div class="product-middle">
			<span class="product-price">￥{{ item.current_price }}</span>
		</div>
		<div class="product-bottom">
			<span class="product-praise">{{ item.review_rate }}好评</span>
			<span class="product-sales">销量{{ item.sales_count }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiscountProduct',
	data() {
		return {
			itemWidth: 0,
			itemHeight: 0,
			showRightBorder: this.index % 2 == 0
		}
	},
	props: ['item', 'index'],
	computed: {
		getProductStyle: function() {
			const { width, height } = window.screen
			let itemWidth = width / 2 - 20 - 1
			let itemHeight = itemWidth * (132.0 / 94.0)
			this.itemWidth = itemWidth
			this.itemHeight = itemHeight
			return {
				width: itemWidth + 'px',
				height: itemHeight + 'px'
			}
		},
		getProductIconStyle: function() {
			const { width, height } = window.screen
			let itemWidth = this.itemWidth - 20
			let itemHeight = itemWidth
			return {
				width: itemWidth + 'px',
				height: itemHeight + 'px'
			}
		}
	},
	methods: {
		productClick: function() {
			this.$router.push({ name: 'product', query: { id: this.item.id } })
		}
	}
}
</script>

<style lang="scss" scoped>
.border {
	border-right: 1px solid #f5f5f5;
}
.product-info {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 10px;
	justify-content: flex-end;
	border-bottom: 1px solid #f5f5f5;
	.product-icon {
		align-self: center;
	}
	.product-title {
		color: #333333;
		font-size: 12px;
		line-height: 16px;
		margin-top: 20px;
		font-family: PingFangSC;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		img {
			width: 15px;
			height: 15px;
			line-height: 16px;
			vertical-align: middle;
			margin-right: 3px;
		}
	}
	.product-middle {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		.product-price {
			color: #fa800a;
			font-size: 12px;
		}
	}
	.product-bottom {
		display: flex;
		margin-top: 4px;
		.product-praise {
			color: #999999;
			font-size: 10px;
			margin-right: 12px;
		}
		.product-sales {
			color: #999999;
			font-size: 10px;
		}
	}
}
</style>
