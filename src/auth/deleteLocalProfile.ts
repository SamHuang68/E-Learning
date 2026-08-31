import { deleteLocalAccount } from '../lib/localBackend'
import { clearLocalProgressCache } from '../utils/storage'

/**
 * Delete one browser-local account and the shared learner progress mirror.
 *
 * The local backend intentionally mirrors the signed-in account into the same
 * browser cache used by anonymous mode. Keeping that mirror after account
 * deletion could leak one learner's progress into the next account created in
 * a shared browser, so deletion is one atomic product operation here.
 */
export function deleteLocalProfile(userId: string): boolean {
  if (!deleteLocalAccount(userId)) return false

  clearLocalProgressCache()
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
  }
  return true
}
