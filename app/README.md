# OpenAI Imperium Reset Petition Site

[Repository entry](../README.md) · [简体中文](README.zh-CN.md) ·
[Visit the petition site](https://openai-imperium-reset.yijie4188.chatgpt.site/)

This document covers the petition site run from the repository root. CordisX
plugin usage, configuration, and development belong in
[`plugin/README.md`](../plugin/README.md).

OpenAI Imperium is an unofficial theatrical petition for the next Codex reset.
Move the ascension control through six increasingly imperial states, add your
plea to the live count, and inspect the public record of petitions and resets.

![OpenAI Imperium — Veni. Vidi. Reset.](../public/og.png)

## From exhausted scribe to Codex Maximus

The experience turns a plain reasoning-intensity control into a miniature
ascension ceremony. Portrait, material, type, background, particles, and
laurel effects evolve together as the control moves toward its final state.

The Reset button advances the control one order at a time and records a real
petition. When a reset is granted, the protected administrative action closes
the round, preserves its result in the ledger, and begins a new count.

## What is available

- Six coordinated portrait and interface states.
- A tactile, keyboard-accessible intensity control and Reset button.
- Smooth material progression from plastic through bronze and silver to gold.
- Algorithmic particles and laurel motion at the higher orders.
- A persistent Cloudflare D1 petition ledger.
- A GitHub-style calendar of petition history and granted resets.
- A bearer-token-protected administrative reset endpoint.
- A public, responsive Site with Open Graph and favicon assets.

## Run locally

Run these commands from the repository root with Node.js 22.13 or newer:

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The persistent ledger uses the `DB` D1 binding declared in
[`.openai/hosting.json`](../.openai/hosting.json). A production reset also requires a hosted
`RESET_ADMIN_TOKEN` secret. Never commit that value.

See the [repository license section](../README.md#license) for source and asset licensing.
