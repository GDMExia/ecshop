<!-- footer.vue -->
<template>
	<div
		class="ui-detail-footer"
		v-if="detailInfo"
		v-bind:class="{
			'hidden-cart-footer': ispromotion,
			'show-cart-footer': !ispromotion
		}"
	>
		<div class="footer-flex" v-if="!this.isExchange">
			<div class="left">
				<img
					src="../../assets/image/change-icon/b0_cart@2x.png"
					v-on:click="goCart()"
				/>
				<span class="icon" v-if="cartNumber > 0">{{ getCarCount }}</span>
			</div>
			<div class="right">
				<div
					class="button active-cart"
					v-on:click="addShopping(true)"
					v-if="detailInfo.good_stock > 0"
				>
					加入购物车
				</div>
				<div class="button disabled-cart" v-if="detailInfo.good_stock <= 0">
					加入购物车
				</div>
				<div
					class="button active-buy"
					v-on:click="checkout()"
					v-if="detailInfo.good_stock > 0"
				>
					立即购买
				</div>
				<div class="button disabled-buy" v-if="detailInfo.good_stock <= 0">
					立即购买
				</div>
			</div>
		</div>
		<div class="footer-flex" v-if="this.isExchange">
			<div class="right">
				<div
					class="button active-cart"
					v-on:click="checkout()"
					v-if="
						detailInfo.good_stock > 0 &&
							this.currentScore >= detailInfo.exchange_score
					"
				>
					立即兑换
				</div>
				<div
					class="button disabled-cart"
					v-else="this.currentScore < detailInfo.exchange_score"
				>
					立即兑换
				</div>
			</div>
		</div>

		<p class="good-stock-none" v-if="detailInfo.good_stock <= 0">
			所选产品暂时无货，非常抱歉！
		</p>
		<p
			class="good-stock-none"
			v-else-if="
				this.isExchange && this.currentScore < detailInfo.exchange_score
			"
		>
			积分不足
		</p>

		<shopping v-if="isShowcartInfo" :isShowcartInfo="isShowcartInfo"></shopping>

		<!-- 加入购物车显示动画 -->
		<div class="ui-cart-animation" v-if="isAnimation">
			<mt-spinner type="snake" color="#FA800A"></mt-spinner>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { MessageBox } from 'mint-ui'
import shopping from './child/Shopping'

