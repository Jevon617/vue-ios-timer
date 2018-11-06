<template>
    <div>
    	<h3 >{{ $t('title') }}</h3>
        <div class="toggleLang">
            <span @click="toggleLang('zh')">中文</span> |
            <span @click="toggleLang('en')">英文</span>
        </div>
    	<el-menu :default-active="'1-4-4-1'" :unique-opened="true">
    		<el-sub-menu index="1">
    			<span slot="title">{{ $t('first.item1') }}</span>
    			<el-menu-item index="1-1">第一项</el-menu-item>
    			<el-menu-item index="1-2">第二项</el-menu-item>
    			<el-menu-item index="1-3">第三项</el-menu-item>
    			<el-sub-menu index="1-4">
    				<span slot="title">第四项</span>
    				<el-menu-item index="1-4-1">第41项</el-menu-item>
    				<el-menu-item index="1-4-2">第42项</el-menu-item>
    				<el-menu-item index="1-4-3">第43项</el-menu-item>
                    <el-sub-menu index="1-4-4">
                        <span slot="title">第44项</span>
                        <el-menu-item index="1-4-4-1">第441项</el-menu-item>
                        <el-menu-item index="1-4-4-2">第442项</el-menu-item>
                        <el-menu-item index="1-4-4-3">第443项</el-menu-item>
                    </el-sub-menu>
    			</el-sub-menu>
    		</el-sub-menu>
    		<el-sub-menu index="2">
    			<span slot="title">{{$t('first.item2')}}</span>
    			<el-menu-item index="2-1">第一项</el-menu-item>
    			<el-menu-item index="2-2">第二项</el-menu-item>
    			<el-menu-item index="2-3">第三项</el-menu-item>
    			<el-sub-menu index="2-4">
    				<span slot="title">第四项</span>
    				<el-menu-item index="2-4-1">第41项</el-menu-item>
    				<el-menu-item index="2-4-2">第42项</el-menu-item>
    				<el-menu-item index="2-4-3">第43项</el-menu-item>
    			</el-sub-menu>
    		</el-sub-menu>
            <el-sub-menu index="3">
                <span slot="title">{{$t('first.item3')}}</span>
                <el-menu-item index="3-1">漯河</el-menu-item>
            </el-sub-menu>
    	</el-menu>
    </div>
</template>

<script>
import menuItem from '../components/menu/menu-item.vue';
import subMenu from '../components/menu/subMenu.vue';
import menu from '../components/menu/menu.vue';

export default {
	components:{
		'el-menu-item':menuItem,
		'el-sub-menu':subMenu,
		'el-menu' : menu
	},
    methods:{
        toggleLang(lang){
            // i18n提供全局变量locale,进项语种的切换
            this.$i18n.locale = lang;
        },
        show(){
            this.$refs.timer.show();
        }
    }
    
}
</script>

<style scoped  lang="scss">
@import '../style/_mixin.scss';
.toggleLang{
    color: skyblue;
    position: absolute;
    right: 30px;
    top: 10px;
    cursor: pointer;
    @include flex;
    font-size: 14px;
    span{
        margin:0 3px;
    }
}


</style>
