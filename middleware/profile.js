// 前往 Profile 页面时，自动添加参数
export default function({
  redirect,
  params: { username },
  query: { favorited, author }
}) {
  if (favorited || author) {
    return
  }
  return redirect(`/profile/${username}?author=${username}`)
}
