import assert from 'node:assert/strict'
import test from 'node:test'
import { apply, backdrop, inject, manifest, presentation } from '../dist/codex-ascension.js'

test('exports a capability-free structured CordisX plugin', () => {
  assert.equal(manifest.schemaVersion, 1)
  assert.equal(manifest.id, 'codex-ascension')
  assert.deepEqual(manifest.capabilities, [])
  assert.deepEqual(inject, ['i18n', 'slots'])
  assert.equal(presentation.variant, 'imperium')
  assert.equal(presentation.motion, 'ascension')
  assert.deepEqual(presentation.stages.map(stage => stage.material), ['plastic', 'bronze', 'steel', 'silver', 'gold'])
  assert.equal(Object.hasOwn(presentation, 'css'), false)
  assert.equal(Object.hasOwn(presentation, 'selector'), false)
  assert.equal(backdrop.driver, 'reasoning-intensity')
  assert.deepEqual(backdrop.stages.map(stage => stage.ambience), ['dormant', 'ember', 'forged', 'luminous', 'imperial'])
  assert.ok(backdrop.stages.every(stage => stage.portrait.mediaType === 'image/png' && stage.portrait.data.length > 100_000))
  assert.equal(Object.hasOwn(backdrop, 'css'), false)
  assert.equal(Object.hasOwn(backdrop, 'selector'), false)
})

test('registers both structured surfaces and both retained locales', () => {
  const catalogs = []
  const registrations = []
  apply({
    i18n: { define: catalog => catalogs.push(catalog) },
    slots: { register: (options, item) => registrations.push({ options, item }) },
  })
  assert.deepEqual(catalogs.map(catalog => catalog.locale), ['en', 'zh-CN'])
  assert.deepEqual(registrations, [
    { options: { name: 'composer.reasoning-intensity', id: 'imperium', order: 10 }, item: presentation },
    { options: { name: 'session.backdrop', id: 'imperium', order: 10 }, item: backdrop },
  ])
})
