=======================================
  PROJEKT REZERVACIJA KART ZA DOGODKE
=======================================

------------------
 ZAGON APLIKACIJE
------------------

Najlažji način testiranja apliakcije je obisk spletne strani: test-matejbokal.si.
(--trenutno porabim preveč resource-ov, idealno bom do zagovora imel zadevo rešeno--)
Spletna stran ima polno funkcionalnost domače naloge in se od nje ne razlikuje.


NAVODILA ZA LOKALNO TESTIRANJE:
PREDPOGOJI:
- Node.js (idealno v18+)
- XAMPP

V mapi /code se nahaja mapa taprav-fri. To je source mapa projekta.
1. Mapo taprav-fri premakni v xampp/htdocs. Za poganjanje strežnika se uporablja aplikacija XAMPP.
2. (po potrebi) Nastavi, da MySQL server teče na port: 3307. Sprememba se lahko uredi datoteki my.ini, ki je dostopna v XAMPP Control Panel: MySQL-> Config -> zamenjaj vse pojavitve 3306 v 3307.
3. Zagon Apache strežnika in MySQL baze.
4. Uvoz baze taprav-fri v phpMyAdmin iz datoteke taprav-fri.sql
5. V mapi code/taprav-fri/frontend odpri terminal in poženi:
  - npm install
  - npm run dev
6. Odpri v brskalniku: http://localhost:3000



-------------------
 UPORABNIŠKA GESLA
-------------------

Za dostop do celotne vsebine se potrebuje admin dostop. Admin ima enake funkcionalnosti kot drugi
prijavljeni uporabniki + dostop do strani /admin/...
Za testiranje brez admin dostopa se lahko uporabi 

ADMIN:
Email: admin@example.com
Geslo: admin

USER: 
Email: matej.bokal2@gmail.com
Geslo: joz123

