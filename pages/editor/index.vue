<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onPublish">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.tagList"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="publishDisabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticle, getArticle, updateArticle } from '@/api'

export default {
  name: 'Editor',
  //在路由匹配组件渲染完成之前回先执行中间件处理
  middleware: 'authenticated',

  async asyncData({ query: { slug } }) {
    let article = {
      title: '',
      description: '',
      body: '',
      tagList: ''
    }
    if (slug) {
      const {
        data: { article: val }
      } = await getArticle(slug)
      Object.keys(article).forEach((key) => {
        article[key] = val[key]
      })
      article.tagList = Array.isArray(article.tagList)
        ? article.tagList.join('，')
        : article.tagList
    }
    return { article }
  },

  data() {
    return {
      publishDisabled: false
    }
  },

  watchQuery: ['slug'],

  methods: {
    async onPublish() {
      try {
        this.publishDisabled = true
        const article = { ...this.article }
        if (article.tagList) {
          article.tagList = article.tagList.trim()
            ? article.tagList.split('，')
            : ''
        }
        // 根据 slug 参数，判断新建还是编辑
        const { slug: articleSlug } = this.$route.query
        const api = articleSlug ? updateArticle : addArticle
        const {
          data: {
            article: { slug }
          }
        } = await api({ article, slug: articleSlug })
        this.$router.push({
          name: 'Article',
          params: {
            slug: slug
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.publishDisabled = false
      }
    }
  }
}
</script>
