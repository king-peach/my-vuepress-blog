module.exports = {
	title: `King-peach`,
	description: '记录一些平时遇到的问题和技术难点',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/favicon.ico'
			}
		]
	],
	dest: './docs/.vuepress/dist',
	base: '/',
	themeConfig: {
		nav: [
			{ text: '首页', link: '/' },
			{
				text: 'Web前端',
				items: [
					{
						text:'HTML+CSS',
						link: '/web/html&css/'
					},
					{
						text: 'JavaScript',
						link: '/web/javascript/'
					},
					{
						text: '浏览器',
						link: '/web/browser/'
					},
					{
						text: '前端工程化',
						link: '/web/engineering/'
					}
				],
			},
			{
				text: 'Flutter',
				items: [
					{
						text: '花上几个小时学习Dart，为Flutter打好基础',
						link: '/flutter/start'
					}
				]
			},
			{ text: '关于我的', link: '/personal/' },
		],
		lastUpdated: '更新时间',
		displayAllHeaders: true,
		sidebar: {
			'/web/': [
				{
					title: 'Javascript',
					children: [
						'/web/javascript/',
						'/web/javascript/variable',
						'/web/javascript/execution-context',
						'/web/javascript/scope-chain',
						'/web/javascript/execution-context-stack',
						'/web/javascript/static&active-execution-context-chain',
						'/web/javascript/explain-this',
						'/web/javascript/explain-closure',
						'/web/javascript/prototype-prototypeChain',
						'/web/javascript/object-extend',
						'/web/javascript/task-queue-event-circulation',
						'/web/javascript/modules',
						'/web/javascript/hacker-9',
						'/web/javascript/argumentsFunc',
						'/web/javascript/number-inaccurate',
						'/web/javascript/smart-combination'
					],
				},
				{
					title: 'HTML+CSS',
					children: [
						'/web/html&css/',
						'/web/html&css/css-variable',
						'/web/html&css/implement-arrow',
						'/web/html&css/pseudo-element-research'
					]
				},
				{
					title: '浏览器',
					children: [
						'/web/browser/',
						'/web/browser/page-render-principle',
						'/web/browser/browser-storage'
					]
				},
				{
					title: '前端工程化',
					children: [
						'/web/engineering/',
						'/web/engineering/commit-rule',
						'/web/engineering/zaozaoliao-devOps',
						'/web/engineering/build-person-blob',
						'/web/engineering/ssh-connect-git'
					]
				}
			],
			'/flutter/': [
				{
					title: '花上几个小时学习Dart，为Flutter打好基础',
					children: [ '/flutter/start' ]
				}
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
