import { request } from '@/plugins/request'

// 登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 注册
export const register = (data) => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 获取当前用户信息
export const getUser = () => {
  return request({
    method: 'GET',
    url: '/api/user'
  })
}

// 更新当前用户信息
export const updtaeUser = (data) => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}
