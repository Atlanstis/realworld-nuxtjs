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
          <articles
            :articles="articles"
            :articlesCount="articlesCount"
            :limit="limit"
            :page="page"
            :query="query"
            :pageRouteName="'Home'"
          ></articles>
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
import Articles from '@/components/articles'

export default {
  name: 'HomeIndex',

  components: {
    Articles
  },

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
      tab: tab || 'global_feed',
      query: {
        tag,
        tab
      }
    }
  },

  // 监听 query 的改变
  watchQuery: ['page', 'tag', 'tab'],

  computed: {
    ...mapState(['user'])
  }
}
</script>
