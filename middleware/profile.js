// 前往 Profile 页面时，自动添加参数
export default function({
  redirect,
  params: { username },
  query: { favorited, author },
  store
}) {
  if (favorited || author) {
    return
  }
  if (!username) {
    username = store.state.user.username
  }
  return redirect(`/profile/${username}?author=${username}`)
}
