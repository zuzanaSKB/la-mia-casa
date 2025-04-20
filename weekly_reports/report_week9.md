# Info o projekte:
- Meno a priezvisko: Zuzana Skubenova
- Názov projektu: La mia casa
- Link na repozitár: https://github.com/zuzanaSKB/la-mia-casa

# Info o reportovanej verzii:
- Tag: week9                        
- Obdobie: 9. týždeň, 14.4. - 20.4.2025 

# Plán:
Pisanie reviews pre danu rezervaciu, dashboard pre admina dokoncit a celu funkcionalitu okolo toho + nasadenie na render.com. 

# Vykonaná práca:
276b2fa - be funkcionalita na vypisanie minulych rezervacii uzivatela
5b7af02 - be funkcionalita na pridavanie recenzii init
06613fb - fe funkcionalita na pridavanie recenzii
913a808 - update table reviews - pridala som stlpce reservation_id a deleted 
5d758f3 - be funkcionalita na pridavanie recenzii
e5e6529 - change navigate to home ak uzivatel nie je autentifikovany
62cd7e2 - fe funkcionalita pre uzivatela guest na mazanie a pridavanie recenzii
1db96d0 - oprava tabulky reviews - kedze chceme len soft delete, reservation_id nemoze byt unique
8cd3801 - fix submit reviews
97d80ec - guest si nemoze pri rezervacii izby zvolit datum v minulosti
0fddff3 - clear log
3dd3bea - pridanie tlacidla na odhlasenie pri rezervacnom formulari
4442cd4 - preklad sprav pre uzivatelov do slovenciny
a77b4d7 - update labels
4fb5712 - pridanie vypisu mena prihlaseneho uzivatela v dashboarde
e19602d - v dashboarde pre admina pridanie tabulky vsetkych rezervacii
137acfb - add scrollbar
c35a547 - add backend room functions
19f523b - funkcionalita pre admina na nastavenie dostupnosti izby a ceny za noc
45a85a9 - vypis vsetkych recenzii v dashboarde pre admina (be)
573c1d4 - vypis vsetkych recenzii v tabulke v dashboarde pre admina (fe)
9a5ca0d - uprava vzhladu pri hodnoteni (5 hviezdiciek)
a692097 - pridanie stlpca price do tabulky reservations
a764756 - be funkcionalita narodeninovych zliav
661e87a - uprava be funkcii po pridani price stlpca
1e60100 - fe funkcionalita narodeninovych zliav
9382ff4 - pridanie stlpca published do tabulky reviews
5766f72 - be funkcionalita pre admina na publikovanie recenzii
14ec8ba - fe funkcionalita pre admina na publikovanie recenzii
e453516 - pridanie tlacidla na publikovanie & zrusenie publikacie pre admina na dashboarde pri kazdej recenzii
05ace97 - fe zobrazovanie publikovanych recenzii na home stranke
b152a43 - pridanie zobrazovania mena izby pri publikovanych recenziach
fc1134f - pridanie jednoduchej animacie na publikovane recenzie
104c9e3 - oprava tlacidla na publikaciu recenzii v dashboarde pre admina

# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:
Kedze sa predlzil deadline na odovzdanie beta verzie, rozhodla som sa spravit aj funkcionalitu narodeninovych zliav (co som mala v specifikacii ako optional) a tym padom som nestihla nasadit stranku na render.com, to planujem spravit v pondelok (zajtra). 

# Plán na ďalší týždeň:
Nasadenie na render.com.

# Problémy:
Ziadne vazme problemy som tento tyzden nemala.

# Zmeny v špecifikácii:
Musela som si pridat nejake stlpce v db tabulkach, aby som mohla urobit niektore funkcionality, konkretne som pridala:
    - reviews tabulka - stlpce reservation_id(kedze chem, aby na 1 rezervaciu mohla byt prave 1 recenzia, ktoru je mozne uzivatelovi upravit/vymazat) a deleted (soft delete recenzie)
    - reservations tabulka - pridanie stlpca price (finalna cena za celu rezervaciu)
    - reviews tabulka - stlpec published (admin vie publikovat recenzie - zobrazia sa neprihlasenym uzivatelom na home page)
 

