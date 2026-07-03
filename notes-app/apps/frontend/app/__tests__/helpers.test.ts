import { describe, it, expect } from 'vitest'
import { buildQueryString } from '../utils/helpers'

describe('buildQueryString', () => {
  it('returns an empty string when no params given', () => {
    expect(buildQueryString({})).toBe('')
  })

  it('returns an empty string when all values are undefined', () => {
    expect(buildQueryString({ q: undefined })).toBe('')
  })

  it('returns an empty string when all values are empty strings', () => {
    expect(buildQueryString({ q: '' })).toBe('')
  })

  it('builds a query string with a single param', () => {
    expect(buildQueryString({ q: 'hello' })).toBe('?q=hello')
  })

  it('URL-encodes special characters', () => {
    expect(buildQueryString({ q: 'hello world' })).toBe('?q=hello%20world')
  })
})
