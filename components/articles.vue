<template>
  <div>
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
        <ul class="tag-list">
          <template v-for="tag of article.tagList">
            <li :key="tag" v-if="tag" class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          </template>
        </ul>
      </nuxt-link>
    </div>
    <nav v-if="totalPage > 1">
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
              name: pageRouteName,
              query: {
                page: item,
                ...query
              }
            }"
            >{{ item }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite } from '@/api'

export default {
  name: 'ArticleComponent',

  props: {
    // 文章列表
    articles: {
      type: Array,
      default: () => []
    },
    // 文章总数
    articlesCount: {
      type: Number,
      default: 0
    },
    // 分页数量
    limit: {
      type: Number,
      default: 1
    },
    // 当前页
    page: {
      type: Number,
      default: 1
    },
    // 页码跳转时携带参数
    query: {
      type: Object,
      default: () => ({})
    },
    // 页码跳转页名称
    pageRouteName: {
      type: String,
      default: 'Home'
    }
  },

  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
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
    // 执行点赞或取消操作
    async onFavourite(article, i) {
      const api = article.favorited ? deleteFavorite : addFavorite
      article._favouriteDisabled = true
      try {
        const {
          data: { article: newArticle }
        } = await api(article.slug)
        newArticle._favouriteDisabled = false
        this.articles.splice(i, 1, newArticle)
      } catch (error) {}
    }
  }
}
</script>
