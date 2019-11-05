<template>
	<div class="container">
		<div class="top-wrapper">
			<!-- <div class="nav-item" id="left-nav-item" @click="goSetting">
				<img
					class="nav-icon"
					src="../../assets/image/change-icon/f0_setup@2x.png"
				/>
			</div>
			<div class="nav-item" id="right-nav-item" @click="goNews()">
				<img
					class="nav-icon"
					src="../../assets/image/change-icon/f0_message@2x.png"
				/>
				<span v-if="isHasUnreadCount"></span>
			</div> -->
			<div class="top-info-wrapper">
				<div class="avatar-wrapper" @click="goProfileInfo">
					<img
						class="avatar"
						v-bind:src="user.avatar.thumb"
						v-if="isOnline && user && user.avatar"
					/>
					<img
						class="avatar"
						src="../../assets/image/change-icon/e0_head1@2x.png"
						v-if="!isOnline || !user || !user.avatar"
					/>
				</div>
				<label
					class="nickname"
					style="-webkit-box-orient:vertical"
					@click="goProfileInfo"
					>{{ nickname }}</label
				>
			</div>
			<!-- <div class="info-wrapper">
				<div class="info-item" @click="goScoreList">{{ getScore }}积分</div>
				<div class="info-item" @click="goRecordList">积分记录</div>
			</div> -->
		</div>
		<div class="order-header" @click="goOrder">
			<div class="order-header-item" id="order-item-left">
				<img
					class="order-header-icon"
					src="../../assets/image/change-icon/e1_order@2x.png"
				/>
				<label class="item-title order-header-title">我的订单</label>
			</div>
			<div class="order-header-item" id="order-item-right">
				<label class="order-subtitle">查看全部订单</label>
				<img
					class="indicator"
					src="../../assets/image/change-icon/enter@2x.png"
				/>
			</div>
			<div class="order-header-line"></div>
		</div>
		<div class="order-wrapper">
			<profile-order-item
				class="order-item"
				testAttr="order"
				id="0"
				:icon="require('../../assets/image/change-icon/f0_icon_pay@2x.png')"
				title="待付款"
				:orderNumber="orderCount.created"
			>
			</profile-order-item>
			<profile-order-item
				class="order-item"
				testAttr="order"
				id="1"
				:icon="require('../../assets/image/change-icon/f0_delivery@2x.png')"
				title="待发货"
				:orderNumber="orderCount.paid"
			>
			</profile-order-item>
			<profile-order-item
				class="order-item"
				testAttr="order"
				id="2"
				:icon="require('../../assets/image/change-icon/f0_receiving@2x.png')"
				title="待收货"
				:orderNumber="orderCount.delivering"
			>
			</profile-order-item>
			<profile-order-item
				class="order-item"
				testAttr="order"
				id="3"
				:icon="require('../../assets/image/change-icon/f0_evaluate@2x.png')"
				title="待评价"
				:orderNumber="orderCount.deliveried"
			>
			</profile-order-item>
		</div>
		<div class="bottom-wrapper">
			<profile-info-item
				v-on:onclick="goFavourite()"
				class="info-item-wrapper section-header"
				:icon="require('../../assets/image/change-icon/f0_favorite@2x.png')"
				title="我的收藏"
			>
			</profile-info-item>
			<profile-info-item
				v-on:onclick="goAddress"
				class="info-item-wrapper"
				:icon="require('../../assets/image/change-icon/f0_address@2x.png')"
				title="管理收货地址"
			>
			</profile-info-item>
			<!-- <profile-info-item
				v-on:onclick="goCashgift"
				class="info-item-wrapper section-footer"
				:icon="require('../../assets/image/change-icon/f0_coupon@2x.png')"
				title="我的红包"
			>
			</profile-info-item>
			<profile-info-item
				v-on:onclick="goAddCashgift"
				class="info-item-wrapper section-footer"
				:icon="require('../../assets/image/change-icon/f0_coupon@2x.png')"
				title="添加红包"
			> -->
			<!-- </profile-info-item>
			<profile-info-item
				v-on:onclick="goBonus"
				class="info-item-wrapper section-header"
				:icon="require('../../assets/image/change-icon/f0_recommend@2x.png')"
				title="我的推荐"
			>
			</profile-info-item>
			<profile-info-item
				v-on:onclick="goBalance"
				class="info-item-wrapper section-footer"
				:icon="require('../../assets/image/change-icon/f0_balance@2x.png')"
				title="我的资金"
			>
			</profile-info-item>
			<profile-info-item
				v-on:onclick="goHelp()"
				class="info-item-wrapper section-footer"
				:icon="require('../../assets/image/change-icon/f0_help@2x.png')"
				title="使用帮助"
			>
			</profile-info-item>
			<profile-info-item
				v-if="user && user.is_affiliate"
				v-on:onclick="goBonusQR"
				class="info-item-wrapper section-header"
				:icon="require('../../assets/image/change-icon/f0_qcode@2x.png')"
				title="我的推广二维码"
			>
			</profile-info-item> -->
		</div>
	</div>
