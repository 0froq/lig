import { apcaContrast, contrast } from '../../core'

/** One view of the resolved port tokens, shared by the demo and Source reference. */
export function terminalColors(tokens: Record<string, string>) {
  const names = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'] as const
  return [0, 8].map(start => ({
    start,
    colors: names.map((name, offset) => {
      const index = start + offset
      const hex = tokens[`terminal.ansi.${index}`]!
      const strong = tokens['text.strong']!
      const inverse = tokens['text.inverse']!
      return {
        index,
        name: start === 8 ? `bright ${name}` : name,
        hex,
        foregroundCode: (start === 0 ? 30 : 90) + offset,
        backgroundCode: (start === 0 ? 40 : 100) + offset,
        label: contrast(strong, hex) >= contrast(inverse, hex) ? strong : inverse,
        wcag: contrast(hex, tokens['terminal.background']!).toFixed(2),
        apca: apcaContrast(hex, tokens['terminal.background']!),
      }
    }),
  }))
}
