module.exports = {
	title: `King-peach`,
	description: '记录一些平时遇到的问题和技术难点',
	head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
	dest: './docs/.vuepress/dist',
	themeConfig: {
		nav: [
			{ text: '首页', link: '/' },
			{
				text: '前端相关',
				items: [
					{ text: 'javaScript', link: '/guide/javaScript/main' },
					{ text: '正则表达式', link: '/guide/regexp/' },
				],
			},
			{ text: '关于我的', link: '/personal/' },
		],
		lastUpdated: '更新时间',
		displayAllHeaders: true,
		sidebar: {
			'/guide/': [
				{
					title: 'javaScript',
					children: ['/guide/javaScript/main', '/guide/javaScript/variable', '/guide/javaScript/modules', '/guide/javaScript/hacker-9', '/guide/javaScript/argumentsFunc'],
				},
				{
					title: '正则表达式',
					children: ['/guide/regexp/', '/guide/regexp/exec'],
				},
			],
			'/personal/': ['/personal/'],
		},
	},
	markdown: {
		lineNumbers: true,
	},
	permalink: '/:year/:month/:day/:slug',
	plugins: ['@vuepress/back-to-top'],
};
