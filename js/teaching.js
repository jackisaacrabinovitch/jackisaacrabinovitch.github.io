const sort_classes = function(a,b){
    if (a.year !== b.year){
        return b.year-a.year
    }
    let semester_numbers = {
        Spring:0,
        Summer:1,
        Fall:2,
        Winter:3
    }
    return semester_numbers[b.semester] - semester_numbers[a.semester]
}

const organize_classes = function(res){
    let classes = res.teaching_data.map((a_class)=>{
        a_class.times = a_class.times.sort(sort_classes)
        return a_class
    }).sort((a,b)=>{
        return sort_classes(a.times[0],b.times[0])
    })
    let institutions = cats(classes,"institution","classes")
    let tablecontents = institutions.map((institution)=>{
        return [
            `<tr><td colspan="3"><h2>Courses taught at ${institution.institution}</h2></td></tr>`,
            ...institution.classes.map((the_class)=>{
                return printClass(the_class)
            })
        ].join('')
    }).join('')
    return `<table><tbody>${tablecontents}</tbody></table>`
}

const printTimes = function(obj){
    let res = []
    obj.times.forEach(time => {
        let formatted_time = {
            left: `<span>${time.semester} ${time.year}</span>`,
            middle: "",
            right: ""
        }
        if (time.sections !== undefined){
            if (time.sections === 1){
                formatted_time.left += ` (${time.sections} section)`
            } else {
                formatted_time.left += ` (${time.sections} sections)`
            }
        }
        if (time.materials !== undefined && time.material_folder !== undefined && time.materials.length !== 0){
            formatted_time.middle = `<a href="/pages/teaching.html?institution=${obj.institution.replace(/ /g,"+")}&class_id=${obj.class_id.replace(/ /g,"+")}&year=${time.year}&semester=${time.semester}">[Materials]</a>`
        }
        if (time.primary_instructor !== undefined){
            formatted_time.right = `[Primary Instructor: ${time.primary_instructor}]`
        }
        res.push(`<tr><td>${formatted_time.left}</td><td style="text-align:center;" >${formatted_time.middle}</td><td style="text-align:right;" >${formatted_time.right}</td></tr>`)
    });
    return res
}
const printClass = function(obj){
    let res = [
        `<tr><td colspan="3"><h3><span class="course-position">${obj.position}</span> for <span class="course-name">${obj.class_id}: ${obj.class_name}</span></h3></td></tr>`
    ]
    return [...res, ...printTimes(obj)].join('')
}

const findcourse = function(classlist,query){
    let res = {}
    let the_course = classlist.find((x)=>{
        return x.institution === query.institution && x.class_id === query.class_id
    });
    ["class_id","class_name","position","institution"].forEach(element => {
        res[element] = the_course[element]
    });
    let the_time = the_course.times.find((x)=>{
        return x.year == query.year && x.semester === query.semester
    });
    Object.keys(the_time).forEach(element => {
        res[element] = the_time[element]
    });
    return res
}

const formatcourse = function(course){
    let under = ``
    if (course.primary_instructor !== undefined){
        under = `, primary instructor: ${course.primary_instructor}`
    }
    let res = [`<h1>Materials for ${course.class_id}: ${course.class_name}, ${course.semester} ${course.year}</h1><p>${course.position}${under}</p>`]
    course.materials.forEach(material => {
        if (material.url !== undefined){
            res.push(`<p><a href="${material.url}">[${material.name}]</a> ${material.description}</p>`)
        } else{
            res.push(`<p><a href="/files/teaching/${course.material_folder}/${material.file_name}">[${material.name}]</a> ${material.description}</p>`)
        }
    });
    return res.join("")
}