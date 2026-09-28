import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const appRoot = process.cwd()
const workspaceRoot = searchForWorkspaceRoot(appRoot)
const webRoot = resolve(workspaceRoot, 'apps/web')
const webSource = resolve(webRoot, 'src')
const publicBase = '/Plain_shop/'

function baseAwarePublicAssets(assetBase) {
  return {
    name: 'base-aware-public-assets',
    enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(webSource)) return null

      if (/\.css(?:\?.*)?$/.test(id)) {
        return code.replace(/url\((\s*["']?)\/assets\/images\//g, `url($1${assetBase}assets/images/`)
      }

      if (/\.[jt]sx?(?:\?.*)?$/.test(id)) {
        return code.replace(/(["'`])\/assets\/images\//g, `$1${assetBase}assets/images/`)
      }

      return null
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const base = command === 'build' ? publicBase : '/'
  const legacyNodeModules = resolve(appRoot, 'node_modules')
  const { VITE_API_URL = '' } = loadEnv(mode, workspaceRoot, 'VITE_')

  return {
    base,
    publicDir: resolve(webRoot, 'public'),
    plugins: [react(), baseAwarePublicAssets(base)],
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(VITE_API_URL),
    },
    resolve: {
      alias: [
        { find: /^@\//, replacement: `${webSource}/` },
        { find: 'next/link', replacement: resolve(appRoot, 'src/compat/next-link.jsx') },
        { find: 'next/navigation', replacement: resolve(appRoot, 'src/compat/next-navigation.js') },
        { find: /^react$/, replacement: resolve(legacyNodeModules, 'react') },
        { find: /^react-dom$/, replacement: resolve(legacyNodeModules, 'react-dom') },
        { find: /^react-dom\/(.*)$/, replacement: `${legacyNodeModules}/react-dom/$1` },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      fs: { allow: [workspaceRoot] },
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
    },
  }
})
