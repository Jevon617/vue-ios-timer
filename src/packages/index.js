import vueIosTimer from './timer.vue';

const iosTimer = {
	 install(Vue, options) {
        Vue.component('ios-timer', vueIosTimer) 
    }
}


if(typeof window !== 'undefined' && window.Vue){
	window.Vue.use(iosTimer);
}

export default iosTimer;

