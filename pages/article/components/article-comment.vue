<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>

    <div v-for="comment of comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'Profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'Profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
          >{{ comment.author.username }}</nuxt-link
        >
        <span class="date-posted">{{
          comment.createdAt | date('MMM DD, YYYY')
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api'

export default {
  name: 'ArticleComment',

  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      comments: []
    }
  },

  async mounted() {
    const {
      data: { comments }
    } = await getComments(this.article.slug)
    this.comments = comments
  }
}
</script>
