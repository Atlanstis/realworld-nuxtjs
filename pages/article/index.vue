<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div v-html="article.body" class="col-md-12"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <div class="row">
        <article-comment
          class="col-xs-12 col-md-8 offset-md-2"
          :article="article"
        ></article-comment>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api'
import MarkownIt from 'markdown-it'
import ArticleMeta from './components/article-meta.vue'
import ArticleComment from './components/article-comment.vue'

export default {
  name: 'Article',

  components: {
    ArticleMeta,
    ArticleComment
  },

  // 设置 title，meta 信息等
  // https://www.nuxtjs.cn/guide/views#%E4%B8%AA%E6%80%A7%E5%8C%96%E7%89%B9%E5%AE%9A%E9%A1%B5%E9%9D%A2%E7%9A%84-meta-%E6%A0%87%E7%AD%BE
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },

  async asyncData({ params: { slug } }) {
    const {
      data: { article }
    } = await getArticle(slug)
    const md = new MarkownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  }
}
</script>
