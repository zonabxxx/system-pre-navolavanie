const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Vytvorenie adresára pre verejné súbory
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Vytvorený adresár pre verejné súbory');
}

// Vytvorenie HTML súboru pre aplikáciu
const createHTMLFile = () => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Call Center Systém</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
  <style>
    .tab-content {
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 5px 5px;
    }
    .nav-tabs .nav-link {
      font-weight: 500;
    }
    .client-info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .badge {
      font-size: 0.9em;
    }
    .phone-link {
      color: #0d6efd;
      text-decoration: none;
    }
    .phone-link:hover {
      text-decoration: underline;
    }
    .link-icon {
      color: #0d6efd;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container-fluid py-3">
    <h2 class="mb-4">Call Center Systém</h2>
    
    <!-- Navigačné záložky -->
    <ul class="nav nav-tabs" id="mainTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="clientsTab" data-bs-toggle="tab" data-bs-target="#clients" type="button" role="tab">
          <i class="bi bi-people"></i> Klienti
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="callsTab" data-bs-toggle="tab" data-bs-target="#calls" type="button" role="tab">
          <i class="bi bi-telephone"></i> História hovorov
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="newCallTab" data-bs-toggle="tab" data-bs-target="#newCall" type="button" role="tab">
          <i class="bi bi-plus-circle"></i> Nový hovor
        </button>
      </li>
    </ul>
    
    <!-- Obsah záložiek -->
    <div class="tab-content" id="mainTabsContent">
      <!-- Záložka klientov -->
      <div class="tab-pane fade show active" id="clients" role="tabpanel">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <input type="text" id="clientSearch" class="form-control" placeholder="Vyhľadať klienta...">
              <button class="btn btn-outline-secondary" type="button" id="clientSearchBtn">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="table table-hover" id="clientsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Firma</th>
                <th>Telefón</th>
                <th>Email</th>
                <th>Adresa</th>
                <th>Web</th>
                <th>Poznámka</th>
                <th>Status</th>
                <th>Akcie</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      
      <!-- Záložka histórie hovorov -->
      <div class="tab-pane fade" id="calls" role="tabpanel">
        <div class="table-responsive">
          <table class="table table-striped" id="callsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Klient</th>
                <th>Dátum a čas</th>
                <th>Trvanie (min)</th>
                <th>Poznámky</th>
                <th>Výsledok</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      
      <!-- Záložka nového hovoru -->
      <div class="tab-pane fade" id="newCall" role="tabpanel">
        <form id="newCallForm" class="mb-4">
          <div class="mb-3">
            <label for="callClientSelect" class="form-label">Vyberte klienta</label>
            <select class="form-select" id="callClientSelect" required>
              <option value="">-- Vyberte klienta --</option>
            </select>
          </div>
          
          <div class="client-info" id="selectedClientInfo">
            <h5>Detaily klienta</h5>
            <p>Vyberte klienta zo zoznamu</p>
          </div>
          
          <div class="mb-3">
            <label for="callDuration" class="form-label">Trvanie hovoru (minúty)</label>
            <input type="number" class="form-control" id="callDuration" min="1" required>
          </div>
          
          <div class="mb-3">
            <label for="callNotes" class="form-label">Poznámky z hovoru</label>
            <textarea class="form-control" id="callNotes" rows="3"></textarea>
          </div>
          
          <div class="mb-3">
            <label for="callOutcome" class="form-label">Výsledok hovoru</label>
            <select class="form-select" id="callOutcome" required>
              <option value="Úspešný">Úspešný</option>
              <option value="Neúspešný">Neúspešný</option>
              <option value="Nedostupný">Nedostupný</option>
              <option value="Vyžiadať neskôr">Vyžiadať neskôr</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="clientStatus" class="form-label">Aktualizovať status klienta</label>
            <select class="form-select" id="clientStatus">
              <option value="Aktívny">Aktívny</option>
              <option value="Neaktívny">Neaktívny</option>
              <option value="Nedostupný">Nedostupný</option>
              <option value="Zavolať neskôr">Zavolať neskôr</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-save"></i> Uložiť hovor
          </button>
        </form>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // Globálne premenné
    let clients = [];
    let calls = [];
    
    // Inicializácia aplikácie po načítaní DOM
    document.addEventListener('DOMContentLoaded', function() {
      // Načítanie klientov zo servera
      fetch('/clients')
        .then(response => response.json())
        .then(data => {
          clients = data;
          displayClients(clients);
          populateClientSelect();
        })
        .catch(error => {
          console.error('Chyba pri načítavaní klientov:', error);
          alert('Nepodarilo sa načítať klientov. Skontrolujte pripojenie k serveru.');
        });
      
      // Načítanie hovorov zo servera
      fetch('/calls')
        .then(response => response.json())
        .then(data => {
          calls = data;
          displayCalls(calls);
        })
        .catch(error => {
          console.error('Chyba pri načítavaní hovorov:', error);
        });
      
      // Event listeners
      document.getElementById('clientSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredClients = clients.filter(client => 
          client.Firma.toLowerCase().includes(searchTerm) ||
          (client.Telefón && client.Telefón.toLowerCase().includes(searchTerm)) ||
          (client.Mail && client.Mail.toLowerCase().includes(searchTerm)) ||
          (client.adresa && client.adresa.toLowerCase().includes(searchTerm)) ||
          (client.status && client.status.toLowerCase().includes(searchTerm))
        );
        displayClients(filteredClients);
      });
      
      document.getElementById('callClientSelect').addEventListener('change', function() {
        const clientId = this.value;
        if (clientId) {
          const client = clients.find(c => c.id == clientId);
          if (client) {
            const infoDiv = document.getElementById('selectedClientInfo');
            infoDiv.innerHTML = `
              <h5>Detaily klienta</h5>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Firma:</strong> ${client.Firma || '-'}</p>
                  <p><strong>Telefón:</strong> ${client.Telefón ? `<a href="tel:${client.Telefón}">${client.Telefón}</a>` : '-'}</p>
                  <p><strong>Email:</strong> ${client.Mail ? `<a href="mailto:${client.Mail}">${client.Mail}</a>` : '-'}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Adresa:</strong> ${client.adresa || '-'}</p>
                  <p><strong>Status:</strong> <span class="badge ${client.status === 'Aktívny' ? 'bg-success' : 'bg-secondary'}">${client.status || '-'}</span></p>
                  <p><strong>Web:</strong> ${client.web ? `<a href="${client.web}" target="_blank">${client.web}</a>` : '-'}</p>
                </div>
              </div>
              <p><strong>Poznámka:</strong> ${client.Poznámka || '-'}</p>
            `;
            
            // Nastavenie predvoleného statusu klienta
            document.getElementById('clientStatus').value = client.status || 'Aktívny';
          }
        } else {
          document.getElementById('selectedClientInfo').innerHTML = '<h5>Detaily klienta</h5><p>Vyberte klienta zo zoznamu</p>';
        }
      });
      
      // Spracovanie formulára pre nový hovor
      document.getElementById('newCallForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientId = document.getElementById('callClientSelect').value;
        const duration = document.getElementById('callDuration').value;
        const notes = document.getElementById('callNotes').value;
        const outcome = document.getElementById('callOutcome').value;
        const newStatus = document.getElementById('clientStatus').value;
        
        if (!clientId) {
          alert('Vyberte klienta zo zoznamu.');
          return;
        }
        
        // Odoslanie dát hovoru na server
        fetch('/calls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            duration,
            notes,
            outcome
          }),
        })
        .then(response => response.json())
        .then(newCall => {
          // Aktualizácia lokálnych dát
          calls.push(newCall);
          displayCalls(calls);
          
          // Aktualizácia statusu klienta
          fetch(\`/clients/\${clientId}/status\`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          })
          .then(response => response.json())
          .then(updatedClient => {
            // Aktualizácia klienta v lokálnom zozname
            const index = clients.findIndex(c => c.id == clientId);
            if (index !== -1) {
              clients[index] = updatedClient;
              displayClients(clients);
              
              // Reset formulára
              document.getElementById('newCallForm').reset();
              document.getElementById('selectedClientInfo').innerHTML = '<h5>Detaily klienta</h5><p>Vyberte klienta zo zoznamu</p>';
              
              // Prepnutie na záložku hovorov
              document.getElementById('callsTab').click();
            }
          })
          .catch(error => {
            console.error('Chyba pri aktualizácii statusu klienta:', error);
            alert('Hovor bol zaznamenaný, ale nepodarilo sa aktualizovať status klienta.');
          });
        })
        .catch(error => {
          console.error('Chyba pri odosielaní dát hovoru:', error);
          alert('Nepodarilo sa zaznamenať hovor. Skúste to znova.');
        });
      });
    });
    
    // Funkcia na zobrazenie klientov v tabuľke
    function displayClients(clientsToDisplay) {
      const clientTable = document.getElementById('clientsTable');
      const tbody = clientTable.querySelector('tbody');
      tbody.innerHTML = '';

      clientsToDisplay.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>\${client.id}</td>
          <td>\${client.Firma || ''}</td>
          <td>
            <a href="tel:\${client.Telefón || ''}" class="phone-link">\${client.Telefón || ''}</a>
          </td>
          <td>
            <a href="mailto:\${client.Mail || ''}">\${client.Mail || ''}</a>
          </td>
          <td>\${client.adresa || ''}</td>
          <td>
            \${client.web ? \`<a href="\${client.web}" target="_blank" class="link-icon"><i class="bi bi-link-45deg"></i></a>\` : '-'}
          </td>
          <td>\${client.Poznámka || ''}</td>
          <td>
            <span class="badge \${client.status === 'Aktívny' ? 'bg-success' : 'bg-secondary'}">\${client.status || 'Neznámy'}</span>
          </td>
          <td>
            <button class="btn btn-sm btn-primary call-btn" data-id="\${client.id}">
              <i class="bi bi-telephone"></i> Zavolať
            </button>
          </td>
        \`;
        tbody.appendChild(row);
      });

      // Pridať event listenery pre tlačidlá volania
      document.querySelectorAll('.call-btn').forEach(button => {
        button.addEventListener('click', function() {
          const clientId = this.getAttribute('data-id');
          const client = clients.find(c => c.id == clientId);
          
          if (client) {
            document.getElementById('newCallTab').click();
            document.getElementById('callClientSelect').value = clientId;
            // Spustenie udalosti change na select pre aktualizáciu údajov o klientovi
            const event = new Event('change');
            document.getElementById('callClientSelect').dispatchEvent(event);
          }
        });
      });
    }
    
    // Funkcia na zobrazenie hovorov v tabuľke
    function displayCalls(callsToDisplay) {
      const tbody = document.querySelector('#callsTable tbody');
      tbody.innerHTML = '';
      
      callsToDisplay.forEach(call => {
        const date = new Date(call.date);
        const formattedDate = \`\${date.toLocaleDateString()} \${date.toLocaleTimeString()}\`;
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>\${call.id}</td>
          <td>\${call.clientName}</td>
          <td>\${formattedDate}</td>
          <td>\${call.duration}</td>
          <td>\${call.notes || '-'}</td>
          <td><span class="badge \${getOutcomeBadgeClass(call.outcome)}">\${call.outcome}</span></td>
        \`;
        tbody.appendChild(row);
      });
    }
    
    // Funkcia na naplnenie select boxu klientov
    function populateClientSelect() {
      const select = document.getElementById('callClientSelect');
      
      // Vymazanie existujúcich možností okrem prvej (placeholder)
      while (select.options.length > 1) {
        select.remove(1);
      }
      
      // Pridanie klientov do select boxu
      clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = \`\${client.Firma} (\${client.Telefón || 'bez telefónu'})\`;
        select.appendChild(option);
      });
    }
    
    // Pomocná funkcia na určenie CSS triedy pre badge výsledku hovoru
    function getOutcomeBadgeClass(outcome) {
      switch (outcome) {
        case 'Úspešný':
          return 'bg-success';
        case 'Neúspešný':
          return 'bg-danger';
        case 'Nedostupný':
          return 'bg-warning';
        case 'Vyžiadať neskôr':
          return 'bg-info text-dark';
        default:
          return 'bg-secondary';
      }
    }
  </script>
</body>
</html>
  `;
  
  const htmlFilePath = path.join(publicDir, 'index.html');
  fs.writeFileSync(htmlFilePath, htmlContent);
  console.log('Vytvorený súbor index.html');
};

// Vytvorenie súborov pri spustení servera
createHTMLFile();

// Čítanie dát z Excel súboru
function readDataFromExcel() {
  try {
    const filePath = path.join(__dirname, 'firmy PK.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    // Mapovanie stĺpcov z Excelu na našu štruktúru
    return data.map((row, index) => ({
      id: index + 1,
      Firma: row['FIRMA'],
      Telefón: row['TELEFÓN'] || '',
      Mail: row['EMAIL'] || '',
      adresa: `${row['ADRESA'] || ''}, ${row['PSČ'] || ''} ${row['MIESTO'] || ''}`,
      web: row['WEB'] || '',
      Poznámka: row['POZNÁMKA'] || '',
      status: 'Aktívny'
    }));
  } catch (error) {
    console.error('Chyba pri čítaní Excel súboru:', error);
    return [];
  }
}

// Inicializácia dát
const clients = readDataFromExcel();
console.log(`Načítaných ${clients.length} klientov z Excel súboru`);

// Dátový model pre hovory
let calls = [];
let nextCallId = 1;

// API endpoint pre získanie všetkých klientov
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// API endpoint pre získanie jedného klienta podľa ID
app.get('/api/clients/:id', (req, res) => {
  const clientId = parseInt(req.params.id);
  const client = clients.find(c => c.id === clientId);
  
  if (!client) {
    return res.status(404).json({ error: 'Klient nenájdený' });
  }
  
  res.json(client);
});

// API endpoint pre aktualizáciu statusu klienta
app.patch('/api/clients/:id', (req, res) => {
  const clientId = parseInt(req.params.id);
  const { status } = req.body;
  
  const clientIndex = clients.findIndex(c => c.id === clientId);
  
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Klient nenájdený' });
  }
  
  // Aktualizácia statusu
  clients[clientIndex].status = status;
  
  res.json(clients[clientIndex]);
});

// API endpoint pre vytvorenie nového hovoru
app.post('/api/calls', (req, res) => {
  const { clientId, duration, notes, outcome } = req.body;
  
  const clientIndex = clients.findIndex(c => c.id === parseInt(clientId));
  
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Klient nenájdený' });
  }
  
  const newCall = {
    id: nextCallId++,
    clientId: parseInt(clientId),
    clientName: clients[clientIndex].Firma,
    date: new Date().toISOString(),
    duration: duration || '0',
    notes: notes || '',
    outcome: outcome || 'Nedokončený'
  };
  
  calls.push(newCall);
  
  res.status(201).json(newCall);
});

// API endpoint pre získanie všetkých hovorov
app.get('/api/calls', (req, res) => {
  res.json(calls);
});

// API endpoint pre vyhľadávanie klientov
app.get('/api/clients/search/:term', (req, res) => {
  const searchTerm = req.params.term.toLowerCase();
  
  const filteredClients = clients.filter(client => 
    client.Firma.toLowerCase().includes(searchTerm) ||
    client.Telefón.toLowerCase().includes(searchTerm) ||
    client.Mail.toLowerCase().includes(searchTerm) ||
    client.adresa.toLowerCase().includes(searchTerm) ||
    client.status.toLowerCase().includes(searchTerm)
  );
  
  res.json(filteredClients);
});

// Servirovanie index.html pre ostatné URL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Štart servera
app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
  console.log(`Načítaných ${clients.length} klientov z Excel súboru`);
});