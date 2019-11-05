<template>
	<div class="product-list">
		<div class="product-list-header">
			<img
				class="header-icon"
				src="../../../assets/image/change-icon/h1_icon_title_goods_left@2x.png"
			/>
			<span class="header-title">{{ title }}</span>
			<img
				class="header-icon"
				src="../../../assets/image/change-icon/h1_icon_title_goods_right@2x.png"
			/>
		</div>
		<div class="product-list-body">
			<integral-product-body
				:item="item"
				:index="index"
				v-for="(item, index) in items"
				v-bind:key="index"
			></integral-product-body>
		</div>
	</div>
</template>

<script>
import IntegralProductBody from './IntegralProductBody'

export default {
	name: 'IntegralProductList',
	props: ['items', 'title'],
	components: {
		IntegralProductBody
	}
}
</script>

<style lang="scss" scoped>
.product-list {
	background: #ffffff;
	margin-bottom: 8px;
	.product-list-header {
		display: flex;
		height: 40px;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		.header-title {
			font-size: 16px;
			color: #333333;
			margin: 0px 8px;
		}
		.header-icon {
			width: 18px;
			height: 18px;
		}
	}
	.product-list-body {
		display: flex;
		flex-wrap: wrap;
	}
}
</style>
