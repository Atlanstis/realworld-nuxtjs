<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' && !tag }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: !!tag }"
                  exact
                  :to="{
                    name: 'Home',
                    query: {
                      tag
                    }
                  }"
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <!-- 文章列表 Start -->
          <div v-if="!articles.length" class="article-preview">
            No articles are here... yet.
          </div>
          <div
            v-for="(article, i) of articles"
            :key="article.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <nuxt-link :to="userLinkTo(article)"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link :to="userLinkTo(article)" class="author">{{
                  article.author.username
                }}</nuxt-link>
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                :disabled="article._favouriteDisabled"
                @click="onFavourite(article, i)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{ name: 'Article', params: { slug: article.slug } }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 文章列表 End -->
          <!-- 页码 Start -->
          <nav>
            <ul class="pagination">
              <li
                v-for="item of totalPage"
                :key="item"
                class="page-item"
                :class="{ active: page === item }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'Home',
                    query: {
                      page: item,
                      tag: tag,
                      tab: tab
                    }
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- 页码 End -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag of tags"
                :key="tag"
                :to="{
                  name: 'Home',
                  query: {
                    tag
                  }
                }"
                class="tag-pill tag-default"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getArticlesFeed,
  getTags,
  addFavorite,
  deleteFavorite
} from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',

  async asyncData({
    query: { page, tag, tab },
    store: {
      state: { user }
    }
  }) {
    page = Number.parseInt(page || 1)
    const limit = 10
    tab = tab || 'global_feed'
    const getArticlesApi =
      user && tab === 'your_feed' ? getArticlesFeed : getArticles
    const [
      {
        data: { articlesCount, articles }
      },
      {
        data: { tags }
      }
    ] = await Promise.all([
      getArticlesApi({
        limit,
        offset: (page - 1) * limit,
        tag: tag
      }),
      getTags()
    ])
    articles.forEach((article) => {
      article._favouriteDisabled = false
    })
    return {
      articlesCount,
      articles,
      page,
      limit,
      tags: tags.slice(0, 20),
      tag,
      tab: tab || 'global_feed'
    }
  },

  // 监听 query 的改变
  watchQuery: ['page', 'tag', 'tab'],

  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },

  methods: {
    userLinkTo(article) {
      return {
        name: 'Profile',
        params: {
          username: article.author.username
        }
      }
    },

    async onFavourite(article, i) {
      // 未登录跳转至登陆页
      if (!this.user) {
        this.$router.push({
          name: 'Login'
        })
        return
      }
      // 执行点赞操作
      const api = article.favorited ? deleteFavorite : addFavorite
      article._favouriteDisabled = true
      const {
        data: { article: newArticle }
      } = await api(article.slug)
      newArticle._favouriteDisabled = false
      this.articles.splice(i, 1, newArticle)
    }
  }
}
</script>