</template>

<script>
import Tabbar from '../../components/common/Tabbar'
import ProfileInfoItem from './child/ProfileInfoItem'
import ProfileOrderItem from './child/ProfileOrderItem'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { userProfileGet } from '../../api/user'
import { scoreGet } from '../../api/score'
import { ENUM } from '../../const/enum'
import { orderSubtotal } from '../../api/order'
import { messageCount } from '../../api/message'
import * as site from '../../api/site'
import { MessageBox } from 'mint-ui'
export default {
	name: 'profile',
	data() {
		return {
			orderAll: 1,
			score: 0,
			orderCount: {},
			isShow: true,
			telephone: ''
		}
	},
	components: {
		Tabbar,
		ProfileOrderItem,
		ProfileInfoItem
	},
	created: function() {
		if (this.isOnline) {
			userProfileGet().then(
				response => {
					if (response && response.user) {
						this.saveUser(response)
					}
				},
				error => {}
			)
			scoreGet().then(
				response => {
					this.score = response.score
				},
				error => {}
			)
		}
		if (this.isOnline) {
			this.getOrderSubtotal()
			this.getMessageCount(ENUM.MESSAGE_TYPE.SYSTEM)
			this.getMessageCount(ENUM.MESSAGE_TYPE.ORDER)
		}
		site.siteGet().then(
			response => {
				if (response && response.site_info) {
					this.telephone = response.site_info.telephone
				}
			},
			error => {}
		)
	},
	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline,
			user: state => state.auth.user,
			lastOrderMsgTime: state => state.message.lastOrderMsgTime,
			lastSystemMsgTime: state => state.message.lastSystemMsgTime,
			orderUnreadCount: state => state.message.orderUnreadCount,
			systemUnreadCount: state => state.message.systemUnreadCount,
			orderStatus: state => state.order.orderStatus
		}),
		...mapGetters({
			isHasUnreadCount: 'isHasUnreadCount'
		}),
		nickname() {
			let title = '登录/注册'
			if (this.isOnline) {
				if (
					this.user &&
					typeof this.user != 'undefined' &&
					JSON.stringify(this.user) != '{}'
				) {
					if (this.user.nickname) {
						title = this.user.nickname
					} else if (this.user.username) {
						title = this.user.username
					}
				}
			}
			return title
		},
		getAvatarUrl() {
			let url = null
			if (this.isOnline) {
				if (
					this.user &&
					typeof this.user != 'undefined' &&
					JSON.stringify(this.user) != '{}'
				) {
					let avatar = this.user.avatar
					if (avatar) {
						if (avatar.large && avatar.large) {
							url = avatar.large
						} else if (avatar.thumb && avatar.thumb) {
							url = avatar.thumb
						}
					}
				}
			}
			if (url === null) {
				url = require('../../assets/image/change-icon/e0_head1@2x.png')
			}
			return url
		},
		getScore() {
			let score = '0'
			if (this.isOnline) {
				score = this.score
			}
			return score
		}
	},
	methods: {
		...mapMutations({
			saveUser: 'saveUser',
			changeStatus: 'changeStatus',
			saveOrderUnread: 'saveOrderUnread',
			saveSystemUnread: 'saveSystemUnread'
		}),
		// 获取订单不同状态的数量统计
		getOrderSubtotal() {
			if (this.user != null) {
				orderSubtotal().then(res => {
					if (res) {
						this.orderCount = res.subtotal
					}
				})
			}
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
		},
		showLogin() {
			this.$router.push({ name: 'signin' })
		},
		goScoreList() {
			if (this.isOnline) {
				this.$router.push({ name: 'scoreList', query: { index: 0 } })
			} else {
				this.showLogin()
			}
		},
		goRecordList() {
			if (this.isOnline) {
				this.$router.push({ name: 'scoreList', query: { index: 1 } })
			} else {
				this.showLogin()
			}
		},
		goProfileInfo() {
			if (this.isOnline) {
				this.$router.push({ name: 'profileInfo' })
			} else {
				this.showLogin()
			}
		},
		goSetting() {
			this.$router.push({ name: 'setting' })
		},
		goNews() {
			if (this.isOnline) {
				this.$router.push({ name: 'messageCenter' })
			} else {
				this.showLogin()
			}
		},
		goFavourite() {
			if (this.isOnline) {
				this.$router.push('collection')
			} else {
				this.showLogin()
			}
		},
		goAddress() {
			if (this.isOnline) {
				this.$router.push({ name: 'addressManage' })
			} else {
				this.showLogin()
			}
		},
		goCashgift() {
			if (this.isOnline) {
				this.$router.push({ name: 'cashgiftList', query: { index: 0 } })
			} else {
				this.showLogin()
			}
		},
		goAddCashgift() {
			if (this.isOnline) {
				this.$router.push({ name: 'cashgiftAdd', query: { title: '添加红包' } })
			} else {
				this.showLogin()
			}
		},
		goHelp() {
			this.$router.push({ name: 'help', query: { title: '使用帮助' } })
		},
		goOrder() {
			if (this.isOnline) {
				if (this.orderStatus != 10) {
					this.changeStatus(10)
				}
				this.$router.push({
					name: 'order',
					params: { order: ENUM.ORDER_STATUS.ALL }
				})
			} else {
				this.showLogin()
			}
		},
		goBonus() {
			if (this.isOnline) {
				this.$router.push({ name: 'bonusList' })
			} else {
				this.showLogin()
			}
		},
		goBalance() {
			if (this.isOnline) {
				this.$router.push({ name: 'balanceUsable' })
			} else {
				this.showLogin()
			}
		},
		goBonusQR() {
			if (this.isOnline) {
				this.$router.push({ name: 'bonusQR' })
			} else {
				this.showLogin()
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
	background-color: $mainbgColor;
	.top-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		height: 225px;
		@include linear-gradient(#fa800a, #fa800a);
		.top-info-wrapper {
			flex: 1;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
		}
	}
	.nav-item {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 44px;
		height: 44px;
		top: 11px;
		span {
			width: 7px;
			height: 7px;
			background-color: $primaryColor;
			border-radius: 50%;
			position: absolute;
			top: 11px;
			right: 11px;
		}
	}
	#left-nav-item {
		left: 2px;
	}
	#right-nav-item {
		right: 2px;
	}
	.nav-icon {
		width: 24px;
		height: 24px;
	}
	.avatar-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 76px;
		height: 76px;
		border-radius: 38px;
		background-color: #fff;
		margin-top: 40px;
		.avatar {
			width: 72px;
			height: 72px;
			border-radius: 36px;
		}
	}
	.nickname {
		width: 100%;
		margin-top: 20px;
		font-size: 16px;
		font-family: PingFangSC-Regular;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		margin-left: 0px;
		margin-right: 0px;
		@include limit-line(1);
	}
	.info-wrapper {
		width: 100%;
		height: 40px;
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: stretch;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.info-item {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
	.order-header {
		height: 44px;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-content: stretch;
		background-color: #fff;
		@include thin-border();
	}
	.order-header-item {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	#order-item-left {
		justify-content: flex-start;
		margin-left: 10px;
	}
	#order-item-right {
		justify-content: flex-end;
	}
	.order-header-line {
		position: absolute;
		height: 1px;
		left: 10px;
		bottom: 0px;
		right: 10px;
		background-color: $lineColor;
	}
	.item-title {
		font-size: 14px;
		color: #4e545d;
	}
	.order-header-icon {
		width: 18px;
		height: 18px;
	}
	.order-header-title {
		margin-left: 8px;
	}
	.indicator {
		width: 7px;
		height: 12 px;
		margin-left: 10px;
		margin-right: 10px;
	}
	.order-subtitle {
		font-size: 12px;
		color: #7c7f88;
	}
	.order-wrapper {
		height: 88px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: stretch;
		background-color: #fff;
	}
	.order-item {
		flex: 1;
	}
	.bottom-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		margin-bottom: 60px;
	}
	.info-item-wrapper {
		height: 44px;
	}
	.section-header {
		margin-top: 12px;
	}
	.section-footer {
		border-bottom-width: 0px;
	}
}
</style>
