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
import { addArticle } from '@/api'

export default {
  name: 'Editor',
  //在路由匹配组件渲染完成之前回先执行中间件处理
  middleware: 'authenticated',

  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: ''
      },
      publishDisabled: false
    }
  },

  methods: {
    async onPublish() {
      try {
        this.publishDisabled = true
        const article = { ...this.article }
        article.tagList = article.tagList.trim()
          ? article.tagList.split('，')
          : ''
        const {
          data: {
            article: { slug }
          }
        } = await addArticle({ article })
        this.$router.push({
          name: 'Article',
          params: {
            slug: slug
          }
        })
      } catch (error) {
      } finally {
        this.publishDisabled = false
      }
    }
  }
}
</script>
