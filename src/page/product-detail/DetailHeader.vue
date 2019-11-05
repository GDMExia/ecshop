<!-- DetailHeader.vue -->
<template>
	<div class="ui-detail-header">
		<img
			src="../../assets/image/change-icon/back@2x.png"
			v-on:click="goBack()"
		/>
		<div class="navbar-wrapper">
			<div
				v-for="(item, key) in data"
				:key="key"
				v-bind:class="{ navbar_active: key == index }"
				v-on:click="changeEvent(key)"
			>
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script>
import { header } from './static'
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {
			data: header
		}
	},

	computed: {
		...mapState({
			index: state => state.detail.index
		})
	},

	created() {},

	methods: {
		...mapMutations({
			changeIndex: 'changeIndex'
		}),

		changeEvent(index) {
			this.changeIndex(index)
		},

		goBack() {
			this.$router.go(-1)
		}
	}
}
</script>

<style lang="scss">
.ui-detail-header {
	padding: 0px 9px;
	// height:64px;
	background: rgba(255, 255, 255, 1);
	border-bottom: 1px solid rgba(232, 234, 237, 1);
	color: #55595f;
	font-size: 17px;
	width: auto;
	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
	flex-basis: auto;
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	img {
		width: 24px;
		height: 24px;
		cursor: pointer;
		position: absolute;
		left: 9px;
		top: 10px;
	}
	div.navbar-wrapper {
		line-height: 42px;
		div {
			// line-height: 42px;
			border-bottom: 0px;
			display: inline-block;
			margin-right: 48px;
			color: #55595f;
			background-color: #fff;
			&.navbar_active {
				color: $primaryColor;
				border-bottom: 2px solid $primaryColor;
			}
			&:last-child {
				margin-right: 0px;
			}
			&:focus {
				outline: none;
			}
		}
	}
}
</style>
