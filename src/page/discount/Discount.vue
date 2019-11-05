<template>
	<div>
		<mt-header class="header" title="优惠活动">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10"
			class="discount-body"
		>
			<discount-body
				v-for="(item, index) in activitiesList"
				:index="index"
				:item="item"
				:key="index"
			></discount-body>
			<div class="wrapper-list-empty" v-if="activitiesList && activitiesList.length <= 0">
				<div>
					<img src="../../assets/image/change-icon/empty_active@2x.png" />
					<p>暂无优惠活动</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Header } from 'mint-ui'
import { HeaderItem } from '../../components/common'
import DiscountBody from './child/DiscountBody'

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
	components: {
		DiscountBody
	},
	computed: {
		...mapState({
			activitiesList: state => state.discount.activitiesList
		})
	},
	created() {
		this.fetchActivityList()
	},
	methods: {
		...mapActions({
			fetchActivityList: 'fetchActivityList'
		}),
		goBack() {
			this.$router.go(-1)
		}
	}
}
</script>

<style lang="scss" scoped>
.header {
	@include header;
	background-color: #ffffff;
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	border-bottom: 1px solid $lineColor;
}
.discount-body {
	position: absolute;
	top: 44px;
	bottom: 0px;
	overflow-y: auto;
	width: 100%;
}
.wrapper-list-empty {
	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
	padding-top: 40%;
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		img {
			width: 75px;
			height: 75px;
		}
		p {
			margin-top: 27px;
			text-align: center;
			color: #a4aab3;
		}
	}
}
</style>
