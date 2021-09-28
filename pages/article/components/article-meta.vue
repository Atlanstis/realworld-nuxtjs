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
    <template v-if="isSelf">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'Editor',
          query: {
            slug: article.slug
          }
        }"
        href="#/editor/1234352345"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        :disabled="deleteDisabled"
        @click="onDeleteArticle"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
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
    </template>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite, deleteArticle } from '@/api'
import UserFollowMixin from '@/mixins/user-follow'
import { mapState } from 'vuex'

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
      favouriteDisabled: false,
      deleteDisabled: false
    }
  },

  computed: {
    isSelf() {
      return this.user.username === this.article.author.username
    },
    ...mapState(['user'])
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

    // 删除文章
    async onDeleteArticle() {
      try {
        this.deleteDisabled = true
        await deleteArticle(this.article.slug)
        this.$router.push({
          name: 'Home'
        })
      } catch (error) {
      } finally {
        this.deleteDisabled = false
      }
    },

    // 关注用户后处理，更新作者信息
    afterFollowHandle(profile) {
      this.$emit('updateAuthor', profile)
    }
  }
}
</script>
