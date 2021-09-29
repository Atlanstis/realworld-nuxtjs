# realworld-nuxtjs

基于 nuxtjs 对 realWorld 的复刻。

### 演示地址

[演示地址](http://www.gypsophila.xyz:3000/)

## realWorld

[GitHub 仓库](https://github.com/gothinkster/realworld)

[在线示例](https://demo.realworld.io/#/)

[接口文档](https://github.com/gothinkster/realworld/tree/master/api)

[页面模板](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md)

## Nuxt.js

[Nuxt.js - Vue.js 通用应用框架 | Nuxt.js 中文网](https://www.nuxtjs.cn/)

## 使用

[命令](https://www.nuxtjs.cn/guide/commands)

### 开发环境启动

```shell
npm run dev
```

### 打包

```shell
npm run build
```

### 本地服务启动

以生产模式启动一个 Web 服务器（需先执行 build）。

```
npm run start
```

### 部署

- 先对项目进行打包处理，`npm run build`。

- 在 nuxt.config.js 配置文件中，配置 Host + Port。

- 将打包生成的 `.nuxt` 目录，`static` 目录，`nuxt.config.js` 配置文件，`package.json`，`yarn.lock` 压缩成压缩包。

- 上传到服务器，后通过 `unzip` 命令解压压缩包。

- 安装环境：

  - 安装 node / pm2 / 配置相关路径

  ```shell
  nver='v14.16.1' && ndir="node-${nver}-linux-x64" && nfile="${ndir}.tar.xz" && cd /usr/local && wget https://nodejs.org/dist/$nver/$nfile && tar xvf $nfile && mv $ndir nodejs && rm -rf $nfile && cd nodejs/bin && ln -sf `readlink -f node` /usr/bin/node && ln -sf `readlink -f npm`  /usr/bin/npm && ln -sf `readlink -f npx`  /usr/bin/npx && npm config set registry http://registry.npm.taobao.org && npm i pm2 -g && ln -sf `readlink -f pm2`  /usr/bin/pm2 && cd
  ```

  - `npm i` 安装 realworld-nuxtjs 依赖。

- `pm2 start npm -- start` 启动。[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

- 通过 ip + 端口 进行访问。
