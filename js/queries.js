// SEARCH PARAMS FOR PROJECTS/COLLAB/TEACHING

const qs = function (){
	return (function(a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i)
		{
			var p=a[i].split('=', 2);
			if (p.length == 1)
				b[p[0]] = "";
			else
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.slice(1).split('&'));
}

// QUERY TO DIVIDE INTO CATEGORIES
const cats = function(arr, property, content_name){
	let cats = []
	arr.forEach(element => {
		let the_cat = cats.find((x)=>{return x[property] === element[property]})
		if (the_cat === undefined){
			let new_category = {}
			new_category[property] = element[property]
			new_category[content_name] = [element]
			cats.push(new_category)
		} else {
			the_cat[content_name].push(element)
		}
	});
	return cats
}
