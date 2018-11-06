<template>
    <li :style="{paddingLeft:paddingLeft+'px'}"
    	:class="['el-menu-item', { 'is-active' : isActive }]"
    	@click.stop="handleItemClick"
    >
    	<slot name="title"></slot>
    	<slot></slot>
    </li>
</template>

<script>
/**
 * index    : 组件index,唯一标识
 * route    : 路由
 * disabled : 是否禁用
 * menu-item组件实现的主要功能 : 点击选中,展示显示效果, 自动添加到父级菜单
 */

import mixins from './mixins.js';

export default {
	name : 'meunItem',
	componentName : 'meunItem',
	reject: ['rootMenu'],
	mixins:[mixins],
    props:{
    	index : {
    		type : String,
    		required : true
    	},
    	route:[String, Object],
    	disabled : Boolean
    },
    methods:{
    	handleItemClick(){
    		if(!this.disabled){
    			this.dispatch('Menu', 'itemclick', this);
    		}
    	}
    },
    computed:{
    	isActive(){
    		return this.index == this.rootMenu.activeIndex
    	}
    },
    mounted(){
    	this.rootMenu.addItem(this);
    	this.parentMenu.addItem(this);
    }
}
</script>

<style scoped  lang="scss">
.el-menu-item{
	width: 200px;
	line-height: 45px;
	height: 45px;
}

.el-menu-item:hover{
	background-color:#ecf5ff ;
}

.is-active{
	color: #409eff;
}



</style>
