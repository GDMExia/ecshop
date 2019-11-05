// search.js
import { searchKeywordList } from '../../api/search'

// initial state
const state = {
	currentKey: '',
	hotKeywords: null,
}

// mutations
const mutations = {
	//
	changeKey(state, value) {
		state.currentKey = value;
	},
	saveHotKeywords(state, items) {
		state.hotKeywords = items;
	}
}

// actions 
const actions = {
  fetchSearchKeywordList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      searchKeywordList().then(
        (response) => {          
          if (response && response.keywords) {
            commit('saveHotKeywords', response.keywords)
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
