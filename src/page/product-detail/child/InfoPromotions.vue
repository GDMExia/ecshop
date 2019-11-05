<!-- promotions.vue -->

<template>
	<div
		class="ui-promotions-wrapper ui-detail-common"
		v-if="detailInfo && detailInfo.promos && detailInfo.promos.length > 0"
	>
		<!-- header -->
		<div class="promotions-header header" v-on:click="openPopup()">
			<h3>促销信息</h3>
			<img src="../../../assets/image/change-icon/enter@2x.png" />
		</div>
		<!-- 展示促销信息 -->
		<div class="promotions-body">
			<div
				class="body-list"
				v-for="(item, index) in detailInfo.promos"
				:key="index"
			>
				<img src="../../../assets/image/change-icon/c0_sale@2x.png" />
				<span>{{ item.promo }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {}
	},

	computed: {
		...mapState({
			detailInfo: state => state.detail.detailInfo
		})
	},

	methods: {
		...mapMutations({
			changePopstatus: 'changePopstatus'
		}),

		/*
				openPopup:
			*/
		openPopup() {
			// this.changePopstatus(true);
			this.$router.push({ name: 'discount' })
		}
	}
}
</script>

<style lang="scss" scoped>
.ui-promotions-wrapper {
	height: auto;
	&.ui-detail-common {
		padding: 0px;
	}
	.promotions-header {
		padding: 0px 15px;
		height: 50px;
		h3 {
			font-size: 16px;
			color: #333333;
		}
		img {
			width: 5px;
			height: 10px;
		}
	}
	.promotions-body {
		background: #ffffff;
		.body-list {
			border-top: 0.5px solid #e8eaed;
			padding: 0px 15px;
			height: 44px;
			display: flex;
			flex-direction: row;
			align-items: center;
			img {
				width: 15px;
				height: 15px;
			}
			span {
				font-size: 14px;
				color: #999999;
				margin-left: 10px;
			}
		}
	}
}
</style>
