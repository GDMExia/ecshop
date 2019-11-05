import { productList } from '../../api/product'

// initial state
const state = {  
  productList: null,
  hotProductList: null,
}

// mutations
const mutations = {  
  saveIntegralMallProduct(state, item) {
    if (item === null) {
      state.productList = item
    } else {
      state.productList = item
    }
  },
  saveIntegralMallHotProduct(state, item) {
    state.hotProductList = item
  }
}

// actions 
const actions = {
  fetchIntegralMallProductList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      productList(params.brand, params.category, params.shop, params.is_exchange, params.is_hot, params.activity, params.sort_key, params.sort_value, params.page, params.per_page).then(
        (response) => {          
          if (response && response.products) {
            if (params.page === 1) {
              commit('saveIntegralMallProduct', null)
            }
            let items = state.productList || []
            items = items.concat(response.products)
            commit('saveIntegralMallProduct', items)
          }
          resolve(response)
        }, (error) => {
          reject(error)          
        })
    })
  },
  fetchIntegralMallHotProductList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      productList(null, null, null, 1, 1, null, null, null, null, null).then(
        (response) => {          
          if (response && response.products) {
            commit('saveIntegralMallHotProduct', response.products)
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