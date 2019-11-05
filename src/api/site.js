import { fetchEndpoint } from '../server/network'

// 站点信息
export const siteGet = () => fetchEndpoint('/v2/ecapi.site.get', 'POST', {})

// 站点配置
export const siteConfigsGet = (key) =>
	fetchEndpoint('/v2/ecapi.site.configs', 'post', {
		key:key
	})
