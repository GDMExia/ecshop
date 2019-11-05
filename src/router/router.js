import App from '../App'

// home
const Home = () => import('@/page/home/Home')

// category
const Category = () => import('@/page/category/Category')

// product list
const ProductList = () => import('@/page/product-list/ProductList')

// product detail
const ProductDetail = () => import('@/page/product-detail/ProductDetail')

// cart
const Cart = () => import('@/page/cart/cart')

// product recommend & accessory
const Recommend = () => import('@/page/recommend/Recommend')
const Accessory = () => import('@/page/recommend/Accessory')

const Promotions = () => import('@/page/promotions/Promotions')

// search
const Search = () => import('@/page/search/Search')

// auth
const Signin = () => import('@/page/auth/Signin')
const Signup = () => import('@/page/auth/Signup')
const Retrieve = () => import('@/page/auth/Retrieve')
const MobileConfirm = () => import('@/page/auth/MobileConfirm')
const EmailConfirm = () => import('@/page/auth/EmailConfirm')
const Bind = () => import('@/page/auth/Bind')
const WebPage = () => import('@/page/auth/WebPage')

// profile
const Profile = () => import('@/page/profile/Profile')
const ProfileInfo = () => import('@/page/profile/ProfileInfo')
const ProfileEdit = () => import('@/page/profile/ProfileEdit')
const ProfileAdd = () => import('@/page/profile/ProfileAdd')

const Setting = () => import('@/page/profile/Setting')
const Help = () => import('@/page/profile/Help')
const HelpUrl = () => import('@/page/profile/child/HelpUrl')
const Collection = () => import('@/page/profile/Collection')

// message
const MessageCenter = () => import('@/page/message/MessageCenter')
const OrderMessageList = () => import('@/page/message/OrderMessageList')
const SystemMessageList = () => import('@/page/message/SystemMessageList')

// cardpage
const CardPage = () => import('@/page/cardpage/CardPage')

// address
const AddressList = () => import('@/page/address/AddressList')
const AddressManage = () => import('@/page/address/AddressManage')
const AddressEdit = () => import('@/page/address/AddressEdit')

// coupon
const CouponList = () => import('@/page/coupon/CouponList')
const CouponUsable = () => import('@/page/coupon/CouponUsable')

// cashgift
const CashgiftList = () => import('@/page/cashgift/CashgiftList')
const CashgiftUsable = () => import('@/page/cashgift/CashgiftUsable')
const CashgiftAdd = () => import('@/page/cashgift/CashgiftAdd')

// score
const ScoreList = () => import('@/page/score/ScoreList')
const ScoreRule = () => import('@/page/score/child/ScoreRule')

// checkout
const Checkout = () => import('@/page/checkout/Checkout')
const GoodsList = () => import('@/page/checkout/GoodsList')
const Shipping = () => import('@/page/checkout/Shipping')
const Invoice = () => import('@/page/checkout/Invoice')

// payment
const Payment = () => import('@/page/payment/Payment')
const PaySucceed = () => import('@/page/payment/PaySucceed')

// order
const Order = () => import('@/page/order/Order')
const OrderDetail = () => import('@/page/order/OrderDetail')
const OrderTrack = () => import('@/page/order/child/OrderTrack')
const OrderTrade = () => import('@/page/order/child/OrderTrade')
const OrderComment = () => import('@/page/order/child/OrderComment')
const OrderSubmit = () => import('@/page/order/child/OrderSubmit')

// Discount
const Discount = () => import('@/page/discount/Discount')
const DiscountDetail = () => import('@/page/discount/DiscountDetail')

// IntegralMall
const IntegralMall = () => import('@/page/integralmall/IntegralMall')

// bonus
const BonusList = () => import('@/page/bonus/BonusList')
const BonusRule = () => import('@/page/bonus/BonusRule')
const RecommendList = () => import('@/page/bonus/RecommendList')
const BonusQR = () => import('@/page/bonus/BonusQR')

// balance
const BalanceUsable = () => import('@/page/balance/BalanceUsable')
const BalanceHistory = () => import('@/page/balance/BalanceHistory')

// withdraw
const WithdrawSuccess = () => import('@/page/withdraw/WithdrawSuccess')
const WithdrawHistory = () => import('@/page/withdraw/WithdrawHistory')

