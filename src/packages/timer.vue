<template>
	<transition name="panel-fade">
	    <div class="timer" v-show="showTimer" @click="showTimer = false">
	    	<transition name="panel-move">
	    		<div class="timer-panel" v-if="showTimer">
			    	<div class="timer-btns">
			    		<button @click.stop="showTimer = false">{{ cancelText }}</button>
			    		<div class="title">
			    			请选择{{ this.type == 'date' ? '日期' : '时间' }}
			    		</div>
			    		<button @click.stop="getIndex">{{ confirmText }}</button>
			    	</div>
			    	<div class="timer-content">
			    		<div class="mask-top border-bottom-1px"></div>
				    	<div class="mask-bottom border-top-1px"></div>
				    	<div class="timer-wrapper" ref="timerWrapper">
				    		<div class="wheel" v-for="data in timeList">
				    			<ul class="wheel-scroll">
				                  	<li v-for="item,index in data" class="wheel-item">{{item}}</li>
				                </ul>
				    		</div>
				    	</div>
			    	</div>
	    		</div>
	    	</transition>
	    </div>
	</transition>
</template>

<script>

function padStart(num){
	let res = num >= 10 && num || ('0' + num);
	return res;
}

import Bscroll from 'better-scroll';
export default {
	data(){
		return{
			timeList : [],
			years : [],
			monthes : [],
			days : [],
			hours : [],
			minutes : [],
			wheels : [],
			timerSelectIndex : [],
			datex : this.date,
			datetimex : this.datetime,
			timex : this.time,
			showTimer : false
		}
	},
	props : {
		type : {
			type : String,      //三个值可选, 默认是date:日期, time:时间, datetime : 日期时间
			default : 'date'
		},
		cancelText : {
			type : String,
			default : '取消'
		},
		confirmText : {
			type : String,
			default : '确定'
		},
		date : {         // 开始日期,必须是1900-01-01这种格式
			type : String,
			default : ''
		},
		datetime : {    // 开始日期时间,必须是1900-01-01 00:00
			type : String,
			default : ''
		},
		time : {
			type : String,
			default : ''
		}
	},
	methods:{
		// 初始化所有数据
		init(){
			for(let key in this.$data){
				if(key == 'showTimer'){
					this.$data[key] = false;
				}else if(key == 'timex'){
					if(!this.time){
						this.timex = new Date().getHours() + ':' + new Date().getMinutes();
					}
				}else if(key == 'datex'){
					if(!this.date) this.datex = new Date();
				}else if(key == 'datetimex'){
					if(!this.datetime)this.datetimex = new Date();
				}else{
					this.$data[key] = [];
				}
			}
		},
		show(){
			this.init();
			this.showTimer = true;
			this.initBasicData();
			this.initTimeList();
			this.$nextTick(()=>{
				this.initScroll();
			})
		},
		initBasicData(){

			for(let i=1900; i<=2100; i++){
				this.years.push(i+'年');
			}

			for(let i=0; i<60; i++){
				if(i>0 && i<=12){
					this.monthes.push(padStart(i)+'月');
				}
				if(i>0 && i<=31){
					this.days.push(padStart(i)+'日');
				}
				if(i<24){
					this.hours.push(padStart(i)+'时');
				}
				this.minutes.push(padStart(i)+'分');
			}
			// 当type=date并且有默认值时
			if(this.type == 'date' && this.datex){
				let y = new Date(this.datex).getFullYear();
				let m = new Date(this.datex).getMonth();
				let d = new Date(this.datex).getDate();
				this.timerSelectIndex = [y-1900, m, d-1];
			// 当type=datetime并且有默认值
			}else if(this.type == 'datetime' && this.datetimex){
				let y  = new Date(this.datetimex).getFullYear();
				let m  = new Date(this.datetimex).getMonth();
				let d  = new Date(this.datetimex).getDate();
				let h  = new Date(this.datetimex).getHours();
				let min= new Date(this.datetimex).getMinutes();
				this.timerSelectIndex = [y-1900, m, d-1, h, min];
			// 当type=time并且有默认值
			}else if(this.type == 'time' && this.timex){
				let h  = Number(this.timex.split(':')[0]);
				let min= Number(this.timex.split(':')[1]);
				this.timerSelectIndex = [h, min];
			}else{
				// 当没有默认值的时候
				this.timerSelectIndex = [0,0,0,0,0];
			}
		},
		initTimeList(){
			if(this.type == 'datetime'){
				this.timeList.push(this.years);
				this.timeList.push(this.monthes);
				this.timeList.push(this.days);
				this.timeList.push(this.hours);
				this.timeList.push(this.minutes);
			}else if(this.type == 'time'){
				this.timeList.push(this.hours);
				this.timeList.push(this.minutes);
			}else {
				this.timeList.push(this.years);
				this.timeList.push(this.monthes);
				this.timeList.push(this.days);
			}
		},
		initScroll(){
			// 循环初始化多个列表
			if(!this.$refs.timerWrapper){
				return
			};
			let timerWrapper = this.$refs.timerWrapper;

			for(let i=0; i<timerWrapper.children.length; i++){

				let wheel = new Bscroll(timerWrapper.children[i],{
					wheel : {
						rotate : 25,
						selectedIndex : this.timerSelectIndex[i],
						wheelWrapperClass : 'wheel-scroll',
						wheelItemClass : 'wheel-item'
					},
					probeType : 3
				});
				this.wheels.push(wheel);
			}

			// 监听scrollEnd事件,当滚动结束以后,重新渲染天这一列
			this.wheels.forEach((wheel,i)=>{
				wheel.on('scrollEnd',(pos)=>{
					if((this.type == 'date' || this.type == 'datetime') && i != 2){
						let year    = 1900 + this.wheels[0].getSelectedIndex();
						let month   = this.wheels[1].getSelectedIndex()+1;
						let newDays = this.getDays(Number(year),Number(month));

						this.$set(this.timeList,2, newDays);
						this.wheels[2].refresh();
					}
				})
			})
		},
		getIndex(){
			// 返回选中的值
			let indexes = [],result = '';
			this.wheels.forEach(wheel=>{
				indexes.push(wheel.getSelectedIndex())
			});

			if(indexes.length == 3 || indexes.length == 5){
				indexes = indexes.map((item,i)=>{
					if(i==0){
						item = 1900 + item;
					}else if(i==1 || i==2){
						item = padStart(item+1);
					}else{
						item = padStart(item);
					}
					return item;
				})
			}else{
				indexes = indexes.map((item,i)=>{
					item = padStart(item);;
					return item;
				})
			}

			if(indexes.length == 2){
				result = indexes.join(':');
			}else if(indexes.length == 3){
				result = indexes.join('-');
			}else{
				result = `${indexes[0]}-${indexes[1]}-${indexes[2]} ${indexes[3]}:${indexes[4]}`;
			}

			this.showTimer = false;
			this.$emit('getTime',result);
		},
		getDays(year,month){
			// 根据年份和月份得到当月的天数
			let isLeapYear = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
			let bigMonthes = [1,3,5,7,8,10,12];
			let isBigMonth = bigMonthes.indexOf(month) > -1;
			let days = [];

			for(let i=1; i<=31; i++){
				days.push(padStart(i)+'日');
			};

			if(isBigMonth){
				return days;
			}else if(isLeapYear && month == 2){
				return days.splice(1,29);
			}else if(!isLeapYear && month == 2){
				return days.splice(1,28);
			}else{
				return days.splice(1,30);
			}
		}
	}
}
</script>

