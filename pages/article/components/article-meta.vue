<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'Profile',
        params: {
          username: article.author.username
        }
      }"
      ><img :src="article.author.image || '/smiley-cyrus.jpeg'"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'Profile',
          params: {
            username: article.author.username
          }
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{ active: article.author.following }"
      :disabled="followDisabled"
      @click="onUserFollow(article.author)"
    >
      <i class="ion-plus-round"></i>
      &nbsp; {{ !article.author.following ? 'Follow' : 'Unfollow' }}
      {{ article.author.username }}
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{ active: article.favorited }"
      @click="onArticleFavorite"
    >
      <i class="ion-heart"></i>
      &nbsp; {{ !article.favorited ? 'Favorite' : 'Unfavorite' }} Article
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite } from '@/api'
import UserFollowMixin from '@/mixins/user-follow'

export default {
  name: 'ArticleMeta',

  mixins: [UserFollowMixin],

  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      favouriteDisabled: false
    }
  },

  methods: {
    // 文章点赞及取消
    async onArticleFavorite() {
      const api = this.article.favorited ? deleteFavorite : addFavorite
      this.favouriteDisabled = true
      try {
        const {
          data: { article }
        } = await api(this.article.slug)
        this.favouriteDisabled = false
        this.$emit('update', article)
      } catch (error) {}
    },

    afterFollowHandle(profile) {
      this.$emit('updateAuthor', profile)
    }
  }
}
</script>
