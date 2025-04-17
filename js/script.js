const form = document.getElementById('create-form');
const table_event = document.getElementById('table-events');
const table_body_event = document.getElementById('body_table-events');

document.getElementById('btn_insert_event').addEventListener('click', async function(e){
    e.preventDefault();


});

function add_event(event){
const row = document.createElement('tr');
row.innerHTML= `
<td>${event.title}</td>
<td>${event.detail}</td>
<td>${event.date}</td>
<td>${event.status}</td>
`
}; 