<style scoped  lang="scss">
@import '../style/_mixin.scss';
.timer{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color:rgba(0,0,0,.5);
}

.timer-panel{
	position: absolute;
	bottom: 0;
	left: 0;
	height: 273px;
	width: 100%;
	background-color: white;
}

.timer-btns{
	width: 100%;
	height: 50px;
	@include flex(space-between);
	border-bottom: 1px solid #ccc;
	button{
		width: 75px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		color: gray;
		background-color: transparent;
		font-size: 16px;
	}
	button:last-child{
		color: skyblue;
	}
}
.timer-content{
	width: 100%;
	height: 222px;
	position: relative;
	padding-top: 30px;
	padding-bottom: 30px;
	box-sizing: border-box;
}
.timer-wrapper{
	width: 100%;
	@include flex(space-around);
	height: 100%;
}
.wheel{
	width: 100px;
	height: 100%;
	overflow: hidden;
	.wheel-scroll{
		width: 100%;
		margin-top: 61px;
        line-height: 36px;
	}
	li{
		width: 100%;
		height: 36px;
		line-height: 36px;
		text-align: center;
		font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
	}
}

.mask-top, .mask-bottom{
	z-index: 10;
	width: 100%;
	height: 63px;
	pointer-events: none;
	transform: translateZ(0);
}
.mask-top{
	position: absolute;
    top: 29px;
    border-bottom: 1px solid #ddd;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.mask-bottom{
	position: absolute;
    bottom: 31px;
    border-top: 1px solid #ddd;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}

.panel-move-enter-active, .panel-move-leave-active, .panel-fade-enter-active,.panel-fade-leave-active,{
	transition: all .3s ease-in-out;
}

.panel-fade-enter, .panel-fade-leave-active{
	opacity: 0;
}

.panel-move-enter,.panel-move-leave-active{
	transform: translateY(273px);
}



</style>
