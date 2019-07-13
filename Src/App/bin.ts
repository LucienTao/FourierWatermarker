import * as path from 'path'
import * as os from 'os'

const platform = os.platform()

export const basePath = path.resolve(
  __dirname,
  '../bin',
).replace('app.asar', 'app.asar.unpacked')

const getBin = (name: string) => {
  if (platform === 'win32') {
    name = name + '.exe'
  }

  return path.resolve(
    basePath,
    name,
  )
}
export const watermark64 = getBin('watermark64')