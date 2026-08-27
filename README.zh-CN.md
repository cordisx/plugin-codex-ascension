<p align="center">
  <img alt="OpenAI Imperium 衔尾蛇金币" src="./public/favicon.png" width="160">
</p>

<p align="center">
  <a href="./LICENSE"><img alt="MIT 许可证" src="https://img.shields.io/github/license/cordisx/plugin-codex-ascension?style=flat-square"></a>
  <a href="https://openai-imperium-reset.yijie4188.chatgpt.site/"><img alt="线上站点状态" src="https://img.shields.io/website?url=https%3A%2F%2Fopenai-imperium-reset.yijie4188.chatgpt.site%2F&amp;label=%E7%BA%BF%E4%B8%8A%E7%AB%99%E7%82%B9&amp;style=flat-square"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> | 简体中文
</p>

<h1 align="center">OpenAI Imperium</h1>

<p align="center"><strong>我来，我见，我 Reset。</strong></p>

<p align="center">
  <a href="https://openai-imperium-reset.yijie4188.chatgpt.site/"><strong>加入 Reset 请愿</strong></a>
  · <a href="https://github.com/cordisx/plugin-codex-ascension">源码</a>
  · <a href="https://github.com/cordisx/plugin-codex-ascension/issues">反馈</a>
</p>

OpenAI Imperium 是一个非官方、戏剧化的 Codex Reset 请愿站。拖动升阶控件，
见证人物经过六个愈发帝王化的状态；提交一份真实请愿，并在公开档案中查看历史
请愿与已经获准的 Reset。

![OpenAI Imperium——我来，我见，我 Reset。](./public/og.png)

## 从疲惫书记官到 Codex Maximus

这个体验把普通的思考强度控件变成一场微型升阶仪式。随着控件向最终档推进，
肖像、材质、字体、背景、粒子与桂冠效果会共同演化。

Reset 按钮每次只推进一个阶位，同时记录一份真实请愿。当 Reset 获准时，受保护
的管理操作会结束本轮、把结果写入历史档案，然后开启新一轮计数。

## 已有能力

- 六组相互配合的肖像与界面状态。
- 带拟物手感、支持键盘操作的强度控件与 Reset 按钮。
- 从塑料、青铜、白银到黄金的连续材质变化。
- 高阶状态下由算法生成的粒子与桂叶动画。
- 由 Cloudflare D1 持久保存的请愿账本。
- 类似 GitHub Contribution Graph 的请愿与 Reset 历史日历。
- 受 Bearer Token 保护的管理 Reset 接口。
- 已公开发布、支持响应式布局并带有分享预览与 favicon 的站点。

## 本地运行

请使用 Node.js 22.13 或更高版本：

```bash
npm install
npm run dev
```

生成生产构建：

```bash
npm run build
```

持久账本使用 `.openai/hosting.json` 中声明的 `DB` D1 binding。生产环境执行
Reset 还需要托管的 `RESET_ADMIN_TOKEN` secret，请勿把它提交到仓库。

## CordisX 插件

仓库的 [`plugin/`](./plugin) 目录包含可安装的思考强度视觉插件。它让原生
CordisX 滑块依次呈现塑料白、青铜、钢、银和金色，但数值、事件、键盘操作、
可访问性与持久化仍全部由 Host 控制。

```bash
cd plugin
npm install
npm run check
npm run dev
```

### 插件配置

CordisX 会根据插件提供的结构化 Schema 渲染以下配置。三个选项默认均开启，
保存后通过插件重启生效：

| 选项 | 控制内容 |
| --- | --- |
| 替换思考强度 Slider | 把 Imperium 升阶外观应用到原生思考强度控件。 |
| 显示背景人像 | 在会话右下角背景显示随档位变化的人像。 |
| 启用背景特效 | 独立控制档位光晕与建筑纹样动画，不依赖背景人像。 |

三个开关可以自由组合。关闭两项背景选项后，插件不会注册
`session.backdrop`；关闭 Slider 替换后，CordisX 会保留原生控件外观。

## 许可证与声明

源代码采用 [MIT License](./LICENSE)。

`public/` 下的肖像、社交预览与品牌素材不属于 MIT 授权范围，准确边界见
[ASSETS-LICENSE.md](./ASSETS-LICENSE.md)。OpenAI、Codex 及相关标识归各自权利人
所有。

这是独立、非官方的戏仿／粉丝项目，与 OpenAI 或肖像中的人物不存在隶属、赞助
或背书关系。
