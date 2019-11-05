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
		<span class="product-title">{{ item.name }}</span>
		<span class="product-score">{{ item.exchange_score }}积分</span>
	</div>
</template>

<script>
export default {
	name: 'IntegralProductBody',
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
			let itemHeight = itemWidth * (127.0 / 94.0)
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
			this.$router.push({
				name: 'product',
				query: { id: this.item.id, isExchange: true }
			})
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
		margin-top: 20px;
	}
	.product-score {
		color: $primaryColor;
		font-size: 12px;
		margin-top: 8px;
	}
}
</style>
