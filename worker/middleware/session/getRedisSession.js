
class RedisSession{
	constructor(redis,session_id){
		this.redis = redis;
		this.session_id = session_id;
	}
	
	set(key,val){
		return new Promise((resolve,reject)=>{
			this.redis.hmset(this.session_id,[key,val],(err,result)=>{
				if(err) return reject(err);
				resolve(result);
			})
		})
	}
	
	get(key){
		return new Promise((resolve,reject)=>{
			this.redis.hget(this.session_id,key,(err,result)=>{
				if(err) return reject(err);
				resolve(result);
			})
		})
	}
	
	delete(key){
		return new Promise((resolve,reject)=>{
			this.redis.hdel(this.session_id,key,(err,result)=>{
				if(err) return reject(err);
				resolve(result);
			})
		})
	}
}


module.exports = function getRedisSession(redis,session_id){
	redis.expire(session_id,60*60*24)				//设置redis的key有效时间(24小时)
	
	return new RedisSession(redis,session_id)
}