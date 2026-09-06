# Repository Guide

- Follow the [organization file-size rule](https://github.com/cordisx/cordisxmono/blob/main/.agents/rules/file-size.md) for formatting and responsibility-based splitting guidance.
- Read the organization [CSS ownership and maintenance rule](https://github.com/cordisx/cordisxmono/blob/main/.agents/rules/css.md) before changing CSS, stylesheet-generating code, or a style-bearing DOM contract.
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

## Shared quality configuration

The local dprint and ESLint entry points consume an exact formal
[Mono quality configuration](https://github.com/cordisx/cordisxmono/blob/c63c2e8c2ba7e11502934a52ad2ce3734e804cdc/.agents/docs/quality-tooling.md).
The Shared quality configuration CI job checks the installed configuration and
tracked-file coverage; inspect its report for excluded paths.
`npm run lint:source` runs the full source policy as a blocking CI step.
Configuration coverage and full-source lint are separate checks.
Update the dependency, lock, formatter reference and CI provider SHA together.
