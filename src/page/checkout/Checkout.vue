<template>
	<div class="container">
		<mt-header class="header" fixed title="确认订单">
			<header-item slot="left" v-bind:isBack="true" v-on:onclick="leftClick">
			</header-item>
			<!-- <header-item slot="right" titleColor="$primaryColor" title="联系客服">
			</header-item> -->
		</mt-header>
		<div class="body">
			<checkout-address
				class="address"
				v-on:onclick="goAddress"
				v-bind:item="selectedAddress"
			>
			</checkout-address>
			<checkout-score-good
				class="section-header section-footer"
				v-if="this.isExchange"
				:items="cartGoods"
			></checkout-score-good>
			<checkout-goods
				v-if="!this.isExchange"
				class="goods section-header"
				v-on:onclick="goGoodsList"
				:items="cartGoods"
			>
			</checkout-goods>
			<checkout-item
				class="item"
				title="配送方式"
				:subtitle="getShippingName"
				v-on:onclick="goShipping"
			>
			</checkout-item>
			<checkout-item
				v-if="!this.isExchange && this.siteConfigs.can_invoice === '1'"
				class="item section-header"
				title="发票类型"
				:subtitle="getInoviceTitle"
				v-on:onclick="goInvoice"
			>
			</checkout-item>
<!--			<checkout-item-->
<!--				v-if="!this.isExchange"-->
<!--				class="item section-header"-->
<!--				title="使用红包"-->
<!--				:subtitle="getCashgiftName"-->
<!--				:tips="getCashgiftTips"-->
<!--				v-on:onclick="goCashgiftList"-->
<!--			>-->
<!--			</checkout-item>-->
			<checkout-score
				v-if="!this.isExchange && this.siteConfigs.use_integral === '1'"
				class="section-header"
				ref="score"
				:default="score"
				:maxUseScore="this.maxUseScore"
			></checkout-score>
			<checkout-comment
				ref="comment"
				:default="comment"
				class="comment section-header"
			>
			</checkout-comment>
			<div class="desc section-header section-footer">
				<checkout-desc
					class="desc-item"
					title="商品金额"
					:subtitle="getOrderProductPrice"
				>
				</checkout-desc>
<!--				<checkout-desc-->
<!--					v-if="!this.isExchange && this.siteConfigs.can_invoice === '1'"-->
<!--					class="desc-item"-->
<!--					title="发票税额"-->
<!--					:subtitle="getOrderTaxPrice">-->
<!--				</checkout-desc>-->
				<checkout-desc
					class="desc-item"
					title="运费"
					:subtitle="getOrderShippingPrice"
				>
				</checkout-desc>
				<checkout-desc
					class="desc-item"
					v-for="(item, index) in getPromos"
					:key="index"
					:title="getPromoTitle(item)"
					:subtitle="getOrderDiscountPrice(item)"
					v-if="item.promo!='cashgift'"
				>
				</checkout-desc>
			</div>
		</div>
		<div class="bottom-wrapper">
			<div class="amount-wrapper">
				<label class="amount">实付款: {{ getOrderTotalPrice }}</label>
			</div>
			<gk-button class="submit" type="primary" @click="checkout"
				>提交订单</gk-button
			>
		</div>
		<!-- <delivery-time  ref="timePicker"  v-on:onClickDate="onClickDate" v-on:onClickTime="onClickTime"></delivery-time> -->
	</div>
</template>

