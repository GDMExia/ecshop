// profile.js
const state = {
	isSwitch: true, // switch == true ? 开 : 关	
}

// mutations
const mutations = {	
	changeOpen(state, value) {
		state.isSwitch = value
	}
}

export default {
	state,
	mutations
}
