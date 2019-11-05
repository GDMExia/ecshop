<template>
	<div class="container">
		<mt-header class="header" title="收银台">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="leftClick(false)">
			</header-item>
		</mt-header>
		<div class="top-wrapper">
			<div class="row-wrapper title-wrapper">
				<img
					class="icon"
					src="../../assets/image/change-icon/b10_order@2x.png"
				/>
				<label class="title">订单提交成功，请选择付款方式</label>
			</div>
			<div class="row-wrapper subtitle-wrapper">
				<label class="subtitle">合计：</label>
				<label class="price">￥ {{ getOrderAmount }}</label>
			</div>
		</div>
		<div
			class="item-wrapper"
			v-on:click="payType(item.code)"
			v-for="item in payList"
			v-if="!teegon"
		>
			<div class="item-left-wrapper">
				<img
					v-if="item.code == 'balance'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_balance@2x.png"
				/>
				<img
					v-if="item.code == 'cod'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_cod@2x.png"
				/>
				<img
					v-if="item.code == 'alipay.wap'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_alipay@2x.png"
				/>
				<img
					v-if="item.code == 'unionpay.app'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_tiangong@2x.png"
				/>
				<img
					v-if="item.code == 'wxpay.web'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_wechat@2x.png"
				/>
				<img
					v-if="item.code == 'wxpay.h5'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_wechat@2x.png"
				/>
				<img
					v-if="item.code == 'teegon.wap'"
					class="icon"
					src="../../assets/image/change-icon/e2_icon_tiangong@2x.png"
				/>
				<label class="item-title">{{ item.name }}</label>
			</div>
			<div class="item-right-wrapper">
				<img
					v-if="code == 'alipay.wap' && item.code == 'alipay.wap'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'unionpay.app' && item.code == 'unionpay.app'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'wxpay.web' && item.code == 'wxpay.web'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'teegon.wap' && item.code == 'teegon.wap'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'wxpay.h5' && item.code == 'wxpay.h5'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'balance' && item.code == 'balance'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
				<img
					v-if="code == 'cod' && item.code == 'cod'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
			</div>
		</div>
		<div class="item-wrapper" v-on:click="payType('wxpay_jsapi')" v-if="teegon">
			<div class="item-left-wrapper">
				<img
					class="icon"
					src="../../assets/image/change-icon/e2_icon_wechat@2x.png"
				/>
				<label class="item-title">天工收银微信支付</label>
			</div>
			<div class="item-right-wrapper">
				<img
					v-if="type == 'wxpay_jsapi'"
					class="item-select"
					src="../../assets/image/change-icon/b1_icon-checkmark.png"
				/>
			</div>
		</div>
		<div class="action-wrapper">
			<gk-button class="button" type="primary" v-on:click="pay"
				>立即付款</gk-button
			>
		</div>
	</div>
</template>

