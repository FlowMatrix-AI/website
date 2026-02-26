import { readDeploymentConfig, deploymentConfigPath } from './read-deployment-config.mjs'

function isValidHttpsUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function isLikelyMeasurementId(value) {
  return /^G-[A-Za-z0-9]+$/.test(value)
}

async function main() {
  const config = await readDeploymentConfig()
  const errors = []

  if (!isValidHttpsUrl(config.siteUrl)) {
    errors.push(`siteUrl must be a valid https URL (received "${config.siteUrl}")`)
  }

  if (typeof config.allowIndexing !== 'boolean') {
    errors.push('allowIndexing must be a boolean')
  }

  if (config.gaMeasurementId && !isLikelyMeasurementId(config.gaMeasurementId)) {
    errors.push(
      `gaMeasurementId must match G-XXXXXXXX format when set (received "${config.gaMeasurementId}")`,
    )
  }

  if (errors.length > 0) {
    console.error('\n[deployment-validate] Failed with the following issues:')
    errors.forEach((error) => {
      console.error(`- ${error}`)
    })
    process.exit(1)
  }

  console.log(`[deployment-validate] OK (${deploymentConfigPath})`)
}

main().catch((error) => {
  console.error(`[deployment-validate] ${error.message}`)
  process.exit(1)
})
