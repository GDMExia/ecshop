import { fetchEndpoint } from '../server/network'

// 邮箱注册
export const authDefaultSignup = (username, email, password, invite_code) =>
	fetchEndpoint('/v2/ecapi.auth.default.signup', 'POST', {
		username: username, // 用户名
		email: email, // 邮箱
		password: password, // 密码
		invite_code: invite_code // 邀请码（邀请者的id）
	})

// 通过邮件找回用户密码
export const authDefaultReset = email =>
	fetchEndpoint('/v2/ecapi.auth.default.reset', 'POST', {
		email: email // 邮箱
	})
