# OpenAI Imperium Reset

An unofficial, theatrical petition counter asking for the next Codex reset.
Move the ascension control through six increasingly imperial states, submit a
reset petition, and inspect the public petition and reset ledger.

[View the live site](https://openai-imperium-reset.yijie4188.chatgpt.site/)

![OpenAI Imperium Reset preview](public/og.png)

## Features

- Six-stage interactive portrait ascension
- Material, typography, background, particle, and laurel transitions
- Persistent petition counts backed by Cloudflare D1
- GitHub-style petition and reset history
- Bearer-token-protected administrative reset endpoint
- Responsive, keyboard-accessible controls

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The persistent ledger uses the `DB` D1 binding declared in
`.openai/hosting.json`. Production resets also require a hosted
`RESET_ADMIN_TOKEN` secret. Do not commit its value.

## Build

```bash
npm run build
```

## License

Source code is available under the [MIT License](LICENSE).

Portraits, social-preview media, and brand assets under `public/` are not
covered by the MIT License. See [ASSETS-LICENSE.md](ASSETS-LICENSE.md). This is
an unofficial parody/fan project and is not affiliated with or endorsed by
OpenAI.
