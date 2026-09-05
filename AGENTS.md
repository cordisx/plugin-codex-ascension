# Repository Guide

- Follow the [organization file-size rule](https://github.com/cordisx/cordisxmono/blob/main/.agents/rules/file-size.md) for formatting and responsibility-based splitting guidance.
- Use the [repository README](README.md) to select the CordisX plugin or Reset
  petition site before changing files or running commands.
- `plugin/` owns the plugin and its [usage and development documentation](plugin/README.md).
  The petition site uses `app/`, `db/`, `drizzle/`, `public/`, and root runtime
  configuration; its documentation is [app/README.md](app/README.md).
- Keep root READMEs as component navigation and shared license information.
  Maintain component details in their own READMEs.
- Choose validation from the affected component's `package.json`. For a
  documentation-only change, check the diff and local links; report those
  checks separately from build, runtime, or live-app verification.
