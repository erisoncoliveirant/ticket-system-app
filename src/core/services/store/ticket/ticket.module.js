import ApiService from '@/core/services/api.service'

// action types
export const GET_LIST_OF_TICKETS = 'getListOfTickets'
export const GET_A_TICKET = 'getATicket'
export const GET_ASSIGNED_TICKETS_EMPLOYEES = 'getAssignedTicketsEmployees'
export const GET_TICKET_TIME_ENTRY = 'getTicketTimeEntry'

export const CREATE_A_TICKET = 'createATicket'
export const UPDATE_A_TICKET = 'updateATicket'
export const DELETE_A_TICKET = 'deleteATicket'
// mutation types
export const SET_TICKETS = 'setTickets'

const state = {
  tickets: [],
  pagination: {}
}

const getters = {}

const mutations = {
  [SET_TICKETS] (state, payload) {
    state.tickets = payload
  }
}

const actions = {
  async [GET_LIST_OF_TICKETS] (
    { commit },
    payload = { q: '', page: 1, per_page: 10 }
  ) {
    ApiService.setHeader()
    const { data } = await ApiService.query('tickets', {
      params: payload
    })
    commit(SET_TICKETS, data.data)
  },
  async [GET_A_TICKET] ({ commit }, payload) {
    ApiService.setHeader()
    const { data } = await ApiService.get('tickets', `${payload}`)
    return data
  },
  async [CREATE_A_TICKET] ({ commit }, payload) {
    const {
      date,
      title,
      description,
      employees,
      selectedCategories,
      selectedStatus,
      selectedPriorities,
      selectedKind
    } = payload

    const emp = employees.map((item) => item.id)

    const ticket = {
      date,
      title,
      description,
      kind_id: selectedKind,
      category_id: selectedCategories,
      priority_id: selectedPriorities,
      status_id: selectedStatus,
      employees: emp
    }
    ApiService.setHeader()
    return await ApiService.post('tickets', ticket)
  },
  async [UPDATE_A_TICKET] ({ commit }, payload) {
    const {
      id,
      date,
      title,
      description,
      employees,
      selectedCategories,
      selectedStatus,
      selectedPriorities,
      selectedKind
    } = payload

    const emp = employees.map((item) => item.id)

    const ticket = {
      date,
      title,
      description,
      kind_id: selectedKind,
      category_id: selectedCategories,
      priority_id: selectedPriorities,
      status_id: selectedStatus,
      employees: emp
    }

    ApiService.setHeader()
    return await ApiService.update('tickets', `${id}`, ticket)
  },
  async [GET_ASSIGNED_TICKETS_EMPLOYEES] ({ commit }, payload) {
    const { data } = await ApiService.get(
      'assigned-tickets-employees',
        `${payload}`
    )
    return data
  },
  async [GET_TICKET_TIME_ENTRY] ({ commit }, payload) {
    const { data } = await ApiService.get(
      'tickets',
        `${payload}/time-entries`
    )
    return data
  },
  async [DELETE_A_TICKET] ({ commit }, payload) {
    ApiService.setHeader()
    await ApiService.delete(`tickets/${payload}`)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
