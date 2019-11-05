<!-- recommend.vue -->
<template>
	<div class="ui-recommend-wrapper" v-if="list.length > 0">
		<div class="wrapper-swipe">
			<mt-swipe
				v-bind:style="getWrapperStyle"
				:auto="0"
				:show-indicators="false"
				@change="handleChange"
				:stop-propagation="true"
				:speed="100"
			>
				<mt-swipe-item v-for="(item, index) in list" :key="index">
					<div class="image-swipe-wrapper">
						<div
							v-for="(image, j) in item[0]"
							@click="goDetail(image.id)"
							v-bind:style="getItemStyle"
						>
							<img
								:src="image.photos[0].thumb"
								v-if="image.photos.length > 0"
							/>
							<img
								src="../../../assets/image/change-icon/default_image_02@2x.png"
								v-if="image.photos.length <= 0"
							/>
							<span>￥{{ image.current_price }}</span>
						</div>
					</div>
				</mt-swipe-item>
			</mt-swipe>
		</div>

		<div class="swiper-indicators" v-if="list.length > 1">
			<div class="ui-indicator">
				<div
					class="indicator-item"
					v-for="(item, index) in indicatorArray"
					v-bind:class="{ active: item.index == currentIndex }"
				></div>
			</div>
		</div>

		<div class="ui-recommend-all" v-on:click="goRecommend()">查看全部</div>
	</div>
</template>

<script>
import { getRecommendProduct } from '../../../api/product'
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {
			list: [],
			indicatorArray: [],
			currentIndex: 0
		}
	},

	created() {
		this.getRecommendList()
	},

	computed: {
		...mapState({
			currentProductId: state => state.detail.currentProductId
		}),
		getWrapperStyle: function() {
			const { width, height } = window.screen
			let itemWidth = width - 30
			let itemHeight = (width - 30 - 16) / 3
			return {
				width: itemWidth + 'px',
				height: itemHeight + 'px'
			}
		},
		getItemStyle: function() {
			const { width, height } = window.screen
			let itemWidth = (width - 30 - 16) / 3
			let itemHeight = itemWidth
			return {
				width: itemWidth + 'px',
				height: itemHeight + 'px'
			}
		}
	},

	methods: {
		/*
				getRecommendList: 获取推荐商品
			*/
		getRecommendList() {
			let params = {
				product: this.currentProductId ? this.currentProductId : '',
				page: 1,
				per_page: 10
			}
			getRecommendProduct(params).then(res => {
				if (res) {
					this.list = this.buildList(res.products)
					this.buildSwipeIndicators()
				}
			})
		},

		/*
				buildList：构建促销展示商品的数据
				@params： res 接口数据返回的促销商品
			*/
		buildList(res) {
			let index = Math.ceil(res.length / 3)
			let newArray = []
			if (index) {
				for (let i = 0; i <= index - 1; i++) {
					let subArray = []
					subArray.push(res.slice(i * 3, i * 3 + 3))
					newArray.push(subArray)
				}
			}
			return newArray
		},

		/*
				buildSwipeIndicators: 根据轮播图的长度计算位于底部的按钮的个数
			*/
		buildSwipeIndicators() {
			let photos = this.list
			for (let i = 0, len = photos.length - 1; i <= len; i++) {
				photos[i].index = i
				this.indicatorArray.push(photos[i])
			}
		},

		/*
				handleChange: 查看大图的时候滑动大图设置位于底部的按钮的选中状态同时隐藏查看大图的头部信息
				@params: index 当前滑动的图片的index
			 */
		handleChange(index) {
			this.currentIndex = index
		},

		/*
				goRecommend: 跳转到相关商品页面
			 */
		goRecommend() {
			let params = {}
			if (this.$route.params.brand) {
				params.brand = this.$route.params.brand
			}
			if (this.$route.params.category) {
				params.category = this.$route.params.category
			}
			if (this.$route.params.shop) {
				params.shop = this.$route.params.shop
			}
			params.product = this.currentProductId
			this.$router.push({ name: 'recommend', params: params })
		},

		goDetail(id) {
			let data = Object.assign({}, { id: id })
			this.$router.push({ name: 'product', query: { id: id } })
		}
	}
}
</script>

<style lang="scss" scoped>
.ui-recommend-wrapper {
	background: #ffffff;
	margin-top: 8px;
	margin-bottom: 10px;
	.wrapper-swipe {
		padding: 15px 15px 0px 15px;
	}

	.swiper-indicators {
		position: relative;
		margin-top: 20px;
		bottom: 0px;
	}

	.ui-recommend-all {
		height: 44px;
		background: #ffffff;
		border-top: 1px solid #e8eaed;
		font-size: 15px;
		color: rgba(78, 84, 93, 1);
		width: 100%;
		flex-basis: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		margin-top: 20px;
	}

	div.image-swipe-wrapper {
		display: flex;
		justify-content: space-between;
		align-content: center;
		align-items: center;
		div {
			position: relative;
			border: 1px solid #efeff4;
			border-radius: 2px;
			img {
				width: 100%;
				height: 100%;
				padding: 0px;
				margin: 0px;
			}
			span {
				position: absolute;
				bottom: 0px;
				width: 100%;
				display: inline-block;
				height: 24px;
				line-height: 24px;
				font-size: 16px;
				font-family: 'PingFangSC-Regular';
				color: #ffffff;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 0px 0px 2px 2px;
			}
		}
	}
}
</style>
