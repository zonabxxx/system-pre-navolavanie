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

// Načítanie dát z Excel súboru
function loadClientsFromExcel() {
  try {
    const workbook = XLSX.readFile(path.join(__dirname, 'firmy PK.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Transformácia dát na požadovaný formát
    return data.map((row, index) => ({
      id: index + 1,
      name: row['Firma'] || '',
      phone: row['Telefón'] || '',
      email: row['E-mail'] || '',
      address: row['Adresa'] || '',
      website: row['Web'] || '',
      notes: row['Poznámka'] || '',
      status: 'Neoslovený'  // Predvolený status pre všetkých klientov
    }));
  } catch (error) {
    console.error('Chyba pri načítaní Excel súboru:', error);
    return [];
  }
}

// Načítanie klientov z excelu
let clients = loadClientsFromExcel();

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
    clientName: clients[clientIndex].name,
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
    client.name.toLowerCase().includes(searchTerm) ||
    client.phone.toLowerCase().includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm) ||
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