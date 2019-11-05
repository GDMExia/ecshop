import { fetchEndpoint } from '../server/network'

// 获取红包列表 ECMobile 4.0
export const cashgiftList = (page, per_page, status) =>
	fetchEndpoint('/v2/ecapi.cashgift.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page, // 每页多少
		status: status // 按红包状态筛选
	})

// 获取可用的红包列表 ECMobile 4.0
export const cashgiftAvailable = (page, per_page, shop, total_price) =>
	fetchEndpoint('/v2/ecapi.cashgift.available', 'POST', {
		page: page, // 当前第几页
		per_page: per_page, // 每页多少
		shop: shop, // 店铺ID
		total_price: total_price // 总价
	})

// 添加红包 ECMobile 4.0
export const cashgiftAdd = (bonus_sn) =>
	fetchEndpoint('/v2/ecapi.cashgift.add', 'POST', {
		bonus_sn: bonus_sn // 红包序列号
	})
