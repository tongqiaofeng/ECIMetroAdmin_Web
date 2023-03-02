import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		// 按需引入element
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		vueSetupExtend(),
	],
	resolve: {
		// 设置路径别名
		alias: {
			vue: 'vue/dist/vue.esm-bundler.js',
			'@': resolve('./src'),
		},
	},
	base: '/admin/', // 打包路径 ./
	server: {
		host: '0.0.0.0',
		port: 4000, // 服务端口号
		open: false, // 服务启动时是否自动打开浏览器
		cors: true, // 允许跨域
	},

	build: {
		outDir: 'dist',
	},
	css: {
		preprocessorOptions: {
			// 引入公用的样式
			scss: {
				additionalData: `
          @use "@/styles/index.scss" as *;
        `,
				charset: false,
			},
		},
	},
});
