import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import {
  CORDISX_PLUGIN_MANIFEST_SCHEMA_V1,
  type CordisXExtensionPointControlClaimOptions,
  type CordisXLocalizedText,
  type CordisXPluginManifestV1,
} from 'cordisx/contracts'
import type {} from 'cordisx/contracts'
import {
  bronzePortrait,
  goldPortrait,
  plasticPortrait,
  silverPortrait,
  steelPortrait,
} from './assets/portraits/generated.js'
import { ascensionIcon } from './assets/identity/generated.js'

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

export type AscensionAmbience = 'dormant' | 'ember' | 'forged' | 'luminous' | 'imperial'

export interface AscensionBackdropStage {
  readonly material: AscensionMaterial
  readonly ambience: AscensionAmbience
  readonly portrait: {
    readonly mediaType: 'image/png'
    readonly data: string
    readonly alt: CordisXLocalizedText
  }
}

export interface AscensionBackdropPresentation {
  readonly variant: 'imperium'
  readonly driver: 'reasoning-intensity'
  readonly motion: 'ascension'
  readonly layers?: {
    readonly portrait?: boolean
    readonly effects?: boolean
  }
  readonly stages: readonly AscensionBackdropStage[]
}

type Messages = {
  'intensity.title': undefined
  'stage.plastic': undefined
  'stage.bronze': undefined
  'stage.steel': undefined
  'stage.silver': undefined
  'stage.gold': undefined
  'portrait.plastic': undefined
  'portrait.bronze': undefined
  'portrait.steel': undefined
  'portrait.silver': undefined
  'portrait.gold': undefined
}

export const manifest = {
  $schema: CORDISX_PLUGIN_MANIFEST_SCHEMA_V1,
  schemaVersion: 1,
  id: 'codex-ascension',
  name: 'Codex Ascension',
  capabilities: [],
} as const satisfies CordisXPluginManifestV1

export const icon = {
  mediaType: 'image/png',
  data: ascensionIcon,
} as const

export const inject = ['i18n', 'slots']

export interface Config {
  readonly replaceReasoningSlider: boolean
  readonly showBackdropPortrait: boolean
  readonly enableBackdropEffects: boolean
}

export const Config: Schema<Config> = Schema.object({
  replaceReasoningSlider: Schema.boolean().default(true)
    .extra('extra', { label: { en: 'Replace reasoning slider', 'zh-CN': '替换思考强度 Slider' } })
    .description('Apply the Imperium presentation to the native reasoning-intensity slider.')
    .i18n({
      en: 'Apply the Imperium presentation to the native reasoning-intensity slider.',
      'zh-CN': '把 Imperium 升阶外观应用到原生思考强度 Slider。',
    }),
  showBackdropPortrait: Schema.boolean().default(true)
    .extra('extra', { label: { en: 'Show backdrop portrait', 'zh-CN': '显示背景人像' } })
    .description('Show the stage portrait in the lower-right background of the active session.')
    .i18n({
      en: 'Show the stage portrait in the lower-right background of the active session.',
      'zh-CN': '在当前会话右下角背景中显示随档位变化的人像。',
    }),
  enableBackdropEffects: Schema.boolean().default(true)
    .extra('extra', { label: { en: 'Enable backdrop effects', 'zh-CN': '启用背景特效' } })
    .description('Enable the stage glow and architectural motion behind the active session.')
    .i18n({
      en: 'Enable the stage glow and architectural motion behind the active session.',
      'zh-CN': '启用当前会话背景中的档位光晕与建筑纹样动画。',
    }),
}).extra('description', {
  en: 'Choose which parts of Codex Ascension CordisX should project.',
  'zh-CN': '选择 CordisX 要启用的 Codex Ascension 视觉部分。',
})

export const configApplies = 'plugin-restart' as const

const defaultConfig: Config = {
  replaceReasoningSlider: true,
  showBackdropPortrait: true,
  enableBackdropEffects: true,
}

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

export const reasoningControl = {
  claimId: 'imperium',
  mode: 'replace',
  priority: 10,
  requestedBindings: {
    properties: ['reasoningIntensity'],
    commands: ['setReasoningIntensity'],
    events: ['reasoningIntensityChanged'],
  },
} as const satisfies CordisXExtensionPointControlClaimOptions

export const backdrop = {
  variant: 'imperium',
  driver: 'reasoning-intensity',
  motion: 'ascension',
  stages: [
    { material: 'plastic', ambience: 'dormant', portrait: { mediaType: 'image/png', data: plasticPortrait, alt: { key: 'portrait.plastic', fallback: 'Tibo as the exhausted scribe' } } },
    { material: 'bronze', ambience: 'ember', portrait: { mediaType: 'image/png', data: bronzePortrait, alt: { key: 'portrait.bronze', fallback: 'Tibo as the night builder' } } },
    { material: 'steel', ambience: 'forged', portrait: { mediaType: 'image/png', data: steelPortrait, alt: { key: 'portrait.steel', fallback: 'Tibo as the agent commander' } } },
    { material: 'silver', ambience: 'luminous', portrait: { mediaType: 'image/png', data: silverPortrait, alt: { key: 'portrait.silver', fallback: 'Tibo as the consul of code' } } },
    { material: 'gold', ambience: 'imperial', portrait: { mediaType: 'image/png', data: goldPortrait, alt: { key: 'portrait.gold', fallback: 'Tibo as Codex Maximus' } } },
  ],
} as const satisfies AscensionBackdropPresentation

export function apply(ctx: Context, config: Config = defaultConfig): void {
  ctx.i18n.define<Messages>({
    namespace: 'codex-ascension', locale: 'en', default: true,
    messages: {
      'intensity.title': 'Reasoning intensity',
      'stage.plastic': 'Promptly Bankrupt',
      'stage.bronze': 'Bronze Builder',
      'stage.steel': 'Tool-Forged Tribune',
      'stage.silver': 'Silver Context',
      'stage.gold': 'Codex Maximus',
      'portrait.plastic': 'Tibo as the exhausted scribe',
      'portrait.bronze': 'Tibo as the night builder',
      'portrait.steel': 'Tibo as the agent commander',
      'portrait.silver': 'Tibo as the consul of code',
      'portrait.gold': 'Tibo as Codex Maximus',
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
      'portrait.plastic': 'Tibo的疲惫抄写员形态',
      'portrait.bronze': 'Tibo的深夜构筑者形态',
      'portrait.steel': 'Tibo的智能体指挥官形态',
      'portrait.silver': 'Tibo的代码执政官形态',
      'portrait.gold': 'Tibo的 Codex Maximus 形态',
    },
  })
  if (config.replaceReasoningSlider) {
    ctx.slots.register({
      name: 'composer.reasoning-intensity',
      id: 'imperium',
      order: 10,
      control: reasoningControl,
    }, presentation)
  }
  if (config.showBackdropPortrait || config.enableBackdropEffects) {
    ctx.slots.register({ name: 'session.backdrop', id: 'imperium', order: 10 }, {
      ...backdrop,
      layers: {
        portrait: config.showBackdropPortrait,
        effects: config.enableBackdropEffects,
      },
    })
  }
}
