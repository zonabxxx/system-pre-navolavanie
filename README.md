# Systém pre navolávanie klientov

Jednoduchý systém pre správu klientov a záznamov hovorov s prehľadným webovým rozhraním.

## Funkcie

- Zobrazenie a filtrovanie zoznamu klientov
- Prehľadná práca so záznamami hovorov
- Stránkovanie výsledkov (50 záznamov na stránku)
- Podpora pre veľké datasety (1800+ klientov)
- Responzívny dizajn

## Technológie

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Dáta**: CSV/XLSX import

## Inštalácia a spustenie

### Lokálne spustenie

1. Naklonujte repozitár:
   ```
   git clone <repository-url>
   cd system-pre-navolavanie
   ```

2. Nainštalujte závislosti:
   ```
   npm install
   ```

3. Spustite server:
   ```
   npm start
   ```

4. Navštívte aplikáciu na `http://localhost:4000`

### Vývojové prostredie

Pre vývojové prostredie s automatickým reštartom servera použite:
```
npm run dev
```

## Nasadenie na Railway

1. Vytvorte účet na [Railway](https://railway.app/)

2. Pripojte svoj GitHub repozitár:
   - V Railway dashboarde kliknite na "New Project"
   - Vyberte "Deploy from GitHub repo"
   - Vyberte váš repozitár

3. Railway automaticky rozpozná Node.js projekt a nasadí ho

4. Po nasadení nájdete URL vašej aplikácie v Railway dashboarde

## Štruktúra súborov

- `server.js` - hlavný súbor servera
- `public/` - adresár s front-end súbormi
  - `index.html` - hlavná stránka aplikácie
- `Porovnanie_v_etk_ch__dajov.csv` - zdrojové dáta klientov

## Licencia

Tento projekt je licencovaný pod MIT licenciou. 