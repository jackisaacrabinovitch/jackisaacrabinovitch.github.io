const organizeService = function(res){
    let works = res.work_data.filter((x)=>{return x.service_type !== undefined})
        .map((x)=>{
            x.latest = latestDate(x)
            return x
        })
    let categories = cats(works,"service_type","content").sort((a,b)=>{
        let comp_class = {
            Service: 0,
            Research: 1,
            Teaching: 2,
            "Labs and Organizations": 3,
        }
        return comp_class[a.service_type]-comp_class[b.service_type]
    }).map((x)=>{
        res = {service_type:x.service_type}
        res.content = cats(x.content,"organization","content")
            .map((org)=>{
                org.latest = Math.max(... org.content.map((x)=>{return x.latest}))
                org.content = org.content.sort((a,b)=>{return b.latest - a.latest})
                return org
            })
            .sort((a,b)=>{return b.latest - a.latest})
        return res
    })
    return categories
}
const printService = function(categories){
    res = []
    categories.forEach(category => {
        res.push(`<tr><td colspan="3"><h2>${category.service_type}</h2></td></tr>`)
        category.content.forEach(org => {
            res.push(`<tr><td colspan="3"><span class="org-name">${org.organization}</span></td></tr>`)
            org.content.forEach(position => {
                let note = ``
                if (position.note !== undefined){
                    note = ` ${position.note}`
                }
                res.push(`<tr><td>&nbsp&nbsp</td><td><span class="position-name">${position.position}</span>${note}</td><td class="service-year">${formatServiceYear(position.dates)}</td>`)
            });
        });
    });
    return `<table><tbody>${res.join('')}</tbody></table>`
}
const dateMonthAsNum = function(x,undef){
    if (x === undefined){
        return undef
    }
    return x.year*12+x.month 
}


const latestDate = function(x){
    let res = 0
    x.dates.forEach(date => {
        if (dateMonthAsNum(date.end,100000) > res){
            res = dateMonthAsNum(date.end)
        }
    });
    return res
}
const formatServiceYear = function(dates){
    let ends = ["",""]
    let earliest = 100000
    let latest = 0

    dates.forEach(date => {
        if (dateMonthAsNum(date.end,100000) > latest){
            latest = dateMonthAsNum(date.end,100000)
            if (latest === 100000 || new Date(`${date.end.year}-${date.end.month}-1`) > Date.now()){
                ends[1] = ``
            } else {
                ends[1] = `${date.end.year}`
            }
        }
        if (dateMonthAsNum(date.start,0) < earliest){
            earliest = dateMonthAsNum(date.start,0)
            if (earliest === 0){
                ends[0] = ""
            } else {
                ends[0] = `${date.start.year}`
            }
        }
    });
    if (ends[0]===ends[1]){return ends[0]}
    return ends.join("–")
}