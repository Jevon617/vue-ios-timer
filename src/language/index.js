// vue 支持多语种项目
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Chinese from './chinese.js';
import English from './english.js';

Vue.use(VueI18n);

export default new VueI18n({
	locale : 'en',
	fallbackLocale : 'zh',
	messages:{
		zh : Chinese,
		en : English
	}
})