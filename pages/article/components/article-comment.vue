<template>
  <div>
    <p v-if="!user" style="display: inherit;">
      <nuxt-link
        :to="{
          name: 'Login'
        }"
        >Sign in</nuxt-link
      >
      or
      <nuxt-link
        :to="{
          name: 'Register'
        }"
        >sign up</nuxt-link
      >
      to add comments on this article.
    </p>
    <form v-else @submit.prevent="onCommentSubmit" class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="user.iamge || '/smiley-cyrus.jpeg'"
          class="comment-author-img"
        />
        <button :disabled="commentDisabled" class="btn btn-sm btn-primary">
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
          <img
            :src="comment.author.image || '/smiley-cyrus.jpeg'"
            class="comment-author-img"
          />
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
        <span
          v-if="user && user.username === comment.author.username"
          class="mod-options"
        >
          <i class="ion-trash-a" @click="deleteComment(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComments } from '@/api'
import { mapState } from 'vuex'

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
      comments: [],
      comment: '',
      commentDisabled: false
    }
  },

  computed: {
    ...mapState(['user'])
  },

  mounted() {
    this.getComments()
  },

  methods: {
    async getComments() {
      const {
        data: { comments }
      } = await getComments(this.article.slug)
      this.comments = comments
    },

    // 提交评论
    async onCommentSubmit() {
      try {
        if (!this.comment.trim()) {
          return
        }
        this.commentDisabled = true
        await addComments({
          slug: this.article.slug,
          comment: { body: this.comment }
        })
        this.comment = ''
        this.getComments()
      } catch (error) {
      } finally {
        this.commentDisabled = false
      }
    },

    // 删除评论
    async deleteComment(comment) {
      try {
        await deleteComments({ slug: this.article.slug, id: comment.id })
        this.getComments()
      } catch (error) {}
    }
  }
}
</script>
