<template>
    <div class="timer-demo" >
    	<input type="" placeholder="请选择时间" readonly @click="show" v-model="time">
    	<ios-timer  type="datetime" time="08:30" ref="timer" @getTime="getTime"></ios-timer>
    </div>
</template>

<script>
import timer from '../components/timer/timer.vue';
export default {
	data(){
		return{
			time : ''
		}
	},
	methods:{
		show(){
			this.$refs.timer.show();
		},
		getTime(time){
			this.time = time;
		}
	}
}
</script>

<style scoped  lang="scss">
input{
	width: 200px;
	border: 1px solid #ccc;
	margin-top: 100px;
}

</style>
