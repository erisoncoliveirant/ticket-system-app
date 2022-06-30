import ApiService from '@/core/services/api.service'

// action types
export const GET_LIST_OF_KINDS = 'getListOfKinds'
// mutation types
export const SET_KINDS = 'setListOfKinds'

const state = {
  kinds: [],
  pagination: {}
}

const getters = {}

const mutations = {
  [SET_KINDS] (state, payload) {
    state.kinds = payload
  }
}

const actions = {
  async [GET_LIST_OF_KINDS] ({ commit }, payload) {
    ApiService.setHeader()
    const { data } = await ApiService.query('kinds', {
      params: payload
    })
    commit(SET_KINDS, data.data)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
