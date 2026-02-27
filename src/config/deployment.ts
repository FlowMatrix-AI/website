import rawDeployment from './deployment.json'
import {
  normalizeAllowIndexing,
  normalizeMeasurementId,
  normalizeSiteUrl,
} from './deploymentNormalization.mjs'

type RawDeploymentConfig = {
  siteUrl?: unknown
  allowIndexing?: unknown
  gaMeasurementId?: unknown
}

type DeploymentConfig = {
  siteUrl: string
  allowIndexing: boolean
  gaMeasurementId: string
}

const config = rawDeployment as RawDeploymentConfig
const siteUrl = normalizeSiteUrl(config.siteUrl)

export const deployment: DeploymentConfig = {
  siteUrl,
  allowIndexing: normalizeAllowIndexing(config.allowIndexing, siteUrl),
  gaMeasurementId: normalizeMeasurementId(config.gaMeasurementId),
}
