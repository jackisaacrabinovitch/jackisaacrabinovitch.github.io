function openModal(id){
    let dialog = document.getElementById(`MODAL-${id}`)
    dialog.showModal()
    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close()
        }
      })
}

function addModals(pubdata,filter_func,element_id){
    let publications = pubdata
		.publication_data.map((obj)=>{return new Publication(obj)})
		.filter((x)=>{return x.visible === 1})
		.filter(filter_func)

    let buttoncontainer = document.getElementById(element_id)
    publications.forEach(pub => {
        buttoncontainer.innerHTML += `${pub.asButton}`
        buttoncontainer.innerHTML += `${pub.asModal}`
    });
    publications.forEach(pub => {
        document.getElementById(`RIS-DOWNLOAD-${pub.id}`).addEventListener('click',()=>{
            download(`${pub.fileTitle}_RIS.ris`,`${pub.RIS}`)
        })
    });
}

function addOrganizedModals(pubdata,filter_func,element_id){
    let publications = pubdata
		.publication_data.map((obj)=>{return new Publication(obj)})
		.filter((x)=>{return x.visible === 1})
		.filter(filter_func)

	let organized_pubs = [
		{
			"name": "Conference Proceedings",
			content: [],
			filter_func: function(x){return x.entry_type === "Proceedings Paper"}
		},
		{
			"name": "Conference Presentations",
			content: [],
			filter_func: function(x){return x.entry_type === "oral presentation" || x.entry_type === "poster presentation"}
		},
		{
			"name": "Other Presentations",
			content: [],
			filter_func: function(x){ return x.entry_type === "Lab Presentation" || x.entry_type === "Blog Post"}
		}
	]
	organized_pubs.forEach(section => {
		section.content = publications.filter(section.filter_func).sort((a,b)=>{
			return daterank(a.date)-daterank(b.date)
		})
	});
	let buttoncontainer = document.getElementById(element_id)

	organized_pubs.forEach(section => {
		if (section.content.length > 0){
			buttoncontainer.innerHTML += `<h2>${section.name}</h2>`
			section.content.forEach(pub => {
				buttoncontainer.innerHTML += `${pub.asButton}`
				buttoncontainer.innerHTML += `${pub.asModal}`
			});
		}
	});
	publications.forEach(pub => {
		document.getElementById(`RIS-DOWNLOAD-${pub.id}`).addEventListener('click',()=>{
			download(`${pub.fileTitle}_RIS.ris`,`${pub.RIS}`)
		})
	});
}

function daterank(date){
	if (date === undefined){
		return -Infinity
	}
	return -(date.year*480+date.month*32+date.day)
}

const attempt = function(func){
	try {func()}
	catch (err){}
}
const errorAtUndefined = function(test,message = ``){
	if (test === undefined){
		throw new Error(message)
	}
}
const applyRISline = function(arr,content,ristag){
	attempt(()=>{
		let res = content()
		res.forEach(element => {
			errorAtUndefined(element,`Appropriate key is undefined or cannot be found.`)
		});
		res.forEach(element => {
			arr.push(`${ristag}  - ${element}`)
		});
	});
}
const formatPeople = function(peopleset){
	people = [];
	peopleset.forEach(person => {
		people.push(`${person.surname}, ${person.given_name}`)
	});
	return people;
}
const oxfordcomma = function(arr){
	if (arr.length === 0){
		return ``
	}
	if (arr.length === 1){
		return arr[0]
	}
	if (arr.length === 2){
		return `${arr[0]} and ${arr[1]}`
	}
	end = arr.pop()
	arr.push(`and ${end}`)
	return arr.join(`, `)
}
const convertMonth = function(month){
	return ['January','February','March',
	'April','May','June',
	'July','August','September',
	'October','November','December'][month-1]
}
const download = function(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
  
	element.style.display = 'none';
	document.body.appendChild(element);
  
	element.click();
  
	document.body.removeChild(element);
}
const formatAuthorsHTML = function(authors){
	let formatauthors = []
	authors.forEach((author,index) => {
		if (author.id === undefined){
			if (index === 0){
				formatauthors.push(`<span class="author-name">${author.surname}, ${author.given_name}</span>`)
			} else {
				formatauthors.push(`<span class="author-name">${author.given_name} ${author.surname}</span>`)
			}
		} else {
			if (index === 0){
				formatauthors.push(`<a href="/pages/people.html?person=${author.id}" class="author-name">${author.surname}, ${author.given_name}</a>`)
			} else {
				formatauthors.push(`<a href="/pages/people.html?person=${author.id}" class="author-name">${author.given_name} ${author.surname}</a>`)
			}
		}
	});
	return oxfordcomma(formatauthors)
}

