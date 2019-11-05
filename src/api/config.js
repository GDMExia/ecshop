import { fetchEndpoint } from '../server/network'

//
export const configGet = () => fetchEndpoint('/v2/ecapi.config.get', 'POST', {})

export const configGetAffiliate = () => fetchEndpoint('/v2/ecapi.config.affiliate', 'POST', {})

export const configGetShare = () => fetchEndpoint('/v2/ecapi.config.share', 'POST', {})
