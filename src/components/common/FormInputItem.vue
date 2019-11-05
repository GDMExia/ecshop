<template>
	<div class="content-wrapper">
		<label class="title">{{ title }}</label>
		<input
			class="value"
			:maxlength="maxlength"
			v-bind:placeholder="placeholder"
			v-bind:value="value"
			v-on:input="value = $event.target.value"
		/>
		<label v-if="isRequired" class="required">*</label>
		<div class="bottom-line" v-if="isShowLine"></div>
	</div>
</template>

<script>
export default {
	name: 'FormInputItem',
	props: {
		isRequired: {
			type: Boolean,
			default: false
		},
		title: {
			type: String
		},
		default: {
			type: String
		},
		placeholder: {
			type: String
		},
		maxlength: {
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
		},
		onchange(value) {
			this.value = value
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
	@include formInput;
	flex: 1;
	margin-left: 10px;
	margin-right: 15px;
	font-size: $form-item-value-font-size;
}
.required {
	color: #ff3c3c;
	font-size: $info-item-title-font-size;
	text-align: center;
	width: 24px;
	height: 16px;
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
