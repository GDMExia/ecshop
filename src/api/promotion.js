import { fetchEndpoint } from '../server/network'

// 获取营销活动列表
export const promotionList = (page, per_page, type) =>
	fetchEndpoint('/v2/ecapi.promotion.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page, // 每页多少
		type: type // 营销活动类型，团购就是0
	})

// 营销活动
export const promotionGet = (id, page, per_page) =>
	fetchEndpoint('/v2/ecapi.promotion.get', 'POST', {
		id: id, // 营销活动id
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})
