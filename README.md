# Systém pre navolávanie klientov

Jednoduchý CRM systém pre správu klientov a zaznamenávanie telefonických hovorov. Aplikácia umožňuje vyhľadávanie v databáze klientov, vedenie záznamov o hovoroch a jednoduché štatistiky.

## Funkcie

- Prehľadná databáza klientov s možnosťou vyhľadávania
- Zaznamenávanie histórie hovorov
- Aktualizácia statusov klientov
- Responzívne používateľské rozhranie
- Filtrovanie a stránkovanie výsledkov

## Technológie

- Node.js + Express
- Vanilla JavaScript + Bootstrap 5 pre frontend
- XLSX pre načítavanie údajov z Excelu
- CORS pre cross-origin komunikáciu

## Inštalácia

1. Klonujte repozitár
   ```
   git clone https://github.com/zonabxxx/system-pre-navolavanie.git
   ```

2. Nainštalujte závislosti
   ```
   npm install
   ```

3. Spustite aplikáciu
   ```
   npm start
   ```

4. Otvorte prehliadač a prejdite na `http://localhost:4000`

## Štruktúra projektu

- `server.js` - hlavný súbor servera
- `public/` - klientska časť aplikácie
  - `index.html` - hlavná stránka aplikácie
- `Porovnanie_v_etk_ch__dajov.csv` - zdrojové dáta klientov
- `calls.json` - úložisko pre záznamy hovorov

## Nedávne zmeny

- Opravený vyhľadávací mechanizmus
- Vylepšené zobrazovanie záznamov v tabuľke
- Pridaná podpora pre stránkovanie výsledkov
- Vylepšené UX/UI pre prácu s hovormi

## Licencia

MIT 