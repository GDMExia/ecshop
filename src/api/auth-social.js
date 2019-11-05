import { fetchEndpoint } from '../server/network'

// 第三方授权
export const authSocial = (
	vendor,
	access_token,
	open_id,
	invite_code,
	js_code
) =>
	fetchEndpoint('/v2/ecapi.auth.social', 'POST', {
		vendor: vendor, // 第三方平台类型
		access_token: access_token, // OAUTH TOKEN
		open_id: open_id, // 用户ID
		invite_code: invite_code, // 推荐人ID（选填）
		js_code: js_code // 小程序专用（选填）
	})
