<template>
    <ul class="el-menu">
        <slot></slot>
    </ul>
</template>

<script>
/**
 * default-active    : 当前激活的idnex
 * default-openends  : 当前打开的sub-menu的数组
 * unique-opened : 是否保持一个子菜单的打开
 * router : 是否开启路由模式
 * menu组件 : open 展开指定的sub-menu , close 收起指定的sub-menu
 */
export default {
	name : 'Menu',
	componentName : 'Menu',
    data(){
        return{
            openMenus : [],
            items : {},
            subMenus : {},
            activeIndex : this.defaultActive
        }
    },
    provide(){
        return {
            rootMenu : this
        }
    },
    props:{
        router : Boolean,
        defaultActive : [String,Number],
        uniqueOpened : Boolean
    },
    methods:{
        handleItemClick(item){
            const oldActiveIndex = this.activeIndex;
            this.activeIndex = item.index;
            if(this.router){
                if(item.route){
                    this.$router.push(item.route);
                }else{
                    this.activeIndex = oldActiveIndex;
                }
            }
        },
        handleSubMenuClick(item){
            let isOpened = this.openMenus.indexOf(item.index) > -1;

            if(isOpened){
                this.closeMenu(item);
                this.$emit('close');
            }else{
                this.openMenu(item);
                this.$emit('end');
            }
        },
        closeMenu(item){
            let i = this.openMenus.indexOf(item.index);
            this.openMenus.splice(i,1);
        },
        openMenu(item){
            if(this.uniqueOpened){
                // 找到当前点击的submenu的最外层submenu
                let firstSubMenu = item.indexPath[0];
                // 取得所有的submenu;
                let childs = this.$children;
                
                childs.forEach(child=>{
                    if(child.index != firstSubMenu){
                        let i = this.openMenus.findIndex((el,index)=>{
                            return child.index == el;
                        })
                        i > -1 && this.openMenus.splice(i,1);
                    }
                })
            }
            this.openMenus.push(item.index);
        },
        addItem(item){
            this.$set(this.items, item.index, item);
        },
        addSubMenu(item){
            this.$set(this.subMenus, item.index, item);
        },
        initOpenMenus(){
            let index = this.activeIndex;
            let activeItem = this.items[index] || this.subMenus[index];
            let indexPath = activeItem.indexPath;  // 子菜单的所有父级菜单路径,不包括menu

            indexPath.forEach(index=>{
                let subMenu = this.subMenus[index];
                subMenu && this.openMenu(subMenu);
            })
        }

    },
    mounted(){
        this.$on('itemclick',this.handleItemClick);
        this.$on('submenuclicik',this.handleSubMenuClick);
        this.initOpenMenus();
    }
}
</script>

<style scoped  lang="scss">
.el-menu{
    width: 200px;
    margin-left: 20px;
    cursor: pointer;
    user-select: none;

    li{
        line-height: 50px;
    }
}

</style>
