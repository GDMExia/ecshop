<template>
	<div class="container">
		<mt-header class="header" fixed title="资金明细">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<top-list class="topList" :items="tabs" v-on:onIndexChange="onIndexChange">
		</top-list>
		<base-list
			class="list-wrapper"
			:items="items"
			:isMore="isMore"
			:isLoaded="isLoaded"
			v-on:loadMore="loadMore"
		>
			<balance-item v-for="(item, index) in items" :key="index" :item="item">
			</balance-item>
		</base-list>
		<empty-item
			v-if="isLoaded && items.length <= 0"
			title="暂无明细"
			:photo="require('../../assets/image/change-icon/empty_coins@2x.png')"
		>
		</empty-item>
	</div>
</template>

<script>
import { HeaderItem, TopList, BaseList } from '../../components/common'
import { Indicator, Toast } from 'mint-ui'
import BalanceItem from './child/BalanceItem'
import { balanceList } from '../../api/balance'
import { ENUM } from '../../const/enum'
export default {
	name: 'BalanceHistory',
	components: {
		BalanceItem
	},
	data() {
		return {
			balance: 0,
			currentIndex: 0,
			tabs: [
				{
					id: 1,
					title: '全部'
				},
				{
					id: 2,
					title: '收入'
				},
				{
					id: 3,
					title: '支出'
				}
			],
			isLoaded: false,
			page: 1,
			items: [],
			isMore: 0
		}
	},
	created() {
		this.loadFirstPageData()
	},
	methods: {
		goBack() {
			this.$router.go(-1)
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
			let status = null
			if (this.currentIndex === 1) {
				status = ENUM.BALANCE_STATUS.INCOME
			} else if (this.currentIndex === 2) {
				status = ENUM.BALANCE_STATUS.EXPENDITURE
			}
			balanceList(status, page, per_page).then(
				res => {
					if (res && res.balances) {
						if (isFirstPage) {
							this.items = res.balances
						} else {
							this.items = this.items.concat(res.balances)
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
		onIndexChange(index) {
			this.currentIndex = index
			this.loadFirstPageData()
		},
		loadMore() {
			if (this.isMore) {
				this.loadMorePageData()
			}
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	height: 100%;
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.topList {
	position: fixed;
	width: 100%;
	margin-top: 44px;
	height: 40px;
	z-index: 100;
}
.list-wrapper {
	margin-top: 92px;
}
</style>
