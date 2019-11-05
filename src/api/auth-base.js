import { fetchEndpoint } from '../server/network'
import axios from 'axios'

// 登录
export const authSignin = (username, password) =>
	fetchEndpoint('/v2/ecapi.auth.signin', 'POST', {
		username: username, // 用户名/手机号/email
		password: password // 密码
	})

export const getauthInfo = (params) => {
	return axios.request({
		url: 'http://xgguc.suoqoo.com/index.php/Index/getUserInfo',
		data: params,
		method: 'post'
	})
}
