<template>
	<div class="container" @click="onclick">
		<label class="title">{{ title }}</label>
		<label class="tips" v-if="isShowTips">{{ tips }}</label>
		<label class="subtitle">{{ subtitle }}</label>
		<img
			class="indicator"
			src="../../../assets/image/change-icon/enter@2x.png"
		/>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String
		},
		subtitle: {
			type: String
		},
		tips: {
			type: String
		}
	},
	computed: {
		isShowTips: function() {
			if (this.tips && this.tips.length) {
				return true
			}
			return false
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
.container {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #fff;
}
.title {
	width: auto;
	font-size: 16px;
	color: #4e545d;
	margin-left: 15px;
}
.tips {
	width: auto;
	font-size: 10px;
	color: $primaryColor;
	margin-left: 10px;
	border: 1px solid $primaryColor;
	border-radius: 2px;
	padding-left: 5px;
	padding-right: 5px;
}
.subtitle {
	flex: 1;
	margin-left: 20px;
	color: #7c7f88;
	font-size: 13px;
	text-align: right;
}
.indicator {
	width: 7px;
	height: 12px;
	margin-left: 10px;
	margin-right: 10px;
}
</style>
