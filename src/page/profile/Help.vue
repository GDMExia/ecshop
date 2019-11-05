<template>
	<div class="container">
		<!-- header -->
		<mt-header fixed class="header" :title="getTitle">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack()">
			</header-item>
		</mt-header>
		<!-- body -->
		<base-list
			class="list-wrapper"
			:items="items"
			:isMore="isMore"
			:isLoaded="isLoaded"
			isHideMore
			v-on:loadMore="loadMore"
		>
			<help-item
				v-for="(item, index) in items"
				:key="index"
				v-on:onclick="getHelpInfo(item)"
				class="section-footer"
				:icon="require('../../assets/image/change-icon/e9_doc.png')"
				:title="item.title"
				:url="item.url"
			>
			</help-item>
		</base-list>
	</div>
</template>

<script>
import { HeaderItem, BaseList } from '../../components/common'
import { Header } from 'mint-ui'
import HelpItem from '../profile/child/HelpItem'
import { articleList } from '../../api/article' //文章列表
export default {
	data() {
		return {
			isLoaded: false,
			page: 1,
			items: [],
			isMore: 0
		}
	},
	computed: {
		getTitle() {
			return this.$route.query.title ? this.$route.query.title : '使用帮助'
		}
	},
	components: {
		HelpItem
	},
	mounted() {
		this.loadFirstPageData()
	},
	beforeRouteUpdate(to, from, next) {
		next()
		this.loadFirstPageData()
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		// 获取文章列表数据
		getArticleList() {
			let id = this.$route.query.id ? this.$route.query.id : 0
			let title = this.$route.query.title
			articleList(id, 1, 10).then(res => {
				if (res) {
					this.items = res.articles
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
			let id = this.$route.query.id ? this.$route.query.id : 0
			let page = 1
			if (isFirstPage) {
				page = 1
			} else {
				page = this.page + 1
			}
			let per_page = 10
			articleList(id, page, per_page).then(
				res => {
					if (res && res.articles) {
						if (isFirstPage) {
							this.items = res.articles
						} else {
							this.items = this.items.concat(res.articles)
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
		getHelpInfo(item) {
			let url = item.url
			let title = item.title
			if (url && url.length) {
				this.$router.push({
					name: 'webPage',
					query: { url: url, title: title }
				})
			} else {
				this.$router.push({
					name: 'help',
					query: { id: item.id, title: title }
				})
			}
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
	height: 100%;
	.header {
		@include header;
		border-bottom: 1px solid #e8eaed;
	}
	.list-wrapper {
		margin-top: 44px;
	}
}
</style>
