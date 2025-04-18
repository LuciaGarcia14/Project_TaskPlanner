const form = document.getElementById('create-form');
const table_event = document.getElementById('table-events');
const table_body_event = document.getElementById('body_table-events');

const saved_events = localStorage.getItem('events');
if(saved_events){
    try{
        const events = JSON.parse(saved_events);
        events.forEach(event => add_event(event));
        table_event.style.display = 'block';
    }catch(error){
        console.error('Error al mostrar la lista de eventos', error);
    }
}

document.getElementById('btn_insert_event').addEventListener('click', function(e){
    e.preventDefault();

    const title = document.getElementById('title-event').value;
    const detail = document.getElementById('description-event').value;
    const date = document.getElementById('date-event').value;
    const status = document.getElementById('status-event').value;



    const event_obj = {title, detail, date, status};

    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event_obj);
    localStorage.setItem('events', JSON.stringify('events'));

    add_event(event_obj);

    form.reset();

});

function add_event(event){
const row = document.createElement('tr');
row.innerHTML= `
<td>${event.title}</td>
<td>${event.detail}</td>
<td>${event.date}</td>
<td>${event.status}</td>
`

table_body_event.appendChild(row);
}; 