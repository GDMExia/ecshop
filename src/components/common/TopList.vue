<template>
	<div class="list">
		<div
			class="item"
			v-for="(item, index) in items"
			:key="index"
			v-on:click="onClickItem(index)"
		>
			<label
				class="title"
				v-bind:class="{
					active: index === currentIndex,
					normal: index !== currentIndex
				}"
				>{{ getTitle(item) }}</label
			>
			<div class="line" v-if="isShowLine(index)"></div>
		</div>
	</div>
</template>

<script>
import TopItem from './TopItem'
export default {
	name: 'TopList',
	components: {
		TopItem
	},
	props: {
		items: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			currentIndex: 0,
			currentItem: this.items && this.items.length ? this.items[0] : null
		}
	},
	methods: {
		getTitle(item) {
			return item ? item.title : ''
		},
		isShowLine(index) {
			return index === this.currentIndex ? true : false
		},
		onClickItem(index) {
			if (this.currentIndex !== index) {
				this.currentIndex = index
				this.$emit('onIndexChange', index)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.list {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
	align-items: stretch;
	background-color: #fff;
}
.item {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.title {
	text-align: center;
	font-size: 14px;
	color: #404245;
}
.active {
	color: $primaryColor;
}
.normal {
	color: #404245;
}
.line {
	position: absolute;
	left: 50px;
	right: 50px;
	bottom: 0px;
	height: 2px;
	background-color: $primaryColor;
}
</style>
