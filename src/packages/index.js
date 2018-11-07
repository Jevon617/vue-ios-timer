import iosTimer from './timer.vue';

const vueIosTimer = {
	 install(Vue, options) {
        Vue.component('vue-ios-timer', iosTimer) 
    }
}

if(typeof window !== 'undefined' && window.Vue){
	window.Vue.use(vueIosTimer);
}

export default vueIosTimer;

