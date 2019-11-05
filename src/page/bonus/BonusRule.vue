<template>
	<div class="container">
		<mt-header class="header" fixed title="分成规则">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<p class="content-wrapper" v-html="getHtml"></p>
	</div>
</template>

<script>
import { HeaderItem } from '../../components/common'
import { Header } from 'mint-ui'
export default {
	name: 'BonusRule',
	data() {
		return {
			html: ''
		}
	},
	computed: {
		getHtml: function() {
			let html = this.$route.params.html
			return html
		}
	},
	methods: {
		goBack() {
			this.$router.go(-1)
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
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.content-wrapper {
	margin-top: 44px;
	padding: 10px;
}
</style>
