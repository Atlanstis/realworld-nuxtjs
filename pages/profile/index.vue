<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="!isSelf"
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{ active: profile.following }"
              :disabled="followDisabled"
              @click="onUserFollow(profile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ !profile.following ? 'Follow' : 'Unfollow' }}
              {{ profile.username }}
            </button>
            <nuxt-link
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'Settings'
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: query.author }"
                  exact
                  :to="{
                    name: 'Profile',
                    query: {
                      author: profile.username
                    }
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: query.favorited }"
                  exact
                  :to="{
                    name: 'Profile',
                    query: {
                      favorited: profile.username
                    }
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>
          <articles
            :articles="articles"
            :articlesCount="articlesCount"
            :limit="limit"
            :page="page"
            :query="query"
            :pageRouteName="'Profile'"
          ></articles>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, getArticles } from '@/api'
import { mapState } from 'vuex'
import UserFollowMixin from '@/mixins/user-follow'
import Articles from '@/components/articles'

export default {
  name: 'Profile',

  middleware: ['authenticated', 'profile'],

  components: { Articles },

  watchQuery: ['favorited', 'author', 'page'],

  mixins: [UserFollowMixin],

  async asyncData({
    params: { username },
    query: { page, author, favorited }
  }) {
    page = Number.parseInt(page || 1)
    const limit = 10
    const [
      {
        data: { profile }
      },
      {
        data: { articles, articlesCount }
      }
    ] = await Promise.all([
      getProfile(username),
      getArticles({ author, favorited, limit, offset: (page - 1) * limit })
    ])
    return {
      profile,
      articles,
      articlesCount,
      limit,
      page,
      query: {
        author,
        favorited
      }
    }
  },

  head() {
    return {
      title: `${this.profile.username} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.profile.bio || ''
        }
      ]
    }
  },

  computed: {
    isSelf() {
      return this.user && this.user.username === this.profile.username
    },
    ...mapState(['user'])
  },

  methods: {
    afterFollowHandle(profile) {
      this.profile = profile
    }
  }
}
</script>
