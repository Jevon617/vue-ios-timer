<template>
	<li :class="['el-sub-menu', {'is-active':isOpen}]"
	    @click.stop="handleSubMenuClick">

		<div class="sub-title" :style="{paddingLeft:paddingLeft && paddingLeft+'px' || ''}">
			<slot name="title"></slot>
			<i class="iconfont icon-drop"></i>
		</div>

        <transition 
            name="submenu-list"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter" 
            v-on:after-enter="afterEnter"
            v-on:leave="leave"
            v-on:before-leave="beforeLeave"
            v-on:after-leave="afterLeave">

            <ul class="el-menu-list" v-show="isOpen">
                <slot></slot>
            </ul>
        </transition>
	</li>
    
</template>

<script>
/**
 * index    : 组件index,唯一标识
 * disabled : 是否禁用
 * submenu组件实现的功能,
 */
import mixins from './mixins.js';

export default {
	name : 'subMenu',
	componentName : 'subMenu',
	inject : ['rootMenu'],
    mixins:[mixins],
	data(){
		return {
			items : {},
            submenus : {}
		}
	},
    props:{
    	index : {
    		type : String,
    		required : true
    	},
    	disabled : Boolean
    },
    methods:{
        addItem(item){
        	this.$set(this.items, item.index, item);
        },
        addSubMenu(item){
            this.$set(this.submenus, item.index, item);
        },
        handleSubMenuClick(){
        	const { rootMenu, disabled } = this;

        	if(!this.disabled){
        		this.dispatch('Menu', 'submenuclicik', this);
        	}
        },
        beforeEnter(el){
            if (!el.dataset) el.dataset = {};

            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;

            el.style.height = '0';
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        },
        enter(el){
            if (el.scrollHeight !== 0) {
              el.style.height = el.scrollHeight + 'px';
              el.style.paddingTop = el.dataset.oldPaddingTop;
              el.style.paddingBottom = el.dataset.oldPaddingBottom;
            } else {
              el.style.height = '';
              el.style.paddingTop = el.dataset.oldPaddingTop;
              el.style.paddingBottom = el.dataset.oldPaddingBottom;
            }

            el.style.overflow = 'hidden';
        },
        afterEnter(el) {
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
        },
        beforeLeave(el) {
            if (!el.dataset) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldOverflow = el.style.overflow;

            el.style.height = el.scrollHeight + 'px';
            el.style.overflow = 'hidden';
        },
        leave(el){
            if(el.scrollHeight !== 0){
                el.style.height = 0;
                el.style.paddingTop = 0;
                el.style.paddingBottom = 0;
            }
        },
        afterLeave(el) {
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
        }
    },
    computed:{
    	// 展开
    	isOpen(){
    		return this.rootMenu.openMenus.indexOf(this.index) > -1;
    	}
    },
    mounted(){
    	this.rootMenu.addSubMenu(this);
    	this.parentMenu.addSubMenu(this);
    }
}
</script>

<style scoped  lang="scss">
@import '../../style/_mixin.scss';

.el-sub-menu{
    width: 200px;
    text-align: left;
}

.sub-title{
    width: 200px;
    @include flex(space-between);
    @include padding(0 10px);
}

.sub-title:hover{
    background-color:#ecf5ff ;
}

// .el-menu-list{
//     transition : all .5s ease;
// }

.submenu-list-leave-active{
    transition : all .4s ease;
}
.submenu-list-enter-active{
    transition : all .4s ease;
}

i{
    font-size: 12px !important;
    transition: all .4s ease;
    margin-left: 10px;
}

.is-active>.sub-title>.icon-drop{
    display: inline-block;
    transform:rotateZ(180deg);
}
    



</style>