export default [
	{
		path: '/',
		component: App,
		children: [
			{
				path: '',
				redirect: '/home'
			},
			{
				name: 'home',
				path: '/home',
				component: Home,
				meta: {
					isshowtabbar: true
				}
			},
			{
				name: 'category',
				path: '/category',
				component: Category,
				meta: {
					isshowtabbar: true
				}
			},
			{
				name: 'products',
				path: '/products',
				component: ProductList
			},
			{
				name: 'search',
				path: '/search',
				component: Search
			},
			{
				name: 'signin',
				path: '/signin',
				component: Signin
			},
			{
				name: 'signup',
				path: '/signup',
				component: Signup
			},
			{
				name: 'retrieve',
				path: '/retrieve',
				component: Retrieve
			},
			{
				name: 'mobileConfirm',
				path: '/mobileConfirm',
				component: MobileConfirm
			},
			{
				name: 'emailConfirm',
				path: '/emailConfirm',
				component: EmailConfirm
			},
			{
				name: 'bind',
				path: '/bind',
				component: Bind
			},
			{
				name: 'webPage',
				path: '/webPage',
				component: WebPage
			},
			{
				name: 'profile',
				path: '/profile',
				component: Profile,
				meta: {
					isshowtabbar: true
				}
			},
			{
				name: 'setting',
				path: '/setting',
				component: Setting
			},
			{
				name: 'profileInfo',
				path: '/profileInfo',
				component: ProfileInfo
			},
			{
				name: 'profileAdd',
				path: '/profileAdd',
				component: ProfileAdd
			},
			{
				name: 'help',
				path: '/help',
				component: Help
			},
			{
				name: 'HelpUrl',
				path: '/helpUrl',
				component: HelpUrl
			},
			{
				name: 'messageCenter',
				path: '/messageCenter',
				component: MessageCenter,
				meta: {
					keepAlive: false
				}
			},
			{
				name: 'orderMessageList',
				path: '/orderMessageList',
				component: OrderMessageList
			},
			{
				name: 'systemMessageList',
				path: '/systemMessageList',
				component: SystemMessageList
			},
			{
				name: 'Collection',
				path: '/collection',
				component: Collection
			},
			{
				name: 'addressList',
				path: '/addressList',
				component: AddressList
			},
			{
				name: 'addressManage',
				path: '/addressManage',
				component: AddressManage,
				meta: {
					keepAlive: false
				}
			},
			{
				name: 'addressEdit',
				path: '/addressManage/addressEdit',
				component: AddressEdit,
				meta: {
					keepAlive: false
				}
			},
			{
				name: 'couponList',
				path: '/couponList',
				component: CouponList
			},
			{
				name: 'couponUsable',
				path: '/checkout/couponUsable',
				component: CouponUsable,
				meta: {
					keepAlive: true
				}
			},
			{
				name: 'cashgiftList',
				path: '/cashgiftList',
				component: CashgiftList
			},
			{
				name: 'cashgiftUsable',
				path: '/checkout/cashgiftUsable',
				component: CashgiftUsable,
				meta: {
					keepAlive: true
				}
			},
			{
				name: 'cashgiftAdd',
				path: '/cashgiftAdd',
				component: CashgiftAdd,
				meta: {
					keepAlive: true
				}
			},
			{
				name: 'checkout',
				path: '/checkout/:isExchange?/:exchangeScore?/:isCart?',
				component: Checkout,
				meta: {
					keepAlive: false
				}
			},
			{
				name: 'payment',
				path: '/payment',
				component: Payment
			},
			{
				name: 'paySucceed',
				path: '/paySucceed',
				component: PaySucceed
			},
			{
				name: 'goodsList',
				path: '/checkout/goodsList',
				component: GoodsList
			},
			{
				name: 'shipping',
				path: '/checkout/shipping',
				component: Shipping
			},
			{
				name: 'invoice',
				path: '/checkout/invoice',
				component: Invoice
			},
			{
				name: 'cardpage',
				path: '/cardpage/:name',
				component: CardPage
			},
			{
				name: 'order',
				path: '/order/:order?',
				component: Order
			},
			{
				name: 'orderDetail',
				path: '/orderDetail/:orderDetail?',
				component: OrderDetail
			},
			{
				name: 'orderTrack',
				path: '/orderTrack/:orderTrack?',
				component: OrderTrack
			},
			{
				name: 'orderTrade',
				path: '/orderTrade',
				component: OrderTrade
			},
			{
				name: 'orderComment',
				path: '/orderComment',
				component: OrderComment
			},
			{
				name: 'orderSubmit',
				path: '/orderSubmit',
				component: OrderSubmit
			},
			{
				name: 'product',
				path: '/product/:id?/:productId?',
				component: ProductDetail
			},
			{
				name: 'cart',
				path: '/cart/:type?',
				component: Cart,
				meta: {
					isshowtabbar: true,
					setIsShowTabBar: 'type'
				}
			},
			{
				name: 'recommend',
				path: 'recommend/:product?/:category?/:brand?/:shop?',
				component: Recommend,
				meta: {
					keepAlive: false
				}
			},
			{
				name: 'accessory',
				path: '/accessory/:product?',
				component: Accessory
			},
			{
				name: 'profileEdit',
				path: '/profileEdit/:type',
				component: ProfileEdit
			},
			{
				name: 'scoreList',
				path: '/scoreList',
				component: ScoreList
			},
			{
				name: 'scoreRule',
				path: '/scoreRule',
				component: ScoreRule
			},
			{
				name: 'promotions',
				path: '/promotions',
				component: Promotions
			},
			{
				name: 'integralMall',
				path: '/integralMall',
				component: IntegralMall
			},
			{
				name: 'bonusList',
				path: '/bonusList',
				component: BonusList
			},
			{
				name: 'bonusQR',
				path: '/bonusQR',
				component: BonusQR
			},
			{
				name: 'bonusRule',
				path: '/bonusRule',
				component: BonusRule
			},
			{
				name: 'recommendList',
				path: '/recommendList',
				component: RecommendList
			},
			{
				name: 'balanceUsable',
				path: '/balanceUsable',
				component: BalanceUsable
			},
			{
				name: 'discount',
				path: '/discount',
				component: Discount
			},
			{
				name: 'discountDetail',
				path: '/discountDetail',
				component: DiscountDetail
			},
			{
				name: 'balanceHistory',
				path: '/balanceHistory',
				component: BalanceHistory
			},
			{
				name: 'withdrawSuccess',
				path: '/withdrawSuccess',
				component: WithdrawSuccess
			},
			{
				name: 'withdrawHistory',
				path: '/withdrawHistory',
				component: WithdrawHistory
			}
		]
	}
]
