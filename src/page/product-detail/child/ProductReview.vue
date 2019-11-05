<!-- Evaluation.vue -->
<template>
	<div class="ui-evaluation">
		<div class="ui-evaluation-header">
			<div class="flex-header">
				<div
					v-for="(item, index) in staticData"
					v-bind:key="item.id"
					v-bind:class="{ active: currentTag == item.value }"
					v-on:click="changeTab(item.value, item.grade)"
				>
					{{ item.name }}({{ subTotal[item.value] }})
				</div>
			</div>
		</div>
		<div
			class="ui-evaluation-body"
			v-infinite-scroll="loadMore"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10"
		>
			<div
				class="list"
				v-for="(item, index) in reviewList"
				v-if="reviewList.length > 0"
			>
				<div>
					<span>
						{{ utils.replaceStr(item.username) }}
						<span
							v-bind:class="{
								'good-review': item.grade == 3,
								'medium-review': item.grade == 2,
								'bad-review': item.grade == 1
							}"
							>{{ getGrade(item.grade) }}</span
						>
					</span>

					<span>{{ getTime(item.created_at) }}</span>
				</div>
				<p v-if="item.content">{{ item.content }}</p>
				<p v-if="!item.content">无评价信息</p>
				<span v-if="item.reply" class="reply">
					<span class="reply_border"></span>
					<span class="reply_content">管理员：{{ item.reply.content }}</span>
				</span>
			</div>

			<div class="list-empty" v-if="reviewList.length <= 0">
				<img src="../../../assets/image/change-icon/empty_comments@2x.png" />
				<p>本商品暂无评价</p>
			</div>
		</div>
	</div>
</template>

<script>
import { evaluation } from '../static'
import { getReviewList, getReviewsubtotal } from '../../../api/product'
export default {
	data() {
		return {
			staticData: evaluation,
			id: this.$store.state.detail.currentProductId
				? this.$store.state.detail.currentProductId
				: '',
			currentTag: 'total',
			grade: 0,
			subTotal: {},
			reviewList: [],
			page: 0,
			loading: false,
			total: 1
		}
	},
	created() {
		this.getReviewTotal()
	},
	methods: {
		getReviewTotal() {
			getReviewsubtotal(this.id).then(res => {
				if (res) {
					this.subTotal = res.subtotal
				}
			})
		},
		loadMore() {
			this.loading = true
			this.page = ++this.page
			if (this.page <= this.total) {
				this.loading = false
				this.getReviewList(true)
			}
		},
		getReviewList(ispush) {
			let params = {
				product: this.id,
				grade: this.grade,
				page: this.page,
				per_page: 10
			}
			getReviewList(params).then(res => {
				if (res) {
					if (ispush) {
						this.reviewList = this.reviewList.concat(res.reviews)
						// this.productList = this.productList.concat(res.products);
					} else {
						this.reviewList = res.reviews
					}
					// this.reviewList = res.reviews;
					if (res.paged.more) {
						this.loading = false
					} else {
						this.loading = true
					}
					this.total = res.paged.total
				}
			})
		},
		changeTab(value, grade) {
			this.currentTag = value
			this.grade = grade
			this.getReviewList(false)
		},
		getGrade(grade) {
			if (grade == 1) {
				return '差评'
			} else if (grade == 2) {
				return '中评'
			} else {
				return '好评'
			}
		},
		getTime(timestamps) {
			let date = new Date(timestamps * 1000)
			let year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate()
			return year + '-' + month + '-' + day
		}
	}
}
</script>

<style lang="scss" scoped>
.ui-evaluation {
	.ui-evaluation-header {
		background: #ffffff;
		.flex-header {
			width: auto;
			display: flex;
			display: -webkit-flex;
			display: -moz-flex;
			flex-basis: 100%;
			justify-content: space-around;
			align-content: center;
			align-items: center;
			height: 44px;
			div {
				color: #5c5958;
				font-size: 14px;
				height: 24px;
				border: 0.5px solid #4e545d;
				padding: 0px 9px;
				line-height: 24px;
				text-align: center;
				&.active {
					color: #ffffff;
					background: $primaryColor;
					border: 0.5px solid transparent;
				}
			}
		}
	}
	.ui-evaluation-body {
		padding: 0px 15px;
		background: rgba(255, 255, 255, 1);
		.list {
			padding: 15px 0px;
			border-bottom: 0.5px solid rgba(232, 234, 237, 1);
			color: #4e545d;
			font-size: 15px;
			div {
				overflow: hidden;
				padding-bottom: 15px;
				display: flex;
				justify-content: space-between;
				align-content: center;
				align-items: center;
				span {
					&:first-child {
						display: flex;
						justify-content: space-around;
						align-content: center;
						align-items: center;
						span {
							margin-left: 15px;
							color: #ffffff;
							font-size: 12px;
						}
					}
					&:last-child {
						color: #8f8e94;
						font-size: 12px;
					}
					&.good-review {
						background: #fc2e39;
						width: 36px;
						height: 16px;
						text-align: center;
						background-size: cover;
						line-height: 16px;
						border-radius: 8px;
					}
					&.medium-review {
						background: #fa800a;
						width: 36px;
						height: 16px;
						text-align: center;
						background-size: cover;
						line-height: 16px;
						border-radius: 8px;
					}
					&.bad-review {
						background: #c3c3c3;
						width: 36px;
						height: 16px;
						text-align: center;
						background-size: cover;
						line-height: 16px;
						border-radius: 8px;
					}
				}
			}
			p {
				padding: 0px;
				margin: 0px;
				flex-basis: 100%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.reply {
				.reply_border {
					border-width: 0px;
				    border-style: solid;
				    border-color: black black rgb(232, 232, 232);
				    border-image: initial;
				    box-sizing: border-box;
				    display: flex;
				    -webkit-box-orient: horizontal;
				    flex-flow: row wrap;
				    align-content: flex-start;
				    flex-shrink: 0;
				    margin-top: 10px;
				    padding-bottom: 5px;
				    -webkit-box-align: center;
				    align-items: center;
				    overflow: hidden;
				}
				.reply_content {
					border: 0px solid black;
				    box-sizing: border-box;
				    display: flex;
				    -webkit-box-orient: vertical;
				    flex-direction: column;
				    align-content: flex-start;
				    flex-shrink: 0;
				    padding: 10px;
				    border-radius: 2.5px;
				    background-color: rgb(232, 232, 232);
				}
			}

		}
		.list-empty {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			img {
				width: 55px;
			}
			p {
				color: #7c7f88;
				font-size: 17px;
				padding: 0px;
				margin: 0px;
				font-weight: normal;
			}
		}
	}
}
</style>
