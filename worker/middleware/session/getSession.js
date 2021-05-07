class Session{
	constructor(context,session_id){
		this.context = context;
		this.session_id = session_id;
	}
	
	set(key,val){
		return new Promise(resolve=>{
			resolve( Reflect.set(this.context[this.session_id],key,val) );
		})
	}
	
	get(key){
		return new Promise(resolve=>{
			resolve(this.context[this.session_id][key]);
		})
	}
	
	delete(key){
		return new Promise(resolve=>{
			resolve( Reflect.delete(this.context[this.session_id],key) );
		})
	}
}

module.exports = function getSession(context,session_id){
	return new Session(context,session_id)
}