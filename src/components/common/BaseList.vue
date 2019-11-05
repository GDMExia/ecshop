<template>
	<div v-infinite-scroll="onLoadMore" infinite-scroll-distance="10">
		<slot></slot>
		<div v-if="isShowMore" class="loading-wrapper">
			<p v-if="!isMore && !isHideMore">没有更多了</p>
			<mt-spinner
				type="triple-bounce"
				color="#FA800A"
				v-if="isMore"
			></mt-spinner>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BaseList',
	props: {
		items: {
			type: Array,
			default: []
		},
		isMore: {
			type: Number,
			default: 0
		},
		isHideMore: {
			type: Boolean,
			default: false
		},
		isLoaded: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isEmpty() {
			if (this.items.length === 0) {
				return true
			}
			return false
		},
		isShowMore() {
			if (this.isLoaded && this.isEmpty) {
				return false
			}
			return true
		}
	},
	methods: {
		onLoadMore() {
			this.$emit('loadMore')
		}
	}
}
</script>

<style scoped lang="scss">
.loading-wrapper {
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 44px;
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
</style>
