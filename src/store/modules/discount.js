import { activityList } from '../../api/activity'

// initial state
const state = {  
  activitiesList: null,
}

// mutations
const mutations = {  
  saveActivityList(state, item) {
    state.activitiesList = item
  }
}

// actions 
const actions = {
  fetchActivityList({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      activityList().then(
        (response) => {          
          if (response && response.activities) {
            commit('saveActivityList', response.activities)
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