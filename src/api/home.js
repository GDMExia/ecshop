import { fetchEndpoint } from '../server/network'

// 首页推荐商品列表
export const homeProductList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.home.product.list', 'POST', {})
