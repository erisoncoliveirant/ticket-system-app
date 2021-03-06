import ApiService from '@/core/services/api.service'

// action types
export const CREATE_TIME_ENTRY = 'createTimeEntry'
export const DELETE_A_TIME_ENTRY = 'deleteATimeEntry'
// mutation types

const state = {}
const getters = {}
const mutations = {}

const actions = {
  async [CREATE_TIME_ENTRY] ({ commit }, payload) {
    const { id, dateFrom, dateTo, employee, note } = payload
    const timeEntry = {
      ticket_id: id,
      date_from: dateFrom,
      date_to: dateTo,
      employee_id: employee,
      note
    }
    ApiService.setHeader()
    // const { data } = await ApiService.post('time-entry', timeEntry)
    await ApiService.post('time-entry', timeEntry)
  },
  async [DELETE_A_TIME_ENTRY] ({ commit }, payload) {
    const { id } = payload
    ApiService.setHeader()
    await ApiService.delete(`time-entry/${id}`)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
