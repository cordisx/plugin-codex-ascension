# Codex Ascension

[English](README.md)

Codex Ascension 为 CordisX 的思考强度控件提供五阶戏剧化外观，从塑料白一路
升至黄金。插件还可以在当前会话背景中显示与档位对应的人像和环境特效。

## 安装

插件 ID：`codex-ascension`。当前版本：`0.1.1`。

```sh
FEED_URL=https://raw.githubusercontent.com/cordisx/marketplace/main/marketplace.json
npx cordisx@beta source add "$FEED_URL" --yes
npx cordisx@beta plugin install codex-ascension --source "$FEED_URL" --version 0.1.1
```

若该 feed 已启用，可以跳过 `source add`。使用其他 profile 时，两条命令都要添加
相同的 `--profile <profile>`。`--source` 只能选择已配置并启用的来源，不会注册
来源；`--yes` 只确认来源变更，不会批准插件权限。发现来源也不等同于 trust root。

Marketplace v3 条目列出验证后的 `0.1.1` artifact 后，安装命令才可用。在此之前，
可从
[GitHub 预发布](https://github.com/cordisx/plugin-codex-ascension/releases/tag/v0.1.1)
下载压缩包与 `SHA256SUMS`。

## 使用

在 CordisX 中打开 Codex 会话并选择思考强度。原生控件行为保持不变，所选档位会
显示为五种 Ascension 外观之一：

| 思考档位 | Ascension 外观 |
| -------- | -------------- |
| 最低     | 提示词破产     |
| 低       | 青铜构筑者     |
| 中       | 工具锻造官     |
| 高       | 白银上下文     |
| 最高     | Codex Maximus  |

启用背景人像或特效后，会话背景会跟随相同档位变化。

## 配置

CordisX 会渲染三个默认开启的设置：

| 设置                | 关闭后的效果                 |
| ------------------- | ---------------------------- |
| 替换思考强度 Slider | 保留原生思考强度控件的外观。 |
| 显示背景人像        | 隐藏当前档位的人像。         |
| 启用背景特效        | 隐藏光晕和建筑纹样特效。     |

保存后需重启插件才能生效。两个背景设置都关闭时，插件不会注册会话背景。

## 权限与限制

Codex Ascension 不请求任何 CordisX capability。授权、思考强度值、原生控件行为、
渲染、可访问性和清理由 Host 负责。插件只改变外观，不会更改模型的思考策略，也不会
代替用户提交设置。

思考强度替换需要 Host 支持受控的 `composer.reasoning-intensity` contribution；
会话背景使用 legacy structured `session.backdrop` contribution。

## 排错

- **找不到 `0.1.1`：**确认 Marketplace 条目已列出该版本的 release artifact；
  `--source` 不会添加或修复 feed。
- **原生 Slider 外观未变化：**启用「替换思考强度 Slider」，保存并重启插件。
- **没有会话背景：**至少启用一个背景设置，然后重启插件。

## 许可证

源代码采用仓库的
[MIT License](https://github.com/cordisx/plugin-codex-ascension/blob/main/LICENSE)。
肖像与品牌素材条款见仓库的
[素材声明](https://github.com/cordisx/plugin-codex-ascension/blob/main/ASSETS-LICENSE.md)。
维护者的环境、检查、打包与发布说明见源码仓库的
[维护指南](https://github.com/cordisx/plugin-codex-ascension/blob/main/plugin/DEVELOPMENT.md)。