export default {
	data() {
		return {
			isAnimation: false //加入购物车成功之后是否显示动画
		}
	},

	components: {
		shopping
	},

	props: {
		ishidefooter: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		...mapState({
			//是否显示购物车浮层
			isShowcartInfo: state => state.detail.isShowcartInfo,
			detailInfo: state => state.detail.detailInfo,
			isOnline: state => state.auth.isOnline,
			ispromotion: state => state.detail.ispromotion,
			cartNumber: state => state.tabBar.cartNumber,
			chooseinfo: state => state.detail.chooseinfo,
			number: state => state.detail.number,
			isExchange: state => state.score.isExchange,
			currentScore: state => state.score.currentScore
		}),
		getCarCount() {
			if (this.cartNumber > 0 && this.cartNumber < 100) {
				return this.cartNumber
			} else if (this.cartNumber >= 100) {
				return '99+'
			}
		}
	},

	created() {
		this.$on('start-addcart-animation', () => {
			this.isAnimation = true
		})
		this.$on('end-addcart-animation', () => {
			this.isAnimation = false
			this.saveCartState(false)
		})
	},

	methods: {
		...mapMutations({
			saveCartState: 'saveCartState',
			changeType: 'changeType',
			saveSelectedCartGoods: 'saveSelectedCartGoods',
			saveExchangeScoreState: 'saveExchangeScoreState'
		}),

		// 加入购物车
		addShopping(value) {
			this.saveCartState(value)
			this.changeType('确定')
		},

		// 立即购买
		checkout() {
			if (
				this.chooseinfo.specification.length != 0 &&
				this.chooseinfo.ids.length == 0
			) {
				this.addShopping(true)
				return
			}

			if (!this.isOnline) {
				this.$router.push({ name: 'signin' })
			} else {
				if (this.detailInfo.properties.length > 0) {
					let status = true
					if (this.chooseinfo.ids.length <= 0) {
						status = false
					} else {
						for (let i = 0; i <= this.chooseinfo.ids.length - 1; i++) {
							if (
								this.chooseinfo.ids[i] == '' ||
								this.chooseinfo.ids[i] == undefined
							) {
								status = false
								break
							}
						}
					}
					if (status) {
						this.checkoutGood()
					} else {
						Toast('请选择商品属性')
						return false
					}
				} else {
					this.checkoutGood()
				}
			}
		},

		checkoutGood() {
			let params = {
				product: this.detailInfo,
				property: '',
				amount: this.numbers ? this.numbers : 1
			}
			if (this.chooseinfo.ids.length > 0) {
				params.property = JSON.stringify(this.chooseinfo.ids)
				let str = this.fromatArray('|', this.chooseinfo.ids),
					stock = this.isHasStock(str)
				if (parseInt(stock) <= 0) {
					Toast('商品库存不足')
					return false
				}
			}

			let cardGood = {
				goods_id: this.detailInfo.id,
				product: this.detailInfo,
				property: '',
				attrs: params.property ? params.property : '[]',
				num: params.amount,
				amount: params.amount,
				chooseinfo: this.chooseinfo,
				price: this.detailInfo.current_price
			}

			if (this.chooseinfo.specification.length > 0) {
				let attrs = this.chooseinfo.specification
				for (let i = 0; i <= attrs.length - 1; i++) {
					cardGood.property = cardGood.property + '' + attrs[i]
				}
			}

			let cardGoods = [cardGood]
			if (this.isExchange) {
				MessageBox({
					title: '确认兑换',
					message: '是否使用' + this.detailInfo.exchange_score + '积分兑换',
					showCancelButton: true,
					cancelButtonText: '取消',
					cancelButtonClass: 'cancel-button',
					confirmButtonClass: 'confirm-button-red',
					confirmButtonText: '确认'
				}).then(action => {
					if (action === 'confirm') {
						this.saveExchangeScoreState(this.detailInfo.exchange_score)
						this.saveSelectedCartGoods({ cartGoods: cardGoods })
						this.$router.push({
							name: 'checkout',
							params: {
								exchangeScore: this.detailInfo.exchange_score,
								isExchange: this.isExchange
							}
						})
					}
				})
			} else {
				this.saveExchangeScoreState(0)
				this.saveSelectedCartGoods({ cartGoods: cardGoods })
				this.$router.push({ name: 'checkout' })
			}
		},

		// 购物车
		goCart() {
			if (this.isOnline) {
				this.$router.push({ name: 'cart', params: { type: 0 } })
			} else {
				this.$router.push({ name: 'signin' })
			}
		},

		/*
		 * fromatArray: 格式化数组
		 */
		fromatArray(delimiter, arrays) {
			let data = ''
			if (delimiter) {
				data = arrays.join(delimiter)
			}
			return delimiter ? data : arrays
		},

		/*
		 * isHasStock: 是否还有库存
		 */
		isHasStock(id) {
			let data = this.detailInfo.stock
			if (data.length > 0) {
				for (let i = 0, len = data.length; i <= len - 1; i++) {
					if (data[i].goods_attr == id) {
						return '' + data[i].stock_number + ''
					}
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.ui-detail-footer {
	background: rgba(255, 255, 255, 1);
	border-top: 0.5px solid #e8eaed;
	width: auto;
	position: absolute;
	bottom: 0px;
	left: 0px;
	right: 0px;
	z-index: 0;
	&.hidden-cart-footer {
		display: none;
	}

	&.show-cart-footer {
		display: block;
	}

	.footer-flex {
		display: flex;
		justify-content: space-between;
		align-content: center;
		align-items: center;
		height: 44px;
	}
	p.good-stock-none {
		width: 100%;
		height: 32px;
		background: #c3c3c3;
		opacity: 0.5;
		font-size: 14px;
		color: #333333;
		line-height: 20px;
		position: absolute;
		text-align: center;
		line-height: 32px;
		padding: 0px;
		margin: 0px;
		bottom: 44px;
	}
	div.left {
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			width: 30px;
			height: 30px;
			flex-shrink: 0;
			margin: 7px 25px;
		}
		span.icon {
			position: absolute;
			left: 40px;
			top: 8px;
			font-size: 10px;
			line-height: 14px;
			width: 18px;
			height: 14px;
			background: #ef3338;
			border-radius: 20px;
			text-align: center;
			color: #ffffff;
		}
	}
	div.right {
		flex: 1;
		display: flex;
		flex-direction: row;
		.button {
			flex: 1;
			height: 44px;
			font-size: 16px;
			color: #ffffff;
			text-align: center;
			line-height: 44px;
			cursor: pointer;
		}
		.disabled-cart {
			background: #c3c3c3;
		}
		.active-cart {
			background: $primaryColor;
		}
		.disabled-buy {
			background: #999999;
		}
		.active-buy {
			background: #f40000;
		}
	}
}
.ui-cart-animation {
	position: fixed;
	top: 50%;
	left: 50%;
}
</style>
