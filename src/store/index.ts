import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    friends: []
  },
  mutations: {
    setUser(state, data) {
      state.user = data 
    },
    setFriends(state, data) {
      state.friends = data
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getFriends: state => {
      return state.friends
    }
  },
  actions: {
  },
  modules: {
  }
})
