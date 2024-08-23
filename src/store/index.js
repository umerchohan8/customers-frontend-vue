import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    customers: [],
    sortBy: 'id',
    sortDirection: 'asc',
    page: 1,
  },
  mutations: {
    SET_CUSTOMERS(state, customers) {
      state.customers = customers;
    },
    SET_SORT(state, { sortBy, sortDirection }) {
      state.sortBy = sortBy;
      state.sortDirection = sortDirection;
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
  },
  actions: {
    async fetchCustomers({ commit, state }) {
      const response = await axios.get('http://localhost:8000/api/customers', {
        params: {
          page: state.page,
          sortBy: state.sortBy,
          sortDirection: state.sortDirection,
        },
      });
      commit('SET_CUSTOMERS', response.data.data);
    },
    sortCustomers({ commit, dispatch }, { sortBy, sortDirection }) {
      commit('SET_SORT', { sortBy, sortDirection });
      dispatch('fetchCustomers');
    },
    changePageInStore({ commit, dispatch }, pageNumber) {
      commit('SET_PAGE', pageNumber);
      dispatch('fetchCustomers'); // Assuming you have a fetchCustomers action
    },
  },
});
