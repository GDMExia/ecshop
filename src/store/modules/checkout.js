// initial state
const state = {
  comment: '',
  score: null,
}

// mutations
const mutations = {
  saveCommentInfo(state, payload) {        
    state.comment = payload.comment
  },
  clearCommentInfo(state) {
    state.comment = ''
  },

  saveScoreInfo(state, value) {
  	state.score = value;
  },
  clearScoreInfo(state) {
    state.score = null;
  },
}

export default {
  state,
  mutations
}