import { fetchEndpoint } from '../server/network'

// 提现
export const withdraw = (cash, memo) =>
	fetchEndpoint('/v2/ecapi.withdraw.submit', 'POST', {
		cash: cash, // 金额
		memo: memo // 备注
	})

// 提现取消
export const withdrawCancel = id =>
	fetchEndpoint('/v2/ecapi.withdraw.cancel', 'POST', {
		id: id //
	})

// 提现列表
export const withdrawList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.withdraw.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})
