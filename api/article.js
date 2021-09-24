import { request } from '@/plugins/request'
// 获取文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取关注的用户文章列表
export const getArticlesFeed = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params
  })
}
