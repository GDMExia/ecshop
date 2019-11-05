<template>
	<div class="container">
		<!-- header -->
		<mt-header class="header" title="消息中心">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="goBack()">
			</header-item>
		</mt-header>
		<!-- body -->
		<div class="flex-wrapper">
			<div class="newslist" v-on:click="getOrderMessage()">
				<div class="ui-image-wrapper">
					<img src="../../assets/image/change-icon/e12_logistics@2x.png" />
				</div>
				<div class="flex-right">
					<h3>订单消息</h3>
					<span v-if="orderMessage.length > 0">{{
						orderMessage[0].content
					}}</span>
					<span v-if="orderMessage.length <= 0">暂无信息</span>
					<span class="prompt" v-if="orderUnreadCount > 0"></span>
				</div>
			</div>

			<div class="newslist" v-on:click="getNoticeMessage()">
				<div class="ui-image-wrapper">
					<img src="../../assets/image/change-icon/e12_message@2x.png" />
				</div>
				<div class="flex-right">
					<h3>通知消息</h3>
					<span v-if="noticeMessage.length > 0">{{
						noticeMessage[0].content
					}}</span>
					<span v-if="noticeMessage.length <= 0">暂无信息</span>
					<span class="prompt" v-if="systemUnreadCount > 0"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ENUM } from '../../const/enum'
import {
	messageOrderList,
	messageSystemList,
	messageCount
} from '../../api/message'
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {
			noticeMessage: [],
			orderMessage: [],
			key: ''
		}
	},

	created() {
		this.getmessageSystemList()
		this.getmessageOrderList()

		this.getMessageCount(ENUM.MESSAGE_TYPE.SYSTEM)
		this.getMessageCount(ENUM.MESSAGE_TYPE.ORDER)
	},

	computed: {
		...mapState({
			lastOrderMsgTime: state => state.message.lastOrderMsgTime,
			lastSystemMsgTime: state => state.message.lastSystemMsgTime,
			orderUnreadCount: state => state.message.orderUnreadCount,
			systemUnreadCount: state => state.message.systemUnreadCount,
			isOnline: state => state.auth.isOnline,
			user: state => state.auth.user
		})
	},

	methods: {
		...mapMutations({
			saveOrderUnread: 'saveOrderUnread',
			saveSystemUnread: 'saveSystemUnread'
		}),

		goBack() {
			this.$router.go(-1)
		},

		// 订单消息
		getOrderMessage() {
			this.$router.push('orderMessageList')
		},

		// 获取订单消息列表数据
		getmessageOrderList() {
			messageOrderList(1, 10).then(res => {
				if (res) {
					this.orderMessage = res.messages
				}
			})
		},

		// 通知消息
		getNoticeMessage() {
			this.$router.push('systemMessageList')
		},

		// 获取通知消息数据
		getmessageSystemList() {
			messageSystemList(1, 10).then(res => {
				if (res) {
					this.noticeMessage = res.messages
				}
			})
		},

		// 获取未读消息数字
		getMessageCount(type) {
			if (this.user != null) {
				let after = null
				// let joined_at = this.user.joined_at ? this.user.joined_at : Date.parse( new Date()) / 1000;
				if (type === ENUM.MESSAGE_TYPE.SYSTEM) {
					after = this.lastSystemMsgTime ? this.lastSystemMsgTime : '0'
				} else if (type === ENUM.MESSAGE_TYPE.ORDER) {
					after = this.lastOrderMsgTime ? this.lastOrderMsgTime : '0'
				}

				messageCount(after, type).then(res => {
					if (res) {
						if (type === ENUM.MESSAGE_TYPE.SYSTEM) {
							this.saveSystemUnread(res.count)
						} else if (type === ENUM.MESSAGE_TYPE.ORDER) {
							this.saveOrderUnread(res.count)
						}
					}
				})
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
	.header {
		@include header;
		border-bottom: 1px solid #e8eaed;
	}
	.flex-wrapper {
		background: rgba(255, 255, 255, 1);
		.newslist {
			display: flex;
			width: auto;
			align-items: center;
			justify-content: space-between;
			padding: 15px 19px 15px 15px;
			position: relative;
			border-bottom: 1px solid #e8eaed;
			height: 80px;
			box-sizing: border-box;
			.ui-image-wrapper {
				img {
					width: 50px;
					height: 50px;
					margin-right: 15px;
				}
			}
			.flex-right {
				width: 100%;
				overflow: hidden;
				h3 {
					font-size: 14px;
					color: #4e545d;
					padding-bottom: 10px;
				}
				span {
					font-size: 12px;
					color: #7c7f88;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
				}
				.prompt {
					width: 6px;
					height: 6px;
					position: absolute;
					right: 19px;
					top: 50%;
					background-color: $primaryColor;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>
