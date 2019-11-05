<template>
	<div class="discount-header">
		<div class="header-container">
			<p class="title">{{ item.name }}</p>
			<p class="price">{{ item.promo }}</p>
			<p class="range">{{ rangeText }}{{ userRank }}</p>
			<p class="time">
				{{ getTime(item.start_at) }}-{{ getTime(item.end_at) }}
			</p>
		</div>
		<div class="time-body">
			<img
				class="time-icon"
				src="../../../assets/image/change-icon/i2_icon_time@2x.png"
			/>
			<span class="time-text"
				>剩余<span>{{ parseInt(day / 10) }}</span
				><span class="right">{{ parseInt(day % 10) }}</span
				>天<span>{{ parseInt(hour / 10) }}</span
				><span class="right">{{ parseInt(hour % 10) }}</span
				>时<span>{{ parseInt(minute / 10) }}</span
				><span class="right">{{ parseInt(minute % 10) }}</span
				>分<span>{{ parseInt(second / 10) }}</span
				><span class="right">{{ parseInt(second % 10) }}</span
				>秒</span
			>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiscountHeader',
	data() {
		return {
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
			timer: null
		}
	},
	props: ['item'],
	created: function() {
		const nowTime = new Date()
		const startTime = new Date(this.item.start_at * 1000)
		const endTime = new Date(this.item.end_at * 1000)

		if (nowTime - startTime > 0 && endTime - nowTime > 0) {
			this.timer = setInterval(() => {
				this.timeDown(endTime)
			}, 1000)
		} else if (startTime - nowTime > 0) {
			this.timer = setInterval(() => {
				this.timeDown(startTime)
			}, 1000)
		} else if (nowTime - endTime > 0) {
			this.day = 0
			this.hour = 0
			this.minute = 0
			this.second = 0
		}
	},
	computed: {
		rangeText: function() {
			if (this.item.range === 0) {
				return '全部商品可用'
			} else if (this.item.range === 1) {
				return '部分分类可用'
			} else if (this.item.range === 2) {
				return '部分品牌可用'
			} else if (this.item.range === 3) {
				return '部分商品可用'
			}
			return ''
		},
		userRank: function() {
			if (this.item.user_rank && this.item.user_rank.length) {
				let rank = '/'
				for (let index in this.item.user_rank) {
					let obj = this.item.user_rank[index]
					rank += obj.name + '、'
				}
				rank = rank.substring(0, rank.length - 1)
				rank += '可用'
				return rank
			} else {
				return ''
			}
		}
	},
	methods: {
		getTime(timestamps) {
			let date = new Date(timestamps * 1000)
			let year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours(),
				minute = date.getMinutes(),
				second = date.getSeconds()
			return (
				year +
				'/' +
				this.formate(month) +
				'/' +
				this.formate(day) +
				' ' +
				this.formate(hour) +
				':' +
				this.formate(minute) +
				':' +
				this.formate(second)
			)
		},

		timeDown(endTime) {
			const nowTime = new Date()
			let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
			this.day = leftTime ? parseInt(leftTime / (24 * 60 * 60)) : '0'
			this.hour = leftTime
				? this.formate(parseInt((leftTime / (60 * 60)) % 24))
				: '0'
			this.minute = leftTime
				? this.formate(parseInt((leftTime / 60) % 60))
				: '0'
			this.second = leftTime ? this.formate(parseInt(leftTime % 60)) : '0'
			if (leftTime <= 0) {
				this.stop()
				this.$emit('timeLeft')
			}
		},

		stop() {
			this.timer && clearTimeout(this.timer)
			this.day = 0
			this.hour = 0
			this.minute = 0
			this.second = 0
		},

		formate(time) {
			if (time >= 10) {
				return time
			} else {
				return `0${time}`
			}
		}
	}
}
</script>

<style lang="scss">
.discount-header {
	width: 100%;
	background-color: #ffffff;
	border-bottom: 1px solid #f5f5f5;
	.header-container {
		background-image: url(../../../assets/image/change-icon/i2_pic_banner.png);
		background-size: 100% 221px;
		background-repeat: no-repeat;
		text-align: center;
		padding: 86px 10px 0px 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			font-size: 22px;
			font-family: PingFangSC;
			height: 30px;
			line-height: 30px;
			color: #333333;
			margin-bottom: 13px;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			text-align: center;
		}
		.price {
			font-size: 18px;
			font-family: PingFangSC;
			line-height: 25px;
			color: #fa800a;
			margin-bottom: 10px;
		}
		.range {
			font-size: 12px;
			font-family: PingFangSC;
			line-height: 17px;
			color: #999999;
			margin-bottom: 2px;
		}
		.time {
			font-size: 12px;
			font-family: PingFangSC;
			line-height: 17px;
			color: #999999;
		}
	}
	.time-body {
		display: flex;
		padding: 8px;
		align-items: center;
		.time-icon {
			width: 18px;
			height: 18px;
		}
		.time-text {
			font-size: 14px;
			color: #666666;
			margin-left: 3px;
			span {
				background-color: #a4aab3;
				color: #ffffff;
				margin-left: 3px;
				padding: 2px 3px;
				&.right {
					margin-right: 3px;
				}
			}
		}
	}
}
</style>
