import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // = data
    products: [],
    // { id, quantity }
    cart: [],
    checkoutStatus: null
  },

  getters: { // = computed properties
    /**
     * Get the available products
     * @param {*} state - Vuex state
     * @param {*} getters - All existing Vuex getters
     */
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },

    /**
     * Get the products from the cart
     * @param {*} state - Vuex state
     */
    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
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

    /**
     * Check if a product is in stock
     */
    productIsInStock () {
      return product => product.inventory > 0
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
    },

    /**
     * Add a product to the cart
     * @param {*} context.state - State method from the context object
     * @param {*} context.getters - Getters method from the context object
     * @param {*} context.commit - Commit method from the context object
     * @param {*} product - The payload (product)
     */
    addProductToCart ({ state, getters, commit }, product) {
      if (getters.productIsInStock(product)) {
        const cartItem = state.cart.find(item => item.id === product.id)
        if (!cartItem) {
          commit('pushProductToCart', product.id)
        } else {
          commit('incrementItemQuantity', cartItem)
        }
        commit('decrementProductInventory', product)
      }
    },

    /**
     * Process the checkout
     * @param {*} context.state - State method from the context object
     * @param {*} context.commit - Commit method from the context object
     */
    checkout ({ state, commit }) {
      shop.buyProducts(
        state.cart,
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

  mutations: { // alter state
    /**
     * Update the products
     * @param {*} state - Vuex state
     * @param {*} products - The payload
     */
    setProducts (state, products) {
      state.products = products
    },

    /**
     * Push a new product to the cart
     * @param {*} state - Vuex state
     * @param {*} productId - The product id
     */
    pushProductToCart (state, productId) {
      state.cart.push({
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
     * Decrement a product inventory by one
     * @param {*} state - Vuex state
     * @param {*} product - A product
     */
    decrementProductInventory (state, product) {
      product.inventory--
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
      state.cart = []
    }
  }
})
