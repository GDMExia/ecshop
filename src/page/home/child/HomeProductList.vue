<template>
	<div class="product-list">
		<div class="product-list-header" @click="productListClick">
			<div class="header-icon"></div>
			<span class="header-title">{{ title }}</span>
			<img
				class="header-icon"
				src="../../../assets/image/change-icon/b0_arrow_all@2x.png"
			/>
		</div>
		<div class="product-list-body">
			<home-product-body
				:item="item"
				:index="index"
				v-for="(item, index) in items"
				v-bind:key="index"
			></home-product-body>
		</div>
	</div>
</template>

<script>
import HomeProductBody from './HomeProductBody'

export default {
	name: 'HomeProductList',
	data() {
		return {}
	},
	props: ['items', 'title', 'type'],
	components: {
		HomeProductBody
	},
	computed: {},
	methods: {
		productListClick: function() {
			this.$router.push({
				name: 'products',
				query: { sort_key: this.type }
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.product-list {
	background: #ffffff;
	margin-top: 12px;
	margin-bottom: 12px;
	.product-list-header {
		display: flex;
		height: 40px;
		padding: 0px 5px;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		.header-title {
			font-size: 16px;
			color: #333333;
		}
		.header-icon {
			width: 20px;
			height: 20px;
		}
	}
	.product-list-body {
		display: flex;
		flex-wrap: wrap;
	}
}
</style>
