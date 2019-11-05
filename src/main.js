import Vue from 'vue'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueResource from 'vue-resource'

import Mint from 'mint-ui'
import * as qiniu from 'qiniu-js'

import App from './App.vue'

import router from './router/index'
import store from './store/index'
import utils from './util/util'
import validator from './util/validator'
import wxApi from './util/wxapi'

import Cookies from 'js-cookie'

import 'swiper/dist/css/swiper.css'
import 'mint-ui/lib/style.css'
import './assets/style/reset.scss'
import './assets/style/common.scss'
import './assets/style/my-mint.scss'
import * as authBase from './api/auth-base'
import { Indicator, Toast, Header } from 'mint-ui'
import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.config.productionTip = false

// 使用moment处理日期格式
import Moment from 'moment'
Vue.filter('convertTime', function (timeStr) {
	return Moment(timeStr).format('YYYY-MM-DD HH:mm:ss')
})

router.beforeEach((to, from, next) => {
	console.log(to.fullPath)
	console.log(store.state)
	var reg = new RegExp("(^|&)token=([^&]*)(&|$)");
	const search = location.search.substr(1).match(reg)
	console.log(search)

	if (to.fullPath != '/signin') {
		if (!(store.state.auth.isOnline)) {
			// router.push('signin')
			if (search) {
				store.commit('setInfoToken', search[2])
				next('signin')
			} else {
				location.href = `http://pts.suoqoo.com/home.php/WechatLogin/accountLogin?callback_url=http://xgh5.suoqoo.com/#/signin`
				// location.href = `http://pts.suoqoo.com/home.php/WechatLogin/accountLogin?callback_url=http://127.0.0.1:8080/#/signin`
			}
			// // location.href = `http://pts.suoqoo.com/home.php/WechatLogin/accountLogin?callback_url=http://xgh5.suoqoo.com/#/signin`
			// location.href = `http://pts.suoqoo.com/home.php/WechatLogin/accountLogin?callback_url=http://127.0.0.1:8080/#/signin`

		} else {
			next()
		}
	}else{
		next()
	}
	let metaData = to.meta;
	if (metaData.setIsShowTabBar) {
		for (const key in to.params) {
			if (key == metaData.setIsShowTabBar) {
				metaData.isshowtabbar = parseInt(to.params[metaData.setIsShowTabBar]);
			}
		}
	}
	next();
});

Vue.use(Mint)
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)
Vue.use(qiniu)
// Vue.use(VueAxios, axios)

Vue.prototype.utils = utils;
Vue.prototype.validator = validator;
Vue.prototype.wxApi = wxApi;
Vue.prototype.$cookie = Cookies;


window.router = router;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
