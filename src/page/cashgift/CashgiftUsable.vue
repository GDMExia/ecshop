<template>
	<div class="container">
		<mt-header class="header" fixed title="我的红包">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div class="empty-wrapper" v-if="isEmpty">
			<img
				class="photo"
				src="../../assets/image/change-icon/empty_red_packet.png"
			/>
			<label class="title">暂无红包</label>
		</div>
		<div
			class="list"
			v-if="!isEmpty"
			v-infinite-scroll="loadMore"
			infinite-scroll-distance="10"
		>
			<cashgift-item
				v-for="item in items"
				:key="item.id"
				:item="item"
				:isSelected="isSelected(item)"
				v-on:onclick="onclick(item)"
			>
			</cashgift-item>
		</div>
		<div class="submit" v-if="!isEmpty" @click="unselect">
			<label class="text">不使用红包</label>
		</div>
	</div>
</template>

<script>
import { Header } from 'mint-ui'
import { HeaderItem } from '../../components/common'
import CashgiftItem from './child/CashgiftItem'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
	components: {
		CashgiftItem
	},
	computed: {
		...mapState({
			total: state => state.cashgift.total,
			items: state => state.cashgift.items,
			isMore: state => state.cashgift.isMore,
			selectedItem: state => state.cashgift.selectedItem
		}),
		isEmpty: function() {
			if (this.items && this.items.length === 0) {
				return true
			}
			return false
		}
	},
	created() {
		this.loadFirstPage()
	},
	methods: {
		...mapMutations({
			selectCashgiftItem: 'selectCashgiftItem',
			unselectCashgiftItem: 'unselectCashgiftItem'
		}),
		...mapActions({
			fetchCashgiftUsable: 'fetchCashgiftUsable'
		}),
		goBack() {
			this.$router.go(-1)
		},
		isSelected(item) {
			let selectedItem = this.selectedItem
			if (selectedItem && item && selectedItem.id === item.id) {
				return true
			}
			return false
		},
		onclick(item) {
			this.selectCashgiftItem(item)
			this.goBack()
		},
		unselect() {
			this.unselectCashgiftItem()
			this.goBack()
		},
		loadFirstPage() {
			this.fetchCashgiftList(true)
		},
		loadMore() {
			if (this.isMore) {
				this.fetchCashgiftList(false)
			}
		},
		// 可使用的优惠券列表
		fetchCashgiftList(isFirstPage) {
			let shop = this.$route.query.shop
			let total_price = this.$route.query.total_price
			this.fetchCashgiftUsable({
				isFirstPage: isFirstPage,
				shop: shop,
				total_price: total_price
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
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
.list {
	padding-bottom: 54px;
	margin-top: 44px;
}
.submit {
	position: fixed;
	height: 44px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}
.text {
	color: #4e545d;
	font-size: 16px;
}
.empty-wrapper {
	margin-top: 40px;
	height: 260px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
}
.photo {
	width: 112px;
	height: 112px;
}
.title {
	font-size: 16px;
	color: #8f8e94;
	text-align: center;
	margin-top: 30px;
}
</style>
