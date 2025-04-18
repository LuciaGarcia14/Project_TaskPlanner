const form = document.getElementById('create-form');
const table_event = document.getElementById('table-events');
const table_body_event = document.getElementById('body_table-events');

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
        localStorage.removeItem('events');
        console.warn('Se ha limpiado localStorage por datos corruptos');
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

        if (!title || !detail || !date || !status) {
            alert('Complete todos los campos');
            return;
        }

        const event_obj = { title, detail, date, status, weather};
        console.log("Agregando nuevo evento:", event_obj);

        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(event_obj);
        localStorage.setItem('events', JSON.stringify(events));

        add_event(event_obj);
        table_event.style.display = 'block';
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
        <td></td>
        <td><button class="btn-delete">Eliminar</button></td>
        <td><button class="btn-delete">Modificar</button></td>
    `;
    table_body_event.appendChild(row);
}

async function get_weather(city = 'Sevilla') {
    try{
        const response = await fetch(`https://wttr.in/${city}?format=j1`)
        const data = await response.json();

        const condition = data.current_condition[0];
        const temperature = condition.temp_C;
        const description_weather = condition.weatherDesc[0].value;

        return `${temperature}°C - ${description_weather}`;
    }catch(error){
        console.error('Error en la petición', error);
        return 'Error en obtener clima.'
    }
}