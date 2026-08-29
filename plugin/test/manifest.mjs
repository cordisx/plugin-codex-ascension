import assert from 'node:assert/strict'
import test from 'node:test'
import { Config, apply, backdrop, configApplies, icon, inject, manifest, presentation, reasoningControl } from '../dist/codex-ascension.js'

test('exports a capability-free structured CordisX plugin', () => {
  assert.equal(manifest.schemaVersion, 1)
  assert.equal(manifest.id, 'codex-ascension')
  assert.deepEqual(manifest.capabilities, [])
  assert.equal(icon.mediaType, 'image/png')
  assert.ok(icon.data.length > 50_000)
  assert.deepEqual(inject, ['i18n', 'slots'])
  assert.equal(configApplies, 'plugin-restart')
  assert.deepEqual(Config({}), {
    replaceReasoningSlider: true,
    showBackdropPortrait: true,
    enableBackdropEffects: true,
  })
  assert.equal(presentation.variant, 'imperium')
  assert.equal(presentation.motion, 'ascension')
  assert.deepEqual(presentation.stages.map(stage => stage.material), ['plastic', 'bronze', 'steel', 'silver', 'gold'])
  assert.equal(Object.hasOwn(presentation, 'css'), false)
  assert.equal(Object.hasOwn(presentation, 'selector'), false)
  assert.deepEqual(reasoningControl, {
    claimId: 'imperium',
    mode: 'replace',
    priority: 10,
    requestedBindings: {
      properties: ['reasoningIntensity'],
      commands: ['setReasoningIntensity'],
      events: ['reasoningIntensityChanged'],
    },
  })
  assert.equal(Object.hasOwn(reasoningControl, 'selector'), false)
  assert.equal(Object.hasOwn(reasoningControl, 'callback'), false)
  assert.equal(backdrop.driver, 'reasoning-intensity')
  assert.deepEqual(backdrop.stages.map(stage => stage.ambience), ['dormant', 'ember', 'forged', 'luminous', 'imperial'])
  assert.ok(backdrop.stages.every(stage => stage.portrait.mediaType === 'image/png' && stage.portrait.data.length > 100_000))
  assert.equal(Object.hasOwn(backdrop, 'css'), false)
  assert.equal(Object.hasOwn(backdrop, 'selector'), false)
})

test('registers an explicit reasoning replacement and a legacy composed backdrop', () => {
  const catalogs = []
  const registrations = []
  const hostHandle = () => {}
  Object.defineProperty(hostHandle, 'control', {
    get() { throw new Error('plugin must not read or forge the Host-projected control lease') },
  })
  apply({
    i18n: { define: catalog => catalogs.push(catalog) },
    slots: {
      register: (options, item) => {
        registrations.push({ options, item })
        return hostHandle
      },
    },
  })
  assert.deepEqual(catalogs.map(catalog => catalog.locale), ['en', 'zh-CN'])
  assert.deepEqual(registrations, [
    {
      options: {
        name: 'composer.reasoning-intensity',
        id: 'imperium',
        order: 10,
        control: reasoningControl,
      },
      item: presentation,
    },
    {
      options: { name: 'session.backdrop', id: 'imperium', order: 10 },
      item: { ...backdrop, layers: { portrait: true, effects: true } },
    },
  ])
})

test('independently enables the slider, portrait, and backdrop effects', () => {
  const registrations = []
  const context = {
    i18n: { define: () => {} },
    slots: { register: (options, item) => registrations.push({ options, item }) },
  }

  apply(context, {
    replaceReasoningSlider: false,
    showBackdropPortrait: true,
    enableBackdropEffects: false,
  })
  assert.deepEqual(registrations, [{
    options: { name: 'session.backdrop', id: 'imperium', order: 10 },
    item: { ...backdrop, layers: { portrait: true, effects: false } },
  }])

  registrations.length = 0
  apply(context, {
    replaceReasoningSlider: true,
    showBackdropPortrait: false,
    enableBackdropEffects: false,
  })
  assert.deepEqual(registrations, [{
    options: {
      name: 'composer.reasoning-intensity',
      id: 'imperium',
      order: 10,
      control: reasoningControl,
    },
    item: presentation,
  }])
})
