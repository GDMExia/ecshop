<!-- SearchHeader.vue -->
<template>
	<div class="ui-search-header">
		<form v-on:submit.prevent="search($event, keywords)" action="#">
			<div>
				<input
					type="search"
					placeholder="请输入您要搜索的商品"
					v-model="keywords"
				/>
				<img
					src="../../../assets/image/change-icon/e2_delete@2x.png"
					@click="clear()"
					v-if="keywords.length > 0"
				/>
			</div>
			<span v-on:click="cancel()">取消</span>
		</form>
	</div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {
			keywords: this.keyword ? this.keyword : '',
			currenKeywords: this.utils.fetch('keyword')
		}
	},
	props: ['keyword'],
	methods: {
		...mapMutations({
			changeKey: 'changeKey'
		}),
		// 分类列表进入到搜索，完成后跳转到商品列表页面
		search(e, value) {
			if (value.replace(/\s+/g, '').length <= 0) {
				Toast('请输入您要搜索的关键字')
				return false
			} else {
				this.keywords = value
			}
			if (value) {
				this.currenKeywords.push(value)
				let data = this.utils.arrayFilter(this.currenKeywords)
				this.utils.save('keyword', data)
			}
			this.$router.push({
				name: 'products',
				query: { keywords: this.keywords }
			})
			if (e) {
				this.utils.stopPrevent(e)
			}
		},

		// 取消返回上一级
		cancel() {
			this.clear()
			let isFromHome = this.$route.params.isFromHome
			if (isFromHome) {
				this.$router.go(-1)
			} else {
				this.$router.push({ name: 'category' })
			}
		},

		clear() {
			this.keywords = ''
			this.changeKey(this.keywords)
		}
	}
}
</script>

<style scoped lang="scss">
.ui-search-header {
	form {
		display: flex;
		justify-content: space-between;
		align-content: center;
		align-items: center;
		background-color: #ffffff;
		padding: 6px 14px;
		div {
			flex-basis: 80%;
			position: relative;
			background-color: #e9ecf0;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			border-radius: 16px;
			height: 32px;
			input {
				display: flex;
				flex: 1;
				background-color: rgba(0, 0, 0, 0);
				font-size: 14px;
				padding: 9px 10px 9px 15px;
				border: 0px;
				&:focus {
					outline: none;
					outline-offset: 0px;
				}
			}
			img {
				width: 16px;
				height: 16px;
				margin-right: 8px;
				cursor: pointer;
			}
		}
		span {
			font-size: 15px;
			color: #4e545d;
		}
	}
}
</style>
