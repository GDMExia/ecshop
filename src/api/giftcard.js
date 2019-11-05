import { fetchEndpoint } from '../server/network'

// 添加礼品卡
export const giftcardBind = id =>
	fetchEndpoint('/v2/ecapi.giftcard.bind', 'POST', {
		id: id // 按礼品卡状态筛选
	})

// 礼品卡列表
export const giftcardList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.giftcard.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

// 礼品卡交易记录列表
export const giftcardRecordList = (page, per_page, giftcard) =>
	fetchEndpoint('/v2/ecapi.giftcard.record.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page, // 每页多少
		giftcard: giftcard // 礼品卡ID
	})
