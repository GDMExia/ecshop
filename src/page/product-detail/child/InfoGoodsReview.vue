<!-- Goodsreview.vue -->
<template>
	<div
		class="ui-review-wrapper ui-detail-common"
		v-if="reviewList.length > 0"
		@click="getCommentStatus()"
	>
		<div class="review-header header"><h3>评价</h3></div>
		<div class="goods-review-body">
			<review-list :list="reviewList"></review-list>
		</div>
	</div>
</template>

<script>
import ReviewList from './ReviewList'
import { getReviewList } from '../../../api/product'
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {
			reviewList: []
		}
	},

	computed: {
		...mapState({
			currentProductId: state => state.detail.currentProductId
		})
	},

	components: {
		ReviewList
	},

	created() {
		this.getReviewList()
	},

	methods: {
		...mapMutations({
			changeIndex: 'changeIndex'
		}),

		getReviewList() {
			let params = {
				product: this.currentProductId,
				grade: '',
				page: 1,
				per_page: 10
			}
			getReviewList(params).then(res => {
				if (res) {
					this.reviewList = res.reviews.slice(0, 2)
				}
			})
		},

		/* 评论 */
		getCommentStatus() {
			this.changeIndex(2)
		}
	}
}
</script>

<style lang="scss" scoped>
.ui-review-wrapper {
	height: auto;
	&.ui-detail-common {
		padding: 0px;
	}
	.review-header {
		padding: 0px 15px;
		height: 50px;
		border-bottom: 0.5px solid #e8eaed;
		h3 {
			font-size: 16px;
			color: #333333;
		}
		img {
			width: 5px;
			height: 10px;
		}
	}
	.goods-review-body {
		background: #ffffff;
	}
}
</style>
