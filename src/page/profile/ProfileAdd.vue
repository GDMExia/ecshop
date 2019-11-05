<template>
	<div class="container">
		<mt-header class="header" fixed title="完善资料">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
			<header-item slot="right" title="跳过" v-on:onclick="onSkip">
			</header-item>
		</mt-header>
		<div class="content" ref="form">
			<form-input-item
				v-for="(item, index) in items"
				:key="index"
				class="item"
				:title="item.name"
				:default="item.value"
				:isRequired="item.is_required"
				:isShowLine="isShowLine(index)"
				:placeholder="getPlaceholder(item)"
			>
			</form-input-item>
		</div>
		<label class="tips">带“*”为必填项</label>
		<gk-button type="primary" class="button" v-on:click="onSubmit"
			>完成</gk-button
		>
	</div>
</template>

<script>
import {
	HeaderItem,
	CountdownButton,
	Button,
	FormInputItem
} from '../../components/common'
import { Toast, Indicator } from 'mint-ui'
import { ENUM } from '../../const/enum'
import * as user from '../../api/user'
export default {
	name: 'Bind',
	data() {
		return {
			items: []
		}
	},
	created() {
		Indicator.open()
		user.userProfileFields().then(
			response => {
				Indicator.close()
				if (response && response.signup_field) {
					this.items = response.signup_field
				}
			},
			error => {
				Indicator.close()
				Toast(error.errorMsg)
			}
		)
	},
	mounted() {},
	methods: {
		getPlaceholder(item) {
			return '请填写' + (item && item.name ? item.name : '')
		},
		isShowLine(index) {
			if (this.items && this.items.length) {
				if (index === this.items.length - 1) {
					return false
				}
			}
			return true
		},
		goBack() {
			this.$router.go(-1)
		},
		onSkip() {
			this.goHome()
		},
		goHome() {
			this.$router.push('/home')
		},
		onSubmit() {
			let fields = new Array()
			if (this.items && this.items.length) {
				for (let i = 0; i < this.$refs.form.children.length; i++) {
					const element = this.$refs.form.children[i]
					let fieldValue = new Object()
					fieldValue.id = this.items[i].id
					fieldValue.is_required = this.items[i].is_required
					fieldValue.value = element.__vue__.value
					if (fieldValue.is_required && !fieldValue.value) {
						Toast('请填写' + this.items[i].name)
						return
					}
					fields.push(fieldValue)
				}
				Indicator.open()
				let values = fields && fields.length ? JSON.stringify(fields) : null
				user
					.userProfileUpdate(values, ENUM.PROFILE_GENDER.UNKNOWN, null, null)
					.then(
						response => {
							Indicator.close()
							Toast('完善信息成功')
							this.goHome()
						},
						error => {
							Indicator.close()
							Toast(error.errorMsg)
						}
					)
			}
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
.content {
	margin-top: 58px;
	background-color: #fff;
}
.item {
	height: 50px;
}
.tips {
	color: #babfc6;
	font-size: 14px;
	margin-left: 20px;
	margin-right: 10px;
	margin-top: 10px;
	text-align: left;
}
.button {
	@include button;
	margin-top: 30px;
}
</style>
