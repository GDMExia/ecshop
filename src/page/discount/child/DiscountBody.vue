<template>
	<div class="discount-container" v-on:click="goDetail(item.id)">
		<img
			class="photo"
			src="../../../assets/image/change-icon/i1_pic_cover.png"
		/>
		<div class="right-container">
			<div class="top">
				<p class="title" v-bind:style="getTitleStyle">{{ this.item.name }}</p>
				<p class="promo">{{ this.item.promo }}</p>
			</div>
			<div class="bottom">
				<p class="range">{{ rangeText }}</p>
				<p class="time">
					{{ getTime(this.item.start_at) }}-{{ getTime(this.item.end_at) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiscountBody',
	props: ['item'],
	computed: {
		rangeText: function() {
			if (this.item.range === 0) {
				return '全部商品可用'
			} else if (this.item.range === 1) {
				return '部分分类可用'
			} else if (this.item.range === 2) {
				return '部分品牌可用'
			} else if (this.item.range === 3) {
				return '部分商品可用'
			}
			return ''
		},
		getTitleStyle: function() {
			const { width } = window.screen
			let itemWidth = width - 160
			return {
				width: itemWidth + 'px'
			}
		}
	},
	methods: {
		getTime(timestamps) {
			let date = new Date(timestamps * 1000)
			let year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate()
			return year + '/' + month + '/' + day
		},

		// 前往优惠详情
		goDetail(id) {
			this.$router.push({ name: 'discountDetail', query: { id: id } })
		}
	}
}
</script>

<style lang="scss">
.discount-container {
	padding: 10px;
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	border-bottom: 1px solid #f5f5f5;
	.photo {
		width: 120px;
		height: 120px;
		align-self: center;
	}
	.right-container {
		margin: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.top {
			.title {
				font-size: 18px;
				color: #333333;
				height: 25px;
				line-height: 25px;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
			.promo {
				font-size: 14px;
				color: $primaryColor;
				margin-top: 6px;
			}
		}
		.bottom {
			.range {
				font-size: 12px;
				color: #999999;
			}
			.time {
				font-size: 12px;
				color: #999999;
				margin-top: 6px;
			}
		}
	}
}
</style>
