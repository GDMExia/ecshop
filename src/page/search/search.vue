<template>
	<div class="search-wrapper">
		<search-header ref="header" :keyword="keywords"></search-header>
		<div class="search-body">
			<div class="list current-search" v-if="currenKeywords.length > 0">
				<div class="list-header">
					<span>最近搜索</span>
					<img
						src="../../assets/image/change-icon/b1_delete@2x.png"
						v-on:click="deleteCurrent()"
					/>
				</div>
				<ul>
					<li
						class="item"
						v-for="(item, index) in currenKeywords"
						v-on:click="getKey(item)"
						:key="index"
					>
						{{ item }}
					</li>
				</ul>
			</div>

			<div class="list hot-wrapper">
				<div class="list-header"><span>热门搜索</span></div>
				<ul>
					<li
						class="item"
						v-for="(item, index) in hotKeywords"
						:key="index"
						v-on:click="getKey(item)"
					>
						{{ item.content }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import searchHeader from './child/SearchHeader'

export default {
	data() {
		return {
			currenKeywords: [],
			keywords: this.$store.state.search.currentKey
				? this.$store.state.search.currentKey
				: ''
		}
	},
	components: {
		searchHeader
	},
	computed: {
		...mapState({
			currentKey: state => state.search.currentKey,
			hotKeywords: state => state.search.hotKeywords,
		})
	},
	created() {
		this.fetchSearchKeywordList()
		this.getCurrentKey()
	},

	methods: {
		...mapMutations({
			changeKey: 'changeKey'
		}),
		...mapActions({
			fetchSearchKeywordList: 'fetchSearchKeywordList',
		}),

		getKey(item) {
			if (item.content) {
				this.keywords = item.content
			} else {
				this.keywords = item
			}
			this.changeKey(this.keywords)
			this.$refs.header.search(null, this.keywords)
		},

		deleteCurrent() {
			this.utils.save('keyword', [])
			this.currenKeywords = this.utils.fetch('keyword')
		},

		getCurrentKey() {
			this.currenKeywords = this.utils.fetch('keyword')
		}
	}
}
</script>

<style lang="scss" scoped>
.search-wrapper {
	height: auto;
	width: auto;
	background-color: $mainbgColor;
	.search-body {
		padding: 15px;
		div.list {
			margin-bottom: 30px;
			.list-header {
				display: flex;
				justify-content: space-between;
				align-content: center;
				align-items: center;
				span {
					color: #4e545d;
					font-size: 14px;
					font-family: 'PingFangSC';
					background: url('../../assets/image/change-icon/b1_history@2x.png')
						no-repeat left center;
					background-size: 16px;
					padding-left: 25px;
					align-self: flex-end;
				}
				img {
					width: 24px;
					height: 24px;
					cursor: pointer;
				}
			}
			ul {
				display: flex;
				padding-top: 13px;
				flex-wrap: wrap;
				li {
					padding: 8px;
					background-color: #fff;
					color: #333333;
					font-size: 12px;
					font-family: 'PingFangSC';
					margin-right: 16px;
					margin-bottom: 16px;
					cursor: pointer;
				}
			}
		}
		div.hot-wrapper {
			.list-header {
				span {
					background: url('../../assets/image/change-icon/b1_hot@2x.png')
						no-repeat left center;
					background-size: 16px;
				}
			}
		}
	}
}
</style>
