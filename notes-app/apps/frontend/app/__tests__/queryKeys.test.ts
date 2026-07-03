import { describe, it, expect } from 'vitest'
import { QUERY_KEYS } from '../lib/query.config'

describe('QUERY_KEYS', () => {
  describe('notes', () => {
    it('returns a stable key with no filters', () => {
      expect(QUERY_KEYS.notes()).toEqual(['notes', { q: undefined }])
    })

    it('includes q when provided', () => {
      expect(QUERY_KEYS.notes('search')).toEqual(['notes', { q: 'search' }])
    })

    it('produces different keys for different filters', () => {
      const a = JSON.stringify(QUERY_KEYS.notes('foo'))
      const b = JSON.stringify(QUERY_KEYS.notes('bar'))
      expect(a).not.toBe(b)
    })
  })

  describe('note', () => {
    it('returns a key scoped to the note id', () => {
      expect(QUERY_KEYS.note('abc')).toEqual(['notes', 'abc'])
    })

    it('produces different keys for different ids', () => {
      expect(QUERY_KEYS.note('a')).not.toEqual(QUERY_KEYS.note('b'))
    })
  })
})
