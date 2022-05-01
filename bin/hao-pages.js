#!/usr/bin/env node

const haoPagesArgv = [
  '--cwd',
  process.cwd(),
  '--gulpfile',
  require.resolve('..'),
]

process.argv.push(...haoPagesArgv)

require('gulp/bin/gulp')
