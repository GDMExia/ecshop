import { fetchEndpoint } from '../server/network'

// 获取优惠活动列表
export const activityList = () =>
	fetchEndpoint('/v2/ecapi.activity.list', 'POST', {})

// 获取优惠活动列表
export const activityDetail = id =>
	fetchEndpoint('/v2/ecapi.activity.get', 'POST', {
		activity: id //优惠id
	})
