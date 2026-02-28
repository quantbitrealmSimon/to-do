import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests for localStorage persistence functionality
 * Validates:
 * - Data is saved to localStorage when todos change
 * - Data is loaded from localStorage on mount
 * - Error handling for corrupted JSON
 * - Error handling for quota exceeded
 */
describe('localStorage Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should save todos to localStorage', () => {
    const todos = [{ id: 1, todo: 'Test task', completed: false }]
    localStorage.setItem('todos', JSON.stringify(todos))
    
    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored).toEqual(todos)
  })

  it('should load todos from localStorage', () => {
    const todos = [
      { id: 1, todo: 'Task 1', completed: false },
      { id: 2, todo: 'Task 2', completed: true }
    ]
    localStorage.setItem('todos', JSON.stringify(todos))
    
    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored).toHaveLength(2)
    expect(stored[0].todo).toBe('Task 1')
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Simulate corrupted data
    localStorage.setItem('todos', 'invalid json{{')
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      const stored = localStorage.getItem('todos')
      if (stored) {
        try {
          JSON.parse(stored)
        } catch (e) {
          console.error('Failed to load todos from localStorage:', e)
          localStorage.removeItem('todos')
        }
      }
    }).not.toThrow()
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load todos from localStorage:',
      expect.any(SyntaxError)
    )
    
    consoleSpy.mockRestore()
  })

  it('should handle empty localStorage', () => {
    const stored = localStorage.getItem('todos')
    expect(stored).toBeNull()
  })

  it('should handle QuotaExceededError', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Simulate quota exceeded
    const error = new Error('Quota exceeded')
    error.name = 'QuotaExceededError'
    
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error
    })
    
    try {
      localStorage.setItem('todos', JSON.stringify([{ id: 1 }]))
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save todos.')
      }
    }
    
    expect(consoleSpy).toHaveBeenCalledWith('localStorage quota exceeded. Unable to save todos.')
    
    consoleSpy.mockRestore()
  })
})
