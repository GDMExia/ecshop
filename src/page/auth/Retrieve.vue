<template>
	<div class="container">
		<mt-header class="header" fixed title="密码找回">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<top-list class="topList" :items="items" v-on:onIndexChange="onIndexChange">
		</top-list>
		<mobile-retrieve v-if="currentIndex === 0"></mobile-retrieve>
		<email-retrieve v-else-if="currentIndex === 1"></email-retrieve>
	</div>
</template>

<script>
import {
	HeaderItem,
	CountdownButton,
	Button,
	TopList
} from '../../components/common'
import MobileRetrieve from './MobileRetrieve'
import EmailRetrieve from './EmailRetrieve'
export default {
	name: 'Retrieve',
	components: {
		MobileRetrieve,
		EmailRetrieve
	},
	data() {
		return {
			currentIndex: 0,
			items: [
				{
					id: 1,
					title: '手机号'
				},
				{
					id: 2,
					title: '邮箱'
				}
			]
		}
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		onIndexChange(index) {
			this.currentIndex = index
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: $mainbgColor;
}
.header {
	@include header;
}
.topList {
	margin-top: 44px;
	height: 40px;
	border-top: 1px solid #e8eaed;
	border-bottom: 1px solid #e8eaed;
}
</style>
