<template>
	<div class="container">
		<mt-header class="header" fixed :title="getTitle">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<form-input-item
			ref="name"
			class="item section"
			title="收件人姓名"
			maxlength="15"
			:default="getName"
			placeholder="请如实填写收货人姓名"
		>
		</form-input-item>
		<form-input-item
			ref="mobile"
			class="item"
			title="手机号码"
			maxlength="11"
			:default="getMobile"
			placeholder="请如实填写手机号码"
		>
		</form-input-item>
		<form-text-item
			ref="region"
			class="item"
			title="所在地区"
			:default="getRegion"
			placeholder="市，区，街"
			v-on:onclick="onRegion"
		>
		</form-text-item>
		<form-input-item
			ref="address"
			class="item"
			title="详细地址"
			:default="getAddress"
			placeholder="请填写详细地址"
		>
		</form-input-item>
		<form-input-item
			ref="zipCode"
			class="item"
			title="邮政编码"
			:default="getZipcode"
			placeholder="请填写正确的邮政编码"
		>
		</form-input-item>
		<gk-button class="button" type="primary" v-on:click="submit">{{
			getSumitTitle
		}}</gk-button>
		<region-picker
			ref="picker"
			:items="regions"
			v-on:onConfirm="onPickerConfirm"
		>
		</region-picker>
	</div>
</template>

<script>
import {
	HeaderItem,
	FormInputItem,
	FormTextItem,
	Button
} from '../../components/common'
import { Header, Toast, Indicator } from 'mint-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import * as consignee from '../../api/consignee'
import RegionPicker from './RegionPicker'
export default {
	components: {
		RegionPicker,
		picker: ''
	},
	data() {
		return {
			templeRegion: null
		}
	},
	created: function() {
		this.fetchRegions()
		// this.isCitynNumber();
	},
	computed: {
		...mapState({
			regions: state => state.region.items
		}),
		isAddMode() {
			let mode = this.$route.query.mode
			// add: 添加地址，edit: 编辑地址
			if (mode === 'add') {
				return true
			} else {
				return false
			}
		},
		getTitle() {
			if (this.isAddMode) {
				return '新增地址'
			} else {
				return '修改收货地址'
			}
		},
		getName() {
			if (!this.isAddMode && this.getItem) {
				return this.getItem.name
			} else {
				return null
			}
		},
		getMobile() {
			if (!this.isAddMode && this.getItem) {
				return this.getItem.mobile
			} else {
				return null
			}
		},
		getRegion() {
			let region = null
			if (this.isAddMode) {
				// region = '市，区，街'
			} else {
				if (this.getItem) {
					let regions = this.getItem.regions
					region = this.getRegionStr(regions)
				}
			}
			return region
		},
		getAddress() {
			if (!this.isAddMode && this.getItem) {
				return this.getItem.address
			} else {
				return null
			}
		},
		getZipcode() {
			if (!this.isAddMode && this.getItem) {
				return this.getItem.zip_code
			} else {
				return null
			}
		},
		getItem() {
			return this.$route.query.item
		},
		getSumitTitle() {
			let isFromCheckout = this.$route.query.isFromCheckout
			if (isFromCheckout) {
				return '保存并使用'
			} else {
				return '保存'
			}
		}
	},
	methods: {
		...mapMutations([
			'addAddressItem',
			'modifyAddressItem',
			'selectAddressItem'
		]),
		...mapActions({
			fetchRegions: 'fetchRegions'
		}),

		// 获取配置的国家个数判断是否显示国家一级
		isCitynNumber() {
			this.picker = Object.assign(
				[],
				this.regions.length <= 1 ? this.regions[0].regions : this.regions
			)
			console.log(this.picker)
		},

		goBack() {
			this.$router.go(-1)
		},

		// change regions value
		buildAegions(type) {
			let data = ''
			// if (type == ) {}
		},

		onRegion(picker, values) {
			this.$refs.picker.currentValue = true
			console.log(this.items)
		},
		onPickerConfirm(values) {
			this.$refs.region.value = this.getRegionStr(values)
			this.templeRegion = values[3]
		},
		getRegionStr(values) {
			let title = ''
			for (let i = 0; i < values.length; i++) {
				const element = values[i]
				if (i !== 0) {
					title = title + ' ' + element.name
				} else {
					title = title + element.name
				}
			}
			return title
		},
		updateSelectedAddress(item) {
			// 从确认订单添加/编辑地址后，使用添加或编辑后的地址
			let isFromCheckout = this.$route.query.isFromCheckout
			let goBackLevel = this.$route.query.goBackLevel
				? this.$route.query.goBackLevel
				: -1
			if (isFromCheckout) {
				this.selectAddressItem(item)
				this.$router.go(goBackLevel)
			} else {
				this.goBack()
			}
		},
		submit() {
			let name = this.$refs.name.value
			let mobile = this.$refs.mobile.value
			let region = null
			if (this.isAddMode) {
				region = this.templeRegion
			} else {
				if (this.templeRegion) {
					region = this.templeRegion
				} else {
					region = this.getItem.regions[3]
				}
			}
			let address = this.$refs.address.value
			let zipCode = this.$refs.zipCode.value
			if (name === null || name === undefined) {
				Toast('请填写收件人姓名')
				return
			}
			if (name.length === 0) {
				Toast('请填写收件人姓名')
				return
			}
			if (name.length < 2 || name.length > 15) {
				Toast('2-15个字符限制')
				return
			}
			if (mobile === null || mobile === undefined) {
				Toast('请填写手机号码')
				return
			}
			if (mobile.length === 0) {
				Toast('请填写手机号码')
				return
			}
			if (!this.validator.isNumber(mobile)) {
				Toast('请填写正确格式的手机号码')
				return
			}
			if (region === null || region === undefined) {
				Toast('请选择所在地区')
				return
			}
			if (address === null || address === undefined) {
				Toast('请填写详细地址')
				return
			}
			if (address.length === 0) {
				Toast('请填写详细地址')
				return
			}
			if (zipCode === null || zipCode === undefined) {
				Toast('请填写邮政编码')
				return
			}
			if (zipCode.length === 0) {
				Toast('请填写邮政编码')
				return
			}
			if (this.isAddMode) {
				Indicator.open()
				consignee
					.consigneeAdd(name, mobile, null, zipCode, region.id, address)
					.then(
						response => {
							Indicator.close()
							let item = response.consignee
							this.addAddressItem(item)
							this.updateSelectedAddress(item)
						},
						error => {
							Indicator.close()
							Toast(error.errorMsg)
						}
					)
			} else {
				let item = this.getItem
				let consigneeId = item ? item.id : null
				Indicator.open()
				consignee
					.consigneeUpdate(
						consigneeId,
						name,
						mobile,
						null,
						zipCode,
						region.id,
						address
					)
					.then(
						response => {
							Indicator.close()
							let item = response.consignee
							this.modifyAddressItem(item)
							this.updateSelectedAddress(item)
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

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.item {
	height: 50px;
}
.section {
	margin-top: 44px;
}
.button {
	@include button;
	margin-top: 40px;
}
</style>
