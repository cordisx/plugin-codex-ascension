import type { Context } from '@deepseek-ai/cordis'
import {
  CORDISX_PLUGIN_MANIFEST_SCHEMA_V1,
  type CordisXLocalizedText,
  type CordisXPluginManifestV1,
} from 'cordisx/contracts'
import type {} from 'cordisx/contracts'

export type AscensionMaterial = 'plastic' | 'bronze' | 'steel' | 'silver' | 'gold'

export interface AscensionStage {
  readonly label: CordisXLocalizedText
  readonly material: AscensionMaterial
}

export interface AscensionPresentation {
  readonly variant: 'imperium'
  readonly title: CordisXLocalizedText
  readonly motion: 'ascension'
  readonly stages: readonly AscensionStage[]
}

declare module 'cordisx/contracts' {
  interface CordisXSurfaceMap {
    'composer.reasoning-intensity': AscensionPresentation
  }
}

type Messages = {
  'intensity.title': undefined
  'stage.plastic': undefined
  'stage.bronze': undefined
  'stage.steel': undefined
  'stage.silver': undefined
  'stage.gold': undefined
}

export const manifest = {
  $schema: CORDISX_PLUGIN_MANIFEST_SCHEMA_V1,
  schemaVersion: 1,
  id: 'codex-ascension',
  name: 'Codex Ascension',
  capabilities: [],
} as const satisfies CordisXPluginManifestV1

export const inject = ['i18n', 'slots']

export const presentation = {
  variant: 'imperium',
  title: { key: 'intensity.title', fallback: 'Reasoning intensity' },
  motion: 'ascension',
  stages: [
    { label: { key: 'stage.plastic', fallback: 'Promptly Bankrupt' }, material: 'plastic' },
    { label: { key: 'stage.bronze', fallback: 'Bronze Builder' }, material: 'bronze' },
    { label: { key: 'stage.steel', fallback: 'Tool-Forged Tribune' }, material: 'steel' },
    { label: { key: 'stage.silver', fallback: 'Silver Context' }, material: 'silver' },
    { label: { key: 'stage.gold', fallback: 'Codex Maximus' }, material: 'gold' },
  ],
} as const satisfies AscensionPresentation

export function apply(ctx: Context): void {
  ctx.i18n.define<Messages>({
    namespace: 'codex-ascension', locale: 'en', default: true,
    messages: {
      'intensity.title': 'Reasoning intensity',
      'stage.plastic': 'Promptly Bankrupt',
      'stage.bronze': 'Bronze Builder',
      'stage.steel': 'Tool-Forged Tribune',
      'stage.silver': 'Silver Context',
      'stage.gold': 'Codex Maximus',
    },
  })
  ctx.i18n.define<Messages>({
    namespace: 'codex-ascension', locale: 'zh-CN',
    messages: {
      'intensity.title': '思考强度',
      'stage.plastic': '提示词破产',
      'stage.bronze': '青铜构筑者',
      'stage.steel': '工具锻造官',
      'stage.silver': '白银上下文',
      'stage.gold': 'Codex Maximus',
    },
  })
  ctx.slots.register({ name: 'composer.reasoning-intensity', id: 'imperium', order: 10 }, presentation)
}
