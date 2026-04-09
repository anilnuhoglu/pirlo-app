const FALLBACK_ASSET_BASE_URL = 'https://pirlo-menu-app.s3.eu-central-1.amazonaws.com'
const LEGACY_MENU_URL = `${FALLBACK_ASSET_BASE_URL}/menu.json`

const trimTrailingSlash = (value) => value.replace(/\/+$/, '')

export const ASSET_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_ASSET_BASE_URL || FALLBACK_ASSET_BASE_URL
)

export const MENU_MANIFEST_URL = `${ASSET_BASE_URL}/menu/current.json`

export async function fetchLatestMenuData() {
  try {
    const manifestResponse = await fetch(MENU_MANIFEST_URL, {
      cache: 'no-store'
    })

    if (!manifestResponse.ok) {
      throw new Error(`Manifest request failed: ${manifestResponse.status}`)
    }

    const manifest = await manifestResponse.json()
    const menuPath = manifest?.key

    if (!menuPath) {
      throw new Error('Menu manifest is missing the "key" field')
    }

    const menuUrl = `${ASSET_BASE_URL}/${menuPath}`
    const versionedMenuUrl = manifest.version ? `${menuUrl}?v=${manifest.version}` : menuUrl
    const menuResponse = await fetch(versionedMenuUrl)

    if (!menuResponse.ok) {
      throw new Error(`Menu request failed: ${menuResponse.status}`)
    }

    return await menuResponse.json()
  } catch (error) {
    const legacyResponse = await fetch(LEGACY_MENU_URL, {
      cache: 'no-store'
    })

    if (!legacyResponse.ok) {
      throw error
    }

    return await legacyResponse.json()
  }
}
