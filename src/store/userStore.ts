import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '游客',
    location: '',
  }),
  getters: {
    hasLocation(state) {
      return state.location !== ''
    },
  },
  actions: {
    // Set user's information
    setInfo(partial: object) {
      this.$patch(partial)
    },

    // Set user's location
    setLocation(data: string) {
      this.location = data
    },

    // Set user's username
    setUsername(data: string) {
      this.username = data
    },

    // Reset user's information
    resetInfo() {
      console.log('reset userInfo !')
      this.$reset()
    },
  },
})
