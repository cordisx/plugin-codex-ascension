# Codex Ascension

[简体中文](README.zh-Hans.md)

Codex Ascension gives CordisX's reasoning-intensity control five theatrical
stages, from plastic through gold. It can also project a matching portrait and
ambient effects into the active session background.

## Install

Plugin ID: `codex-ascension`. Current release: `0.1.1`.

```sh
FEED_URL=https://raw.githubusercontent.com/cordisx/marketplace/main/marketplace.json
npx cordisx@beta source add "$FEED_URL" --yes
npx cordisx@beta plugin install codex-ascension --source "$FEED_URL" --version 0.1.1
```

Skip `source add` when that exact feed is already enabled. For another profile,
add the same `--profile <profile>` argument to both commands. `--source` selects
an already configured and enabled source; it does not register one. `--yes`
confirms the source change only and does not approve plugin permissions. A
discovery source is not a trust root.

The install command becomes available after the Marketplace v3 entry lists the
verified `0.1.1` artifact. Until then, download the archive and `SHA256SUMS`
from the
[GitHub prerelease](https://github.com/cordisx/plugin-codex-ascension/releases/tag/v0.1.1).

## Use

Open a Codex session in CordisX and choose a reasoning-intensity value. The
native control keeps its normal behavior while the selected value is presented
as one of five Ascension stages:

| Reasoning stage | Ascension presentation |
| --------------- | ---------------------- |
| Lowest          | Promptly Bankrupt      |
| Low             | Bronze Builder         |
| Medium          | Tool-Forged Tribune    |
| High            | Silver Context         |
| Highest         | Codex Maximus          |

The session backdrop follows the same stage when its portrait or effects are
enabled.

## Configuration

CordisX renders three settings, all enabled by default:

| Setting                  | Effect when disabled                                     |
| ------------------------ | -------------------------------------------------------- |
| Replace reasoning slider | Leaves the native reasoning-intensity control unchanged. |
| Show backdrop portrait   | Hides the staged portrait.                               |
| Enable backdrop effects  | Hides the glow and architectural effects.                |

Saved changes apply after the plugin restarts. If both backdrop settings are
disabled, the plugin does not register a session backdrop.

## Permissions and limits

Codex Ascension requests no CordisX capabilities. The Host owns authorization,
the reasoning value, native control behavior, rendering, accessibility, and
cleanup. The plugin changes presentation only; it does not change model
reasoning policy or submit settings on the user's behalf.

The reasoning-control replacement requires a CordisX Host that supports the
controlled `composer.reasoning-intensity` contribution. The session backdrop
uses the legacy structured `session.backdrop` contribution.

## Troubleshooting

- **Version `0.1.1` is not found:** confirm the Marketplace entry lists the
  release artifact. `--source` cannot add or repair a feed.
- **The native slider is unchanged:** enable **Replace reasoning slider**, save,
  and restart the plugin.
- **The backdrop is missing:** enable at least one backdrop setting and restart
  the plugin.

## License

The source code is available under the repository's
[MIT License](https://github.com/cordisx/plugin-codex-ascension/blob/main/LICENSE).
Portrait and brand-asset terms are described in the repository's
[asset notice](https://github.com/cordisx/plugin-codex-ascension/blob/main/ASSETS-LICENSE.md).
Maintainer setup, checks, packaging, and release instructions are in the source
repository's
[maintainer guide](https://github.com/cordisx/plugin-codex-ascension/blob/main/plugin/DEVELOPMENT.md).
