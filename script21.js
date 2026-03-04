const database = {

"Zwierzęta": [
"Pies","Kot","Lew","Tygrys","Słoń","Żyrafa","Zebra","Wilk","Lis","Niedźwiedź",
"Królik","Krowa","Koń","Świnia","Owca","Kura","Kaczka","Pingwin","Rekin","Delfin",
"Żółw","Małpa","Papuga","Sowa","Wąż"
],

"Jedzenie": [
"Pizza","Hamburger","Hot dog","Frytki","Spaghetti","Pierogi","Rosół","Zupa pomidorowa",
"Schabowy","Bigos","Sushi","Kebab","Sałatka","Kanapka","Jajecznica","Omlet",
"Lody","Tort","Sernik","Pączek","Czekolada","Chipsy","Popcorn","Banan","Jabłko"
],

"Filmy i bajki": [
"Król Lew","Shrek","Harry Potter","Spider-Man","Batman","Avengers",
"Gwiezdne Wojny","Jurassic Park","Titanic","Matrix",
"Kraina Lodu","Minionki","Toy Story","Auta","Madagaskar",
"Piraci z Karaibów","Władca Pierścieni","Hobbit","Joker","Transformers"
],

"Państwa": [
"Polska","Niemcy","Francja","Włochy","Hiszpania",
"USA","Kanada","Brazylia","Chiny","Japonia",
"Indie","Australia","Egipt","Grecja","Turcja",
"Norwegia","Szwecja","Finlandia","Ukraina","Czechy"
],

"Miasta": [
"Warszawa","Kraków","Gdańsk","Wrocław",
"Berlin","Paryż","Londyn","Rzym",
"Madryt","Nowy Jork","Los Angeles",
"Tokio","Dubaj","Praga","Barcelona",
"Wiedeń","Budapeszt","Sydney","Chicago","Toronto"
],

"Sport": [
"Piłka nożna","Koszykówka","Siatkówka","Tenis",
"Boks","MMA","Hokej","Narciarstwo",
"Pływanie","Lekkoatletyka","Rugby","Golf",
"Szachy","Żużel","Piłka ręczna",
"Baseball","Surfing","Kolarstwo","Skoki narciarskie","Formuła 1"
],

"Zawody": [
"Lekarz","Nauczyciel","Strażak","Policjant","Programista",
"Kucharz","Pilot","Pielęgniarka","Mechanik","Fryzjer",
"Architekt","Weterynarz","Prawnik","Sędzia","Dziennikarz",
"Fotograf","Trener","Kierowca","Rolnik","Listonosz"
],

"Przedmioty": [
"Telefon","Laptop","Telewizor","Konsola","Słuchawki",
"Zegarek","Aparat","Głośnik","Powerbank","Tablet",
"Monitor","Klawiatura","Myszka","Drukarka","Plecak",
"Portfel","Okulary","Lodówka","Pralka","Suszarka",
"Łóżko","Krzesło","Stół","Lampa","Poduszka"
],

"Miejsca": [
"Szkoła","Szpital","Lotnisko","Plaża","Góry",
"Las","Pustynia","Restauracja","Kino","Sklep",
"Siłownia","Basen","Stadion","Hotel","Biblioteka",
"Park","Muzeum","Dworzec","Teatr","Zoo"
]

};

// użyj swojej bazy haseł
// (Twoja aktualna uproszczona baza będzie działać)

let players=[];
let impostors=[];
let currentPlayer=0;
let selectedWord="";
let selectedCategory="";
let showCategoryToImpostor=false;
let holdTimer=null;
let holdProgress=0;

function addPlayer(){
    const input=document.getElementById("playerName");
    const name=input.value.trim();
    if(!name) return;
    players.push(name);
    input.value="";
    renderPlayers();
}

function removePlayer(i){
    players.splice(i,1);
    renderPlayers();
}

function renderPlayers(){
    const list=document.getElementById("playersList");
    list.innerHTML="";
    players.forEach((name,i)=>{
        const div=document.createElement("div");
        div.className="playerItem";
        div.innerHTML=`${name}
        <button class="removeBtn" onclick="removePlayer(${i})">✕</button>`;
        list.appendChild(div);
    });
    document.getElementById("playerCount").textContent=players.length;
}

function startGame(){
    if(players.length<3){ alert("Minimum 3 graczy"); return; }

    const impostorCount=+document.getElementById("impostorCount").value;
    if(impostorCount>=players.length){ alert("Za dużo oszustów"); return; }

    showCategoryToImpostor=document.getElementById("showCategoryToImpostor").checked;

    impostors=[];
    while(impostors.length<impostorCount){
        let r=Math.floor(Math.random()*players.length);
        if(!impostors.includes(r)) impostors.push(r);
    }

    const categories=Object.keys(database);
    selectedCategory=categories[Math.floor(Math.random()*categories.length)];
    selectedWord=database[selectedCategory][
        Math.floor(Math.random()*database[selectedCategory].length)
    ];

    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("playerScreen").classList.add("active");

    currentPlayer=0;
    updatePlayer();
}

function updatePlayer(){
    document.getElementById("playerTitle").textContent="Telefon dla: "+players[currentPlayer];
    document.getElementById("revealBox").textContent="";
    document.getElementById("progressBar").style.width="0%";
}

function startHold(){
    holdProgress=0;
    const bar=document.getElementById("progressBar");

    holdTimer=setInterval(()=>{
        holdProgress+=100/15;
        bar.style.width=holdProgress+"%";
        if(holdProgress>=100){
            clearInterval(holdTimer);
            revealContent();
        }
    },100);
}

function cancelHold(){
    clearInterval(holdTimer);
    holdProgress=0;
    document.getElementById("progressBar").style.width="0%";
}

function revealContent(){
    const box=document.getElementById("revealBox");

    if(impostors.includes(currentPlayer)){
        if(showCategoryToImpostor){
            box.innerHTML="Kategoria: "+selectedCategory+"<br><br>OSZUST";
        } else {
            box.innerHTML="OSZUST";
        }
    } else {
        box.innerHTML="Kategoria: "+selectedCategory+"<br><br>"+selectedWord;
    }
}

function nextPlayer(){
    currentPlayer++;
    if(currentPlayer<players.length){
        updatePlayer();
    } else {
        document.getElementById("playerScreen").classList.remove("active");
        document.getElementById("endScreen").classList.add("active");
    }
}

function revealImpostor(){
    document.getElementById("finalReveal").innerHTML=
        "Kategoria: "+selectedCategory+
        "<br>Hasło: "+selectedWord+
        "<br>Oszust: "+impostors.map(i=>players[i]).join(", ");
}