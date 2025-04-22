# Info o projekte:
- Meno a priezvisko: Zuzana Skubenova
- Názov projektu: La mia casa
- Link na repozitár: https://github.com/zuzanaSKB/la-mia-casa
- Link na verejnú inštanciu projektu: https://la-mia-casa-fe.onrender.com/

# Info o reportovanej verzii:
- Tag: beta

# Info k testovaniu: 
- je mozne sa aj zaregistrovat a vytvorit si vlastny ucet (ako guest) - odporucam si dat datum narodenia v den registracie aby sa dala rovno aj otestovat narodeninova zlava

# Postup, ako rozbehať vývojové prostredie 

    1. Naklonujte si repozitar z GitHubu pomocou prikazu: git clone https://github.com/zuzanaSKB/la-mia-casa
    2. V PostgreSQL si vytvorte databazu s tabulkami pomocou suboru tables.sql ( nachadza sa v priecinku my-app-be)
    3. Do my-app-be si pridajte subor .env s nasledovnymi premennymi:
        CLIENT_ORIGIN=http://localhost:5173
        NODE_ENV === 'development'
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
- prihlasenie (guest+admin)
- odhlasenie (guest+admin)
- vypisanie buducich + ongoing rezervacii a ich stavu (Potvrdene, Caka na potvrdenie) + moznost zrusit rezervaciu (guest)
- vypisanie potvrdenych minulych (absolvovanych) rezervacii + moznost ku kazdej pridat 1 recenziu (guest)
- vypisanie recenzii, ktore uzivatel napisal k rezervaciam + moznost ich upravit/odstranit (guest)
- narodeninova zlava - na narodeniny dostane uzivatel 20% zlavu na 1 rezervaciu, ktora ma platnost 1 rok (guest)
- rezervacny fromular na rezervaciu izby + ak ma uzivatel narok na narodeninovu zlavu, zobrazi sa mu tam moznost uplatnit si ju (guest)
- vypisanie vsetkych buducich + ongoing rezervacii a ich stavu (Potvrdene, Caka na potvrdenie, Zrusene) + moznost potvrdit/zrusit rezervaciu v stave "Caka na potvrdenie" uzivatelovi (admin)
- sprava izieb - vypisanie vsetkych izieb + moznost zmenit cenu za noc a dostupnost izby (admin)
- vypisanie vsetkych recenzii od uzivatelov + moznost publikovat / zrusit publikaciu pre kazdu recenziu (admin)

zatial neimplementovane funkcionality:
- upravenie profilu uzivatela (guest)

# Časový plán:
10. tyzden: nasadenie na hosting
11. tyzden: funkcioalita upravenia profilu uzivatela

# Problémy:
Nemala som ziadne vaznejsie problemy.