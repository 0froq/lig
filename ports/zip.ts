import { Buffer } from 'node:buffer'
import { crc32 } from '../shared/crc32'

/** Small, deterministic ZIPs of generated files; stored entries, UTF-8, 1980-01-01. */
export function zip(files: Record<string, string | Buffer>): Buffer {
  const local: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0
  for (const [path, content] of Object.entries(files).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    if (path.startsWith('/') || path.split('/').includes('..'))
      throw new Error(`Invalid ZIP entry: ${path}`)
    const name = Buffer.from(path)
    const data = typeof content === 'string' ? Buffer.from(content) : content
    const header = Buffer.alloc(30)
    header.writeUInt32LE(0x04034B50, 0)
    header.writeUInt16LE(20, 4)
    header.writeUInt16LE(0x0800, 6)
    header.writeUInt16LE(0x0021, 12)
    header.writeUInt32LE(crc32(data), 14)
    header.writeUInt32LE(data.length, 18)
    header.writeUInt32LE(data.length, 22)
    header.writeUInt16LE(name.length, 26)
    local.push(header, name, data)

    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014B50, 0)
    entry.writeUInt16LE(20, 4)
    header.copy(entry, 6, 4, 30)
    entry.writeUInt32LE(offset, 42)
    central.push(entry, name)
    offset += header.length + name.length + data.length
  }
  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054B50, 0)
  end.writeUInt16LE(central.length / 2, 8)
  end.writeUInt16LE(central.length / 2, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, directory, end])
}
