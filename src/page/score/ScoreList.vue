<template>
	<div class="container">
		<div class="ul-score">
			<mt-header class="header" title="我的积分">
				<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
				</header-item>
				<!-- 	<div class="right" slot="right" @click="goRecord">
				<img src="../../assets/image/change-icon/btn_rule@2x.png">积分规则</div> -->
			</mt-header>
			<div class="header-info">
				<div class="title">{{ scoreInfo.score }}</div>
				<div class="desc">
					当前可用积分
					<!-- <img @click="touchExplain()" src="../../assets/image/change-icon/btn_integral@2x.png"> -->
				</div>
			</div>
			<div class="tab">
				<ul>
					<li
						class="tab-item"
						v-bind:class="{ active: currentIndex == 0 }"
						@click="setCurrentItem(0)"
					>
						全部
					</li>
					<li
						class="tab-item"
						v-bind:class="{ active: currentIndex == 1 }"
						@click="setCurrentItem(1)"
					>
						收入
					</li>
					<li
						class="tab-item"
						v-bind:class="{ active: currentIndex == 2 }"
						@click="setCurrentItem(2)"
					>
						支出
					</li>
				</ul>
			</div>
		</div>
		<div class="content-wrapper">
			<base-list
				class="list"
				:items="items"
				:isMore="isMore"
				:isLoaded="isLoaded"
				v-on:loadMore="loadMore"
			>
				<score-record
					class="item"
					v-for="(item, index) in items"
					:key="index"
					:item="item"
				>
				</score-record>
			</base-list>
			<empty-item
				v-if="isLoaded && items.length <= 0"
				title="暂无积分记录"
				:photo="require('../../assets/image/change-icon/e2_wu@2x.png')"
			>
			</empty-item>
		</div>
	</div>
</template>

<script>
import { HeaderItem, BaseList, EmptyItem } from '../../components/common'
import ScoreItem from './child/ScoreItem'
import ScoreRecord from './child/ScoreRecord'
import * as api from '../../api/score'
import { MessageBox, Toast } from 'mint-ui'

export default {
	data() {
		return {
			scoreInfo: {},
			items: [], // 记录列表
			isLoaded: false,
			isLoading: false,
			page: 1,
			isMore: 0,
			currentIndex: this.$route.query.index ? this.$route.query.index : 0 //当前的tab
		}
	},
	created() {
		this.getScoreInfo()
		this.loadFirstPageData()
	},
	mounted() {},
	methods: {
		touchExchange(item) {
			api.scoreExchangeCoupon(item.id).then(
				res => {
					if (res) {
						Toast('积分兑换成功')
						this.getScoreInfo()
					}
				},
				error => {
					Toast({
						message: error.errorMsg,
						duration: 1000
					})
				}
			)
		},
		goBack() {
			this.$router.go(-1)
		},
		goRecord() {
			this.$router.push('/scoreRule')
		},
		getScoreInfo() {
			api.scoreGet().then(res => {
				if (res) {
					this.scoreInfo = res
				}
			})
		},

		loadFirstPageData() {
			this.loadPageData(true)
		},
		loadMorePageData() {
			this.loadPageData(false)
		},
		loadPageData(isFirstPage) {
			let page = 1
			if (isFirstPage) {
				page = 1
			} else {
				page = this.page + 1
			}
			let per_page = 10
			let status = this.currentIndex
			this.isLoading = true
			api.scoreExchangeCouponRecordList(page, per_page, status).then(
				res => {
					if (res && res.history) {
						if (isFirstPage) {
							this.items = res.history
						} else {
							this.items = this.items.concat(res.history)
						}
						this.isLoading = false
						this.isMore = res.paged.more
						this.isLoaded = true
						if (res.paged && res.paged.page) {
							this.page = parseInt(res.paged.page)
						}
					}
				},
				error => {
					this.isLoading = false
					this.isLoaded = true
				}
			)
		},

		// 解释
		touchExplain() {
			MessageBox({
				title: '',
				message: '即将到账的积分将在付款成功后</br>自动充值到总积分当中！',
				confirmButtonText: '知道了',
				confirmButtonClass: 'confirm-button-red'
			})
		},
		setCurrentItem(index) {
			if (index == this.currentIndex) {
				return
			}
			this.currentIndex = index
			this.loadFirstPageData()
		},
		/*
		 * loadMore: 无限滚动加载
		 */
		loadMore() {
			if (this.isMore && !this.isLoading) {
				this.loadMorePageData()
			}
		}
	},
	components: {
		ScoreItem,
		ScoreRecord
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #ffffff;
	height: 100%;
	display: flex;
	.ul-score {
		position: fixed;
		width: 100%;
		z-index: 100;
		.header-info {
			width: 100%;
			height: 170px;
			background: url('../../assets/image/change-icon/e2_bg@2x.png') no-repeat;
			background-size: cover;
			color: #fff;
			font-size: 18px;
			text-align: center;
			.title {
				font-size: 36px;
				padding-top: 28px;
			}
			.desc {
				margin-top: 12px;
				img {
					width: 16px;
					height: 16px;
					display: inline-block;
					vertical-align: middle;
					margin-top: -3px;
				}
			}
		}
		.tab {
			height: 50px;
			line-height: 50px;
			background: rgba(255, 255, 255, 1);
			border-top: 1px solid #e8eaed;
			border-bottom: 1px solid #e8eaed;
			ul {
				padding: 0px;
				margin: 0px;
				list-style: none;
				display: flex;
				justify-content: space-around;
				align-content: center;
				align-items: center;
				li {
					height: -webkit-fill-available;
					padding: 0px 10px;
					font-size: 14px;
					color: rgba(124, 127, 136, 1);
					border-bottom: 2px solid;
					border-bottom-color: transparent;
					&.active {
						color: $primaryColor;
						border-bottom-color: $primaryColor;
					}
				}
			}
		}
	}
	.content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		margin-top: 265px;
	}
	.list {
		margin-top: 0px;
	}
	.empty {
		padding-top: 350px;
		text-align: center;
		img {
			width: 75px;
			height: 75px;
		}
		.desc {
			margin-top: 30px;
			font-size: 18px;
			color: #a0a0a0;
		}
	}
}
.header {
	@include header;
	.right {
		font-size: 14px;
		color: #404245;
		img {
			width: 16px;
			height: 16px;
			vertical-align: middle;
			margin-right: 2px;
			margin-top: -4px;
		}
	}
}
</style>
