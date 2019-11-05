<template>
	<div class="content-wrapper" @click="onclick">
		<label class="title">{{ title }}</label>
		<label class="value" v-if="value">{{ value }}</label>
		<label class="placeholder" v-else>{{ placeholder }}</label>
		<img class="indicator" src="../../assets/image/change-icon/enter@2x.png" />
		<div class="bottom-line" v-if="isShowLine"></div>
	</div>
</template>

<script>
export default {
	name: 'FormTextItem',
	props: {
		title: {
			type: String
		},
		default: {
			type: String
		},
		placeholder: {
			type: String
		},
		isShowLine: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			value: this.default
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
.content-wrapper {
	display: flex;
	position: relative;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #fff;
	padding-left: 20px;
}
.title {
	width: 90px;
	font-size: $form-item-title-font-size;
	color: $form-item-title-color;
}
.value {
	flex: 1;
	font-size: $form-item-value-font-size;
	margin-left: 10px;
	margin-right: 15px;
}
.placeholder {
	flex: 1;
	font-size: $form-item-value-font-size;
	color: $form-item-value-color;
	margin-left: 10px;
	margin-right: 15px;
}
.indicator {
	width: 7px;
	height: 12px;
	margin-left: 10px;
	margin-right: 10px;
}
.bottom-line {
	position: absolute;
	height: 1px;
	left: 20px;
	right: 0px;
	bottom: 0px;
	background-color: $line-bg-color;
}
</style>
