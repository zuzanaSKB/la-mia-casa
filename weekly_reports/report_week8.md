# Info o projekte:

- Meno a priezvisko: Zuzana Skubenova
- Názov projektu: La Casa Mia
- Link na repozitár: https://github.com/zuzanaSKB/la-mia-casa

# Info o reportovanej verzii:

- Tag: week8
- Obdobie: 8. týždeň, 7.4. - 13.4.2025

# Plán:
Chcem zabezpecit, aby sa neprhlaseny uzivatel nevedel dostat na dashboardGuest stranku. Dalej by som chcela pracovat na frontende dashboardGuest a funkcii rezervacie izieb.

# Vykonaná práca:
d05ccdd - pridanie ProtectedRoute na zabezpecenie autentifikovaneho pristupu do dashboardGuest (pristup maju len prihlasey)
c665fe0 - oprava aby fungovalo ProtectedRoute
6c762c1 - vycistenie kodu
b6cc74b - pridanie session table na ukladanie session
b2cf56d - uprava nazvu funkcie
ddc3cd1 - init  dashboard stranky pre Admina
ae879fb - pridanie role-based pristupu (guest/admin pristup)
ac8385f - mala som niekde chybu a myslela som si ze ked vsade budem pouzivat async/await syntax tak to pomoze (zjednotenie na async/await)
a507bdd - rezervacny formular init
22c498e - fe (fetch) funkcia na vratenie dostupnych izieb (fetchAvailableRooms)
7061fe3 - funkcia ktora vrati dostupne izby z db (getAvailableRooms )
95f5b60 - be (router) funkcia na ziskanie dostupnych izieb  
4c6ff56 - test na funkciu na dostupne izby z db
6fd7c8a - doplnenie kodu aby sa vracalo aj user id
ea0cfe7 - doplnenie do app.js route na funkcie ohladom rezervacii izieb
f7ae613 - fix logout funkcie
9eff032 - update dashboardGuest stranky 
918ef91 - doplnenie argumentov ktore sa maju posielat do componentov v App.jsx
08031f4 - doplnenie argumentov ktore pridu do home componentu z App.jsx
1961f55 - pridanie nastavenia user id po uspesnom prihaseni v Login componente
62f16e9 - cistenie kodu (odstranenie nepotrebneho componentu)
0cda1a5 - uprava rezervacneho formulara ak pre dany termin a pocet osob nie je volna izba
0871492 - uprava rezervacneho formulara - pridanie kratkeho popisu k jednotlinym izbam
a6f0f5b - funkcionalita na zrusenie rezervacie
5830fb5 - doplnenie do DashboardGuest aktivne rezervacie z db a pridanie buttonu a zrusenie rezervacie

# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
Myslim, ze som dodrzala vsetko co som naplanovala.

# Plán na ďalší týždeň:
Pisanie reviews pre danu rezervaciu, dashboard pre admina dokoncit a celu funkcionalitu okolo toho + nasadenie na render.com. 

# Problémy:
Hlavne asi malo casu kvoli inym povinnostiam a vela casu mi zabera hladanie chyb. 


# Zmeny v špecifikácii:
Zatial nie.
 

