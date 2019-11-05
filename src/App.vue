<template>
	<div class="app">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
		<v-tab-bar v-if="$route.meta.isshowtabbar" ref="bar"></v-tab-bar>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import tabBar from './components/common/Tabbar'
import { cartQuantity } from './api/cart'
import { configGetAffiliate } from './api/config'
import { Toast } from 'mint-ui'
export default {
	name: 'app',
	data(){
		return {
			affiliate_expire: 0
		}
	},
	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline
		})
	},
	created: function() {
		this.loadConfig()
		if (this.isOnline) {
			this.getCartNumber()
		}
		// this.saveAuthInfo()

		let name = this.$route.name
		if (name) {
			this.changeTabBar(name)
		}
		
	},
	watch: {
		$route(to, from) {
			// 路由改变发起重置
			this.resetStates()
			this.changeTabBar(to.name)
			if (to.name == 'cart' || from.name == 'cart') {
				this.getCartNumber()
			}
		}
	},
	methods: {
		...mapMutations({
			saveToken: 'saveToken',
			clearToken: 'clearToken',
			changeTabBar: 'changeTabBar',
			setCartNumber: 'setCartNumber'
		}),
		...mapActions({
			resetStates: 'resetStates'
		}),
		goBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
		},
		getCartNumber() {
			cartQuantity().then(res => {
				if (res) {
					this.setCartNumber(res.quantity)
				}
			})
		},
		saveAuthInfo() {
			let location = window.location
			let references = this.utils.getUrlKey(location.href, 'u')
			if (references) {
				if(this.affiliate_expire > 0){
					let inFifteenMinutes = new Date(this.affiliate_expire*1000)
					this.$cookie.set('r', references,{expires:inFifteenMinutes})
				}else{
					this.$cookie.set('r', references)
				}
			}
			let token = this.utils.getUrlKey(location.href, 'token')
			if (token) {
				this.$cookie.set('t', token)
				this.saveToken({ token: token })
			}
		},
		loadConfig() {
			configGetAffiliate().then(
				response => {
					if(response.on == 1 && response.separate_by == 1){
						this.affiliate_expire = response.expire
					}
					this.saveAuthInfo()
				},
				error => {}
			)
		}
	},
	components: {
		'v-tab-bar': tabBar
	}	
}
</script>

<style>
div.app {
	height: 100%;
}
</style>
