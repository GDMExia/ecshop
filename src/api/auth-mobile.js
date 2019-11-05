import { fetchEndpoint } from '../server/network'

// 获得手机验证码
export const authMobileSend = (code, mobile) =>
	fetchEndpoint('/v2/ecapi.auth.mobile.send', 'POST', {
		code: code, // 手机区号
		mobile: mobile // 手机号码
	})

// 验证手机号
export const authMobileVerify = (code, mobile) =>
	fetchEndpoint('/v2/ecapi.auth.mobile.verify', 'POST', {
		code: code, // 手机区号
		mobile: mobile // 手机号
	})

// 手机号注册
export const authMobileSignup = (mobile, code, password, invite_code) =>
	fetchEndpoint('/v2/ecapi.auth.mobile.signup', 'POST', {
		mobile: mobile, // 手机号
		code: code, // 验证码
		password: password, // 密码
		invite_code: invite_code // 邀请码（邀请者的id）
	})

// 手机重置用户密码
export const authMobileReset = (mobile, code, password) =>
	fetchEndpoint('/v2/ecapi.auth.mobile.reset', 'POST', {
		mobile: mobile, // 手机号
		code: code, // 验证码
		password: password // 新密码
	})

// 手机号绑定
export const authMobileBinding = (mobile, code, password) =>
	fetchEndpoint('/v2/ecapi.auth.mobile.binding', 'POST', {
		mobile: mobile, // 手机号
		code: code, // 验证码
		password: password // 密码
	})
