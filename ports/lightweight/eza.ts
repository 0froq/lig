import type { ThemeIR } from '../types'
import { color, heading } from './common'

export const EZA_BINDINGS: Record<string, Record<string, string>> = {
  filekinds: {
    normal: 'text.primary',
    directory: 'accent.blue.base',
    symlink: 'accent.cyan.base',
    pipe: 'accent.orange.base',
    block_device: 'accent.orange.base',
    char_device: 'accent.orange.base',
    socket: 'accent.magenta.base',
    special: 'accent.orange.base',
    executable: 'accent.green.base',
    mount_point: 'accent.blue.highlight',
  },
  perms: {
    user_read: 'text.primary',
    user_write: 'accent.orange.base',
    user_execute_file: 'accent.green.base',
    user_execute_other: 'accent.green.base',
    group_read: 'text.secondary',
    group_write: 'accent.orange.base',
    group_execute: 'accent.green.base',
    other_read: 'text.secondary',
    other_write: 'accent.orange.base',
    other_execute: 'accent.green.base',
  },
  git: { new: 'git.add', modified: 'git.change', deleted: 'git.delete', renamed: 'accent.blue.base', ignored: 'text.subtle', conflicted: 'diagnostic.error' },
}

export function eza(theme: ThemeIR): string {
  return heading(theme) + Object.entries(EZA_BINDINGS).map(([group, entries]) => `${group}:\n${
    Object.entries(entries).map(([key, token]) => `  ${key}:\n    foreground: "${color(theme, token)}"\n`).join('')}`).join('')
  + ['punctuation', 'date', 'inode', 'blocks', 'header', 'octal', 'flags'].map(key => `${key}:\n  foreground: "${color(theme, key === 'header' ? 'text.strong' : 'text.secondary')}"\n`).join('')
}