class Publication{
	constructor(obj){
		for (const [key, value] of Object.entries(obj)) {
			this[key] = value
		}
	}
	get RIS(){
		let res = []
		applyRISline(res,() => [this.ris_type],`TY`)
		applyRISline(res,() => [this.abstract],`AB`)
		applyRISline(res,() => [this.date.year],`PY`)
		applyRISline(res,() => [`${this.date.year}/${this.date.month}/${this.date.day}/`],`DA`)
		applyRISline(res,() => [this.language],`LA`)
		applyRISline(res,() => [this.url],`UR`)
		applyRISline(res,() => [this.title],`TI`)
		applyRISline(res,() => [this.doi],`DO`)
		applyRISline(res,() => [this.pages.start],`SP`)
		applyRISline(res,() => [this.pages.end],`EP`)
		applyRISline(res,() => [this.volume],`VL`)
		applyRISline(res,() => [this.issue],`IS`)
		switch(this.ris_type){
			case `BLOG`:
				applyRISline(res,() => formatPeople(this.authors), `AU`)
				applyRISline(res,() => [this.venue], `T2`)
			break;
			case `CONF`:
				applyRISline(res,() => formatPeople(this.authors), `AU`)
				applyRISline(res,() => [this.venue], `T2`)
				applyRISline(res,() => formatPeople(this.editors), `A2`)
				applyRISline(res,() => [this.isbn], `SN`)
				applyRISline(res,() => [this.location], `C1`)
				applyRISline(res,() => [this.publication.title], `C3`)
				applyRISline(res,() => [this.publication.publisher], `PB`)
			break;
			case `JOUR`:
				applyRISline(res,() => formatPeople(this.authors), `AU`)
				applyRISline(res,() => formatPeople(this.editors), `A2`)
				applyRISline(res,() => [this.issn], `SN`)
				applyRISline(res,() => [this.publication.title], `T2`)
				applyRISline(res,() => [this.publication.short_title], `J2`)
				applyRISline(res,() => [this.short_title], `ST`)
			break;
			case `SLIDE`:
				applyRISline(res,() => formatPeople(this.authors), `A2`)
				applyRISline(res,() => [this.venue], `T2`)
				applyRISline(res,() => [this.location], `CY`)
				applyRISline(res,() => [this.short_title], `ST`)
				applyRISline(res,() => [this.entry_type], `M3`)
			break;
		}
		res.push(`ER  - `)
		res.push(``)
		return res.join(`\n`);
	}
	get asButton(){
		let year = ``
		if (this.date === undefined){
			year = `SOON`
		} else{
			year = this.date.year
		}
		let withauthors = []
		if (this.authors !== undefined){
			withauthors = this.authors.filter((x)=>{return x.id !== "rabinovitch-jack"}).map((x)=>{return `<span class="author-name">${x.given_name} ${x.surname}</span>`})
		}

		if (withauthors.length === 0){
			return `<div class="publication-container" onclick="openModal('${this.id}')"><div class="publication-year">${year}</div><div class="publication-title">${this.title}</div></div>`
		}
		return `<div class="publication-container" onclick="openModal('${this.id}')"><div class="publication-year">${year}</div><div class="publication-author">with ${oxfordcomma(withauthors)}</div><div class="publication-title">${this.title}</div></div>`
	}
	get asModal(){
		return `<dialog id="MODAL-${this.id}"><h2>${this.title}</h2><p>${this.entry_type}</p><p>${this.referenceHTML}</p>${this.modalLinks}<table>${this.infoTable}</table></dialog>`
	}
	get modalLinks(){
		let links = [ `<a id="RIS-DOWNLOAD-${this.id}">RIS</a>` ]
		if (this.url !== undefined){
			links.push(`<a href="${this.url}">Link</a>`)
		}
		if (this.files !== undefined){
			this.files.forEach(file => {
				if (file.visible === 1){
					if (file.extension === `link`){
						links.push(`<a href="${file.url}">${file.name}</a>`)
					} else {
						let year = ``
						if (this.date === undefined){
							year = `upcoming`
						} else{
							year = this.date.year
						}
						links.push(`<a href="/files/publications/${year}/${this.id}/${this.fileTitle}_${file.name}.${file.extension}">${file.name}</a>`)
					}
				}
			});
		}
		return `<div class="modal-links-container-cont"><div class="modal-links-container"><div class="modal-links">${links.join('')}</div></div></div>`
	}
	get fileTitle(){
		let year = ``
		if (this.date === undefined){
			year = `Upcoming`
		} else{
			year = this.date.year
		}
		return `${this.authors[0].surname}_${year}_${this.id}`
	}
	get infoTable(){
		let table = []
		if (this.date === undefined){
			table.push([`Date:`,`Upcoming`])
		} else{
			table.push([`Date:`,`${this.date.day} ${convertMonth(this.date.month)} ${this.date.year}`])
		}
		attempt(()=>{
			errorAtUndefined(this.review_status)
			table.push([`Review Status:`,`${this.review_status}`])
		})
		attempt(()=>{
			errorAtUndefined(this.publication.title)
			table.push([`Publication:`,`${this.publication.title}`])
		})
		attempt(()=>{
			errorAtUndefined(this.venue)
			table.push([`Venue:`,`${this.venue}`])
		})	
		attempt(()=>{
			errorAtUndefined(this.publication.publisher)
			table.push([`Publisher:`,`${this.publication.publisher}`])
		})
		table = table.map((row)=>{
			row = row.map((column)=>{
				return `<td>${column}</td>`
			}).join('')
			return `<tr>${row}</tr>`
		}).join('')
		return `<tbody>${table}</tbody>`
	}
	get referenceHTML(){
		let res = [];
		attempt(()=>{
			errorAtUndefined(this.authors,`'authors' not found or undefined.`)
			res.push(formatAuthorsHTML(this.authors))
		})
		attempt(()=>{
			if (this.date === undefined){
				res.push (`Upcoming`)
			} else {
				res.push(`${this.date.year}`)
			}
		})
		attempt(()=>{
			errorAtUndefined(this.title,`'title' not found or undefined.`)
			res.push(`${this.title}`)
		})
		let VIP = []
		try {
			errorAtUndefined(this.publication.title,`'publication.title' not found or undefined.`)
		}
		catch (err) {
			attempt(()=>{
				errorAtUndefined(this.venue,`'venue' not found or undefined.`)
				VIP.push(`Presented at <span class="pub-venue">${this.venue}</span>`)
			})
			attempt(()=>{
				errorAtUndefined(this.location,`'location' not found or undefined.`)
				VIP.push(`${this.location}`)
			})
		}
		attempt(()=>{
			errorAtUndefined(this.publication.title,`'publication.title' not found or undefined.`)
			VIP.push(`In <span class="pub-venue">${this.publication.title}</span>`)
		})
		attempt(()=>{
			errorAtUndefined(this.editors,`'editors' not found or undefined.`)
			VIP.push(`eds. ${formatEditorsLaTeX(this.editors)}`)
		})
		attempt(()=>{
			errorAtUndefined(this.volume,`'volume' not found or undefined.`)
			VIP.push(`volume ${this.volume}`)
		})
		attempt(()=>{
			errorAtUndefined(this.issue,`'issue' not found or undefined.`)
			VIP.push(`issue ${this.issue}`)
		})
		attempt(()=>{
			errorAtUndefined(this.pages.start,`'pages.start' not found or undefined.`)
			errorAtUndefined(this.pages.end,`'pages.end' not found or undefined.`)
			VIP.push(`pp ${this.pages.start}–${this.pages.end}`)
		})
		if (VIP.length > 0){
			res.push(VIP.join(`, `))
		}
		attempt(()=>{
			errorAtUndefined(this.publication.publisher,`'publication.publisher' not found or undefined.`)
			res.push(`${this.publication.publisher}`)
		})
		attempt(()=>{
			errorAtUndefined(this.url,`'url' not found or undefined.`)
			res.push(`URL: <a href="${this.url}">${this.url}</a>`)
		})
		return res.join('. ').concat('.')
	}
	get upcoming(){
		let res = [`On ${convertMonth(this.date.month)} ${this.date.day}, I will present the ${this.entry_type}: <a style="font-weight:bold;" onclick="openModal('${this.id}')">${this.title}</a>`]
		attempt(()=>{
			errorAtUndefined(this.venue)
			res.push(` at <span class="pub-venue">${this.venue}</span>`)
			attempt(()=>{
				errorAtUndefined(this.location)
				res.push(`, ${this.location}`)
			})
		})
		attempt(()=>{
			let withauthors = []
			withauthors = this.authors.filter((x)=>{return x.id !== "rabinovitch-jack"}).map((x)=>{
				if (x.id !== undefined){
					return `<a href="/pages/people.html?person=${x.id}">${x.given_name} ${x.surname}</a>` 
				}
				return `<span>${x.given_name} ${x.surname}</span>`
			})
			if (withauthors.length !== 0){
				res.push(`, in collaboration with ${oxfordcomma(withauthors)}`)
			}
		})
		res.push(".")
		return `<p>${res.join(``)}</p>`
	}
}



