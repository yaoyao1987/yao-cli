# yao-cli

参考文章：
[Everything you should know about Monorepo：那些你需要知道的 Monorepo 技术点](https://juejin.cn/post/6844904150770122759)
[Monorepo 实战](https://juejin.cn/post/6866748110644822023)
[lerna 和 yarn 实现 monorepo](https://juejin.cn/post/6855129007185362952)
[【前端工程化基础 - CLI 篇】Vue CLI 是如何实现的](https://juejin.cn/post/6916303253487484942)
[从剖析 Vue-cli 源码出发完整的 React 业务脚手架实践](https://juejin.im/post/6844904131266625549)
[Vue CLI 源码探索](https://juejin.cn/post/6844904154360446983)

## 技术栈

cli 工具，涉及到一下技术：

- Monorepo：Monorepo 是管理项目代码的一个方式，指在一个项目仓库(repo)中管理多个模块/包(package)
- [lerna](https://github.com/lerna/lerna)：lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目
- [commander](https://github.com/tj/commander.js)：Nodejs 命令配置工具
- [Inquirer](https://github.com/SBoudrias/Inquirer.js)：一个用户与命令行交互的工具
- [execa](https://github.com/sindresorhus/execa)：execa 是可以调用 shell 和本地外部程序的 javascript 封装
- [chalk](https://github.com/chalk/chalk)：一个可以修改终端输出字符样式的工具
- [download-git-repo](https://gitlab.com/flippidippi/download-git-repo#readme)：是用于 从 GitHub, GitLab, Bitbucket 下载一个 git 仓库
- [didyoumean](https://github.com/dcporter/didyoumean.js)：一个简单的，经过优化的 js 库 和 node.js 模块，能够将人的个性化输入和各种可能性进行匹配

## 准备

### Monorepo

目前最常见的 Monorepo 解决方案是 Lerna 和 Yarn 的 Workspaces 特性。用 Yarn 处理依赖问题，Lerna 处理发布问题

### Lerna

#### 开启 Yarn Workspaces

```sh
yarn config set workspaces-experimental true
```

作用：它会在你的操作系统主文件夹的 `.yarnrc` 文件中添加 `workspaces-experimental true`。Yarn Workspaces 允许用户在单个根 package.json 文件的子文件夹中从多个 package.json 文件中安装依赖

#### 全局安装 Lerna

```sh
npm install --global lerna
```

#### 初始化项目

```sh
# 创建并进入项目
mkdir project && cd project

# 初始化
yarn init

# lerna 初始化
lerna init
```

生成目录如下

```
├── packages
├── lerna.json
├── package.json
```

package.json

```json
{
  "name": "project",
  "private": true, // 私有的，不会被发布，是管理整个项目，与要发布的npm包解耦
  "devDependencies": {
    "lerna": "^3.22.1"
  }
}
```

lerna.json

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0"
}
```

常用代码

```sh
# lerna create <package>创建包
lerna create cli 0
```

## 提交规范

### commitizen && cz-lerna-changelog

```sh
yarn add commitizen cz-lerna-changelog -D -W
```
