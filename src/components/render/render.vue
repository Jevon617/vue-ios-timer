<script>
export default {
	name : 'Render',
	render(h){
		return <div id="foo" onClick={(e)=>this.print('hello')}>msg</div>
	},
	methods:{
		print(msg){
			console.log(msg);
		}
	},
	data(){
		return{
			msg : 'helloword'
		}
	}
}
</script>

<style scoped  lang="scss">
#foo{
	color: red;
}

</style>
