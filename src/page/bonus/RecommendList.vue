<template>
	<div class="container">
		<mt-header class="header" fixed title="我推荐的会员">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<table class="table" v-if="items.length > 0">
			<thead>
				<tr>
					<th style="width:25%">等级</th>
					<th style="width:25%">人数</th>
					<th style="width:25%">积分分成</th>
					<th style="width:25%">现金分成</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-bind:style="getRowStyle(index)"
					v-for="(rule, index) in items"
					:key="index"
				>
					<td>{{ rule.rank }}</td>
					<td>{{ rule.recommend_amount }}</td>
					<td>{{ rule.score_percentage }}</td>
					<td>{{ rule.price_percentage }}</td>
				</tr>
			</tbody>
		</table>
		<empty-item
			v-if="isLoaded && items.length <= 0"
			title="暂无推荐"
			:photo="require('../../assets/image/change-icon/empty_recommend@2x.png')"
		>
		</empty-item>
	</div>
</template>

<script>
import { HeaderItem, EmptyItem } from '../../components/common'
import { Header } from 'mint-ui'
import { recommendBonusInfo } from '../../api/recommend'
export default {
	name: 'RecommendList',
	data() {
		return {
			isLoaded: false,
			items: []
		}
	},
	computed: {},
	created() {
		this.loadItemData()
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		getRowStyle(index) {
			let color = '#FFFFFF'
			if ((index + 1) % 2 == 0) {
				color = '#FFF2E5'
			}
			return {
				'background-color': color
			}
		},
		loadItemData() {
			recommendBonusInfo().then(
				res => {
					if (res && res.bonus_info) {
						this.items = res.bonus_info.rules
					}
				},
				error => {}
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
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
.table {
	margin-top: 44px;
	width: 100%;
	border-collapse: collapse;
	tr {
		th {
			background-color: #e8eaed;
			color: #999999;
			font-size: 12px;
			height: 30px;
		}
	}
	tr {
		td {
			height: 40px;
			text-align: center;
			color: #333333;
			font-size: 14px;
			border: 1px solid $lineColor;
		}
	}
}
</style>
