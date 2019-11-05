import { fetchEndpoint } from '../server/network'

// 订单支付
export const paymentPay = (order, code, referer, channel, openid) =>
	fetchEndpoint('/v2/ecapi.payment.pay', 'POST', {
		order: order, // 订单ID
		code: code, // 支付code  ehking 易汇金 pay.alipay 支付宝支付    pay.weixin微信支付  pay.unionpay 银联支付   pay.code 货到付款 pay.teegon  天工
		referer: referer, // 支付code  ehking 易汇金 pay.alipay 支付宝支付    pay.weixin微信支付  pay.unionpay 银联支付   pay.code 货到付款 pay.teegon  天工
		channel: channel, // 支付code  ehking 易汇金 pay.alipay 支付宝支付    pay.weixin微信支付  pay.unionpay 银联支付   pay.code 货到付款 pay.teegon  天工
		openid: openid
	})

// 支付方式列表
export const paymentTypesList = (order) =>
	fetchEndpoint('/v2/ecapi.payment.types.list', 'POST', {
		order: order,//订单ID
	})
