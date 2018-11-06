<template>
    <div class="scroll" ref="wrapper">

		<!-- 数据列表 -->
    	<div class="list-wrapper">
    		<slot name="content"></slot>
            <!-- 上拉加载 start-->
            <slot name="pullup">
                <div class="pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        {{ pullupText }}
                    </div>
                    <div class="after-trigger" v-else>
                        <loading></loading>
                    </div>
                </div>
            </slot>
            <!-- 上拉加载 end-->
    	</div>

        <!-- 下拉刷新start -->
        <slot name="pulldown">
            <div class="pulldown-wrapper" :style="pullDownStyle">
                <div class="before-trigger" v-if="beforePullDown">
                    {{ pullDownText }}
                </div>
                <div class="after-trigger" v-else>
                    <loading v-if="isPullDown"></loading>
                    <div v-else>刷新成功</div>
                </div>
            </div>
        </slot>
        <!-- 下拉刷新end -->

    </div>
</template>

<script>
import Bscroll from 'better-scroll';
import loading from '../loading/loading.vue';
export default {
	componentName : 'scroll',
    components:{
        loading
    },
	data(){
        return{
            scroll       : null,
            isPullUpLoad : false,  // 上拉正在加载中
            pullUpDirty  : true,   // 是否有新数据
            isPullDown   : false,  // 正在刷新
            beforePullDown: true,  // 未开始下拉刷新
            pullDownStyle : {}
        }
	},
    mounted(){
        this.initScroll();
    },
    destroyed() {
        this.scroll && this.scroll.destroy()
    },
    computed:{
        pullupText(){
            const moreText = this.pullUpLoad && this.pullUpLoad.more || '上拉加载更多';
            const noMoreText = this.pullUpLoad && this.pullUpLoad.nomore || '没有更多数据了';
            return this.pullUpDirty && moreText || noMoreText;
        },
        pullDownText(){
            return this.pullDown && this.pullDown.refreshText || '下拉刷新';
        }
    },
    methods:{
        forceUpdate(dirty){
            if(this.pullUpLoad && this.isPullUpLoad){
                this.pullUpDirty = dirty;
                this.isPullUpLoad = false;
                this.finishPullUp();
                this.refresh();
            }else if(this.pullDown && this.isPullDown){
                this.isPullDown = false;
                setTimeout(()=>{            // 让刷新成功停留一段时间
                    this.finishPullDown();
                    this.refresh();
                    this.beforePullDown = true;
                },500)
            }
        },
        initScroll(){
            if(!this.$refs.wrapper){
                return
            }
            let options = {
                probeType : this.probeType,
                click     : this.click,
                startX    : this.startX,
                startY    : this.startY,
                tap       : this.tap,
                pullUpLoad: this.pullUpLoad,
                pullDownRefresh: this.pullDown && {  threshold: 50,stop : 50 }
            }

            this.scroll = new Bscroll(this.$refs.wrapper, options);
            
            // 代理scrollEnd事件
            if(this.scrollEnd){
                this.scroll.on('scrollEnd',(pos)=>{
                    this.$emit('scrollEnd', pos)
                })
            }
            // 代理scroll事件
            if(this.onScroll){
                this.scroll.on('scroll',(pos)=>{
                    console.log(pos.y);
                    let position = pos.y-50 >= 20 && 20 || pos.y-50;
                    this.$set(this.pullDownStyle, 'top', position + 'px')
                    this.$emit('scroll', pos);
                })
            }
            // 代理pullingUp事件,在一次上拉加载的动作后.
            if(this.pullUpLoad){
                this.onPullingUp();
            }

            // 代理pullingDown事件,在一次下拉刷新的动作后.
            if(this.pullUpLoad){
                this.onPullingDown();
            }
        },
        onPullingUp(){
            this.scroll.on('pullingUp',()=>{
                this.isPullUpLoad = true;
                this.$emit('pullingUp');
            })
        },
        onPullingDown(){
            this.scroll.on('pullingDown', ()=>{
                this.beforePullDown = false;
                this.isPullDown = true;
                this.$emit('pullingDown');
            })
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        finishPullUp(){
            this.scroll && this.scroll.finishPullUp();
        },
        finishPullDown(){
            this.scroll && this.scroll.finishPullDown();
        }
    },
    watch:{
        list(){
            // 列表有变化刷新,没有变化在父组件调用forceUpdate
            this.forceUpdate(true);
        }
    },
    props : {
        list : {            // 数据源
            type : Array,
            default(){
                return []
            }
        },
        startX : {          // 横轴方向初始化位置
            type : Number,
            default : 0
        },
        startY : {          // 纵轴方向初始化位置
            type : Number,
            default : 0
        },
        probeType : {       // 实时派发滚动位置的等级
            type : Number,
            default : 3
        },
        click : {           // 开启better-scroll派发的click事件
            type : Boolean,
            default : true,
        },
        tap : {
            type : Boolean, // 开启better-scroll派发的tap事件
            default : false
        },
        scrollEnd : { // 监听滚动到结束位置
            type : Boolean,
            default : false
        },
        pullDown : {     // 是否开启下拉刷新
            type : null,
            default : false
        },
        pullUpLoad : {      // 是否开启上拉加载
            type : null,
            default : false
        }, 
        onScroll : {       // 监听滚动事件
            type : Boolean,
            default : true
        }
    }
    
}
</script>

<style scoped  lang="scss">
.scroll{
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;

}
.list-wrapper{
    width: 100%;
    min-height: 101%;
}
.pulldown-wrapper{
    width: 100%;
    height: 50px;
    position: absolute;
    display: flex;
    align-items : center;
    justify-content : center;
    left: 0;
    top: -50px;
    z-index: 100;
}
.pullup-wrapper{
    width: 100%;
    height: 50px;
    display: flex;
    align-items : center;
    justify-content : center;
}
</style>
