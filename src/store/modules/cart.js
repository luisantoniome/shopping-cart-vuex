import shop from '@/api/shop'

export default {
  namespaced: true,

  state: {
    items: [],
    checkoutStatus: null
  },

  getters: {
    /**
     * Get the products from the cart
     * @param {*} state - Vuex state
     */
    cartProducts(state, getters, rootState, rootGetters) {
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },

    /**
     * Get the cart products total
     * @param {*} state - Vuex state
     * @param {*} getters - All existing Vuex getters
     */
    cartTotal (state, getters) {
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },
  },

  actions: {
    /**
     * Add a product to the cart
     * @param {*} context.state - State method from the context object
     * @param {*} context.getters - Getters method from the context object
     * @param {*} context.commit - Commit method from the context object
     * @param {*} product - The payload (product)
     */
    addProductToCart ({ state, getters, commit, rootState, rootGetters }, product) {
      if (rootGetters['products/productIsInStock'](product)) {
        const cartItem = state.items.find(item => item.id === product.id)
        if (!cartItem) {
          commit('pushProductToCart', product.id)
        } else {
          commit('incrementItemQuantity', cartItem)
        }
        commit('products/decrementProductInventory', product, {root: true})
      }
    },

    /**
     * Process the checkout
     * @param {*} context.state - State method from the context object
     * @param {*} context.commit - Commit method from the context object
     */
    checkout ({ state, commit }) {
      shop.buyProducts(
        state.items,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )
    }
  },

  mutations: {
    /**
     * Push a new product to the cart
     * @param {*} state - Vuex state
     * @param {*} productId - The product id
     */
    pushProductToCart (state, productId) {
      state.items.push({
        id: productId,
        quantity: 1
      })
    },

    /**
     * Increment the quantity of an existing cart item
     * @param {*} state - Vuex state
     * @param {*} cartItem - An existing cart item
     */
    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },

    /**
     * Change the checkout status
     * @param {*} state - Vuex state
     * @param {*} status - Checkout status (success | fail)
     */
    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },

    /**
     * Reset the cart by setting to an empty array
     * @param {*} state - Vuex state
     */
    emptyCart (state) {
      state.items = []
    }
  }
}