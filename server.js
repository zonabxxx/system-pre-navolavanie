const express = require('express');
const cors = require('cors');
const fs = require('fs');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Pridanie CORS middleware
app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Načítanie dát z CSV súboru
function loadDataFromCSV(filePath) {
  try {
    console.log(`Načítavám dáta z ${filePath}...`);
    
    // Nastavenie možnosti čítania s UTF-8 kódovaním
    const options = {
      type: 'file',
      raw: false,
      codepage: 65001, // UTF-8
      cellDates: true,
      dateNF: 'dd.mm.yyyy'
    };
    
    const workbook = XLSX.readFile(filePath, options);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Načítaných ${data.length} záznamov z CSV súboru.`);
    
    // Zistenie dostupných stĺpcov v prvom zázname pre debug
    if (data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log("Dostupné stĺpce v CSV:", columns);
    }
    
    // Spracovanie dát - pridanie ID a mapovanie stĺpcov z CSV formátu
    const processedData = data.map((item, index) => {
      const id = item.id || item.ID || item.Position || index + 1;
      
      return {
        id: id,
        Firma: item['Business Name'] || item.Firma || item.Meno || item.NAZOV || '',
        Telefón: item['Phone Number'] || item.Telefón || item.Tel || item.TEL || item.TELEFON || '',
        Mail: item.Email || item.Mail || item['E-mail'] || item.EMAIL || '',
        Poznámka: item.Category || item.Poznámka || item.Notes || item.Poznamka || '',
        status: item.Stav || item.Is_Client || item.Status || 'Aktívny',
        adresa: item.Address || item.Adresa || '',
        web: item.Website || item.Web || '',
        profileLink: item['Profile Link'] || ''
      };
    });
    
    // Vypíš prvých 5 spracovaných záznamov pre kontrolu
    console.log("Ukážka spracovaných dát (prvých 5 záznamov):");
    processedData.slice(0, 5).forEach((client, index) => {
      console.log(`Záznam ${index + 1}:`, client);
    });
    
    console.log(`Spracovaných ${processedData.length} klientov.`);
    return processedData;
  } catch (error) {
    console.error('Chyba pri načítaní CSV súboru:', error);
    return [];
  }
}

// Načítanie klientov z CSV súboru
const clients = loadDataFromCSV('./Porovnanie_v_etk_ch__dajov.csv');
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

// Pomocná funkcia na uloženie hovorov do JSON súboru
function saveCalls() {
  fs.writeFileSync('./calls.json', JSON.stringify(calls, null, 2));
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
  saveCalls();
  
  console.log(`Pridaný nový hovor pre klienta s ID ${newCall.clientId}`);
  
  res.status(201).json(newCall);
});

// Editácia existujúceho hovoru
app.put('/api/calls/:id', (req, res) => {
  const callId = parseInt(req.params.id);
  const callIndex = calls.findIndex(call => call.id === callId);
  
  if (callIndex === -1) {
    return res.status(404).json({ error: 'Záznam hovoru nebol nájdený' });
  }
  
  // Aktualizácia údajov
  const updatedCall = {
    ...calls[callIndex],
    clientId: req.body.clientId || calls[callIndex].clientId,
    date: req.body.date || calls[callIndex].date,
    duration: req.body.duration || calls[callIndex].duration,
    notes: req.body.notes || calls[callIndex].notes,
    outcome: req.body.outcome || calls[callIndex].outcome,
    updatedAt: new Date().toISOString()
  };
  
  calls[callIndex] = updatedCall;
  
  // Uloženie aktualizovaných hovorov
  saveCalls();
  
  console.log(`Aktualizovaný hovor s ID ${callId}`);
  
  res.json(updatedCall);
});

// Vymazanie hovoru
app.delete('/api/calls/:id', (req, res) => {
  const callId = parseInt(req.params.id);
  const callIndex = calls.findIndex(call => call.id === callId);
  
  if (callIndex === -1) {
    return res.status(404).json({ error: 'Záznam hovoru nebol nájdený' });
  }
  
  // Vymazanie hovoru
  const deletedCall = calls[callIndex];
  calls.splice(callIndex, 1);
  
  // Uloženie aktualizovaných hovorov
  saveCalls();
  
  console.log(`Vymazaný hovor s ID ${callId}`);
  
  res.json({ message: 'Hovor bol úspešne vymazaný', deletedCall });
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

// Hlavná HTML stránka
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Spustenie servera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server beží na porte ${PORT}`);
}); 