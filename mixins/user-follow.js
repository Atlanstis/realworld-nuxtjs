import { followUser, unfollowUser } from '@/api'

// 用户关注及取消
export default {
  data() {
    return {
      followDisabled: false
    }
  },

  methods: {
    async onUserFollow(author) {
      const api = author.following ? unfollowUser : followUser
      this.followDisabled = true
      try {
        const {
          data: { profile }
        } = await api(author.username)
        this.followDisabled = false
        this.afterFollowHandle && this.afterFollowHandle(profile)
      } catch (error) {}
    }
  }
}
