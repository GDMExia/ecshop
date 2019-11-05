<template>
	<div class="container">
		<mt-header class="header" fixed title="我的优惠券">
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
			<coupon-item v-for="(item, index) in items" :key="index" :item="item">
			</coupon-item>
		</base-list>
		<empty-item
			v-if="isLoaded && items.length <= 0"
			title="暂无优惠券"
			:photo="require('../../assets/image/change-icon/empty_red_packet.png')"
		>
		</empty-item>
	</div>
</template>

<script>
import { Header } from 'mint-ui'
import {
	HeaderItem,
	TopList,
	BaseList,
	EmptyItem
} from '../../components/common'
import CouponItem from './child/CouponItem'
import { ENUM } from '../../const/enum'
import { couponList } from '../../api/coupon'
export default {
	components: {
		CouponItem
	},
	data() {
		return {
			currentIndex: 0,
			tabs: [
				{
					id: 1,
					title: '未使用'
				},
				{
					id: 2,
					title: '已使用'
				},
				{
					id: 3,
					title: '已过期'
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
			if (this.currentIndex === 0) {
				status = ENUM.COUPON_STATUS.AVAILABLE
			} else if (this.currentIndex === 1) {
				status = ENUM.COUPON_STATUS.EXPIRED
			} else if (this.currentIndex === 2) {
				status = ENUM.COUPON_STATUS.USED
			}
			couponList(page, per_page, status).then(
				res => {
					if (res && res.coupons) {
						if (isFirstPage) {
							this.items = res.coupons
						} else {
							this.items = this.items.concat(res.coupons)
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

<style lang="scss" scoped>
.container {
	display: flex;
	position: relative;
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
