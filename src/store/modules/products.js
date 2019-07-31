import shop from '@/api/shop'

export default {
  namespaced: true,
  
  state: {
    items: []
    // { id, quantity }
  },

  getters: {
    /**
     * Get the available products
     * @param {*} state - Vuex state
     * @param {*} getters - All existing Vuex getters
     */
    availableProducts (state, getters) {
      return state.items.filter(product => product.inventory > 0)
    },

    /**
     * Check if a product is in stock
     */
    productIsInStock () {
      return product => product.inventory > 0
    }
  },

  actions: {
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

  mutations: {
    /**
     * Update the products
     * @param {*} state - Vuex state
     * @param {*} products - The payload
     */
    setProducts (state, products) {
      state.items = products
    },

    /**
     * Decrement a product inventory by one
     * @param {*} state - Vuex state
     * @param {*} product - A product
     */
    decrementProductInventory (state, product) {
      product.inventory--
    }
  }
}