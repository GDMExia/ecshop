import { fetchEndpoint } from '../server/network'

// 我的余额
export const balanceTotal = () =>
	fetchEndpoint('/v2/ecapi.balance.get', 'POST', {})

// 我的余额列表
export const balanceList = (status, page, per_page) =>
	fetchEndpoint('/v2/ecapi.balance.list', 'POST', {
		status: status, // 状态   全部  收入  支出
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})