<script>
import { HeaderItem, Button } from '../../components/common'
import { mapState, mapActions } from 'vuex'
import { Header, MessageBox, Indicator, Toast } from 'mint-ui'
import { paymentPay, paymentTypesList } from '../../api/payment'
import { ENUM } from '../../const/enum'
import { configGet } from '../../api/config'
import XXTEA from '../../assets/js/xxtea'
import wx from 'weixin-js-sdk'
import Vue from 'vue'
export default {
	data() {
		return {
			payList: this.payList,
			alipay_html: this.alipay_html,
			config: this.config,
			code: this.code,
			type: this.type,
			teegon: false
		}
	},
	props: {
		order: {
			type: Object
		}
	},
	mounted() {
		let orderid = this.$route.query.order
		paymentTypesList(orderid).then(
			response => {
				// Indicator.close()
				// this.goPaySucceed()
				this.payList = response.payment_types
			},
			error => {
				// Indicator.close()
				Toast(error.errorMsg)
			}
		),
		this.$on('onPayFailed', (event, reason) => {
			let orderid = this.$route.query.order
			this.$router.push({
				name: 'orderDetail',
				query: { id: orderid, isFromPay: true }
			})
		}),
		this.$on('onPaySuccess', (event, reason) => {
			this.goPaySucceed()
		})
		if (window.history && window.history.pushState) {
			history.pushState(null, null, document.URL);
			window.addEventListener('popstate', this.goBack, false);
		}
	},
	destroyed() {
		window.removeEventListener('popstate', this.goBack, false);
	},
	computed: {
		getOrderAmount: function() {
			let total = this.$route.query.total
			return total ? total : ''
		}
	},
	methods: {
		...mapActions({
			fetchHomeBanner: 'fetchHomeBanner',
			fetchHomeProduct: 'fetchHomeProduct',
			fetchConfig: 'fetchConfig'
		}),

		leftClick(isFromBrowser) {
			MessageBox({
				title: '',
				message: '商品一眨眼就没了</br>确定放弃支付吗？',
				showCancelButton: true,
				cancelButtonText: '去意已决',
				cancelButtonClass: 'cancel-button',
				confirmButtonText: '再想想',
				confirmButtonClass: 'confirm-button-red'
			}).then(action => {
				if (action === 'cancel') {
					this.$router.push({
						name: 'order',
						params: { order: ENUM.ORDER_STATUS.CREATED }
					})
				} else {
					if (isFromBrowser) {
						history.pushState(null, null, document.URL)
					}
				}
			})
		},
		/*
		 *获取支付方式
		 */

		payType(code) {
			if (code == 'wxpay_jsapi') {
				this.type = code
			} else {
				this.code = code
			}
		},
		/*
		 *支付
		 */

		pay() {
		  console.log(this.$route.query.orderSn)
		  location.href=`http://pts.suoqoo.com/home.php/Pay/orderShopPay?order_no=${this.$route.query.orderSn}`
		  // this.$http.get('http://pts.suoqoo.com/home.php/Pay/orderShopPay?order_no='+this.$route.query.order).then(res=>{console.log(res)})
			// // Indicator.open()
			// let code = this.code
			// let type = this.type
			// let orderid = this.$route.query.order
			// let referer = null
			// let channel = null
			// let openid = null
			// if (this.teegon == false) {
			// 	if (code == 'teegon.wap') {
			// 		this.teegon = true
			// 		return
			// 	}
			// }
			// if (code == 'alipay.wap' || type == 'wxpay_jsapi' || 'wxpay.h5') {
			// 	let order = this.$route.query.order
			// 	console.log("111111")
			// 	referer =
			// 		window.location.protocol +
			// 		'//' +
			// 		window.location.host +
			// 		window.location.pathname +
			// 		'#/paySucceed?order=' +
			// 		orderid
			// }
			//
			// if (type == 'wxpay_jsapi') {
			// 	channel = 'wxpay_jsapi'
			// }
			//
			// if (!code) {
			// 	Toast('请选择支付方式')
			// 	return
			// }
			// if (code == 'teegon.wap') {
			// 	if (!type) {
			// 		Toast('请选择支付方式')
			// 		return
			// 	}
			// }
			//
			// if (orderid) {
			// 	// 微信支付
			// 	if (code == 'wxpay.web') {
			// 		this.fetchConfig().then(response => {
			// 			let wechat = response.config['wechat.web']
			// 			let openid = this.$cookie.get('o')
			// 			let that = this
			// 			wx.config({
			// 				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			// 				appId: wechat.app_id, // 必填，公众号的唯一标识
			// 				timestamp: wechat.timestamp, // 必填，生成签名的时间戳
			// 				nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
			// 				signature: wechat.signature, // 必填，签名，见附录1
			// 				jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			// 			})
			//
			// 			wx.ready(function() {
			// 				paymentPay(orderid, code, referer, channel, openid).then(
			// 					ressponse => {
			// 						if (ressponse && ressponse.wxpay) {
			// 							var result = ressponse
			// 							that.$cookie.set('orderid', orderid)
			// 							// if(true){
			// 							//       Toast(JSON.stringify(result));
			// 							//  }
			// 							return wx.chooseWXPay({
			// 								timestamp: result.wxpay.timestamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			// 								nonceStr: result.wxpay.nonce_str, // 支付签名随机串，不长于 32 位
			// 								package: result.wxpay.packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			// 								signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			// 								paySign: result.wxpay.sign, // 支付签名
			// 								success: function(res) {
			// 									if (res.errMsg == 'chooseWXPay:ok') {
			// 										that.$emit('onPaySuccess', res.errMsg)
			// 									} else {
			// 										that.$emit('onPayFailed', res.errMsg)
			// 									}
			//
			// 									// 支付成功后的回调函数
			// 									return true
			// 								},
			// 								cancel: res => {
			// 									// if(true){
			// 									//     Toast(JSON.stringify(res));
			// 									// }
			// 									//支付取消
			// 									that.$emit('onPayFailed', '1')
			// 								},
			// 								// 支付失败回调函数
			// 								fail: function(res) {
			// 									that.$emit('onPayFailed', res.errMsg)
			// 									// if(true){
			// 									//     // Toast(JSON.stringify(res));
			// 									// }
			// 								}
			// 							})
			// 						} else {
			// 							return false
			// 						}
			// 					},
			// 					error => {}
			// 				)
			// 			})
			// 		})
			// 	}
			//
			// 	//微信H5支付
			// 	if (code == 'wxpay.h5') {
			// 		paymentPay(orderid, code, referer, channel, openid).then(
			// 			response => {
			// 				if (response) {
			// 					if (response.result && response.result.mweb_url) {
			// 						response.result.mweb_url =
			// 							response.result.mweb_url +
			// 							'&redirect_url=' +
			// 							encodeURIComponent(referer)
			// 						this.$cookie.set('orderid', orderid)
			// 						// window.location.href = response.result.mweb_url
			// 					}
			// 				}
			// 			},
			// 			error => {
			// 				Toast(error.errorMsg)
			// 			}
			// 		)
			// 	}
			//
			// 	//支付宝支付&天工收银微信支付
			// 	if (code == 'alipay.wap' || type == 'wxpay_jsapi') {
			// 		paymentPay(orderid, code, referer, channel, openid).then(
			// 			response => {
			// 				if (response) {
			// 					//支付宝支付
			// 					if (code == 'alipay.wap') {
			// 						if (response.alipay && response.alipay.html) {
			// 							this.alipay_html = response.alipay.html
			// 							if (this.alipay_html != '') {
			// 								const div = document.createElement('div')
			// 								div.innerHTML = this.alipay_html
			// 								document.body.appendChild(div)
			// 								document.forms[0].submit()
			// 								this.$cookie.set('orderid', orderid)
			// 							}
			// 						}
			// 					}
			// 					//天工收银微信支付
			// 					if (type == 'wxpay_jsapi') {
			// 						if (response.teegon && response.teegon.url) {
			// 							// window.location.href = response.teegon.url
			// 						}
			// 					}
			// 				}
			// 			},
			// 			error => {
			// 				// Indicator.close()
			// 				Toast(error.errorMsg)
			// 			}
			// 		)
			// 	}
			//
			// 	//余额支付
			// 	if (code == 'balance' || code == 'cod') {
			// 		paymentPay(orderid, code, referer, channel, openid).then(
			// 			response => {
			// 				if (response) {
			// 					this.$cookie.set('orderid', orderid)
			// 					this.goPaySucceed()
			// 				}
			// 			},
			// 			error => {
			// 				Toast(error.errorMsg)
			// 			}
			// 		)
			// 	}
			// }
		},

		/*
		 * 微信支付
		 */
		weixiPay(config) {
			if (config.prepay_id) {
				config.prepay_id = 'prepay_id=' + config.prepay_id
			}
			this.wxApi.wxRegister(config)
		},

		goPaySucceed() {
			let order = this.$route.query.order
			this.$router.push({ name: 'paySucceed', params: { order: order } })
		},

		goBack() {
			this.leftClick(true)
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
}
.header {
	@include header;
	border-bottom: 1px solid $lineColor;
}
.top-wrapper {
	height: 120px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
	margin-bottom: 15px;
}
.row-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.title-wrapper {
	height: 64px;
}
.subtitle-wrapper {
	height: 30px;
	margin-top: 10px;
}
.icon {
	width: 18px;
	height: 18px;
	margin-left: 16px;
	margin-right: 10px;
}
.title {
	font-size: 16px;
	color: #3c3c3c;
}
.subtitle {
	font-size: 16px;
	color: #4d4d4d;
	margin-left: 50px;
}
.price {
	font-size: 16px;
	color: $primaryColor;
}
.item-wrapper {
	height: 62px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px solid $lineColor;
}
.item-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
	background-color: #fff;
}
.item-left-wrapper {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.item-right-wrapper {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.item-title {
	font-size: 16px;
	color: #3c3c3c;
}
.item-subtitle {
	font-size: 16px;
	color: #8c8c8c;
	margin-right: 5px;
	text-align: right;
}
.item-select {
	width: 16px;
	height: 16px;
	margin-right: 22px;
}
.indicator {
	width: 14px;
	height: 14px;
	margin-left: 5px;
	margin-right: 16px;
}
.action-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 50px;
	margin-top: 45px;
}
.button {
	@include button;
	width: 180px;
	height: 50px;
}
</style>
