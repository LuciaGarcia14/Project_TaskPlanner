const form = document.getElementById('create-form');
const table_event = document.getElementById('table-events');
const table_body_event = document.getElementById('body_table-events');
const body = document.body;

if (body.id === 'event-list-page' && table_body_event) {
    const saved_events = localStorage.getItem('events');
    if (saved_events) {
        try {
            const events = JSON.parse(saved_events);
            console.log("Eventos cargados del localStorage:", events);
            events.forEach(event => add_event(event)); 
            if (events.length > 0) {
                table_event.style.display = 'block'; 
            }
        } catch (error) {
            console.error('Error al cargar eventos:', error);
        }
    }
}

const btn_insert = document.getElementById('btn_insert_event');
if (btn_insert) {
    btn_insert.addEventListener('click', async function (e) {
        e.preventDefault();

        const title = document.getElementById('title-event').value.trim();
        const detail = document.getElementById('description-event').value.trim();
        const date = document.getElementById('date-event').value;
        const status = document.getElementById('status-event').value;
        const weather = await get_weather('Sevilla');
        const url_img_cat = await get_cat();

        if (!title || !detail || !date || !status) {
            alert('Complete todos los campos');
            return;
        }

        const event_obj = { title, detail, date, status, weather, url_img_cat};
        console.log("Agregando nuevo evento:", event_obj);

        const events = JSON.parse(localStorage.getItem('events')) || [];

        const event_exist = events.find(event => event.title === title);
        if(event_exist){
            alert('¡ERROR! No puede existir eventos con mismo titulo.');
            return;
        }

        events.push(event_obj);
        localStorage.setItem('events', JSON.stringify(events));

        if (body.id === 'event-list-page' && table_body_event) {
            add_event(event_obj);
            table_event.style.display = 'block'; 
        }

        form.reset();
    });
}

function add_event(event) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${event.title}</td>
        <td>${event.detail}</td>
        <td>${event.date}</td>
        <td>${event.status}</td>
        <td>${event.weather}</td>
        <td><img src="${event.url_img_cat}" width="100" /></td>
        <td><button class="btn-delete">Eliminar</button></td>
        <td><button class="btn-update">Modificar</button></td>
    `;
    table_body_event.appendChild(row);

    row.querySelector('.btn-delete').addEventListener('click', () => {
        event_delete(event.title, row);
    });

    row.querySelector('.btn-update').addEventListener('click', ()=>{
        edit_mode(row, event);
    });
}

async function get_weather(city = 'Sevilla') {
    try {
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        const data = await response.json();

        const condition = data.current_condition[0];
        const temperature = condition.temp_C;
        const description_weather = condition.weatherDesc[0].value;

        return `${temperature}°C - ${description_weather}`;
    } catch (error) {
        console.error('Error en la petición', error);
        return 'Error en obtener clima.';
    }
}

async function get_cat() {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();
        const url = data[0].url;
        return url;
    } catch (error) {
        console.error('Error en la petición', error);
        return 'Error al obtener imagen de gatito.';
    }
}

function event_delete(title, row) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.title !== title);
    localStorage.setItem('events', JSON.stringify(events));

    row.remove();

    if (events.length === 0) {
        table_event.style.display = 'none';
        alert('¡No hay eventos!');
    }
}

function edit_mode(row, event){
    const cells = row.querySelectorAll('td');

    cells[1].innerHTML = `<input type="text" value="${event.detail}"/>`;
    cells[2].innerHTML = `<input type="date" value="${event.date}"/>`;
    cells[3].innerHTML = `
    <select>
        <option value="pendiente" ${event.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="completado" ${event.status === 'completado' ? 'selected' : ''}>Completado</option>
        <option value="en proceso" ${event.status === 'en proceso' ? 'selected' : ''}>En proceso</option>
    </select>
    `;
    cells[6].innerHTML = `<button class="btn-save">Guardar</button>`
    cells[7].innerHTML = `<button class="btn-cancel">Cancelar</button>`

    cells[6].querySelector('.btn-save').addEventListener('click', ()=>{
        save_edit(row, event.title);
    });

    cells[7].querySelector('.btn-cancel').addEventListener('click', ()=>{
        cancel_edit(row, event);
    });
}

function save_edit(row, title){
    const cells = row.querySelectorAll('td');
    const new_detail = cells[1].querySelector('input').value;
    const new_date = cells[2].querySelector('input').value;
    const new_status = cells[3].querySelector('select').value;

    let events = JSON.parse(localStorage.getItem('events')) || [];
    const ind = events.findIndex(ev => ev.title === title); 

    if(ind !== -1){
        events[ind].detail = new_detail;
        events[ind].date = new_date;
        events[ind].status = new_status;

        localStorage.setItem('events', JSON.stringify(events));
        row.innerHTML= '';
        add_event(events[ind]);
    }
}

function cancel_edit(row, event){
    row.innerHTML= '';
    add_event(event);
}