<script>
import { Header } from 'mint-ui'
import { HeaderItem } from '../../components/common'
import CheckoutAddress from './child/CheckoutAddress'
import CheckoutGoods from './child/CheckoutGoods'
import CheckoutItem from './child/CheckoutItem'
import CheckoutScore from './child/CheckoutScore'
import CheckoutComment from './child/CheckoutComment'
import CheckoutDesc from './child/CheckoutDesc'
import CheckoutScoreGood from './child/CheckoutScoreGood'
import { mapState, mapMutations, mapActions } from 'vuex'
import * as consignee from '../../api/consignee'
import * as order from '../../api/order'
import * as cart from '../../api/cart'
import * as product from '../../api/product'
import { cartQuantity } from '../../api/cart'
import {siteConfigsGet} from '../../api/site'
import { Toast, Indicator, MessageBox } from 'mint-ui'
import Promos from './Promos'
export default {
	components: {
		CheckoutAddress,
		CheckoutGoods,
		CheckoutItem,
		CheckoutScore,
		CheckoutComment,
		CheckoutDesc,
		CheckoutScoreGood
	},
	mixins: [Promos],
	data() {
		return {
			order_price: null,
			maxUseScore: 0,
			siteConfigs:{}
		}
	},
	watch: {
		score: function(value) {
			this.getOrderPrice()
		}
	},
	computed: {
		...mapState({
			selectedAddress: state => state.address.selectedItem,
			addressItems: state => state.address.items,
			selectedShipping: state => state.shipping.selectedItem,
			cashgiftTotal: state => state.cashgift.total,
			selectedCashgift: state => state.cashgift.selectedItem,
			invoice: state => state.invoice,
			selectedDate: state => state.delivery.selectedDate,
			selectedTime: state => state.delivery.selectedTime,
			comment: state => state.checkout.comment,
			cartGoods: state => state.cart.cartGoods,
			isOnline: state => state.auth.isOnline,
			user: state => state.auth.user,
			score: state => state.checkout.score
		}),
		isExchange() {
			if (
				this.$route.params &&
				this.$route.params.isExchange &&
				this.$route.params.isExchange != '0'
			) {
				return 1
			} else {
				return null
			}
		},
		exchangeScore() {
			if (
				this.$route.params &&
				this.$route.params.hasOwnProperty('exchangeScore')
			) {
				return this.$route.params.exchangeScore
			} else {
				return null
			}
		},
		isCart() {
			if (this.$route.params && this.$route.params.isCart) {
				return this.$route.params.isCart
			} else {
				return null
			}
		},
		// 获取订单商品数组(计算价格/获取货运公司列表)
		getOrderProducts: function() {
			let cartGoods = this.cartGoods
			let orderProducts = []
			for (let i = 0; i < cartGoods.length; i++) {
				const element = cartGoods[i]
				let goods = new Object()
				goods.goods_id = element.product ? element.product.id : ''
				goods.num = element.amount
				let attrs = new Array()

				let selectedAttrs = element.attrs ? element.attrs.toString() : null
				if (selectedAttrs && selectedAttrs.length) {
					let startIndex = selectedAttrs.indexOf('[')
					let endIndex = selectedAttrs.indexOf(']')
					if (startIndex > -1 && endIndex > -1 && startIndex !== endIndex) {
						selectedAttrs = selectedAttrs.substring(startIndex + 1, endIndex)
					}
					if (selectedAttrs.indexOf(',') > -1) {
						attrs = selectedAttrs.split(',')
					} else {
						attrs.push(selectedAttrs)
					}
				}
				goods.property = attrs
				orderProducts.push(goods)
			}
			return orderProducts
		},
		// 获取购物车货品id数组
		getCartGoodsIds: function() {
			let cartGoods = this.cartGoods
			let goodsIds = []
			if (cartGoods && cartGoods.length) {
				goodsIds = cartGoods.map(function(cardGood) {
					return cardGood.id
				})
			}
			return goodsIds
		},
		getShippingName: function() {
			let name = ''
			let item = this.selectedShipping
			if (item && item.name) {
				name = item.name
			} else {
				name = '请选择配送方式'
			}
			return name
		},
		getCashgiftName: function() {
			let name = ''
			let cashgift = this.selectedCashgift
			if (cashgift && cashgift.name) {
				name = cashgift.name
			} else {
				let total = this.cashgiftTotal
				if (total && total > 0) {
					name = '未使用'
				} else {
					name = '无可用'
				}
			}
			return name
		},
		getCashgiftTips: function() {
			let tips = ''
			let cashgift = this.selectedCashgift
			if (cashgift) {
				tips = '已选1张'
			} else {
				let total = this.cashgiftTotal
				if (total && total > 0) {
					tips = total + '张可用'
				} else {
					tips = ''
				}
			}
			return tips
		},
		getInoviceTitle: function() {
			let title = ''
			if (this.invoice.isSave) {
				if (!this.getInoviceToggle) {
					if (this.invoice.type && this.invoice.type.name) {
						title = this.invoice.type.name
					}
				} else {
					title = '不要发票'
				}
			} else {
				title = '请选择发票类型'
			}
			return title
		},
		getInoviceToggle: function() {
			return this.invoice.toggle
		},
		getSelectedDateStr: function() {
			let str = ''
			let date = this.selectedDate
			let time = this.selectedTime
			if (date && time) {
				str = date + ' ' + time
			}
			return str
		},
		getSelectedDateValue: function() {
			let str = ''
			let date = this.selectedDate
			let time = this.selectedTime
			if (date && time) {
				str = date + '/' + time
			}
			return str
		},
		getPromos: function() {
			return this.getPriceByKey('promos')
		},
		getOrderTotalPrice: function() {
			return this.getFormatPrice('total_price')
		},
		getOrderProductPrice: function() {
			return this.getFormatPrice('product_price')
		},
		getOrderTaxPrice: function() {
			return this.getFormatPrice('tax_price')
		},
		getOrderShippingPrice: function() {
			let priceStr = ''
			let price = this.order_price ? this.order_price.shipping_price : 0
			if (parseFloat(price) > 0) {
				priceStr = '￥ ' + this.utils.currencyPrice(price)
			} else {
				priceStr = '免运费'
			}
			return priceStr
		}
	},
	created: function() {
		this.fetchAddressList()
		this.getOrderPrice()
		this.getMaxUseScore()
		this.siteConfigsGet()
		// 配送时间列表
		// this.fetchDeliveryList();
	},

	methods: {
		...mapMutations({
			saveAddressItems: 'saveAddressItems',
			selectAddressItem: 'selectAddressItem',
			unselectAddressItem: 'unselectAddressItem',
			unselectCashgiftItem: 'unselectCashgiftItem',
			clearInvoiceInfo: 'clearInvoiceInfo',
			unselectDelivery: 'unselectDelivery',
			clearCommentInfo: 'clearCommentInfo',
			clearSelectedCartGoods: 'clearSelectedCartGoods',
			setCartNumber: 'setCartNumber',
			clearScoreInfo: 'clearScoreInfo'
		}),
		...mapActions({
			fetchShippingList: 'fetchShippingList',
			fetchCashgiftUsable: 'fetchCashgiftUsable'
			// fetchDeliveryList: 'fetchDeliveryList'
		}),

		/***滑动限制***/
		stop() {
			var mo = function(e) {
				e.preventDefault()
			}
			document.body.style.overflow = 'hidden'
			document.addEventListener('touchmove', mo, false) //禁止页面滑动
		},

		getPriceByKey(key) {
			let total = ''
			let order_price = this.order_price
			if (order_price && order_price[key]) {
				total = order_price[key]
			}
			return total
		},

		getOrderDiscountPrice(item) {
			return '-￥ ' + (item.price ? item.price : 0)
		},

		getFormatPrice(key) {
			let price = this.getPriceByKey(key)
			let priceStr = '￥ ' + (price ? this.utils.currencyPrice(price) : '0')
			return priceStr
		},

		goBack() {
			MessageBox({
				title: '',
				message: '好货不等人</br>请三思而行',
				showCancelButton: true,
				cancelButtonText: '去意已决',
				cancelButtonClass: 'cancel-button',
				confirmButtonClass: 'confirm-button-red',
				confirmButtonText: '再想想'
			}).then(action => {
				if (action === 'cancel') {
					this.clearSelectedInfo()
					this.$router.go(-1)
				}
			})
		},

		clearSelectedInfo() {
			this.unselectAddressItem()
			this.unselectCashgiftItem()
			this.clearInvoiceInfo()
			this.unselectDelivery()
			this.clearCommentInfo()
			this.clearSelectedCartGoods()
			this.clearScoreInfo()
		},

		leftClick() {
			this.goBack()
		},

		rightClick() {},

		goAddress() {
			if (this.addressItems && this.addressItems.length) {
				this.$router.push({ name: 'addressList' })
			} else {
				this.$router.push({
					name: 'addressEdit',
					query: {
						mode: 'add',
						item: null,
						isFromCheckout: true,
						goBackLevel: -1
					}
				})
			}
		},

		goGoodsList() {
			this.$router.push({ name: 'goodsList' })
		},

		goShipping() {
			this.$router.push({ name: 'shipping' })
		},

		goInvoice() {
			let title = this.invoice ? this.invoice.title : ''
			let number = this.invoice ? this.invoice.number : ''
			// TODO:
			this.$router.push({
				name: 'invoice',
				params: { title: title, number: number }
			})
		},

		// goDuration() {
		//   this.$refs.timePicker.open();
		//   // this.stop();
		// },

		onClickDate(date) {},

		onClickTime(time) {},

		goCashgiftList() {
			let shop = null
			let product_price = this.order_price
				? this.order_price.product_price
				: null
			this.$router.push({
				name: 'cashgiftUsable',
				query: { shop: shop, total_price: product_price }
			})
		},

		// fetchCartList() {
		//   cart.cartGet().then(response => {
		//     if (response && response.goods_groups.length > 0) {
		//       this.cartGoods = Object.assign([], response.goods_groups[0].goods);

		//       this.getOrderPrice();
		//     }
		//   });
		// },

		// 收货地址列表
		fetchAddressList() {
			consignee.consigneeList().then(
				response => {
					let items = response.consignees
					// 保存地址列表
					this.saveAddressItems(items)
					this.loadShippingList()
				},
				error => {
					Toast(error.errorMsg)
				}
			)
		},

		// 配送方式列表
		loadShippingList() {
			let shop = null
			console.log('====================================')
			console.log(this.getOrderProducts)
			console.log('====================================')
			let products = this.getOrderProducts
				? JSON.stringify(this.getOrderProducts)
				: null

			let address = this.selectedAddress ? this.selectedAddress.id : null
			this.fetchShippingList({
				shop: null,
				products: products,
				address: address
			}).then(
				response => {
					this.getOrderPrice()
				},
				error => {}
			)
		},

		// 可使用的红包列表
		fetchCashgiftList() {
			let shop = null
			let product_price = this.order_price
				? this.order_price.product_price
				: null
			this.fetchCashgiftUsable({
				isFirstPage: true,
				shop: shop,
				total_price: product_price
			})
		},

		// 计算订单价格
		getOrderPrice() {
			let shop = null
			let order_product = this.getOrderProducts
				? JSON.stringify(this.getOrderProducts)
				: null
			let consignee = this.selectedAddress ? this.selectedAddress.id : null
			let shipping = this.selectedShipping ? this.selectedShipping.id : null
			let coupon = null
			// TODO:
			let cashgift = this.selectedCashgift ? this.selectedCashgift.id : null
			let score = this.isExchange ? null : this.score
			let invoiceType =
				this.invoice && this.invoice.type ? this.invoice.type.id : null
			let isExchange = this.isExchange
			order
				.orderPrice(
					shop,
					order_product,
					consignee,
					shipping,
					coupon,
					cashgift,
					score,
					invoiceType,
					isExchange
				)
				.then(
					response => {
						if (response && response.order_price) {
							this.order_price = response.order_price
							this.fetchCashgiftList()
						}
					},
					error => {}
				)
		},

		checkout() {
			// TODO: 确认订单
			let shop = null
			let consignee = this.selectedAddress ? this.selectedAddress.id : null
			let shipping = this.selectedShipping ? this.selectedShipping.id : null
			let invoiceType =
				this.invoice && this.invoice.type ? this.invoice.type.id : null
			let invoiceContent =
				this.invoice && this.invoice.content ? this.invoice.content.name : null
			let invoiceTitle = this.invoice ? this.invoice.title : null
			let invoiceNumber = this.invoice ? this.invoice.number : null
			let coupon = null
			// TODO:
			let cashgift = this.selectedCashgift ? this.selectedCashgift.id : null
			let comment = this.$refs.comment.value
			let score = this.score
          if(score==null){
            alert('请输入抵扣积分')
            return false
          }
          if(score==0){
            alert('输入积分必须大于0')
            return false
		  }
			let deliveryTime = this.getSelectedDateValue
			let cartGoods = this.getCartGoodsIds
				? JSON.stringify(this.getCartGoodsIds)
				: null
			let invite_code = this.$cookie.get('r') || 0 // 获取邀请人id

			if (consignee === null || consignee === undefined) {
				Toast('请填写收货地址')
				return
			}
			if (shipping === null || shipping === undefined) {
				Toast('请选择配送方式')
				return
			}
			Indicator.open()
			if (this.isCart) {
				cart
					.cartCheckout(
						shop,
						consignee,
						shipping,
						invoiceType,
						invoiceContent,
						invoiceTitle,
						invoiceNumber,
						coupon,
						cashgift,
						comment,
						score,
						cartGoods,
						invite_code
					)
					.then(
						response => {
							Indicator.close()
							if (response && response.order) {
							  console.log(response)
								// 清除选中的信息
								this.clearSelectedInfo()
								this.getCartNumber()
								if (response.order.total == 0) {
									this.goPaySucceed(response.order)
								} else {
									this.$router.push({
										name: 'payment',
										query: {
											order: response.order.id,
											total: response.order.total,
                                      	 	orderSn: response.order.sn
										}
									})
								}
							}
						},
						error => {
							Indicator.close()
							Toast(error.errorMsg)
						}
					)
			} else {
				let good = this.cartGoods[0]
				let exchangeScore = this.isExchange ? this.exchangeScore : null
				product
					.productPurchase(
						shop,
						good.goods_id,
						good.attrs,
						good.amount,
						consignee,
						shipping,
						invoiceType,
						invoiceTitle,
						invoiceContent,
						coupon,
						cashgift,
						comment,
						score,
						exchangeScore,
						invite_code
					)
					.then(
						response => {
							Indicator.close()
							if (response && response.order) {
								// 清除选中的信息
								this.clearSelectedInfo()
								this.getCartNumber()
								if (response.order.total == 0) {
									this.goPaySucceed(response.order)
								} else {
									this.$router.push({
										name: 'payment',
										query: {
											order: response.order.id,
											total: response.order.total,
                                          	orderSn: response.order.sn
										}
									})
								}
							}
						},
						error => {
							Indicator.close()
							Toast(error.errorMsg)
						}
					)
			}
		},

		goPaySucceed(order) {
			this.$cookie.set('orderid', order.id)
			this.$router.push({
				name: 'paySucceed',
				query: { order: order.id, isExchange: this.isExchange }
			})
		},

		// 获取购物商品数量
		getCartNumber() {
			cartQuantity().then(res => {
				if (res) {
					this.setCartNumber(res.quantity)
				}
			})
		},

		getMaxUseScore() {
			for (var i = 0; i < this.cartGoods.length; ++i) {
				this.maxUseScore +=
					this.cartGoods[i].product.score * this.cartGoods[i].amount
			}
		},

		siteConfigsGet() {
			let key = ['can_invoice','use_integral']
			key = JSON.stringify(key)
			Indicator.open()
			siteConfigsGet(key).then(
				response => {
					Indicator.close()
					this.siteConfigs = response
				},
				error => {
					Indicator.close()
					Toast(error.errorMsg)
				}
			)
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
	border-bottom: 1px solid #e8eaed;
}
.body {
	margin-top: 44px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	margin-bottom: 50px;
}
.address {
	height: 100px;
}
.goods {
	height: 90px;
}
.item {
	height: 50px;
}
.section-header {
	margin-top: 8px;
}
.section-footer {
	margin-bottom: 8px;
}
.comment {
	height: 145px;
}
.desc {
	background-color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	padding-top: 10px;
	padding-bottom: 10px;
}
.desc-item {
	height: 30px;
}
.bottom-wrapper {
	position: fixed;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: stretch;
}
.amount-wrapper {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #fff;
}
.amount {
	flex: 1;
	font-size: 16px;
	color: $primaryColor;
	text-align: right;
	padding-right: 15px;
}
.submit {
	width: 150px;
	height: 50px;
	border-radius: 0px;
}
</style>
