<template>
	<div class="score-container">
		<div class="score-header">
			<label class="title">当前嘻格格积分余额：
				 <img style="width: 31px;height: 20px;display: inline-block;vertical-align: bottom" @click="gotoPay" src="../../../../static/payformore@2x.png" />
			</label>
			<label class="score" v-if="this.currentScore"
				>现有{{ this.currentScore }}积分</label
			>
			<label class="score" v-else>无可用积分</label>
		</div>
		<div class="score-header">
			<label class="title"><p style="color:red;display: inline-block">*</p>积分抵扣：</label>
			<label class="score" v-if="this.currentScore"
				>最多可用{{ this.maxUseScore }}积分(每积分抵扣{{ this.rule }}元)</label
			>
			<label class="score" v-else>无可用积分</label>
		</div>
		<div class="bottom-wrapper">
			<input
				:disabled="!this.currentScore"
				placeholder="在此输入积分"
				v-model="value"
				@input="onInput"
			/>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { scoreGet } from '../../../api/score'

export default {
	props: {
		default: '',
		maxUseScore: 0
	},
	data() {
		return {
			value: this.default,
			currentScore: null,
			rule: null
		}
	},
	methods: {
		...mapMutations({
			saveScoreInfo: 'saveScoreInfo',
			clearScoreInfo: 'clearScoreInfo',
		}),
      gotoPay(){
		  location.href='http://pts.suoqoo.com/nh5/#/owners/pay'
	  },
		onInput() {
			if (this.value.length == 0) {
				this.value = '';
				this.clearScoreInfo()
			} else {
				this.value = parseInt(this.value);
				if (this.value > this.currentScore) {
					this.value = this.currentScore
				}
				if (this.value > this.maxUseScore) {
					this.value = this.maxUseScore
				}
				if (this.value <= 0) {
					this.value = 0
				}
				this.saveScoreInfo(this.value)
			}
		}
	},
	created() {
		scoreGet().then(
			response => {
				this.currentScore = response.score
				this.rule = response.rule
			},
			error => {}
		)
	}
}
</script>

<style lang="scss" scoped>
.score-container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	.bottom-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		margin: 15px;
		input {
			flex: 1;
			font-size: 14px;
			color: #4e545d;
			background-color: #f7f8fa;
			padding: 10px;
			border: none;
			border-radius: 2px;
			&:focus {
				outline-style: none;
			}
		}
	}
}
.score-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 15px 0px 15px;
	.title {
		font-size: 16px;
		color: #4e545d;
	}
	.score {
		font-size: 12px;
		color: #fa800a;
	}
}
</style>
