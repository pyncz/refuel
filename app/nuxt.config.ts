export default defineNuxtConfig({
  /*
  * Build config
  */
  typescript: {
    strict: true,
  },

  runtimeConfig: {
    public: {
      resolverContractAddress: '',
      automatedContractAddress: '',
    },
  },
})
