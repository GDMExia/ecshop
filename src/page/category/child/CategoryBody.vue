<!-- CategoryBody.vue -->
<template>
	<div class="ui-category-body">
		<div class="category-flex">
			<div class="category-sidebar">
				<ul>
					<li
						class="item"
						v-for="item in items"
						v-bind:key="item.id"
						v-on:click="onItemClick(item)"
						v-bind:class="{
							sidbaractive: currentItem && item.id == currentItem.id,
							noActive: currentItem && item.id != currentItem.id
						}"
					>
						<a>{{ item.name }}</a>
					</li>
				</ul>
			</div>
			<div class="category-content" v-if="currentItem && currentItem.more">
				<ul>
					<li class="item" v-on:click="goProduct(currentItem.id)">
						<a>全部</a>
					</li>
					<li
						class="item"
						v-for="item in currentItem.categories"
						v-bind:key="item.id"
						v-on:click="goProduct(item.id)"
					>
						<a>{{ item.name }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
	computed: {
		...mapState({
			items: state => state.category.items,
			currentItem: state => state.category.currentItem
		})
	},
	created() {
		this.getCategoryList()
	},
	methods: {
		...mapMutations({
			saveCurrentCategoryItem: 'saveCurrentCategoryItem'
		}),
		...mapActions({
			fetchCategoryList: 'fetchCategoryList'
		}),
		getCategoryList() {
			if (!(this.items && this.items.length)) {
				Indicator.open()
			}
			this.fetchCategoryList({ shop: null, category: null }).then(
				response => {
					Indicator.close()
				},
				error => {
					Toast(error.errorMsg)
					Indicator.close()
				}
			)
		},
		onItemClick(item) {
			this.saveCurrentCategoryItem(item)
		},
		goProduct(id) {
			let params = { category: id }
			this.$router.push({ name: 'products', query: params })
		}
	}
}
</script>

<style scoped lang="scss">
.ui-category-body {
	@include pd(44px, 50px, 0px, 0px);
	width: 100%;
	.category-flex {
		display: flex;
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		width: 100%;
		position: absolute;
		bottom: 0px;
		width: 100%;
		top: 0px;
		.category-sidebar {
			flex-basis: 140px;
			background-color: $mainbgColor;
			overflow-y: scroll;
			ul {
				border-right: 0.5px solid #e8eaed;
				li {
					display: block;
					padding: 19px 11px;
					a {
						color: #4e545d;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						font-size: 15px;
						text-align: center;
					}
				}
				li.noActive {
					background-color: $mainbgColor;
					border-left: 2px solid transparent;
					a {
						color: #4e545d;
					}
				}
				li.sidbaractive {
					background-color: #ffffff;
					border-left: 2px solid $primaryColor;
					a {
						color: $primaryColor;
					}
				}
			}
		}
		.category-content {
			width: 100%;
			background-color: #fff;
			overflow: auto;
			ul {
				height: 100%;
				li {
					display: block;
					padding: 19px 0px;
					text-align: center;
					cursor: pointer;
					border-bottom: 0.5px solid rgb(232, 234, 237);
					a {
						color: #4e545d;
						font-size: 15px;
						text-align: center;
					}
				}
			}
		}
	}
}
</style>
