import { categoryList } from '../../api/category'

// initial state
const state = {
  items: [],
  currentItem: null
}

// mutations
const mutations = {
  saveCategoryItems(state, items) {
    state.items = items
  },
  clearCategoryItems(state) {
    state.items = null
  },
  saveCurrentCategoryItem(state, item) {
    state.currentItem = item
  },
  resetCurrentCategoryItem(state) {
    if (state.items && state.items.length) {
      state.currentItem = state.items[0]
    }
  },
}

// actions 
const actions = {
  fetchCategoryList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      categoryList(params.shop, params.category, 1, 1000).then((response) => {
        if (response && response.categories && response.categories.length) {
          commit('saveCategoryItems', response.categories)
          if (!state.currentItem) {
            commit('saveCurrentCategoryItem', response.categories[0])
          }
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