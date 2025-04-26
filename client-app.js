const express = require('express');
const app = express();
const PORT = 5000;
const XLSX = require('xlsx');
const path = require('path');

// Nastavenie pre statické súbory a parsovanie formulárov
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Načítanie údajov z Excel súboru
const workbook = XLSX.readFile(path.join(__dirname, 'firmy PK.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const excelData = XLSX.utils.sheet_to_json(worksheet);

// Transformácia dát
const clients = excelData.map((row, index) => {
  return {
    id: index + 1,
    name: row['Názov firmy'] || row['Meno'] || 'Neznámy názov',
    phone: row['Telefón'] || row['Tel'] || 'Nevyplnené',
    email: row['Email'] || row['E-mail'] || 'Nevyplnené',
    notes: row['Poznámka'] || '',
    status: row['Status'] || 'Nekontaktovaný'
  };
});

// Záznamy hovorov
let calls = [
  { id: 1, clientId: 1, date: "2025-04-25", duration: "5:30", notes: "Klient požaduje dodatočné informácie", outcome: "Úspešný" },
  { id: 2, clientId: 3, date: "2025-04-24", duration: "2:15", notes: "Problém s fakturáciou", outcome: "Callback" }
];

// API ENDPOINTS
// Získanie zoznamu klientov
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Získanie zoznamu hovorov
app.get('/api/calls', (req, res) => {
  res.json(calls);
});

// Pridanie nového hovoru
app.post('/api/calls', (req, res) => {
  const newCall = {
    id: calls.length + 1,
    clientId: parseInt(req.body.clientId),
    date: req.body.date,
    duration: req.body.duration,
    notes: req.body.notes,
    outcome: req.body.outcome
  };
  
  calls.push(newCall);
  
  // Aktualizácia stavu klienta
  const clientId = parseInt(req.body.clientId);
  const newStatus = req.body.newStatus;
  
  const clientIndex = clients.findIndex(c => c.id === clientId);
  if (clientIndex > -1) {
    clients[clientIndex].status = newStatus;
  }
  
  res.status(201).json(newCall);
});

// Hlavná stránka
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Call Center Systém</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .container { max-width: 1200px; margin: 0 auto; }
        .btn { background-color: #4CAF50; color: white; padding: 8px 12px; border: none; cursor: pointer; }
        .btn-secondary { background-color: #008CBA; }
        form { margin-bottom: 20px; background-color: #f2f2f2; padding: 15px; border-radius: 5px; }
        label { display: block; margin-bottom: 5px; }
        input, textarea, select { width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; }
        .tabs { display: flex; margin-bottom: 20px; }
        .tab { padding: 10px 20px; cursor: pointer; background-color: #ddd; margin-right: 5px; }
        .tab.active { background-color: #4CAF50; color: white; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status-contacted { background-color: #d4edda; color: #155724; }
        .status-not-contacted { background-color: #f8d7da; color: #721c24; }
        .status-unavailable { background-color: #fff3cd; color: #856404; }
        .search-container { margin-bottom: 20px; }
        .pagination { display: flex; justify-content: center; margin-top: 20px; }
        .pagination button { margin: 0 5px; padding: 5px 10px; background-color: #ddd; border: none; cursor: pointer; }
        .pagination button.active { background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Call Center Systém</h1>
        
        <div class="tabs">
          <div class="tab active" onclick="openTab(event, 'clients')">Klienti</div>
          <div class="tab" onclick="openTab(event, 'calls')">Záznamy hovorov</div>
          <div class="tab" onclick="openTab(event, 'new-call')">Nový hovor</div>
        </div>
        
        <div id="clients" class="tab-content active">
          <h2>Zoznam klientov</h2>
          
          <div class="search-container">
            <input type="text" id="searchClient" placeholder="Vyhľadať klienta..." onkeyup="searchClients()">
          </div>
          
          <table id="clientsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Názov</th>
                <th>Telefón</th>
                <th>Email</th>
                <th>Poznámky</th>
                <th>Stav</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody id="clientsTableBody">
              <!-- Dáta sa načítajú cez JavaScript -->
            </tbody>
          </table>
          
          <div class="pagination" id="clientPagination">
            <!-- Pagination buttons will be inserted here by JavaScript -->
          </div>
        </div>
        
        <div id="calls" class="tab-content">
          <h2>Záznamy hovorov</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Klient</th>
                <th>Dátum</th>
                <th>Trvanie</th>
                <th>Poznámky</th>
                <th>Výsledok</th>
              </tr>
            </thead>
            <tbody id="callsTableBody">
              <!-- Dáta sa načítajú cez JavaScript -->
            </tbody>
          </table>
        </div>
        
        <div id="new-call" class="tab-content">
          <h2>Záznam nového hovoru</h2>
          <form id="callForm">
            <div>
              <label for="clientId">Klient:</label>
              <select id="clientId" name="clientId" required>
                <option value="">-- Vyberte klienta --</option>
                <!-- Dáta sa načítajú cez JavaScript -->
              </select>
            </div>
            <div>
              <label for="date">Dátum:</label>
              <input type="date" id="date" name="date" required>
            </div>
            <div>
              <label for="duration">Trvanie (mm:ss):</label>
              <input type="text" id="duration" name="duration" required placeholder="03:45">
            </div>
            <div>
              <label for="notes">Poznámky z hovoru:</label>
              <textarea id="notes" name="notes" rows="4" required></textarea>
            </div>
            <div>
              <label for="outcome">Výsledok:</label>
              <select id="outcome" name="outcome" required>
                <option value="Úspešný">Úspešný</option>
                <option value="Neúspešný">Neúspešný</option>
                <option value="Callback">Callback potrebný</option>
                <option value="Zanechaná správa">Zanechaná správa</option>
                <option value="Nedostupný">Nedostupný</option>
              </select>
            </div>
            <div>
              <label for="newStatus">Nový stav klienta:</label>
              <select id="newStatus" name="newStatus" required>
                <option value="Kontaktovaný">Kontaktovaný</option>
                <option value="Nekontaktovaný">Nekontaktovaný</option>
                <option value="Nedostupný">Nedostupný</option>
              </select>
            </div>
            <button type="submit" class="btn">Uložiť záznam</button>
          </form>
        </div>
      </div>

      <script>
        // Globálne premenné
        let allClients = [];
        let allCalls = [];
        const clientsPerPage = 20;
        let currentPage = 1;
        
        // Načítanie dát pri štarte aplikácie
        window.addEventListener('DOMContentLoaded', async () => {
          await Promise.all([
            fetchClients(),
            fetchCalls()
          ]);
          
          displayClients();
          displayCalls();
          populateClientOptions();
          document.getElementById('date').value = new Date().toISOString().split('T')[0];
        });
        
        // Načítanie klientov z API
        async function fetchClients() {
          try {
            const response = await fetch('/api/clients');
            allClients = await response.json();
          } catch (error) {
            console.error('Chyba pri načítaní klientov:', error);
          }
        }
        
        // Načítanie hovorov z API
        async function fetchCalls() {
          try {
            const response = await fetch('/api/calls');
            allCalls = await response.json();
          } catch (error) {
            console.error('Chyba pri načítaní hovorov:', error);
          }
        }
        
        // Zobrazenie klientov
        function displayClients(filteredClients = allClients) {
          const start = (currentPage - 1) * clientsPerPage;
          const end = start + clientsPerPage;
          const paginatedClients = filteredClients.slice(start, end);
          
          const tbody = document.getElementById('clientsTableBody');
          tbody.innerHTML = '';
          
          paginatedClients.forEach(client => {
            let statusClass = '';
            if (client.status === 'Kontaktovaný') {
              statusClass = 'status-contacted';
            } else if (client.status === 'Nekontaktovaný') {
              statusClass = 'status-not-contacted';
            } else {
              statusClass = 'status-unavailable';
            }
            
            const row = document.createElement('tr');
            row.innerHTML = 
              '<td>' + client.id + '</td>' +
              '<td>' + client.name + '</td>' +
              '<td>' + client.phone + '</td>' +
              '<td>' + client.email + '</td>' +
              '<td>' + client.notes + '</td>' +
              '<td><span class="status ' + statusClass + '">' + client.status + '</span></td>' +
              '<td>' +
                '<button class="btn" onclick="startCall(' + client.id + ', \'' + client.name.replace(/'/g, "\\'") + '\')">Zavolať</button>' +
              '</td>';
            
            tbody.appendChild(row);
          });
          
          updatePagination(filteredClients.length);
        }
        
        // Zobrazenie hovorov
        function displayCalls() {
          const tbody = document.getElementById('callsTableBody');
          tbody.innerHTML = '';
          
          allCalls.forEach(call => {
            const client = allClients.find(c => c.id === call.clientId) || { name: 'Neznámy' };
            
            const row = document.createElement('tr');
            row.innerHTML = 
              '<td>' + call.id + '</td>' +
              '<td>' + client.name + '</td>' +
              '<td>' + call.date + '</td>' +
              '<td>' + call.duration + '</td>' +
              '<td>' + call.notes + '</td>' +
              '<td>' + call.outcome + '</td>';
            
            tbody.appendChild(row);
          });
        }
        
        // Naplnenie select boxu s klientmi
        function populateClientOptions() {
          const select = document.getElementById('clientId');
          select.innerHTML = '<option value="">-- Vyberte klienta --</option>';
          
          allClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            select.appendChild(option);
          });
        }
        
        // Aktualizácia stránkovania
        function updatePagination(totalItems) {
          const pageCount = Math.ceil(totalItems / clientsPerPage);
          const paginationElement = document.getElementById('clientPagination');
          paginationElement.innerHTML = '';
          
          for (let i = 1; i <= pageCount; i++) {
            if (i <= 5 || i > pageCount - 5 || Math.abs(i - currentPage) < 3) {
              const button = document.createElement('button');
              button.innerText = i;
              button.classList.toggle('active', i === currentPage);
              button.addEventListener('click', () => goToPage(i));
              paginationElement.appendChild(button);
            } else if (Math.abs(i - currentPage) === 3) {
              const ellipsis = document.createElement('span');
              ellipsis.innerText = '...';
              ellipsis.style.margin = '0 5px';
              paginationElement.appendChild(ellipsis);
            }
          }
        }
        
        // Prejsť na určitú stránku
        function goToPage(page) {
          currentPage = page;
          displayClients();
        }
        
        // Vyhľadávanie klientov
        function searchClients() {
          const searchText = document.getElementById('searchClient').value.toLowerCase();
          
          if (searchText.trim() === '') {
            displayClients();
            return;
          }
          
          const filteredClients = allClients.filter(client => 
            client.name.toLowerCase().includes(searchText) ||
            client.email.toLowerCase().includes(searchText) ||
            client.phone.toLowerCase().includes(searchText) ||
            client.notes.toLowerCase().includes(searchText)
          );
          
          currentPage = 1;
          displayClients(filteredClients);
        }
        
        // Prepínanie záložiek
        function openTab(evt, tabName) {
          const tabContents = document.getElementsByClassName("tab-content");
          for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove("active");
          }
          
          const tabs = document.getElementsByClassName("tab");
          for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("active");
          }
          
          document.getElementById(tabName).classList.add("active");
          evt.currentTarget.classList.add("active");
        }
        
        // Začatie hovoru s klientom
        function startCall(clientId, clientName) {
          document.getElementById('clientId').value = clientId;
          openTab({currentTarget: document.querySelector('.tab:nth-child(3)')}, 'new-call');
          alert('Začínam hovor s klientom: ' + clientName);
        }
        
        // Odoslanie formulára pre nový hovor
        document.getElementById('callForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const callData = {
            clientId: parseInt(formData.get('clientId')),
            date: formData.get('date'),
            duration: formData.get('duration'),
            notes: formData.get('notes'),
            outcome: formData.get('outcome'),
            newStatus: formData.get('newStatus')
          };
          
          try {
            const response = await fetch('/api/calls', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(callData)
            });
            
            if (response.ok) {
              // Načítať aktualizované dáta
              await Promise.all([
                fetchClients(),
                fetchCalls()
              ]);
              
              // Aktualizovať UI
              displayClients();
              displayCalls();
              
              alert('Hovor bol úspešne uložený!');
              
              // Resetovať formulár
              e.target.reset();
              document.getElementById('date').value = new Date().toISOString().split('T')[0];
            } else {
              alert('Chyba pri ukladaní hovoru!');
            }
          } catch (error) {
            console.error('Chyba:', error);
            alert('Chyba pri ukladaní hovoru!');
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Spustenie servera
app.listen(PORT, () => {
  console.log('======================================');
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  console.log(`OPEN: http://localhost:${PORT}`);
  console.log('======================================');
});