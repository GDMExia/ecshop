<template>
	<div class="container">
		<mt-header class="header" fixed :title="getTitle()">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<top-list class="topList" :items="items" v-on:onIndexChange="onIndexChange">
		</top-list>
		<mobile-signup v-if="currentIndex === 0"></mobile-signup>
		<email-signup v-else-if="currentIndex === 1"></email-signup>
	</div>
</template>

<script>
import {
	HeaderItem,
	CountdownButton,
	Button,
	TopList
} from '../../components/common'
import MobileSignup from './MobileSignup'
import EmailSignup from './EmailSignup'
export default {
	name: 'Signup',
	components: {
		MobileSignup,
		EmailSignup
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
	computed: {
		isFirstTab() {
			if (this.currentIndex === 0) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		getTitle() {
			if (this.isFirstTab) {
				return '快速注册'
			} else {
				return '邮箱注册'
			}
		},
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
