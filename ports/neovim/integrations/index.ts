import type { PluginIntegration } from '../../types'
import { GIT_INTEGRATIONS } from './git'
import { MINI_INTEGRATIONS } from './mini'
import { OTHER_INTEGRATIONS } from './other'

export const INTEGRATIONS: Record<string, PluginIntegration> = {
  ...GIT_INTEGRATIONS,
  ...MINI_INTEGRATIONS,
  ...OTHER_INTEGRATIONS,
}
