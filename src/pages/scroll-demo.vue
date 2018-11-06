<template>
    <div class="scroll-demo">
    	<scroll
    		ref = "scroll"
    		:list =	"list"
    	 	:pullUpLoad = "true"
    	 	:pullDown = "true"
    	 	:scrollEnd = "true"
    	 	@scrollEnd = "listenScrollEnd"
    		@pullingUp = "getData"
    		@pullingDown = "pullDown">

    		<ul slot="content" class="content">
    			<li v-for="item in list">{{ item }}</li>
    		</ul>

    	</scroll>
    </div>
</template>

<script>
import scroll from '../components/scroll/scroll.vue';
export default {
	components:{
		scroll
	},
	data(){
		return{
			list : [1,2,3,4,5]

		}
	},
	methods:{
		getData(){
			let random = Math.random(0,1);
			setTimeout(()=>{
				if(random > 0.5){
					this.list.push(random);
				}else{
					this.$refs.scroll.forceUpdate(false);
				}
			},1000) 
		},
		pullDown(){
			let date = Number(new Date());
			setTimeout(()=>{
				this.list.unshift(date);
			},1000) 
		},
		listenScrollEnd(pos){
			console.log('到底部了')
		}
	}
    
}
</script>

<style scoped  lang="scss">
.scroll-demo{
	width: 100%;
	height: 100vh;
}

li{
	width: 100%;
	height: 50px;
	line-height: 50px;
	border-bottom: 1px solid #ccc;
}

li:first-child{
	// border-top: 1px solid #ccc;
}

</style>
