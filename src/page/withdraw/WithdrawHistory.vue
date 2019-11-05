<template>
	<div class="container">
		<mt-header class="header" fixed title="提现记录">
			<header-item
				slot="left"
				v-bind:isBack="true"
				v-on:onclick="goBack"
			></header-item>
		</mt-header>
		<base-list
			class="list-wrapper"
			:items="items"
			:isMore="isMore"
			:isLoaded="isLoaded"
			v-on:loadMore="loadMore"
		>
			<withdraw-item
				class="item"
				v-for="(item, index) in items"
				:key="index"
				v-on:onclick="onclick"
				:item="item"
			>
			</withdraw-item>
		</base-list>
		<empty-item
			v-if="isLoaded && items.length <= 0"
			title="暂无记录"
			:photo="require('../../assets/image/change-icon/empty_record@2x.png')"
		>
		</empty-item>
	</div>
</template>

<script>
import { HeaderItem, TopList, BaseList } from '../../components/common'
import { Indicator, Toast, MessageBox } from 'mint-ui'
import WithdrawItem from './child/WithdrawItem'
import { withdrawList, withdrawCancel } from '../../api/withdraw'
import { ENUM } from '../../const/enum'
export default {
	name: 'WithdrawHistory',
	components: {
		WithdrawItem
	},
	data() {
		return {
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
			withdrawList(page, per_page).then(
				res => {
					if (res && res.withdraws) {
						if (isFirstPage) {
							this.items = res.withdraws
						} else {
							this.items = this.items.concat(res.withdraws)
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
		onclick(item) {
			MessageBox.confirm('是否取消该提现', '确认取消').then(action => {
				if (action === 'confirm') {
					this.cancel(item)
				}
			})
		},
		cancel(item) {
			let id = item && item.id ? item.id : null
			if (id) {
				Indicator.open()
				withdrawCancel(id).then(
					res => {
						Indicator.close()
						this.loadFirstPageData()
					},
					error => {
						Indicator.close()
						Toast(error.errorMsg)
					}
				)
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
.list-wrapper {
	margin-top: 44px;
	background-color: $mainbgColor;
}
.item {
	margin-top: 8px;
}
</style>
