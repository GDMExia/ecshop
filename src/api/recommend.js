import { fetchEndpoint } from '../server/network'

// 获取分类推荐
export const recommendCategoryList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.recommend.category.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

// 获取商品推荐
export const recommendProductList = (
	brand,
	category,
	shop,
	product,
	page,
	per_page
) =>
	fetchEndpoint('/v2/ecapi.recommend.product.list', 'POST', {
		brand: brand, // 所属品牌ID
		category: category, // 所属分类ID
		shop: shop, // 所属店铺ID (选填)
		product: product, // 相关商品ID
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

// 获取品牌推荐
export const recommendBrandList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.recommend.brand.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

// 获取店铺推荐
export const recommendShopList = (brand, category, page, per_page) =>
	fetchEndpoint('/v2/ecapi.recommend.shop.list', 'POST', {
		brand: brand, // 按品牌id
		category: category, // 按分类id
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

// ECShop 二期  新增内容
export const recommendAffiliateList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.recommend.affiliate.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

export const recommendBonusList = (page, per_page) =>
	fetchEndpoint('/v2/ecapi.recommend.bonus.list', 'POST', {
		page: page, // 当前第几页
		per_page: per_page // 每页多少
	})

export const recommendBonusInfo = () =>
	fetchEndpoint('/v2/ecapi.recommend.bonus.info', 'POST', {})
