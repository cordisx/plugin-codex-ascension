# @cordisx/codex-ascension

The CordisX plugin for the OpenAI Imperium reasoning-intensity presentation.
It contributes five localized semantic stages—plastic, bronze, steel, silver,
and gold—through `composer.reasoning-intensity`, plus an optional staged
portrait and effects projection through `session.backdrop`.

CordisX Host owns the native range discovery, DOM, styling, motion,
accessibility, value mapping, and cleanup. This plugin contains no selectors,
CSS, setting mutations, or native event code.

## Configuration

CordisX renders the plugin's structured configuration form. Each option is
enabled by default and can be changed independently:

| Option | Effect when disabled |
| --- | --- |
| Replace reasoning slider | Leaves the native reasoning-intensity control unchanged. |
| Show backdrop portrait | Does not mount portrait images in the session backdrop. |
| Enable backdrop effects | Does not mount the glow or architectural effect layers. |

If both backdrop options are disabled, the plugin does not register a
`session.backdrop` contribution. Saved changes apply with a plugin restart.

## Development

Requires a CordisX build containing
[cordisx/cordisx#171](https://github.com/cordisx/cordisx/pull/171).

```bash
npm install
npm run check
npm run dev:dry-run
npm run dev
```

## 中文

这是 OpenAI Imperium 的 CordisX 思考强度主题插件。插件声明塑料白、青铜、
钢、银、金五个语义档位，并可选提供会话背景人像与特效；原生滑块定位、DOM、
样式、动画、可访问性、数值映射和卸载清理由 CordisX Host 统一负责。

CordisX 会从插件的结构化 Schema 渲染三个默认开启、可独立组合的配置项：
「替换思考强度 Slider」「显示背景人像」「启用背景特效」。关闭某项后 Host
不会挂载对应视觉层；两项背景配置都关闭时，插件不会注册 `session.backdrop`。
保存配置后通过插件重启生效。
