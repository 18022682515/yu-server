
function addProperty(app, property, value) {
	Reflect.defineProperty(app, property, {
		value
	});
}


/**
 * @param {Object} o
 */
module.exports = o => {
	Object.keys(o).forEach(key=>{
		addProperty(app,key,o[key])
	})
};
