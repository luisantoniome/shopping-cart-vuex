/**
 * Mocking client-server processing
 */
const _products = [
  {"id": 1, "title": "iPad 128GB Space Gray", "price": 429.00, "inventory": 2},
  {"id": 2, "title": "Nike Sportswear", "price": 699.99, "inventory": 10},
  {"id": 3, "title": "The Weeknd - Starboy CD", "price": 11.99, "inventory": 5}
]

export default {
  getProducts (callback) {
    setTimeout(() => callback(_products), 100)
  },

  buyProducts (products, callback, errorCallback) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
        ? callback()
        : errorCallback()
    }, 100)
  }
}
