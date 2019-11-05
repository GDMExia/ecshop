<template>
	<mt-swipe v-bind:style="getBannerStyle" :showIndicators="isShowIndicators">
		<mt-swipe-item v-for="(item, index) in items" :key="index">
			<img
				v-bind:style="getBannerStyle"
				v-bind:src="item.photo.large"
				v-if="item.photo"
				@click="bannerClick(item)"
			/>
			<img
				v-bind:style="getBannerStyle"
				src="../../../assets/image/change-icon/default_image_02@2x.png"
				v-else
			/>
		</mt-swipe-item>
	</mt-swipe>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import { openLink } from '../../cardpage/deeplink'

export default {
	name: 'HomeBanner',
	data() {
		return {}
	},
	props: ['items'],
	mounted() {},
	created: function() {},
	computed: {
		getBannerStyle: function() {
			const { width, height } = window.screen
			let itemWidth = width
			let itemHeight = width * (94.0 / 188.0)
			return {
				width: itemWidth + 'px',
				height: itemHeight + 'px'
			}
		},
		isShowIndicators() {
			if (this.items && this.items.length > 1) {
				return true
			}
			return false
		}
	},
	methods: {
		bannerClick(item) {
			let link = item.link
			if (link && link.length) {
				openLink(this.$router, link)
			}
		}
	}
}
</script>

<style lang="scss">
.mint-swipe-indicators {
	div.mint-swipe-indicator {
		background: #efeff4;
		opacity: 1;
		&.is-active {
			background: $primaryColor;
		}
	}
}
</style>
