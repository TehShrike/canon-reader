import { cpSync, mkdirSync, rmSync } from 'node:fs'

// Clean and recreate build directory
rmSync('build', { recursive: true, force: true })
mkdirSync('build', { recursive: true })

// Copy public directory contents to build
cpSync('public', 'build', { recursive: true })

console.log('Copied public/ to build/')
