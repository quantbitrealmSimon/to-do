/**
 * Vitest test setup file
 * Configures testing environment
 */
import { vi } from 'vitest'

// Mock localStorage for tests
let store = {}

const localStorageMock = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => {
    store[key] = value
  }),
  removeItem: vi.fn((key) => {
    delete store[key]
  }),
  clear: vi.fn(() => {
    store = {}
  }),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
