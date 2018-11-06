export default{
	inject : ['rootMenu'],

	computed:{
		parentMenu() {
			let parent = this.$parent;
			while(parent && ['subMenu','Menu'].indexOf(parent.$options.componentName) == -1) {
				parent = parent.$parent
			}

			return parent;
		},
		indexPath() {
			let path = [this.index];
			let parent = this.$parent;

			while(parent.$options.componentName != 'Menu'){
				path.unshift(parent.index);
				parent = parent.$parent;
			}

			return path;
		},
		paddingLeft(){
    		let paddingLeft = 0;
    		let parent = this.$parent;
    		while(parent.$options.componentName !== 'Menu' ){
    			paddingLeft += 20;
    			parent = parent.$parent;
    		}
    		return paddingLeft;
    	}
	},
	methods:{
		dispatch(componentName, eventName, params){
			let parent = this.$parent || this.$root;
		    let name   = parent.$options.componentName;

		    // 找到父组件跳出while
		    while(parent && (!name || name != componentName)){
		        parent = parent.$parent;
		        if(parent) name = parent.$options.componentName;
		    }
		    if(parent) parent.$emit(eventName, params);
		},
		brodercast(componentName, eventName, params){
			let children = this.$children;

		    children.forEach(child=>{
		        if(child.$options.componentName == componentName){
		            child.$emit.apply(child, [evnetName].concat(params))
		        }else{
		            brodercast.apply(child,[componentName, eventName].concat[params]);
		        }
		    })
		}
	}

}