<template>
	<div class="ui-popup-right">
		<mt-header class="header" title="我的红包">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack">
			</header-item>
		</mt-header>
		<div>
			<div class="updeta-user-name ui-common-update">
				<input type="text" v-model="bonus_sn" placeholder="请输入红包序列号" />
				<img
					src="../../assets/image/change-icon/e2_delete@2x.png"
					@click="clearBonusSn()"
					v-if="bonus_sn.length > 0"
				/>
			</div>
			<div class="ui-save-btn"><span @click="saveBtn()">添加红包</span></div>
		</div>
	</div>
</template>

<script>
import { Header } from 'mint-ui'
import {
	HeaderItem,
	TopList,
	BaseList,
	EmptyItem
} from '../../components/common'
import { cashgiftAdd } from '../../api/cashgift'
import { Toast } from 'mint-ui'
export default {
	components: {
		
	},
	data() {
		return {
			bonus_sn: ''
		}
	},
	created() {
	},
	methods: {
		goBack() {
			this.$router.go(-1)
		},
		/*
		 * clearBonusSn: 清除红包序列号
		 */
		clearBonusSn() {
			this.bonus_sn = '' // CODE REVIEW: 换行缩进2个字符
		},
		/*
		 *saveBtn:  保存
		 */
		saveBtn() {
			this.cashgiftAdd()
		},

		/*
		 * cashgiftAdd: 添加红包
		 */
		cashgiftAdd() {
			let bonus_sn = this.bonus_sn
			if (bonus_sn.length != 10) {
				Toast('请输入10位的序列号')
				return false
			}
			cashgiftAdd(
				bonus_sn
			).then(
				res => {
					Toast('红包添加成功')
					this.clearBonusSn()
					this.$router.go(-1)
				},
				error => {
					Toast(error.errorMsg)
				}
			)
			

			
		},
	}
}
</script>

<style lang="scss" scoped>
.header {
	border-bottom: 0.5px solid #e8eaed;
	@include header;
}
.ui-popup-right {
	background-color: #fff;
}
.updeta-user-name {
	position: relative;
	padding: 0px 15px 0px 20px;
	input {
		border: 0px;
		/* padding-right: 20px; */
	}
	img {
		position: absolute;
		top: 17px;
		right: 15px;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
}
.ui-common-update {
	margin: 0px;
	padding: 0px 20px;

	input {
		border: 0px;
	}
}
.ui-save-btn {
	padding: 36px 38px;
	span {
		display: block;
		width: 100%;
		height: 40px;
		background: $primaryColor;
		border-radius: 2px;
		border: 0px;
		font-size: 16px;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		cursor: pointer;
		line-height: 40px;
		&:focus {
			outline: none;
			outline-offset: 0px;
		}
	}
}
</style>
