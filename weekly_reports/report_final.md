# Info o projekte:
- Meno a priezvisko: Zuzana Skubenova
- Názov projektu: La mia casa
- Link na repozitár: https://github.com/zuzanaSKB/la-mia-casa
- Link na verejnú inštanciu projektu: https://la-mia-casa-fe.onrender.com/

# Info o reportovanej verzii:
- Tag: final

# Info k testovaniu:     
- je mozne sa aj zaregistrovat a vytvorit si vlastny ucet (ako guest) - odporucam si dat datum narodenia v den registracie aby sa dala rovno aj otestovat narodeninova zlava alebo vyuzit uz niektory z testovacich profilov na testovanie recenzii. Na testovanie zmeny hesla prosim pouzivajte len svoje vlastne ucty a nie tie testovacie.

# Postup, ako rozbehať vývojové prostredie 

    1. Naklonujte si repozitar z GitHubu pomocou prikazu: git clone https://github.com/zuzanaSKB/la-mia-casa
    2. V PostgreSQL si vytvorte databazu s tabulkami pomocou suboru tables.sql ( nachadza sa v priecinku my-app-be)
    3. Do my-app-be si pridajte subor .env s nasledovnymi premennymi:
        CLIENT_ORIGIN=http://localhost:5173
        NODE_ENV= 'development'
        SESSION_SECRET= ''              #lubovolny tajny retacez
        SESSION_COOKIE_NAME=sessionId   
        DB_USER= ''                     #doplnte podla db nastavenia
        DB_PASSWORD= ''                 #doplnte podla db nastavenia
        DB_HOST= 'localhost'
        DB_PORT= '5432'
        DB_NAME= ''                     #doplnte podla db nastavenia
    
    4. V priecinkoch my-app-be, my-app-fe spustite prikaz: npm install
    5. V oboch priecinkoch my-app-be, my-app-fe spustite pomocou: npm run dev
    6. Aplikacia nasledne bude bezat na:
        - backend: http://localhost:3000
        - frontend: http://localhost:5173

# Stav implementácie:
implementovane funkcionality:
- registracia (guest) 
- prihlasenie a odhlasenie (guest+admin)
- vypisanie buducich + ongoing rezervacii a ich stavu (Potvrdene, Caka na potvrdenie) + moznost zrusit rezervaciu (guest)
- vypisanie potvrdenych minulych (absolvovanych) rezervacii + moznost ku kazdej pridat 1 recenziu a hodnotenie (guest)
- vypisanie recenzii a hodnotenia, ktore uzivatel napisal k rezervaciam + moznost ich upravit/odstranit, kazda rezervacia moze mat najviac jednu recenziu (guest)
- narodeninova zlava - kazdy rok na narodeniny dostane uzivatel 20% zlavu na 1 rezervaciu, ktora ma platnost 1 rok (guest)
- rezervacny fromular na rezervaciu izby + ak ma uzivatel narok na narodeninovu zlavu, zobrazi sa mu tam moznost na jej uplatnenie (guest)
- upravenie profilu uzivatela (guest), uzivatel si vie pozriet svoje informacie o profile a zmenit meno, tel. cislo alebo heslo
- vypisanie vsetkych buducich + ongoing rezervacii a ich stavu (Potvrdene, Caka na potvrdenie, Zrusene) + moznost potvrdit/zrusit rezervaciu v stave "Caka na potvrdenie" uzivatelovi (admin)
- sprava izieb - vypisanie vsetkych izieb + moznost zmenit cenu za noc a dostupnost izby (admin)
- vypisanie vsetkych recenzii od uzivatelov + moznost publikovat / zrusit publikaciu pre kazdu recenziu, publikovane recenzie sa zobrazia na domovskej/uvodnej stranke (admin)

# Retrospektíva:
- Keby som robila tento projekt odznovu, premyslela by som si vopred lepsie navrh stranky, tabulky v databaze a zamyslela by som sa viac nad jednotlivymi funkcionalitami, (napr. ked som pred odovzdavanim bety robila narodeninove zlavy, musela somm vela veci prerabat a upravovat aby to bolo mozne naimplementovat tak ako som chcela, lebo som si to dopredu lepsie nepremyslela).
- Som hrda na vysledky mojej prace, stale by sa dalo nieco viac spravit, ale myslim, ze som nad strankou stravila vela casu a snazila som sa aby bola dobra a aby som sa za nu nemusela hanbit :).
- Na mojej stranke sa mi paci najviac funkcionalita recenzii a hodnotenia alebo myslienka narodeninovej zlavy. Taktiez sa mi paci aj ako vyzera / aky dojem zanechava pre uzivatela a ze styl stranky ladi s ideou domu situovaneho v Taliansku.