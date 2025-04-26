const express = require('express');
const cors = require('cors');
const fs = require('fs');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

// Pridanie CORS middleware
app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Načítanie dát z Excel súboru
function loadDataFromExcel(filePath) {
  try {
    console.log(`Načítavám dáta z ${filePath}...`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Načítaných ${data.length} záznamov z Excel súboru.`);
    
    // Adding proper id field to each client and default status if missing
    const processedData = data.map((item, index) => {
      return {
        id: item.id || index + 1,
        Firma: item.Firma || item.name || item.Name || item.Meno || '',
        Telefón: item.Telefón || item.Tel || item.phone || item.Phone || item.Mobil || item['Telefónne číslo'] || '',
        Mail: item.Mail || item.Email || item.email || item['E-mail'] || '',
        Poznámka: item.Poznámka || item.Notes || item.notes || item.Poznamka || '',
        status: item.status || item.Status || 'Aktívny'
      };
    });
    
    console.log(`Spracovaných ${processedData.length} klientov.`);
    return processedData;
  } catch (error) {
    console.error('Chyba pri načítaní Excel súboru:', error);
    return [];
  }
}

// Načítanie klientov z Excel súboru
const clients = loadDataFromExcel('./firmy PK.xlsx');
let calls = [];

// Načítanie hovorov z JSON súboru (ak existuje)
try {
  if (fs.existsSync('./calls.json')) {
    const callsData = fs.readFileSync('./calls.json', 'utf8');
    calls = JSON.parse(callsData);
  }
} catch (error) {
  console.error('Chyba pri načítaní hovorov:', error);
}

// API routes
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/calls', (req, res) => {
  res.json(calls);
});

app.post('/api/calls', (req, res) => {
  const newCall = {
    id: calls.length + 1,
    clientId: req.body.clientId,
    date: req.body.date || new Date().toISOString(),
    duration: req.body.duration,
    notes: req.body.notes,
    outcome: req.body.outcome,
    createdAt: new Date().toISOString()
  };
  
  calls.push(newCall);
  
  // Uloženie aktualizovaných hovorov do JSON súboru
  fs.writeFileSync('./calls.json', JSON.stringify(calls, null, 2));
  
  console.log(`Pridaný nový hovor pre klienta s ID ${newCall.clientId}`);
  
  res.status(201).json(newCall);
});

app.post('/api/clients/:id/status', (req, res) => {
  const clientId = parseInt(req.params.id);
  const { status } = req.body;
  
  const clientIndex = clients.findIndex(client => client.id === clientId);
  
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Klient nenájdený' });
  }
  
  clients[clientIndex].status = status;
  
  // Uloženie aktualizovaných klientov do JSON súboru
  fs.writeFileSync('./clients.json', JSON.stringify(clients, null, 2));
  
  res.json(clients[clientIndex]);
});

// Hlavná HTML stránka s frontend kódom
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Call Center Management System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .tabs {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 20px 0;
          border-bottom: 1px solid #ddd;
        }
        .tabs li {
          padding: 10px 20px;
          cursor: pointer;
          background-color: #f0f0f0;
          margin-right: 5px;
          border-radius: 5px 5px 0 0;
        }
        .tabs li.active {
          background-color: #4CAF50;
          color: white;
        }
        .tab-content {
          display: none;
          padding: 20px;
          background-color: white;
          border-radius: 0 0 5px 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .tab-content.active {
          display: block;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        .highlight-row {
          background-color: #e6f7ff !important;
        }
        form {
          display: grid;
          grid-gap: 10px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
          margin-top: 20px;
        }
        label {
          font-weight: bold;
        }
        input, select, textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .button {
          padding: 10px 15px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .button:hover {
          background-color: #45a049;
        }
        .button-warning {
          background-color: #f44336;
        }
        .button-warning:hover {
          background-color: #d32f2f;
        }
        .action-buttons {
          display: flex;
          gap: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Call Center Management System</h1>
        
        <ul class="tabs">
          <li class="active" data-tab="clients">Klienti</li>
          <li data-tab="calls">Hovory</li>
          <li data-tab="new-call">Nový hovor</li>
        </ul>
        
        <div id="clients" class="tab-content active">
          <h2>Zoznam klientov</h2>
          <input type="text" id="clientSearch" placeholder="Vyhľadať klienta..." style="margin-bottom: 15px; width: 100%; padding: 8px;">
          <table id="clientsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Meno</th>
                <th>Telefón</th>
                <th>Email</th>
                <th>Poznámky</th>
                <th>Status</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody id="clientsTableBody">
              <!-- Klienti budú načítaní pomocou JavaScript -->
            </tbody>
          </table>
        </div>
        
        <div id="calls" class="tab-content">
          <h2>Záznamy hovorov</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Klient</th>
                <th>Dátum</th>
                <th>Trvanie (min)</th>
                <th>Poznámky</th>
                <th>Výsledok</th>
              </tr>
            </thead>
            <tbody id="callsTableBody">
              <!-- Hovory budú načítané pomocou JavaScript -->
            </tbody>
          </table>
        </div>
        
        <div id="new-call" class="tab-content">
          <h2>Zaznamenať nový hovor</h2>
          <form id="newCallForm">
            <div>
              <label for="clientId">Klient:</label>
              <select id="clientId" name="clientId" required>
                <option value="">-- Vyberte klienta --</option>
                <!-- Klienti budú načítaní pomocou JavaScript -->
              </select>
            </div>
            <div>
              <label for="date">Dátum a čas:</label>
              <input type="datetime-local" id="date" name="date">
            </div>
            <div>
              <label for="duration">Trvanie (minúty):</label>
              <input type="number" id="duration" name="duration" min="1" required>
            </div>
            <div>
              <label for="notes">Poznámky:</label>
              <textarea id="notes" name="notes" rows="4"></textarea>
            </div>
            <div>
              <label for="outcome">Výsledok:</label>
              <select id="outcome" name="outcome" required>
                <option value="">-- Vyberte výsledok --</option>
                <option value="Úspešný">Úspešný</option>
                <option value="Neúspešný">Neúspešný</option>
                <option value="Nedostupný">Nedostupný</option>
                <option value="Callback">Callback</option>
                <option value="Iný">Iný</option>
              </select>
            </div>
            <div>
              <label for="status">Aktualizovať stav klienta:</label>
              <select id="status" name="status">
                <option value="">-- Ponechať aktuálny --</option>
                <option value="Aktívny">Aktívny</option>
                <option value="Čakajúci">Čakajúci</option>
                <option value="Uzavretý">Uzavretý</option>
                <option value="Nedostupný">Nedostupný</option>
              </select>
            </div>
            <button type="submit" class="button">Uložiť hovor</button>
          </form>
        </div>
      </div>

      <script>
        // Klientsky kód pre UI a interakciu
        document.addEventListener('DOMContentLoaded', function() {
          // Premenné pre uloženie dát
          let clients = [];
          let calls = [];
          
          // Zmena záložiek
          const tabs = document.querySelectorAll('.tabs li');
          const tabContents = document.querySelectorAll('.tab-content');
          
          tabs.forEach(tab => {
            tab.addEventListener('click', function() {
              tabs.forEach(t => t.classList.remove('active'));
              tabContents.forEach(content => content.classList.remove('active'));
              
              this.classList.add('active');
              const activeTab = this.getAttribute('data-tab');
              document.getElementById(activeTab).classList.add('active');
            });
          });
          
          // Načítanie dát
          async function loadData() {
            try {
              // Načítanie klientov
              const clientsResponse = await fetch('/api/clients');
              clients = await clientsResponse.json();
              
              // Načítanie hovorov
              const callsResponse = await fetch('/api/calls');
              calls = await callsResponse.json();
              
              // Zobrazenie dát
              displayClients(clients);
              displayCalls(calls);
              populateClientDropdown();
            } catch (error) {
              console.error('Chyba pri načítaní dát:', error);
            }
          }
          
          // Zobrazenie klientov
          function displayClients(clientsData) {
            const tableBody = document.getElementById('clientsTableBody');
            tableBody.innerHTML = '';
            
            if (clientsData.length === 0) {
              const row = document.createElement('tr');
              row.innerHTML = '<td colspan="7" style="text-align: center;">Neboli nájdení žiadni klienti</td>';
              tableBody.appendChild(row);
              return;
            }
            
            clientsData.forEach(client => {
              const row = document.createElement('tr');
              
              row.innerHTML = 
                "<td data-value='" + client.id + "'>" + client.id + "</td>" +
                "<td>" + (client.Firma || '') + "</td>" +
                "<td>" + (client.Telefón || '') + "</td>" +
                "<td>" + (client.Mail || '') + "</td>" +
                "<td>" + (client.Poznámka || '') + "</td>" +
                "<td>" +
                  "<select class='status-select' data-client-id='" + client.id + "'>" +
                    "<option value='Aktívny' " + (client.status === 'Aktívny' ? 'selected' : '') + ">Aktívny</option>" +
                    "<option value='Čakajúci' " + (client.status === 'Čakajúci' ? 'selected' : '') + ">Čakajúci</option>" +
                    "<option value='Uzavretý' " + (client.status === 'Uzavretý' ? 'selected' : '') + ">Uzavretý</option>" +
                    "<option value='Nedostupný' " + (client.status === 'Nedostupný' ? 'selected' : '') + ">Nedostupný</option>" +
                  "</select>" +
                "</td>" +
                "<td class='action-buttons'>" +
                  "<button onclick='viewCallHistory(" + client.id + ")' class='button'>História hovorov</button>" +
                  "<button onclick='selectClientForCall(" + client.id + ")' class='button'>Zavolať</button>" +
                "</td>";
              
              tableBody.appendChild(row);
            });
            
            console.log(`Zobrazených ${clientsData.length} klientov v tabuľke.`);
            
            // Pridanie event listenerov pre zmenu statusu
            document.querySelectorAll('.status-select').forEach(select => {
              select.addEventListener('change', function() {
                updateClientStatus(this.getAttribute('data-client-id'), this.value);
              });
            });
          }
          
          // Zobrazenie hovorov
          function displayCalls(callsData) {
            const tableBody = document.getElementById('callsTableBody');
            tableBody.innerHTML = '';
            
            if (callsData.length === 0) {
              const row = document.createElement('tr');
              row.innerHTML = '<td colspan="6" style="text-align: center;">Neboli nájdené žiadne záznamy hovorov</td>';
              tableBody.appendChild(row);
              return;
            }
            
            callsData.forEach(call => {
              const client = clients.find(c => c.id === parseInt(call.clientId)) || {};
              const row = document.createElement('tr');
              
              const callDate = new Date(call.date);
              const formattedDate = callDate.toLocaleString('sk-SK');
              
              row.innerHTML = 
                "<td data-client-id='" + call.clientId + "'>" + call.id + "</td>" +
                "<td data-original-client-id='" + call.clientId + "'>" + (client.Firma || '') + "</td>" +
                "<td>" + formattedDate + "</td>" +
                "<td>" + (call.duration || '') + "</td>" +
                "<td>" + (call.notes || '') + "</td>" +
                "<td>" + (call.outcome || '') + "</td>";
              
              tableBody.appendChild(row);
            });
            
            console.log(`Zobrazených ${callsData.length} záznamov hovorov.`);
          }
          
          // Naplnenie dropdown zoznamu klientov
          function populateClientDropdown() {
            const dropdown = document.getElementById('clientId');
            dropdown.innerHTML = '<option value="">-- Vyberte klienta --</option>';
            
            clients.forEach(client => {
              const option = document.createElement('option');
              option.value = client.id;
              option.textContent = client.Firma || '';
              dropdown.appendChild(option);
            });
            
            console.log(`Naplnený dropdown so ${clients.length} klientmi.`);
          }
          
          // Aktualizácia statusu klienta
          async function updateClientStatus(clientId, status) {
            try {
              const response = await fetch('/api/clients/' + clientId + '/status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
              });
              
              if (!response.ok) {
                throw new Error('Server returned an error');
              }
              
              const updatedClient = await response.json();
              console.log('Status klienta aktualizovaný:', updatedClient);
            } catch (error) {
              console.error('Chyba pri aktualizácii statusu:', error);
            }
          }
          
          // Výber klienta pre nový hovor
          function selectClientForCall(clientId) {
            document.querySelector('.tabs li[data-tab="new-call"]').click();
            document.getElementById('clientId').value = clientId;
          }
          
          // Funkcia pre zobrazenie histórie hovorov pre konkrétneho klienta
          function viewCallHistory(clientId) {
            document.querySelector('.tabs li[data-tab="calls"]').click();
            
            // Filtrovanie hovorov pre daného klienta
            const table = document.getElementById('callsTableBody');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 0; i < rows.length; i++) {
              const cells = rows[i].getElementsByTagName('td');
              if (cells.length > 0) {
                // Získanie ID klienta z prvého stĺpca (clientId)
                const rowClientId = parseInt(cells[0].getAttribute('data-client-id') || '-1');
                
                // Ak nenájdeme atribút, použijeme alternatívny spôsob kontroly
                if (rowClientId === clientId || (rowClientId === -1 && clientId === parseInt(cells[1].getAttribute('data-original-client-id')))) {
                  rows[i].style.display = '';
                  rows[i].classList.add('highlight-row');
                } else {
                  rows[i].style.display = 'none';
                }
              }
            }
            
            // Aktualizácia nadpisu, aby používateľ vedel, že sa zobrazujú filtrované výsledky
            let clientName = 'Klienta';
            
            // Nájdenie mena klienta podľa ID
            const client = clients.find(c => c.id === clientId);
            if (client) {
              clientName = client.Firma || 'Klienta';
            }
            
            document.querySelector('#calls h2').textContent = 'História hovorov pre: ' + clientName;
            
            // Pridanie tlačidla na zrušenie filtrovania
            if (!document.getElementById('clearFilterButton')) {
              const clearButton = document.createElement('button');
              clearButton.id = 'clearFilterButton';
              clearButton.className = 'button button-warning';
              clearButton.textContent = 'Zrušiť filter';
              clearButton.style.marginLeft = '15px';
              clearButton.onclick = function() {
                // Obnovenie pôvodného zobrazenia všetkých hovorov
                for (let i = 0; i < rows.length; i++) {
                  rows[i].style.display = '';
                  rows[i].classList.remove('highlight-row');
                }
                // Obnovenie pôvodného nadpisu
                document.querySelector('#calls h2').textContent = 'Záznamy hovorov';
                // Odstránenie tlačidla
                this.remove();
              };
              document.querySelector('#calls h2').appendChild(clearButton);
            }
          }
          
          // Vyhľadávanie klientov
          document.getElementById('clientSearch').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredClients = clients.filter(client => {
              const firma = (client.Firma || '').toLowerCase();
              const telefon = (client.Telefón || '').toLowerCase();
              const email = (client.Mail || '').toLowerCase();
              const poznamka = (client.Poznámka || '').toLowerCase();
              
              return firma.includes(searchTerm) || 
                    telefon.includes(searchTerm) || 
                    email.includes(searchTerm) || 
                    poznamka.includes(searchTerm);
            });
            
            displayClients(filteredClients);
          });
          
          // Spracovanie formulára pre nový hovor
          document.getElementById('newCallForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
              clientId: document.getElementById('clientId').value,
              date: document.getElementById('date').value || new Date().toISOString(),
              duration: document.getElementById('duration').value,
              notes: document.getElementById('notes').value,
              outcome: document.getElementById('outcome').value
            };
            
            try {
              // Uloženie nového hovoru
              const response = await fetch('/api/calls', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              });
              
              if (!response.ok) {
                throw new Error('Server returned an error');
              }
              
              const newCall = await response.json();
              console.log('Nový hovor uložený:', newCall);
              
              // Aktualizácia statusu klienta, ak je zvolený
              const status = document.getElementById('status').value;
              if (status) {
                await updateClientStatus(formData.clientId, status);
              }
              
              // Vyčistenie formulára
              this.reset();
              
              // Obnovenie dát
              loadData();
              
              // Prepnutie na záložku s hovormi
              document.querySelector('.tabs li[data-tab="calls"]').click();
              
            } catch (error) {
              console.error('Chyba pri ukladaní hovoru:', error);
              alert('Nastala chyba pri ukladaní hovoru. Skúste to prosím znova.');
            }
          });
          
          // Nastavenie aktuálneho dátumu a času
          const now = new Date();
          const formattedDateTime = now.toISOString().slice(0, 16);
          document.getElementById('date').value = formattedDateTime;
          
          // Načítanie dát pri načítaní stránky
          loadData();
          
          // Globálne funkcie, ktoré musia byť prístupné z HTML
          window.viewCallHistory = viewCallHistory;
          window.selectClientForCall = selectClientForCall;
        });
      </script>
    </body>
    </html>
  `);
});

// Spustenie servera
app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
});