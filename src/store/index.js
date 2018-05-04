import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // = data
    products: []
  },

  getters: { // = computed properties
    /**
     * Get the available products
     * @param {*} state - Vuex state
     * @param {*} getters - All existing Vuex getters
     */
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
    }
  },

  actions: { // = methods
    /**
     * Make the call to the shop API
     * and run the setProducts mutation
     * @param {*} context.commit - Commit method from the context object
     */
    fetchProducts ({ commit }) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    }
  },

  mutations: { // alter state
    /**
     * Update the products
     * @param {*} state - Vuex state
     * @param {*} products - The payload
     */
    setProducts (state, products) {
      state.products = products
    }
  }
})
