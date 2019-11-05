<template>
	<div v-if="isBack" @click="onclick" class="left-item">
		<img class="icon" src="../../assets/image/change-icon/back@2x.png" />
	</div>
	<div v-else>
		<div v-if="icon" @click="onclick" v-bind:class="itemStyle">
			<img class="icon" v-bind:src="icon" v-bind:class="{ minIcon: minIcon }" />
		</div>
		<div v-else-if="title" @click="onclick" v-bind:class="itemStyle">
			<label class="title" v-bind:style="{ color: titleColor }">{{
				title
			}}</label>
		</div>
	</div>
</template>

<script>
export default {
	name: 'header-item',
	props: {
		icon: {
			type: String
		},
		title: {
			type: String
		},
		isBack: {
			type: Boolean,
			default: false
		},
		isLeft: {
			type: Boolean,
			default: false
		},
		titleColor: {
			type: String,
			default: '#48505D'
		},
		minIcon: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		itemStyle() {
			return {
				'left-item': this.isLeft,
				'right-item': !this.isLeft
			}
		}
	},
	methods: {
		onclick() {
			this.$emit('onclick')
		}
	}
}
</script>

<style lang="scss" scoped>
.left-item {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-left: 10px;
}
.right-item {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-right: 15px;
}
.icon {
	width: 24px;
	height: 24px;
}
.minIcon {
	width: 16px;
	height: 16px;
}
.title {
	font-size: 16px;
	color: #48505d;
}
</style>
