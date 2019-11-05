import { bannerList } from '../../api/banner'
import { homeProductList } from '../../api/home'

// initial state
const state = {  
  banners: null,
  hotProducts: null,
  recentlyProducts: null,
  goodProducts: null,
}

// mutations
const mutations = {  
  saveHomeBanners(state, items) {
    state.banners = items
  },
  saveHomeProducts(state, data) {
    state.hotProducts = data.hot_products;
    state.recentlyProducts = data.recently_products;
    state.goodProducts = data.good_products;
  }
}

// actions 
const actions = {
  fetchHomeBanner({commit, state}, params) {
    return new Promise((resolve, reject) => {
      bannerList(params.name).then(
        (response) => {
          if (response && response.banners) {
            commit('saveHomeBanners', response.banners)
          }
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },

  fetchHomeProduct({commit, state}, params) {
    return new Promise((resolve, reject) => {
      homeProductList(params.name).then(
        (response) => {
          if (response) {
            commit('saveHomeProducts', response)
          }
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}