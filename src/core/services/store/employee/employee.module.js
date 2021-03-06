import ApiService from '@/core/services/api.service'

// action types
export const GET_LIST_OF_EMPLOYEES = 'getListOfEmployees'
export const GET_A_EMPLOYEE = 'getAEmployee'
export const CREATE_A_EMPLOYEE = 'createAEmployee'
export const DELETE_A_EMPLOYEE = 'deleteAEmployee'
export const UPDATE_A_EMPLOYEE = 'updateAEmployee'
// mutation types
export const SET_EMPLOYEES = 'setEmployees'

const state = {
  employees: [],
  pagination: {}
}

const getters = {}

const mutations = {
  [SET_EMPLOYEES] (state, payload) {
    state.employees = payload
  }
}

const actions = {
  async [GET_LIST_OF_EMPLOYEES] (
    { commit },
    payload = { q: '', page: 1, activated: 1, per_page: 10 }
  ) {
    ApiService.setHeader()
    const { data } = await ApiService.query('employees', {
      params: payload
    })
    commit(SET_EMPLOYEES, data.data)
  },
  async [GET_A_EMPLOYEE] ({ commit }, payload) {
    ApiService.setHeader()
    const { data } = await ApiService.get('employees', `${payload}`)
    return data
  },
  async [CREATE_A_EMPLOYEE] ({ commit }, payload) {
    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      activated
    } = payload
    const employee = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: repeatPassword,
      activated
    }
    ApiService.setHeader()
    return await ApiService.post('employees', employee)
  },

  async [UPDATE_A_EMPLOYEE] ({ commit }, payload) {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      activated
    } = payload
    const employee = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: repeatPassword,
      activated
    }
    ApiService.setHeader()
    return await ApiService.update('employees', `${id}`, employee)
  },

  async [DELETE_A_EMPLOYEE] ({ commit }, payload) {
    ApiService.setHeader()
    await ApiService.delete(`employees/${payload}`)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
