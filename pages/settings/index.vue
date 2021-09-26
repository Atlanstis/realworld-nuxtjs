<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="updateDisabled"
                @click="onUpdate"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="onLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updtaeUser } from '@/api'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'Settings',
  middleware: 'authenticated',

  async asyncData() {
    const {
      data: { user }
    } = await getUser()
    delete user.token
    return { user }
  },

  data() {
    return {
      updateDisabled: false
    }
  },

  methods: {
    // 更新用户信息
    async onUpdate() {
      try {
        this.updateDisabled = true
        console.log(this.user)
        const {
          data: { user }
        } = await updtaeUser({ user: this.user })
        this.$store.commit('setUser', user)
        Cookie.set('user', JSON.stringify(user))
        this.$router.push({
          name: 'Profile',
          params: {
            username: user.username
          }
        })
      } catch (error) {
      } finally {
        this.updateDisabled = false
      }
    },

    // 登出操作
    onLogout() {
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>
