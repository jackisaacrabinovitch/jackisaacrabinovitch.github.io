// const displayPeople = function(people,publications){
//     let res = []
//     people.filter((x)=>{return x.id !== "rabinovitch-jack"})
//         .forEach(person => {
//             person_div = []
//             if (person.photo === "yes"){
//                 person_div.push(`<div class="collab-photo" style="background-image: url('/images/people/${person.id}-small.jpg');"></div>`)
//             } else {
//                 person_div.push(`<div class="collab-photo" style="background-color: gray;"></div>`)
//             }
//             person_div.push(`<h2>${person.names[0].given_name} ${person.names[0].surname}</h2>`)
//             let contacts = []
//             if (person.email !== undefined){
//                 contacts.push(`<a href="mailto:${person.email}">Email</a>`)
//             }
//             if (person.website !== undefined){
//                 contacts.push(`<a href="${person.website}">Website</a>`)
//             }
//             if (contacts.length > 0){
//                 person_div.push(`<div>${contacts.join(" || ")}</div>`)
//             }
//             person_div.push(`<div><a href="/pages/people.html?person=${person.id}">More Info</a></div>`)
//             res.push(`<div class="collab-container" onclick="location.replace('/pages/people.html?person=${person.id}')">${person_div.join('')}</div>`)
//         });
//     return `<div class="people-content-container">${res.join('')}</div>`
// }
const displayPeople= function(people){
    res = []
    people.forEach(person => {
        let person_header = []
    if (person.photo === "yes"){
        person_header.push(`<div class="collab-photo" style="background-image: url('/images/people/${person.id}-small.jpg');"></div>`)
    } else {
        person_header.push(`<div class="collab-photo" style="background-color: gray;"></div>`)
    }
    let contacts = [`<h2>${person.names[0].given_name} ${person.names[0].surname}</h2>`]
    if (person.email !== undefined){
        contacts.push(`<div>Email: <a href="mailto:${person.email}">${person.email}</a></div>`)
    }
    if (person.website !== undefined){
        contacts.push(`<div>Website: <a href="${person.website}">${person.website}</a></div>`)
    }
    if (person.affiliations !== undefined){
        let affiliations = [`Affiliations:`]
        person.affiliations.forEach(affiliation => {
            if (affiliation.url !== undefined){
                affiliations.push(`- <a href="${affiliation.url}">${affiliation.name}</a>`)
            } else{
                affiliations.push(`- <span>${affiliation.name}</span>`)
            }
        });
        contacts.push(`<div>${affiliations.join("<br>")}</div>`)
    }
    person_header.push(`<div class="person-info">${contacts.join('')}</div>`)
    res.push(`<div class="person-header">${person_header.join('')}</div>`)
    });
    return res.join('')    
}
const namePerson = function(people,id){
    let person = people.find((x)=>{return x.id === id})
    return `${person.names[0].given_name} ${person.names[0].surname}`
}
