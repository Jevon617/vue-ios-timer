

// 绑定事件
export const addEvent = function(el,event, callback, is=false){

	if(!el || !event){
		return;
	}
	if(document.addEventListener){
		el.addEventListener(event,callback,is)
	}else{
		el.attachevent("on"+event, callback,is)
	}
}

// 移除事件
export const removeEvent = function(el,event, callback,is=false){
    if(!el || !event){
        return;
    }
    if(document.removeEventListener){
        el.removeEventListener(event,callback,is)
    }else if(document.detachEvent){
        el.detachEvent(event,callback,is)
    }else{
        el['on'+type] = null;
    }

}

// 阻止事件冒泡,捕获
export const stopEvent = (e)=>{
    if(!e) return;
    if(e.stopPropagation){
        e.stopPropagation();
    }else if(window.event){
        event.cancleBubble = true;
    }

}


// 向任意上级组件发送事件
export const dispatch = (componentName,eventName, params )=>{
    let parent = this.$parent || this.$root;
    let name   = parent.$options.componentName;

    // 找到父组件跳出while
    while(parent && (!name || name != componentName)){
        parent = parent.$parent;
        if(parent) name = parent.$options.componentName;
    }

    if(parent) parent.$emit.apply(parent, [eventName].concat[params])
}

// 向任意下级发送事件
export const brodercast = (componentName, eventName, params)=>{
    let children = this.$children;

    children.forEach(child=>{
        if(child.$options.componentName == componentName){
            child.$emit.apply(child, [evnetName].concat(params))
        }else{
            brodercast.apply(child,[componentName, eventName].concat[params]);
        }
    })
}

export const getTime= (timeStamp)=>{
    let time  = new Date(timeStamp),
        day   = time.getDate(),
        month = time.getMonth(),
        year  = time.getFullYear();

    if(!day || !month || !year){
        return ''
    }else{
        return `${year}-${month+1}-${day}`
    }
}

export const clone = (obj)=>{
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    
    // Handle Date
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        let copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        let copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");

}