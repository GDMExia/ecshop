import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import * as getters from './getter'
import mutations from './mutations'
import actions from './actions'

import auth from './modules/auth'
import config from './modules/config'
// import cardpage from './modules/cardpage'
import category from './modules/category'
import address from './modules/address'
import region from './modules/region'
import detail from './modules/detail'
import shipping from './modules/shipping'
import coupon from './modules/coupon'
import invoice from './modules/invoice'
import product from './modules/product'
import cart from './modules/cart'
import delivery from './modules/delivery'
import search from './modules/search'
import profile from './modules/profile'
import order from './modules/order'
import tabBar from './modules/tabbar'
import message from './modules/message'
import checkout from './modules/checkout'
import home from './modules/home'
import score from './modules/score'
import cashgift from './modules/cashgift'
import discount from './modules/discount'
import integralmall from './modules/integralmall'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		auth,
		config,
		// cardpage,
		category,
		address,
		region,
		detail,
		product,
		cart,
		shipping,
		coupon,
		invoice,
		delivery,
		search,
		profile,
		order,
		tabBar,
		checkout,
		message,
		home,
		score,
		cashgift,
		discount,
		integralmall
	},
	getters: getters,
	actions,
	mutations,
	plugins: [
		createPersistedState({
			key: 'ecm',
			paths: [
				'auth',
				'region',
				'tabBar',
				'category',
				'cart',
				'profile',
				'message',
				'home'
			]
		})
	]
})
