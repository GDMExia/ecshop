<template>
	<div class="container">
		<mt-header class="header" fixed title="我的推荐">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
			<!-- <header-item slot="right" title="推荐分成" v-on:onclick="recommend"></header-item>		 -->
		</mt-header>
		<div class="info-wrapper">
			<div class="top-wrapper">
				<div class="column-wrapper left-item">
					<label class="title">已推荐</label>
					<label class="value">{{ getRecommendAmount }}</label>
				</div>
				<div class="vertical-line"></div>
				<div class="column-wrapper right-item">
					<label class="title">已分成</label>
					<label class="value">{{ getBonusAmount }}</label>
				</div>
				<div class="rule-wrapper" @click="goBonusRule">
					<label class="desc">分成规则</label>
					<img
						class="icon"
						src="../../assets/image/change-icon/f9_enter_w@2x.png"
					/>
				</div>
				<div class="bottom-line"></div>
			</div>
			<div class="bottom-wrapper">
				<div class="row-wrapper" @click="goBalance">
					<label class="row-title">可用资金</label>
					<img
						class="indicator"
						src="../../assets/image/change-icon/f9_enter_w@2x.png"
					/>
				</div>
				<div class="row-line"></div>
				<div class="row-wrapper" @click="goRecommend">
					<label class="row-title">我推荐的会员</label>
					<img
						class="indicator"
						src="../../assets/image/change-icon/f9_enter_w@2x.png"
					/>
				</div>
			</div>
		</div>
		<div class="content-wrapper">
			<base-list
				class="list-wrapper"
				:items="items"
				:isMore="isMore"
				:isLoaded="isLoaded"
				v-on:loadMore="loadMore"
			>
				<bonus-item
					class="item"
					v-for="(item, index) in items"
					:key="index"
					:item="item"
				>
				</bonus-item>
			</base-list>
			<empty-item
				v-if="isLoaded && items.length <= 0"
				title="暂无推荐订单"
				:photo="require('../../assets/image/change-icon/empty_order@2x.png')"
			>
			</empty-item>
		</div>
	</div>
</template>

<script>
import {
	HeaderItem,
	Button,
	BaseList,
	EmptyItem
} from '../../components/common'
import { recommendBonusList, recommendBonusInfo } from '../../api/recommend'
import { Indicator, Toast } from 'mint-ui'
import BonusItem from './child/BonusItem'
export default {
	name: 'BonusList',
	components: {
		BonusItem
	},
	data() {
		return {
			item: null,
			isLoaded: false,
			page: 1,
			items: [],
			isMore: 0
		}
	},
	created() {
		this.loadItemData()
		this.loadFirstPageData()
	},
	computed: {
		getRecommendAmount() {
			return this.item && this.item.recommend_amount
				? this.item.recommend_amount
				: 0
		},
		getBonusAmount() {
			return this.item && this.item.bonus_amount ? this.item.bonus_amount : 0
		}
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		recommend() {},
		loadItemData() {
			recommendBonusInfo().then(
				res => {
					if (res && res.bonus_info) {
						this.item = res.bonus_info
					}
				},
				error => {}
			)
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
			recommendBonusList(page, per_page).then(
				res => {
					if (res && res.bonues) {
						if (isFirstPage) {
							this.items = res.bonues
						} else {
							this.items = this.items.concat(res.bonues)
						}
						this.isMore = res.paged.more
						this.isLoaded = true
						if (res.paged && res.paged.page) {
							this.page = parseInt(res.paged.page)
						}
					}
				},
				error => {}
			)
		},
		loadMore() {
			if (this.isMore) {
				this.loadMorePageData()
			}
		},
		goBalance() {
			this.$router.push({ name: 'balanceUsable' })
		},
		goRecommend() {
			this.$router.push({ name: 'recommendList' })
		},
		goBonusRule() {
			let rule = this.item && this.item.rule_desc ? this.item.rule_desc : ''
			this.$router.push({ name: 'bonusRule', params: { html: rule } })
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
	height: 100%;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.info-wrapper {
	margin-top: 44px;
	height: 140px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $primaryColor;
}
.top-wrapper {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
}
.column-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.vertical-line {
	width: 1px;
	background-color: #fff;
	opacity: 0.2;
	margin-top: 20px;
	margin-bottom: 20px;
}
.rule-wrapper {
	position: absolute;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 90px;
	height: 26px;
	top: 15px;
	right: 0px;
	background-color: #ff994a;
	border-top-left-radius: 13px;
	border-bottom-left-radius: 13px;
}
.left-item {
	flex: 1;
}
.right-item {
	flex: 3;
}
.icon {
	width: 12px;
	height: 12px;
	margin-left: 5px;
}
.indicator {
	width: 12px;
	height: 12px;
	margin-right: 15px;
}
.desc {
	color: #ffffff;
	font-size: 12px;
}
.title {
	color: #ffffff;
	font-size: 14px;
	margin-top: 20px;
	margin-left: 14px;
	opacity: 0.5;
}
.value {
	color: #ffffff;
	font-size: 34px;
	margin-top: 5px;
	margin-left: 14px;
}
.bottom-wrapper {
	height: 44px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
}
.bottom-line {
	position: absolute;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 1px;
	background-color: #fff;
	opacity: 0.2;
}
.row-wrapper {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.row-title {
	color: #ffffff;
	font-size: 16px;
	margin-left: 14px;
}
.row-line {
	width: 1px;
	background-color: #fff;
	opacity: 0.2;
}
.content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.list-wrapper {
	margin-top: 0px;
}
.item {
	margin-top: 8px;
}
.empty-item {
	margin-top: 140px;
}
</style>
