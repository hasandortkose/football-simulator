import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ═══ SEO META INJECTION ═══ */
const injectSEO=()=>{try{document.title="Football Simulator - Online Futbol Menajer Oyunu | 36 Lig";
let m=document.querySelector('meta[name="description"]');if(!m){m=document.createElement("meta");m.name="description";document.head.appendChild(m)}m.content="Ücretsiz online futbol menajer simülasyonu. 36 lig, 600+ takım, 10.000+ oyuncu. Menajer ol, transfer yap, şampiyonluk kazan. Efsane futbolcu kariyeri oluştur.";
let k=document.querySelector('meta[name="keywords"]');if(!k){k=document.createElement("meta");k.name="keywords";document.head.appendChild(k)}k.content="futbol menajer oyunu, football simulator, online futbol oyunu, menajer kariyer, futbol simülasyon, ücretsiz futbol oyunu";
const og=[["og:title","Football Simulator - 36 Lig Futbol Menajer Oyunu"],["og:description","600+ takım, 10.000+ oyuncu ile futbol menajer simülasyonu. Ücretsiz oyna!"],["og:type","website"],["og:image","/og-image.png"],["twitter:card","summary_large_image"]];
og.forEach(([p,c])=>{let t=document.querySelector(`meta[property="${p}"]`)||document.querySelector(`meta[name="${p}"]`);if(!t){t=document.createElement("meta");t.setAttribute(p.startsWith("twitter")?"name":"property",p);document.head.appendChild(t)}t.content=c});
const schema=document.createElement("script");schema.type="application/ld+json";schema.text=JSON.stringify({"@context":"https://schema.org","@type":"VideoGame","name":"Football Simulator","description":"Online futbol menajer simülasyonu","genre":"Sports Simulation","numberOfPlayers":1,"operatingSystem":"Web Browser","applicationCategory":"Game","offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"}});
if(!document.querySelector('script[type="application/ld+json"]'))document.head.appendChild(schema)}catch(e){}};

/* ═══ SAVE/LOAD SYSTEM ═══ */
const SAVE_KEY="football_sim_save";
const saveGame=(data)=>{try{const json=JSON.stringify(data);localStorage.setItem(SAVE_KEY,json);return true}catch(e){console.warn("Save failed:",e);return false}};
const loadGame=()=>{try{const json=localStorage.getItem(SAVE_KEY);return json?JSON.parse(json):null}catch(e){return null}};
const deleteSave=()=>{try{localStorage.removeItem(SAVE_KEY)}catch(e){}};
const hasSave=()=>{try{return!!localStorage.getItem(SAVE_KEY)}catch(e){return false}};

/* ═══ RESPONSIVE HELPERS ═══ */
const useWindowSize=()=>{const[s,setS]=useState({w:typeof window!=="undefined"?window.innerWidth:1200,h:typeof window!=="undefined"?window.innerHeight:800});
useEffect(()=>{const h=()=>setS({w:window.innerWidth,h:window.innerHeight});window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);return s};

/* ═══ THEME ═══ */
const T={bg:"#1a1040",bg2:"#231555",bg3:"#2d1d6b",panel:"#1e1250",sidebar:"#150d38",header:"#2a1a65",glass:"rgba(30,18,80,.7)",gb:"rgba(140,120,255,.12)",cy:"#a78bfa",li:"#4ade80",go:"#fbbf24",warn:"#fb923c",red:"#f87171",tx:"#f1f0f8",tx2:"#c8c4d8",txd:"#8b85a8",font:"'Segoe UI',system-ui,sans-serif",accent:"#8b5cf6",pink:"#f472b6",blue:"#60a5fa",card:"#251760",cardHover:"#2f1d75"};
const G=(e={})=>({background:T.panel,border:`1px solid ${T.gb}`,borderRadius:10,...e});
const gc=n=>({"Galatasaray":["#FFC72C","#A8001C"],"Fenerbahçe":["#FFED00","#00308F"],"Beşiktaş":["#ccc","#1a1a2e"],"Trabzonspor":["#8B0000","#003DA5"],"Real Madrid":["#FEBE10","#00529F"],"Barcelona":["#A50044","#004D98"],"Bayern München":["#DC052D","#0066B2"],"Manchester City":["#6CABDD","#1C2C5B"],"Arsenal":["#EF0107","#063672"],"Liverpool":["#C8102E","#00B2A9"],"Inter Milan":["#009BDB","#0a0f1e"],"PSG":["#004170","#DA291C"],"Ajax":["#D2122E","#eee"],"Celtic":["#016938","#eee"],"Benfica":["#FF0000","#eee"],"Porto":["#003FA2","#eee"]}[n]||[T.cy,"#1e2040"]);
const fV=v=>v>=1e6?`€${(v/1e6).toFixed(1)}M`:v>=1e3?`€${(v/1e3).toFixed(0)}K`:`€${v}`;
const MO=["Ağu","Eyl","Eki","Kas","Ara","Oca","Şub","Mar","Nis","May"];
const PC={GK:"#f59e0b",DEF:"#3b82f6",MID:"#22c55e",FWD:"#ef4444"};
const rn=(a,b)=>a+~~(Math.random()*(b-a+1));
const WE=[{id:"sunny",i:"☀️",m:1},{id:"rainy",i:"🌧️",m:.95},{id:"snowy",i:"❄️",m:.9},{id:"windy",i:"💨",m:.97}];

/* ═══ NAMES (50 per country) ═══ */
const NM={turkey:{f:["Ali","Mehmet","Emre","Burak","Hakan","Kerem","Arda","Yusuf","Cenk","Ozan","Enes","İrfan","Halil","Umut","Serdar","Uğurcan","Kaan","Taylan","Berkan","Orkun","Cengiz","Dorukhan","Altay","Deniz","Batuhan","Ertuğrul","Furkan","Gökhan","İsmail","Koray","Mert","Nuri","Onur","Selim","Tarık","Volkan","Yasin","Barış","Ceyhun","Eren","Fatih","Güneş","Hamza","Kağan","Levent","Doğan","Bora","Can","Adem","Sefa"],l:["Yılmaz","Demir","Kaya","Çelik","Şahin","Arslan","Koç","Aydın","Tosun","Kabak","Ünal","Ünder","Söyüncü","Demiral","Akgün","Karaman","Çalhanoğlu","Yazıcı","Aktürkoğlu","Güler","Öztürk","Yıldırım","Polat","Korkmaz","Dursun","Bulut","Toprak","Aksoy","Bayrak","Çetin","Elmas","Güneş","Işık","Kaplan","Kurt","Özkan","Soylu","Turan","Uzun","Yavuz","Ateş","Başar","Ceylan","Dinç","Erkan","Genç","Kılıç","Tekin","Bozkurt","Acar"]},spain:{f:["Carlos","Diego","Sergio","Álvaro","Marco","Pablo","Dani","Pedri","Gavi","Rodri","Unai","Joselu","Bryan","Álex","Iker","Mikel","Ander","Fermín","Nico","Lamine","Hugo","Adrián","Borja","César","David","Enrique","Fabián","Gonzalo","Héctor","Iván","Javier","Lucas","Manuel","Nacho","Óscar","Pau","Raúl","Samuel","Tomás","Víctor","Alberto","Cristóbal","Eduard","Felipe","Germán","Ismael","Jaime","Kike","Luis","Mateo"],l:["García","Martínez","López","Hernández","Moreno","Ruiz","Torres","Ramos","Olmo","Williams","Morata","Carvajal","Cucurella","Díaz","Fernández","Gil","Navas","Grimaldo","Merino","Laporte","Álvarez","Blanco","Campos","Delgado","Flores","Gómez","Herrera","Iglesias","Jiménez","León","Marín","Navarro","Ortega","Pardo","Reyes","Sánchez","Vargas","Zamora","Aguilar","Benítez","Caballero","Domínguez","Espinosa","Fuentes","Gallego","Quintero","Tejada","Urbano","Yuste","Mendoza"]},germany:{f:["Leon","Thomas","Joshua","Florian","Kai","Timo","Leroy","Ilkay","Julian","Jamal","Chris","Kevin","Lukas","Jonas","David","Robin","Antonio","Hans","Erik","Deniz","Finn","Luca","Niklas","Philipp","Tim","Alexander","Benjamin","Christoph","Daniel","Emil","Felix","Georg","Henrik","Jan","Konstantin","Lars","Marvin","Nils","Oliver","Patrick","Sebastian","Tobias","Uwe","Vincent","Werner","Bastian","Cedric","Maximilian","Rafael","Yannick"],l:["Müller","Schmidt","Weber","Fischer","Neuer","Kimmich","Havertz","Sané","Wirtz","Musiala","Füllkrug","Rüdiger","Tah","Brandt","Hofmann","Koch","Richter","Klein","Wolf","Gündogan","Bauer","Berg","Braun","Dietrich","Ernst","Frank","Gross","Hartmann","Jäger","Krause","Lang","Mayer","Nagel","Otto","Pfeiffer","Roth","Schulz","Stein","Voss","Winkler","Adler","Conrad","Dreyer","Engel","Falk","Geiger","Hahn","Keller","Lorenz","Brückner"]},england:{f:["James","Harry","Mason","Phil","Jack","Marcus","Bukayo","Jude","Declan","John","Luke","Kyle","Jordan","Trent","Aaron","Ollie","Cole","Eberechi","Kobbie","Raheem","Ben","Charlie","Daniel","Edward","George","Henry","Isaac","Joe","Kieran","Liam","Max","Nathan","Oscar","Patrick","Reece","Sam","Thomas","Will","Alfie","Bradley","Callum","Dylan","Ethan","Finley","Harvey","Jacob","Kai","Leo","Morgan","Freddie"],l:["Smith","Palmer","Foden","Bellingham","Saka","Rice","Kane","Grealish","Stones","Walker","Rashford","Pickford","Shaw","Watkins","Gordon","Mainoo","Sterling","Wilson","Taylor","Brown","Adams","Baker","Clark","Davis","Edwards","Fisher","Green","Harris","Jackson","King","Lewis","Martin","Nelson","Owen","Parker","Quinn","Robinson","Scott","Turner","Ward","Young","Allen","Brooks","Campbell","Dixon","Elliott","Fox","Grant","Hunt","Knight","James"]},italy:{f:["Marco","Andrea","Federico","Lorenzo","Nicolo","Matteo","Gianluca","Leonardo","Sandro","Ciro","Simone","Moise","Riccardo","Paolo","Giovanni","Davide","Domenico","Danilo","Roberto","Rafael","Alberto","Bruno","Carlo","Diego","Emanuele","Fabio","Giorgio","Luca","Massimo","Pietro","Salvatore","Vincenzo","Antonio","Claudio","Enrico","Filippo","Giuseppe","Luigi","Stefano","Tommaso","Alessio","Cristian","Edoardo","Franco","Giacomo","Mario","Sergio","Valerio","Nino","Ignazio"],l:["Rossi","Bianchi","Ferrari","Russo","Barella","Chiesa","Donnarumma","Bastoni","Tonali","Pellegrini","Immobile","Scamacca","Jorginho","Frattesi","Retegui","Colombo","Romano","Ricci","Greco","Bruno","Amato","Benedetti","Conti","De Luca","Esposito","Ferrara","Galli","Leone","Mancini","Napoli","Palmieri","Rinaldi","Santoro","Testa","Vitale","Bellini","Caputo","Ferretti","Grassi","Longo","Martini","Neri","Orlando","Parisi","Riva","Sala","Serra","Totti","Verdi","De Marco"]},france:{f:["Antoine","Kylian","Ousmane","Hugo","Raphaël","Theo","Jules","Aurélien","Eduardo","Kingsley","Olivier","Marcus","Mike","Dayot","Ibrahima","Moussa","Mattéo","Bradley","Pierre","Jean","Alexandre","Baptiste","Clément","Dimitri","Étienne","Florian","Gaël","Julien","Karim","Loïc","Maxime","Nicolas","Patrice","Quentin","Romain","Sébastien","Thierry","Valentin","Adrien","Blaise","Cédric","Damien","Éric","Franck","Guillaume","Jérôme","Kévin","Mathieu","Hervé","Ismaël"],l:["Mbappé","Griezmann","Dembélé","Lloris","Konaté","Upamecano","Tchouaméni","Camavinga","Thuram","Giroud","Coman","Maignan","Barcola","Martin","Moreau","Laurent","Simon","Lefebvre","Leroy","Varane","Blanc","Collet","Dubois","Fabre","Garnier","Henry","Jacques","Lambert","Marchand","Noël","Perrin","Richard","Thomas","Vincent","Andre","Bonnet","Chevalier","Deschamps","Fontaine","Germain","Hubert","Jobert","Klein","Legrand","Moulin","Olivier","Picard","Renard","Sauvage","Tessier"]},netherlands:{f:["Virgil","Frenkie","Memphis","Cody","Denzel","Nathan","Xavi","Marten","Wout","Tijjani","Teun","Donyell","Brian","Jurriën","Micky","Joey","Jan","Pieter","Davy","Kenneth","Arjen","Bas","Dirk","Frank","Guus","Henk","Jeroen","Klaas","Luuk","Marco","Nick","Quincy","Rick","Stefan","Thijs","Wesley","Daan","Sven","Ruud","Jasper","Owen","Florian","Gijs","Hidde","Jens","Lars","Mitchel","Noa","Clarence","Edgar"],l:["Van Dijk","De Jong","De Ligt","Gakpo","Dumfries","Ake","Bergwijn","Koopmeiners","Weghorst","Simons","Frimpong","Reijnders","Brobbey","Timber","Malen","Gravenberch","Veerman","Schouten","Maatsen","Zirkzee","Bakker","De Boer","Dekker","Jansen","De Vrij","Vos","Smit","Mulder","Bos","Visser","De Graaf","Peters","Meijer","Hendriks","Dijkstra","Vermeer","Willems","De Haan","Kramer","Scholten","Postma","Kuiper","Van Dam","Brouwer","Jacobs","De Wit","Hoekstra","Van Beek","Van den Berg","Van Loon"]},scotland:{f:["Andrew","Scott","John","James","Billy","Kieran","Andy","Callum","Ryan","Lewis","Grant","Kenny","Liam","Jack","Aaron","Greg","Ross","Che","Tommy","Nathan","Angus","Blair","Craig","Duncan","Ewan","Fraser","Hamish","Iain","Keith","Malcolm","Neil","Rory","Stuart","Archie","Bruce","Colin","Douglas","Finlay","Gordon","Murray","Calum","Gavin","Logan","Magnus","Owen","Robbie","Sandy","Wallace","Brodie","Fergus"],l:["Robertson","McTominay","Tierney","McGinn","McGregor","Adams","Gilmour","McLean","Dykes","Porteous","Hendry","Gunn","Christie","Patterson","Hickey","McKenna","Ferguson","Morgan","Taylor","Brown","Campbell","Stewart","MacDonald","Murray","Fraser","Cameron","MacKay","MacLeod","Hamilton","Douglas","Graham","Wallace","Burns","Ross","Duncan","MacKenzie","Gordon","Sinclair","Henderson","Thomson","Crawford","Davidson","Fleming","Gallagher","Kerr","Lindsay","Maxwell","Ramsay","Mitchell","Boyd"]},switzerland:{f:["Yann","Granit","Xherdan","Remo","Manuel","Fabian","Denis","Breel","Ruben","Nico","Silvan","Renato","Kevin","Dan","Ardon","Cédric","Eray","Ricardo","Noah","Zeki","Adrian","Blerim","Djibril","Filip","Haris","Ivan","Joel","Loris","Mario","Pajtim","Samuele","Timm","Ulisses","Valentin","Albian","Becir","Dereck","Edon","Florent","Gaël","Hakan","Ilan","Jérémy","Kastriot","Léon","Michel","Nando","Okafor","Edimilson","Leonidas"],l:["Sommer","Xhaka","Shaqiri","Freuler","Akanji","Schär","Embolo","Vargas","Elvedi","Sow","Ndoye","Jashari","Zuber","Fernandes","Cömert","Rieder","Okafor","Amdouni","Garcia","Steffen","Benito","Fassnacht","Hefti","Imeri","Kobel","Lotomba","Mvogo","Ngamaleu","Omlin","Petkovic","Rodriguez","Seferovic","Stocker","Widmer","Zakaria","Zesiger","Berardi","Frei","Gavranovic","Hitz","Kasami","Lichtsteiner","Mehmedi","Mbabu","Behrami","Djourou","Inler","Klose","Crnogorcevic","Djuricin"]},greece:{f:["Giorgos","Kostas","Dimitris","Vangelis","Petros","Christos","Manolis","Tasos","Konstantinos","Lazaros","Marios","Dimitrios","Georgios","Andreas","Fotis","Spyros","Orestis","Thanasis","Sokratis","Anastasios","Alexandros","Vassilis","Nikos","Panagiotis","Stavros","Ioannis","Leonidas","Michalis","Panos","Theodoros","Angelos","Charalampos","Dionysis","Grigoris","Ilias","Kosmas","Lampros","Markos","Nikolaos","Pavlos","Stefanos","Thanos","Achilleas","Athanasios","Evangelos","Filippos","Haris","Efthymios","Vlasios","Chrysovalantis"],l:["Papadopoulos","Nikolaou","Mavropanos","Bakasetas","Fortounis","Tsimikas","Giannoulis","Pelkas","Siopis","Kourbelis","Vlachodimos","Ioannidis","Pavlidis","Baldock","Bouchalakis","Galanopoulos","Tzolakis","Rota","Masouras","Mantalos","Alexiou","Christodoulou","Diamantis","Economou","Fotopoulos","Georgiou","Kalogeropoulos","Lazaridis","Makris","Nikolaidis","Papanikolaou","Raptis","Samaras","Theodoridis","Vasileiou","Xenakis","Zachariadis","Angelopoulos","Daskalakis","Giannopoulos","Karamanlis","Leventis","Mitropoulos","Ntouskos","Papadimitriou","Stamatis","Hatzitheodorou","Efstathiou","Ioannidou","Bakoyannis"]},belgium:{f:["Kevin","Romelu","Thibaut","Axel","Yannick","Leandro","Amadou","Charles","Hans","Timothy","Youri","Thorgan","Thomas","Zeno","Dodi","Arthur","Orel","Johan","Aster","Lois","Adnan","Birger","Divock","Elias","Florian","Guillaume","Hendrik","Jelle","Koen","Laurent","Michy","Nacer","Pieter","Radja","Stef","Wout","Arnaut","Brandon","Dennis","Ferran","Gianni","Hugo","Jannes","Koni","Loïs","Maxime","Noa","Ritchie","Chadli","Ilombe"],l:["De Bruyne","Lukaku","Courtois","Witsel","Trossard","Onana","Doku","De Ketelaere","Vanaken","Castagne","Tielemans","Meunier","Debast","Theate","Mangala","Vermeeren","Openda","Bakayoko","Vranckx","Faes","Alderweireld","Benteke","Carrasco","Dendoncker","Engels","Fellaini","Hazard","Januzaj","Kompany","Lestienne","Mertens","Nainggolan","Praet","Saelemaekers","Vertonghen","Boyata","Defour","Gillet","Hubert","Lombaerts","Mirallas","Origi","Pocognoli","Simons","Vanden Borre","Wilmots","Chadli","Ferreira","Batshuayi","Carrasco"]},portugal:{f:["Cristiano","Bruno","Bernardo","Diogo","Rafael","Rúben","Gonçalo","Vitinha","João","Nuno","Pedro","Francisco","William","Danilo","Renato","André","José","Nélson","Ricardo","Fábio","Adrien","Cédric","Eduardo","Gelson","Hélder","Luis","Miguel","Otávio","Paulo","Rafa","Sérgio","Tiago","Vítor","Beto","Carlos","Domingos","Éder","Florentino","Gedson","Henrique","Ivo","Kevin","Leonardo","Marcos","Paulinho","Raphael","Simão","Tomás","Ivan","André"],l:["Fernandes","Silva","Santos","Costa","Pereira","Oliveira","Dias","Jota","Cancelo","Mendes","Leão","Ramos","Neves","Carvalho","Palhinha","Neto","Félix","Conceição","Dalot","Inácio","Almeida","Barbosa","Cunha","Duarte","Esteves","Fonseca","Gomes","Henriques","Lopes","Machado","Nogueira","Pinto","Queiroz","Ribeiro","Sousa","Tavares","Vieira","Abreu","Borges","Coelho","Ferreira","Guerreiro","Horta","Matos","Nascimento","Paiva","Rodrigues","Semedo","Teixeira","Veríssimo"]}};
function genName(ck){const p=NM[ck]||NM.england;return`${p.f[rn(0,p.f.length-1)]} ${p.l[rn(0,p.l.length-1)]}`}
function genUName(ck,u){let n,t=0;do{n=genName(ck);t++}while(u.has(n)&&t<50);u.add(n);return n}
function nRat(m=65,s=12){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.max(40,Math.min(95,Math.round(m+Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)*s)))}
function gAge(p){if(p==="GK")return rn(20,37);const r=Math.random();return r<.35?rn(17,22):r<.7?rn(23,28):r<.9?rn(29,33):rn(34,38)}

/* ═══ LEAGUES ═══ */
const C2={turkey:["Ankara Gücü","İzmirspor","Bursaspor","Mersin İdman","Eskişehirspor","Denizlispor","Boluspor","Elazığspor","Manisaspor","Afjet Afyon","Muğlaspor","Çorumspor","Tokatspor","Giresunspor","Düzcespor","Kırıkkalespor"],spain:["Zaragoza","Valladolid","Levante","Sp.Gijón","Albacete","Tenerife","Huesca","Burgos","Leganés","Eibar","Castellón","Córdoba","Racing","Eldense","Amorebieta","Ferrol"],germany:["Nürnberg","Hannover","Kaiserslautern","Paderborn","Magdeburg","Rostock","Braunschweig","Elversberg","Schalke","Hamburg","Hertha","Karlsruher","Gr.Fürth","Osnabrück","Wiesbaden","Regensburg"],england:["Leicester","Southampton","Leeds","Norwich","Sunderland","Coventry","Middlesbrough","Swansea","Watford","Stoke","Hull","Millwall","Blackburn","Ipswich","Plymouth","QPR"],italy:["Parma","Palermo","Como","Venezia","Bari","Catanzaro","Cremonese","Modena","Brescia","Sampdoria","Reggiana","Pisa","Spezia","Südtirol","Cosenza","Ascoli"],france:["Saint-Étienne","Caen","Bordeaux","Bastia","Guingamp","Laval","Valenciennes","Amiens","Annecy","Auxerre","Rodez","Troyes","Pau","Sochaux","Grenoble","Dijon"],netherlands:["Willem II","NAC Breda","Cambuur","Emmen","Den Bosch","Dordrecht","Helmond","Telstar","De Graafschap","Roda JC","MVV","FC Eindhoven","ADO Den Haag","Heracles","VVV Venlo","Jong Ajax"],scotland:["Dundee","Partick","Queen's Park","Airdrie","Raith","Arbroath","Cove Rangers","Falkirk","Dunfermline","Hamilton","Morton","Inverness"],switzerland:["Thun","Aarau","Schaffhausen","Bellinzona","Nyonnais","Kriens","Vaduz","Wil","Xamax","Münsingen","Baden","Breitenrain"],greece:["Ergotelis","Panserraikos","Kavala","Apollon","Chania","Diagoras","Panachaiki","Trikala","Panaitolikos","Levadiakos","Olymp.Volos","Pierikos"],belgium:["Beerschot","Lommel","Lierse","Deinze","Virton","Mouscron","Waasland","Tubize","Francs Borains","Seraing","Patro Eisden","La Louvière","Club NXT","Lokeren","Roeselare","Tienen"],portugal:["Leixões","Penafiel","Tondela","Académica","Nacional","Mafra","Feirense","Oliveirense","Covilhã","Ac.Viseu","Paços","D.Aves","Alverca","Felgueiras","Sp.Covilhã","Oriental"]};
const C3={turkey:["Tarsus İdman","Erzurum FK","Diyarbakır","Kahramanmaraş","Uşakspor","Ispartaspor","Nevşehir","Kars 36","Iğdır FK","Şırnak Spor","Bitlis Öz","Artvin Hopa","Çankırı FK","Rize Çamlı"],spain:["Ponferradina","Alcorcón","Lugo","Mirandés","Cartagena","Andorra FC","Hércules","Algeciras","Sestao","Linense","Talavera","Linares","Marbella","Recreativo"],germany:["Aue","Dresden","Saarbrücken","Ingolstadt","Duisburg","Mannheim","Unterhaching","Verl","Meppen","Essen","Lübeck","Zwickau","Bayreuth","Sandhausen"],england:["Cardiff","Bristol City","Rotherham","Wigan","Preston","Birmingham","Reading","Huddersfield","Barnsley","Charlton","Bolton","Peterborough","Shrewsbury","Port Vale"],italy:["Feralpi","Perugia","Reggina","Benevento","Catania","Avellino","Messina","Taranto","Crotone","Siena","Novara","Alessandria","Ancona","Foggia"],france:["Quevilly","Concarneau","Nancy","Niort","Dunkerque","Châteauroux","Sedan","Orléans","Villefranche","Avranches","Versailles","Martigues","Red Star","Bourg-P."],netherlands:["Jong PSV","Jong AZ","Jong Utrecht","Oss FC","Wageningen","Zeist","Roosendaal","Arnhem FC","Deventer","Leeuwarden","Almelo FC","Zutphen","Doetinchem","Venray"],scotland:["Ayr United","Queen of South","Montrose","Stenhousemuir","Alloa","Clyde","Dumbarton","Peterhead","Stirling","Kelty Hearts","Annan","Elgin City"],switzerland:["Langenthal","Bulle","Rapperswil","Solothurn","Emmenbrücke","Brig","Delémont","Monthey","Naters","Chiasso","Cham","Black Stars"],greece:["Niki Volos","AO Trikala","Ethnikos","Doxa Dramas","Makedonikos","Fokikos","Veria","Olymp.Kymi","AE Larissa","Iraklis","Kallithea","Anag.Karditsa"],belgium:["Lyra-Lierse","Heist","Hamme","Dessel","Mandel Utd","Hoogstraten","Knokke","Rupel Boom","Witgoor","Bocholter","Thes Sport","Wezet","Verviers","RFC Liège"],portugal:["Real SC","Vilaverdense","Coimbrões","Beira-Mar","V.Setúbal","Sanjoanense","Amora","Anadia","Praiense","Lusitano","Fontinhas","Olhanense","Torreense","E.Lagos"]};

function bLg(){const cd={turkey:{n:"Türkiye",f:"🇹🇷",q:6,t1:[{n:"Galatasaray",s:88},{n:"Fenerbahçe",s:87},{n:"Beşiktaş",s:83},{n:"Trabzonspor",s:80},{n:"Başakşehir",s:76},{n:"Adana Demir",s:74},{n:"Antalyaspor",s:72},{n:"Konyaspor",s:71},{n:"Sivasspor",s:70},{n:"Alanyaspor",s:70},{n:"Kasımpaşa",s:69},{n:"Kayserispor",s:67},{n:"Samsunspor",s:68},{n:"Hatayspor",s:66},{n:"Gaziantep",s:67},{n:"Rizespor",s:65},{n:"Pendikspor",s:63},{n:"İstanbulspor",s:62}]},spain:{n:"İspanya",f:"🇪🇸",q:10,t1:[{n:"Real Madrid",s:95},{n:"Barcelona",s:94},{n:"Atlético",s:88},{n:"R.Sociedad",s:83},{n:"Villarreal",s:82},{n:"Ath.Bilbao",s:81},{n:"Real Betis",s:80},{n:"Sevilla",s:79},{n:"Valencia",s:77},{n:"Osasuna",s:74},{n:"Celta Vigo",s:73},{n:"Getafe",s:72},{n:"Girona",s:78},{n:"Rayo",s:72},{n:"Mallorca",s:71},{n:"Las Palmas",s:70},{n:"Alavés",s:68},{n:"Cádiz",s:66},{n:"Granada",s:65},{n:"Almería",s:64}]},germany:{n:"Almanya",f:"🇩🇪",q:9,t1:[{n:"Bayern München",s:94},{n:"B.Dortmund",s:88},{n:"RB Leipzig",s:85},{n:"B.Leverkusen",s:87},{n:"E.Frankfurt",s:80},{n:"Stuttgart",s:81},{n:"Wolfsburg",s:77},{n:"Freiburg",s:78},{n:"Hoffenheim",s:76},{n:"M'gladbach",s:76},{n:"Union Berlin",s:75},{n:"W.Bremen",s:74},{n:"Mainz",s:73},{n:"Augsburg",s:71},{n:"Köln",s:72},{n:"Heidenheim",s:70},{n:"Darmstadt",s:65},{n:"Bochum",s:66}]},england:{n:"İngiltere",f:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",q:10,t1:[{n:"Manchester City",s:95},{n:"Arsenal",s:92},{n:"Liverpool",s:91},{n:"Chelsea",s:85},{n:"Man United",s:84},{n:"Tottenham",s:83},{n:"Newcastle",s:84},{n:"Brighton",s:80},{n:"Aston Villa",s:82},{n:"West Ham",s:78},{n:"Crystal Palace",s:75},{n:"Brentford",s:76},{n:"Fulham",s:75},{n:"Wolves",s:74},{n:"Everton",s:73},{n:"Nott.Forest",s:73},{n:"Bournemouth",s:72},{n:"Luton",s:67},{n:"Burnley",s:68},{n:"Sheffield U",s:66}]},italy:{n:"İtalya",f:"🇮🇹",q:9,t1:[{n:"Inter Milan",s:91},{n:"AC Milan",s:86},{n:"Juventus",s:87},{n:"Napoli",s:88},{n:"Roma",s:83},{n:"Lazio",s:82},{n:"Atalanta",s:84},{n:"Fiorentina",s:79},{n:"Bologna",s:78},{n:"Torino",s:75},{n:"Monza",s:73},{n:"Genoa",s:72},{n:"Udinese",s:74},{n:"Lecce",s:70},{n:"Cagliari",s:70},{n:"Empoli",s:69},{n:"Sassuolo",s:71},{n:"Frosinone",s:66},{n:"Verona",s:68},{n:"Salernitana",s:64}]},france:{n:"Fransa",f:"🇫🇷",q:8,t1:[{n:"PSG",s:93},{n:"Marseille",s:83},{n:"Monaco",s:82},{n:"Lyon",s:80},{n:"Lille",s:80},{n:"Nice",s:78},{n:"Rennes",s:77},{n:"Lens",s:79},{n:"Strasbourg",s:74},{n:"Montpellier",s:73},{n:"Toulouse",s:73},{n:"Nantes",s:72},{n:"Reims",s:72},{n:"Brest",s:74},{n:"Le Havre",s:68},{n:"Metz",s:67},{n:"Lorient",s:68},{n:"Clermont",s:66}]},netherlands:{n:"Hollanda",f:"🇳🇱",q:7,t1:[{n:"PSV",s:86},{n:"Ajax",s:85},{n:"Feyenoord",s:84},{n:"AZ",s:78},{n:"Twente",s:76},{n:"Utrecht",s:74},{n:"Vitesse",s:72},{n:"Heerenveen",s:71},{n:"Groningen",s:69},{n:"Sparta R.",s:70},{n:"NEC",s:70},{n:"Go Ahead",s:68},{n:"F.Sittard",s:67},{n:"RKC",s:66},{n:"Excelsior",s:64},{n:"Almere",s:63},{n:"PEC Zwolle",s:65},{n:"Volendam",s:62}]},scotland:{n:"İskoçya",f:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",q:4,t1:[{n:"Celtic",s:82},{n:"Rangers",s:81},{n:"Aberdeen",s:70},{n:"Hibernian",s:68},{n:"Hearts",s:69},{n:"Dundee U",s:66},{n:"St.Mirren",s:65},{n:"Kilmarnock",s:65},{n:"Motherwell",s:64},{n:"Ross County",s:62},{n:"Livingston",s:62},{n:"St.Johnstone",s:63}]},switzerland:{n:"İsviçre",f:"🇨🇭",q:5,t1:[{n:"Young Boys",s:79},{n:"Basel",s:78},{n:"Zürich",s:73},{n:"Servette",s:72},{n:"Lugano",s:71},{n:"St.Gallen",s:70},{n:"Luzern",s:69},{n:"Sion",s:67},{n:"Winterthur",s:65},{n:"Grasshoppers",s:66},{n:"Yverdon",s:63},{n:"Lausanne",s:64}]},greece:{n:"Yunanistan",f:"🇬🇷",q:5,t1:[{n:"Olympiacos",s:80},{n:"PAOK",s:78},{n:"AEK Athens",s:77},{n:"Panathinaikos",s:76},{n:"Aris",s:72},{n:"Asteras",s:68},{n:"OFI Crete",s:67},{n:"Volos",s:66},{n:"Atromitos",s:66},{n:"Ionikos",s:64},{n:"Lamia",s:63},{n:"Giannina",s:64}]},belgium:{n:"Belçika",f:"🇧🇪",q:6,t1:[{n:"Club Brugge",s:83},{n:"Union SG",s:78},{n:"Anderlecht",s:79},{n:"Genk",s:78},{n:"Antwerp",s:77},{n:"Gent",s:76},{n:"Standard",s:73},{n:"Mechelen",s:71},{n:"Charleroi",s:70},{n:"Cercle Brugge",s:69},{n:"Westerlo",s:68},{n:"OH Leuven",s:67},{n:"Sint-Truiden",s:66},{n:"Kortrijk",s:65},{n:"Eupen",s:64},{n:"RWDM",s:63}]},portugal:{n:"Portekiz",f:"🇵🇹",q:8,t1:[{n:"Benfica",s:88},{n:"Porto",s:87},{n:"Sporting CP",s:86},{n:"Braga",s:80},{n:"Vitória SC",s:74},{n:"Gil Vicente",s:70},{n:"Boavista",s:70},{n:"Rio Ave",s:69},{n:"Casa Pia",s:69},{n:"Arouca",s:67},{n:"Estoril",s:68},{n:"Moreirense",s:67},{n:"Famalicão",s:68},{n:"Vizela",s:65},{n:"Chaves",s:64},{n:"Portimonense",s:63},{n:"E.Amadora",s:66},{n:"Farense",s:62}]}};
const a={};Object.entries(cd).forEach(([k,d])=>{a[`${k}_1`]={name:`${d.n} 1. Lig`,country:d.n,flag:d.f,q:d.q,tier:1,ck:k,teams:d.t1.map(t=>({name:t.n,str:t.s}))};const t2=C2[k]||[];a[`${k}_2`]={name:`${d.n} 2. Lig`,country:d.n,flag:d.f,q:Math.max(1,d.q-3),tier:2,ck:k,teams:t2.map(n=>({name:n,str:rn(58,75)}))};const t3=C3[k]||[];a[`${k}_3`]={name:`${d.n} 3. Lig`,country:d.n,flag:d.f,q:Math.max(1,d.q-5),tier:3,ck:k,teams:t3.map(n=>({name:n,str:rn(40,60)}))};});return a;}

/* ═══ ENGINE ═══ */
let gID=0;
/* ═══ REALISTIC VALUE ALGORITHM ═══ */
function calcValue(rating,age,pot,tierQ){
// Exponential base value curve (deterministic, not random)
// 40=€25K, 50=€100K, 60=€350K, 65=€1M, 70=€3M, 75=€8M, 80=€20M, 85=€45M, 90=€80M, 95=€120M
const r=Math.max(40,Math.min(99,Math.round(rating)));
const bv=Math.round(20000*Math.pow(1.155,r-40)); // ~20K at 40, ~€50M at 90, ~€150M at 95
// AgeFactor
const af=age<=22?1.4:age<=25?1.3:age<=28?1.15:age<=31?0.9:age<=33?.6:.3;
// PotentialFactor (capped, subtle)
const gap=Math.max(0,(pot||r)-r);const pf=1+Math.min(gap,20)*.012; // max 1.24x
// League tier multiplier
const tm=tierQ>=8?1.15:tierQ>=5?.9:tierQ>=3?.6:.4;
// Small variance (±10%)
const variance=.9+Math.random()*.2;
return Math.max(20000,~~(bv*af*pf*tm*variance))}

function valueGrowth(p,oldPwr){
// Called when rating increases
if(p.pwr<=oldPwr)return;
const jump=p.pwr-oldPwr;
let growthPct;
if(p.age<23)growthPct=.15+Math.random()*.1; // 15-25%
else if(p.age<28)growthPct=.08+Math.random()*.07; // 8-15%
else if(p.age<33)growthPct=.02+Math.random()*.03; // 2-5%
else growthPct=.01+Math.random()*.02; // 1-3%
p.value=~~(p.value*(1+growthPct*jump));
return growthPct*jump; // return total % for news
}

const ALL_CK=Object.keys(NM);
const NAT_FLAG={turkey:"🇹🇷",spain:"🇪🇸",germany:"🇩🇪",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",italy:"🇮🇹",france:"🇫🇷",netherlands:"🇳🇱",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",switzerland:"🇨🇭",greece:"🇬🇷",belgium:"🇧🇪",portugal:"🇵🇹"};
function gSq(ck,str,tierQ){const sq=[];const u=new Set();[{p:"GK",n:2},{p:"DEF",n:6},{p:"MID",n:6},{p:"FWD",n:4}].forEach(({p:pos,n})=>{for(let i=0;i<n;i++){
const isForeign=Math.random()<.3;const pCk=isForeign?ALL_CK[rn(0,ALL_CK.length-1)]:ck;
const nm=genUName(pCk,u);const age=gAge(pos);const rat=Math.max(40,Math.min(95,nRat(str,8)));
const pot=Math.min(99,rat+rn(0,age<23?20:10));
const value=calcValue(rat,age,pot,tierQ||5);
sq.push({id:gID++,name:nm,pos,age,value,goals:0,assists:0,yellows:0,reds:0,suspended:false,injured:false,forSale:false,team:null,pot,pwr:rat,streak:0,xp:0,nat:pCk})}});return sq}
function gFx(n){const t=[...n];if(t.length%2)t.push("BYE");const l=t.length,h=l/2,r=[];for(let i=0;i<l-1;i++){const m=[];for(let j=0;j<h;j++){const a=t[j],b=t[l-1-j];if(a!=="BYE"&&b!=="BYE")m.push({home:a,away:b,hg:null,ag:null,ev:[]})}r.push(m);const x=t.pop();t.splice(1,0,x)}return[...r,...r.map(rd=>rd.map(m=>({home:m.away,away:m.home,hg:null,ag:null,ev:[]})))];}
function poi(l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function pick(sq,ty){const av=sq.filter(p=>!p.suspended&&!p.injured);if(!av.length)return sq[0];if(ty==="g"||ty==="a"){const w=av.map(p=>p.pos==="FWD"?5:p.pos==="MID"?3:p.pos==="DEF"?1:.2);const t=w.reduce((a,b)=>a+b,0);let r=Math.random()*t;for(let i=0;i<av.length;i++){r-=w[i];if(r<=0)return av[i]}return av[av.length-1]}return av[~~(Math.random()*av.length)]}
function prP(hs,as,hS,aS,cM=1){const h=hs+4,a=as,t=h+a;const r={hg:Math.min(poi((h/t)*3),9),ag:Math.min(poi((a/t)*2.6),9)};const ev=[],um=new Set();const rm=()=>{let m;do{m=rn(1,90)}while(um.has(m));um.add(m);return m};for(let i=0;i<r.hg;i++){const s=pick(hS,"g"),a2=pick(hS.filter(p=>p.id!==s.id),"a");ev.push({type:"goal",team:"home",player:s.name,pid:s.id,assist:a2?.name,aid:a2?.id,minute:rm()})}for(let i=0;i<r.ag;i++){const s=pick(aS,"g"),a2=pick(aS.filter(p=>p.id!==s.id),"a");ev.push({type:"goal",team:"away",player:s.name,pid:s.id,assist:a2?.name,aid:a2?.id,minute:rm()})}const ny=~~((2+rn(0,3))*cM);for(let i=0;i<ny;i++){const ih=Math.random()>.5,sq=ih?hS:aS,p=pick(sq,"c");ev.push({type:"yellow",team:ih?"home":"away",player:p.name,pid:p.id,minute:rm()})}if(Math.random()<.12*cM){const ih=Math.random()>.5,sq=ih?hS:aS,p=pick(sq,"c");ev.push({type:"red",team:ih?"home":"away",player:p.name,pid:p.id,minute:rm()})}ev.sort((a,b)=>a.minute-b.minute);return{...r,events:ev}}
function aEv(ev,hN,aN,sqs){const hS=sqs[hN],aS=sqs[aN];if(!hS||!aS)return;ev.forEach(e=>{const sq=e.team==="home"?hS:aS,p=sq.find(x=>x.id===e.pid);if(!p)return;if(e.type==="goal"){p.goals++;p.streak++;p.xp=(p.xp||0)+1;const a2=sq.find(x=>x.id===e.aid);if(a2){a2.assists++;a2.xp=(a2.xp||0)+.5}}if(e.type==="yellow")p.yellows++;if(e.type==="red"){p.reds++;p.suspended=true}})}
function clS(sqs,addSocialFn){Object.values(sqs).forEach(sq=>{if(!Array.isArray(sq))return;sq.forEach(p=>{if(p.suspended)p.suspended=false;if(p.injured&&Math.random()<.4)p.injured=false;
// Dynamic potential (very rare, only for exceptional young performers)
if(p.age<=23&&Math.random()<.02){const perf=(p.goals||0)+(p.assists||0)*.5;if(perf>=5&&p.pot<95)p.pot=Math.min(95,p.pot+1);if(p.isMyPlayer&&perf>=3&&p.pot<97)p.pot=Math.min(97,p.pot+1)}
// Development: very slow, realistic (~0.05-0.15 per week max)
const oldPwr=p.pwr;const gap=(p.pot||p.pwr)-p.pwr;if(gap>0){
const ageRate=p.age<=20?.012:p.age<=23?.008:p.age<=27?.004:p.age<=30?.001:0;
const perfBonus=(p.goals||0)*.002+(p.assists||0)*.001;
const weekGrowth=Math.min(.15,gap*(ageRate+perfBonus));
// Only grow sometimes, not every week
if(Math.random()<.6)p.pwr=Math.min(p.pot,Math.round((p.pwr+weekGrowth)*100)/100)}
// XP level up (much harder: 15 XP per +1)
if((p.xp||0)>=15){p.pwr=Math.min(p.pot||99,Math.round(p.pwr*10+1)/10);p.xp-=15}
// Aging decline (28+ subtle, 32+ real)
if(p.age>=32&&Math.random()<.2){p.pwr=Math.max(40,Math.round((p.pwr-.3)*100)/100);p.pot=Math.max(~~p.pwr,p.pot)}
else if(p.age>=28&&p.age<32&&Math.random()<.05){p.pwr=Math.max(40,Math.round((p.pwr-.1)*100)/100)}
// Value growth on rating increase
if(p.pwr>oldPwr){const pct=valueGrowth(p,oldPwr);
if(pct>.15&&addSocialFn)addSocialFn("hype",`📈 ${p.name} değeri %${~~(pct*100)} arttı! → ${fV(p.value)}`)}
// Weekly value volatility (minor)
let drift=(Math.random()-.5)*.008;if(p.goals>0)drift+=.005;if(p.age>32)drift-=.008;if(p.age<23)drift+=.004;
p.value=Math.max(20000,~~(p.value*(1+drift)));
// Performance bonus: 3+ streak = +8% form bonus
if(p.streak>=3){p.value=~~(p.value*1.08);p.streak=0}
// Sanity cap
const maxVal=calcValue(Math.round(p.pwr),p.age,p.pot,8)*2;
p.value=Math.min(p.value,maxVal)})})}
function cSt(ld,fx,wk){const t={};ld.teams.forEach(x=>{t[x.name]={name:x.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}});for(let w=0;w<wk;w++){if(!fx[w])continue;fx[w].forEach(m=>{if(m.hg===null)return;const h=t[m.home],a=t[m.away];if(!h||!a)return;h.p++;a.p++;h.gf+=m.hg;h.ga+=m.ag;a.gf+=m.ag;a.ga+=m.hg;if(m.hg>m.ag){h.w++;h.pts+=3;a.l++}else if(m.hg<m.ag){a.w++;a.pts+=3;h.l++}else{h.d++;h.pts++;a.d++;a.pts++}})}return Object.values(t).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf)}
function doPr(al,aFx,cW){const cts=new Set(Object.values(al).map(l=>l.ck));const ch=[];cts.forEach(ck=>{const[l1,l2,l3]=[1,2,3].map(t=>al[`${ck}_${t}`]);if(!l1||!l2)return;
const s1=cSt(l1,aFx[`${ck}_1`]||[],cW[`${ck}_1`]||0);const s2=cSt(l2,aFx[`${ck}_2`]||[],cW[`${ck}_2`]||0);
const origL1=l1.teams.length,origL2=l2.teams.length;
const swapN=Math.min(3,Math.floor(origL1/4),Math.floor(origL2/4));if(swapN<1)return;
const down1=s1.slice(-swapN).map(t=>t.name);const up2=s2.slice(0,swapN).map(t=>t.name);
const t1down=l1.teams.filter(t=>down1.includes(t.name));const t2up=l2.teams.filter(t=>up2.includes(t.name));
if(t1down.length!==t2up.length||t1down.length!==swapN)return;
down1.forEach(n=>ch.push({team:n,f:"1>2",dir:"d"}));up2.forEach(n=>ch.push({team:n,f:"2>1",dir:"u"}));
let t2down=[],t3up=[];
if(l3){const origL3=l3.teams.length;const s3=cSt(l3,aFx[`${ck}_3`]||[],cW[`${ck}_3`]||0);
const swapN2=Math.min(3,Math.floor(origL2/4),Math.floor(origL3/4));
if(swapN2>0){const down2=s2.slice(-swapN2).map(t=>t.name);const up3=s3.slice(0,swapN2).map(t=>t.name);
t2down=l2.teams.filter(t=>down2.includes(t.name));t3up=l3.teams.filter(t=>up3.includes(t.name));
if(t2down.length===t3up.length&&t2down.length===swapN2){down2.forEach(n=>ch.push({team:n,f:"2>3",dir:"d"}));up3.forEach(n=>ch.push({team:n,f:"3>2",dir:"u"}))}else{t2down=[];t3up=[]}}}
l1.teams=[...l1.teams.filter(t=>!down1.includes(t.name)),...t2up.map(t=>({...t,str:Math.min(t.str+3,95)}))];
const t2dN=t2down.map(x=>x.name);
l2.teams=[...l2.teams.filter(t=>!up2.includes(t.name)&&!t2dN.includes(t.name)),...t1down.map(t=>({...t,str:Math.max(t.str-3,40)})),...t3up.map(t=>({...t,str:Math.min(t.str+2,75)}))];
if(l3&&t2down.length>0){const t3uN=t3up.map(x=>x.name);l3.teams=[...l3.teams.filter(t=>!t3uN.includes(t.name)),...t2down.map(t=>({...t,str:Math.max(t.str-2,40)}))]}
});return ch}

/* ═══ MATCH SIM (compact broadcast) ═══ */
const TO=t=>[`${t} yükleniyor!`,`${t} golle burun buruna!`,`Şut ama direk!`];const TD=t=>[`${t} duvar ördü!`,`Kaleci devleşiyor!`];const TX=["VAR...","Sert müdahale!"];const TA=["Tempo yükseldi!","Herkes ayakta!"];
function MSV({hN,aN,hStr,aStr,hSq,aSq,onComplete,uT,cM}){
const[mn,setMn]=useState(0);const[hs,setHs]=useState(0);const[as2,setAs]=useState(0);const[tk,setTk]=useState([]);const[done,setDone]=useState(false);const[fl,setFl]=useState(null);const[bp,setBp]=useState({x:52.5,y:34});const[ga,setGa]=useState(null);const[sh,setSh]=useState(false);const[lt,setLt]=useState("balanced");const ltR=useRef("balanced");const[intro,setIntro]=useState(true);const[paused,setPaused]=useState(false);const pauseR=useRef(false);const[showStats,setShowStats]=useState(false);const[setPiece,setSetPiece]=useState(null);// "corner_h","corner_a","freekick_h","freekick_a","penalty_h","penalty_a"
const[plan]=useState(()=>{const p=prP(hStr,aStr,hSq||[],aSq||[],cM||1);
// Inject set pieces: corners, freekicks, penalties
const sp=[];const um=new Set(p.events.map(e=>e.minute));
for(let i=0;i<rn(4,8);i++){let m;do{m=rn(1,90)}while(um.has(m));um.add(m);const team=Math.random()>.5?"home":"away";const type=["corner","freekick","freekick","corner","corner"][rn(0,4)];sp.push({type,team,minute:m})}
// Rare penalty (10% chance)
if(Math.random()<.1){let m;do{m=rn(30,85)}while(um.has(m));um.add(m);const team=Math.random()>.5?"home":"away";const scored=Math.random()<.75;sp.push({type:"penalty",team,minute:m,scored});if(scored){p.events.push({type:"goal",team,player:pick(team==="home"?hSq:aSq,"g")?.name||"?",pid:0,minute:m});if(team==="home")p.hg++;else p.ag++}}
p.events.sort((a,b)=>a.minute-b.minute);p.setPieces=sp;return p});
const ref=useRef(null);let[hc1,hc2]=gc(hN);let[ac1,ac2]=gc(aN);if(hc1===ac1){ac1="#e5383b";ac2="#8b0000"}
const gP=(z,tc)=>{const ts=tc==="attack"?8:tc==="defend"?-8:0;const s=z==="hA"?12:z==="aA"?-12:z==="hG"?18:z==="aG"?-18:z==="corner_h"?15:z==="corner_a"?-15:0;return{h:[[12,50],[25,18],[25,38],[25,62],[25,82],[40,28],[40,50],[40,72],[55,22],[55,50],[55,78]].map(([x,y])=>[Math.min(92,Math.max(4,x+s+ts+rn(-2,2))),Math.min(94,Math.max(6,y+rn(-3,3)))]),a:[[88,50],[75,18],[75,38],[75,62],[75,82],[60,28],[60,50],[60,72],[45,22],[45,50],[45,78]].map(([x,y])=>[Math.min(96,Math.max(8,x+s+rn(-2,2))),Math.min(94,Math.max(6,y+rn(-3,3)))])}};
const[ps,setPs]=useState(()=>gP("mid","balanced"));
const hShots=useRef(0);const aShots=useRef(0);const hPoss=useRef(0);const aPoss=useRef(0);const hCorners=useRef(0);const aCorners=useRef(0);const hFouls=useRef(0);const aFouls=useRef(0);
useEffect(()=>{if(intro)setTimeout(()=>setIntro(false),2200)},[intro]);

// Ticker messages
const TK_ATK=t=>[`${t} hücuma kalkıyor!`,`${t} son çizgiye iniyor!`,`Uzun pas ${t} cephesine!`,`${t} ceza sahasına yaklaşıyor!`,`${t} tehlikeli geliyor!`];
const TK_DEF=t=>[`${t} araya giriyor!`,`Kaleci çıkış yaptı!`,`${t} topu uzaklaştırdı!`,`Savunma duvarı ${t}!`];
const TK_MID=[`Orta sahada mücadele!`,`Tempo yükseldi!`,`İkili mücadele!`,`Herkes ayakta!`,`Sert müdahale!`,`VAR kontrol ediyor...`];

useEffect(()=>{if(intro)return;let c=0;const ms=20000/90;const iv=setInterval(()=>{if(pauseR.current)return;c++;if(c>90){clearInterval(iv);setDone(true);return}setMn(c);let z="mid";
// Check set pieces
const sp=plan.setPieces?.filter(s=>s.minute===c)||[];sp.forEach(s=>{if(s.type==="corner"){
if(s.team==="home"){z="corner_h";hCorners.current++;setBp({x:100,y:rn(0,1)?2:66});setSetPiece("corner_h");setTimeout(()=>{setSetPiece(null);setBp({x:90+rn(0,5),y:25+rn(0,18)})},1200);setTk(t=>[...t,{id:Date.now()+.1,text:`🚩 ${c}' Köşe vuruşu — ${hN}`,tp:"info"}])}
else{aCorners.current++;setBp({x:5,y:rn(0,1)?2:66});z="corner_a";setSetPiece("corner_a");setTimeout(()=>{setSetPiece(null);setBp({x:10+rn(0,5),y:25+rn(0,18)})},1200);setTk(t=>[...t,{id:Date.now()+.1,text:`🚩 ${c}' Köşe vuruşu — ${aN}`,tp:"info"}])}}
if(s.type==="freekick"){const isH=s.team==="home";hFouls.current++;const fx=isH?65+rn(0,15):20+rn(0,15);setBp({x:fx,y:30+rn(0,8)});setSetPiece(isH?"fk_h":"fk_a");setTimeout(()=>setSetPiece(null),1500);if(isH)hShots.current++;else aShots.current++;setTk(t=>[...t,{id:Date.now()+.2,text:`🎯 ${c}' Serbest vuruş — ${isH?hN:aN}`,tp:"info"}])}
if(s.type==="penalty"){const isH=s.team==="home";setBp({x:isH?91:14,y:34});z=isH?"hG":"aG";setSetPiece(isH?"pen_h":"pen_a");setFl("⚠️ PENALTI!");setTimeout(()=>{setFl(null);setSetPiece(null);if(s.scored)setBp({x:isH?103:2,y:34})},1800);setTk(t=>[...t,{id:Date.now()+.3,text:`⚠️ ${c}' PENALTI! ${isH?hN:aN} — ${s.scored?"GOL!":"KAÇTI!"}`,tp:s.scored?"goal":"info"}])}});
// Check goals
const evs=plan.events.filter(e=>e.minute===c);evs.forEach(ev=>{const tn=ev.team==="home"?hN:aN;if(ev.type==="goal"){
// Ball enters net animation
const goalX=ev.team==="home"?103:2;const goalY=28+rn(0,12);
setBp({x:ev.team==="home"?92:13,y:30+rn(0,8)});setTimeout(()=>setBp({x:goalX,y:goalY}),400);
if(ev.team==="home"){setHs(s=>s+1);z="hG";hShots.current++}else{setAs(s=>s+1);z="aG";aShots.current++}
setGa(ev.team==="home"?"h":"a");setSh(true);setTimeout(()=>{setSh(false);setGa(null);setBp({x:52.5,y:34})},2500);
setFl("⚽ GOL!");setTimeout(()=>setFl(null),2e3);
setTk(t=>[...t,{id:Date.now(),text:`⚽ ${c}' GOL! ${ev.player} (${tn})${ev.assist?` | Asist: ${ev.assist}`:""}`,tp:"goal"}])}
else if(ev.type==="yellow"){hFouls.current++;setTk(t=>[...t,{id:Date.now()+1,text:`🟨 ${c}' ${ev.player} (${tn})`,tp:"yellow"}])}
else if(ev.type==="red"){setSh(true);setTimeout(()=>setSh(false),500);setTk(t=>[...t,{id:Date.now()+2,text:`🟥 ${c}' KIRMIZI KART! ${ev.player} (${tn})`,tp:"red"}])}});
// Normal play movement
if(!evs.length&&!sp.length){const r=Math.random();if(r<.3){z="hA";const bx=65+rn(0,25),by=10+rn(0,48);setBp({x:bx,y:by});hPoss.current++;if(Math.random()<.25)hShots.current++}else if(r<.6){z="aA";setBp({x:10+rn(0,25),y:10+rn(0,48)});aPoss.current++;if(Math.random()<.25)aShots.current++}else{setBp({x:30+rn(0,45),y:10+rn(0,48)});(Math.random()>.5?hPoss:aPoss).current++}}
setPs(gP(z,ltR.current));
// Ticker every 3-6 minutes
if(c%(3+rn(0,3))===0&&!evs.length&&!sp.length){const r2=Math.random();const at=z==="hA"?hN:z==="aA"?aN:(Math.random()>.5?hN:aN);const df=at===hN?aN:hN;
let msg;if(r2<.35)msg=TK_ATK(at)[rn(0,4)];else if(r2<.6)msg=TK_DEF(df)[rn(0,3)];else msg=TK_MID[rn(0,5)];
setTk(t=>[...t,{id:Date.now()+Math.random(),text:`${c}' — ${msg}`,tp:"info"}])}
// Half time
if(c===45)setTk(t=>[...t,{id:Date.now()+.5,text:`⏱️ 45' İLK YARI SONU`,tp:"info"}]);
if(c===46)setTk(t=>[...t,{id:Date.now()+.6,text:`⏱️ 46' İKİNCİ YARI BAŞLADI`,tp:"info"}])
},ms);return()=>clearInterval(iv)},[plan,hN,aN,intro]);
useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"})},[tk]);
const togglePause=()=>{setPaused(p=>{pauseR.current=!p;return!p})};
const chT=t=>{setLt(t);ltR.current=t;setTk(x=>[...x,{id:Date.now()+99,text:`📋 Taktik: ${t==="attack"?"HÜCUM":t==="defend"?"SAVUNMA":"DENGELİ"}`,tp:"info"}])};
const ec={goal:T.li,yellow:"#eab308",red:T.red};
const totalPoss=Math.max(1,hPoss.current+aPoss.current);const hPossP=~~(hPoss.current/totalPoss*100);

if(intro)return<div style={{position:"fixed",inset:0,zIndex:10000,background:`linear-gradient(160deg,${T.bg},${T.bg3},${T.bg})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font}}><style>{`@keyframes iz{0%{transform:scale(3);opacity:0}60%{transform:scale(1);opacity:1}}`}</style><div style={{animation:"iz 1.5s ease",textAlign:"center"}}><div style={{fontSize:42,fontWeight:900,color:T.accent,textShadow:`0 0 50px ${T.accent}60`,letterSpacing:".12em"}}>MAÇ BAŞLIYOR</div><div style={{marginTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:28}}><div style={{textAlign:"center"}}><div style={{width:60,height:60,borderRadius:12,background:`linear-gradient(135deg,${hc1},${hc2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",margin:"0 auto 6px",boxShadow:`0 6px 20px ${hc1}50`}}>{hN.charAt(0)}</div><div style={{fontSize:16,fontWeight:800,color:T.tx}}>{hN}</div></div><div style={{fontSize:30,fontWeight:900,color:T.go,textShadow:`0 0 20px ${T.go}40`}}>VS</div><div style={{textAlign:"center"}}><div style={{width:60,height:60,borderRadius:12,background:`linear-gradient(135deg,${ac1},${ac2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",margin:"0 auto 6px",boxShadow:`0 6px 20px ${ac1}50`}}>{aN.charAt(0)}</div><div style={{fontSize:16,fontWeight:800,color:T.tx}}>{aN}</div></div></div></div></div>;

if(done&&showStats)return<div style={{position:"fixed",inset:0,zIndex:10000,background:T.bg,fontFamily:T.font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
<div style={{maxWidth:520,width:"100%"}}>
<div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:11,color:T.txd,marginBottom:4}}>MAÇ SONU</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:28,height:28,borderRadius:4,background:`linear-gradient(135deg,${hc1},${hc2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>{hN.charAt(0)}</div><span style={{fontSize:14,fontWeight:800,color:T.tx}}>{hN}</span></div><span style={{fontSize:30,fontWeight:900,color:"#fff"}}>{hs} - {as2}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,fontWeight:800,color:T.tx}}>{aN}</span><div style={{width:28,height:28,borderRadius:4,background:`linear-gradient(135deg,${ac1},${ac2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>{aN.charAt(0)}</div></div></div></div>
{[{l:"Topa Sahip Olma",h:`${hPossP}%`,a:`${100-hPossP}%`,hv:hPossP},{l:"Toplam Şut",h:hShots.current,a:aShots.current,hv:hShots.current/(Math.max(1,hShots.current+aShots.current))*100},{l:"İsabetli Şut",h:plan.hg,a:plan.ag,hv:plan.hg/(Math.max(1,plan.hg+plan.ag))*100},{l:"Köşe Vuruşu",h:hCorners.current,a:aCorners.current,hv:hCorners.current/(Math.max(1,hCorners.current+aCorners.current))*100},{l:"Faul",h:hFouls.current,a:aFouls.current,hv:50}].map(s=><div key={s.l} style={{marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.tx2,marginBottom:3}}><span style={{fontWeight:700,minWidth:30}}>{s.h}</span><span style={{color:T.txd,fontSize:10}}>{s.l}</span><span style={{fontWeight:700,minWidth:30,textAlign:"right"}}>{s.a}</span></div>
<div style={{display:"flex",height:5,borderRadius:3,overflow:"hidden",gap:1}}><div style={{width:`${s.hv}%`,background:hc1,borderRadius:3}}/><div style={{flex:1,background:ac1,borderRadius:3}}/></div></div>)}
<div style={{marginTop:12,background:T.bg3,borderRadius:6,padding:10}}>
<div style={{fontSize:10,fontWeight:700,color:T.cy,marginBottom:6}}>OLAYLAR</div>
{plan.events.map((e,i)=><div key={i} style={{fontSize:10,color:e.type==="goal"?T.li:e.type==="red"?T.red:T.tx2,marginBottom:2,display:"flex",gap:6}}><span style={{minWidth:25,color:T.txd}}>{e.minute}'</span><span>{e.type==="goal"?"⚽":e.type==="yellow"?"🟨":"🟥"} {e.player} ({e.team==="home"?hN:aN}){e.assist?` | ${e.assist}`:""}</span></div>)}
</div>
<button onClick={()=>onComplete({hg:plan.hg,ag:plan.ag,events:plan.events})} style={{marginTop:14,width:"100%",padding:12,borderRadius:6,background:T.bg3,border:`1px solid ${T.cy}20`,color:T.cy,fontSize:14,fontWeight:800,cursor:"pointer"}}>DEVAM ET →</button>
</div></div>;

return<div style={{position:"fixed",inset:0,zIndex:10000,background:`linear-gradient(160deg,${T.bg},${T.bg3},${T.bg})`,fontFamily:T.font,overflow:"hidden",display:"flex",flexDirection:"column",animation:sh?"shk .3s":"none"}}><style>{`@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}@keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes gp{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}@keyframes netShake{0%,100%{transform:translateX(0)}25%{transform:translateX(1)}75%{transform:translateX(-1)}}`}</style>
{/* Scoreboard */}
<div style={{flexShrink:0,padding:"8px 16px",background:T.header,borderBottom:`1px solid ${T.gb}`,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
<div style={{display:"flex",alignItems:"center",gap:6,background:T.bg3,padding:"6px 18px",borderRadius:6}}>
<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:26,height:26,borderRadius:4,background:`linear-gradient(135deg,${hc1},${hc2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>{hN.charAt(0)}</div><span style={{fontSize:13,fontWeight:800,color:T.tx}}>{hN}</span></div>
<span style={{fontSize:28,fontWeight:900,color:"#fff",fontVariantNumeric:"tabular-nums",minWidth:55,textAlign:"center"}}>{hs}<span style={{color:T.txd,fontSize:16,margin:"0 2px"}}>:</span>{as2}</span>
<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:800,color:T.tx}}>{aN}</span><div style={{width:26,height:26,borderRadius:4,background:`linear-gradient(135deg,${ac1},${ac2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>{aN.charAt(0)}</div></div>
<div style={{marginLeft:6,padding:"3px 10px",borderRadius:4,background:paused?`${T.go}15`:done?`${T.red}15`:`${T.cy}10`}}><span style={{fontSize:12,fontWeight:800,color:paused?T.go:done?T.red:T.cy}}>{paused?"DURDURULDU":done?"MS":`${mn}'`}</span></div>
{!done&&<button onClick={togglePause} style={{padding:"4px 10px",borderRadius:4,background:paused?`${T.li}15`:T.bg3,border:`1px solid ${paused?T.li:T.gb}`,color:paused?T.li:T.txd,fontSize:12,fontWeight:700,cursor:"pointer"}}>{paused?"▶":"⏸"}</button>}
</div></div>
{/* Split */}
<div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
{/* Ticker */}
<div style={{width:"28%",minWidth:180,display:"flex",flexDirection:"column",borderRight:`1px solid ${T.gb}`}}>
<div style={{flexShrink:0,padding:"8px 12px",fontSize:10,fontWeight:800,color:T.cy,letterSpacing:".1em",borderBottom:`1px solid ${T.gb}`,display:"flex",justifyContent:"space-between"}}><span>CANLI AKIŞ</span><span style={{color:T.txd}}>{hPossP}%-{100-hPossP}%</span></div>
<div style={{flex:1,overflowY:"auto",padding:"4px 6px"}}>{tk.map(t=><div key={t.id} style={{padding:"6px 8px",borderRadius:4,fontSize:11,animation:"su .2s",fontWeight:t.tp==="goal"?800:500,marginBottom:2,background:t.tp==="goal"?`${T.li}0a`:t.tp==="red"?`${T.red}08`:T.bg3,borderLeft:`2px solid ${ec[t.tp]||"transparent"}`,color:ec[t.tp]||T.txd}}>{t.text}</div>)}<div ref={ref}/></div></div>
{/* Pitch */}
<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"4px",position:"relative",minHeight:0}}>
{fl&&<div style={{position:"absolute",top:"44%",left:"50%",transform:"translate(-50%,-50%)",zIndex:100,fontSize:20,fontWeight:900,color:"#fff",padding:"12px 28px",borderRadius:8,background:fl.includes("GOL")?`${T.li}dd`:fl.includes("PENALTI")?`${T.go}dd`:`${T.red}dd`,boxShadow:`0 0 40px ${fl.includes("GOL")?T.li:T.go}80`,textShadow:"0 2px 8px rgba(0,0,0,.5)"}}>{fl}</div>}
<svg viewBox="0 0 105 68" preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"100%",maxHeight:"calc(100vh - 110px)",display:"block",borderRadius:4}}>
{/* Grass stripes */}
{Array.from({length:10},(_,i)=><rect key={i} x={i*10.5} y="0" width="10.5" height="68" fill={i%2===0?"#1a8a40":"#1d9446"}/>)}
{/* Field markings */}
<rect x="2.5" y="2" width="100" height="64" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth=".35"/>
<line x1="52.5" y1="2" x2="52.5" y2="66" stroke="rgba(255,255,255,.5)" strokeWidth=".35"/>
<circle cx="52.5" cy="34" r="9.15" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth=".35"/>
<circle cx="52.5" cy="34" r=".5" fill="rgba(255,255,255,.6)"/>
<rect x="2.5" y="13.5" width="16.5" height="41" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth=".3"/>
<rect x="86" y="13.5" width="16.5" height="41" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth=".3"/>
<rect x="2.5" y="22" width="5.5" height="24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth=".25"/>
<rect x="97" y="22" width="5.5" height="24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth=".25"/>
{/* Goals with net pattern */}
<rect x=".3" y="27" width="2.2" height="14" fill="rgba(255,255,255,.06)" stroke="#fff" strokeWidth=".4" rx=".2"/>
<rect x="102.5" y="27" width="2.2" height="14" fill="rgba(255,255,255,.06)" stroke="#fff" strokeWidth=".4" rx=".2"/>
{/* Net lines */}
{[28,30,32,34,36,38,40].map(y=><><line key={`nl${y}`} x1=".3" y1={y} x2="2.5" y2={y} stroke="rgba(255,255,255,.08)" strokeWidth=".15"/><line key={`nr${y}`} x1="102.5" y1={y} x2="104.7" y2={y} stroke="rgba(255,255,255,.08)" strokeWidth=".15"/></>)}
<circle cx="14" cy="34" r=".4" fill="rgba(255,255,255,.5)"/><circle cx="91" cy="34" r=".4" fill="rgba(255,255,255,.5)"/>
{/* Corner arcs */}
<path d="M2.5,4 A2,2 0 0,1 4.5,2" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
<path d="M100.5,2 A2,2 0 0,1 102.5,4" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
<path d="M2.5,64 A2,2 0 0,0 4.5,66" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
<path d="M100.5,66 A2,2 0 0,0 102.5,64" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
{/* Penalty arc */}
<path d="M14,24 A10,10 0 0,1 14,44" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
<path d="M91,24 A10,10 0 0,0 91,44" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".25"/>
{/* Set piece markers */}
{setPiece&&(setPiece.includes("pen")?<circle cx={setPiece==="pen_h"?91:14} cy="34" r="3" fill="none" stroke={T.go} strokeWidth=".3" strokeDasharray="1"/>:setPiece.includes("fk")?<circle cx={bp.x*105/100} cy={bp.y*68/100} r="4" fill="none" stroke="#fff" strokeWidth=".2" strokeDasharray=".5"/>:null)}
{/* Home players */}
{ps.h.map((p,i)=>{const cx=p[0]*105/100,cy=p[1]*68/100;return<g key={`h${i}`} style={{transition:"transform .7s ease"}} transform={`translate(${cx},${cy})`}>
<ellipse rx="1.6" ry="1.8" fill={hc1} stroke={hc2} strokeWidth=".35"/>
<ellipse rx=".55" ry=".55" fill="#ffe0bd" cy="-1.4"/>
{i===0&&<><ellipse rx="1.6" ry="1.8" fill={hc2} stroke={hc1} strokeWidth=".35"/><text y=".6" textAnchor="middle" fontSize="1.6" fill="#fff" fontWeight="900">1</text></>}
</g>})}
{/* Away players */}
{ps.a.map((p,i)=>{const cx=p[0]*105/100,cy=p[1]*68/100;return<g key={`a${i}`} style={{transition:"transform .7s ease"}} transform={`translate(${cx},${cy})`}>
<ellipse rx="1.6" ry="1.8" fill={ac1} stroke={ac2} strokeWidth=".35"/>
<ellipse rx=".55" ry=".55" fill="#ffe0bd" cy="-1.4"/>
{i===0&&<><ellipse rx="1.6" ry="1.8" fill={ac2} stroke={ac1} strokeWidth=".35"/><text y=".6" textAnchor="middle" fontSize="1.6" fill="#fff" fontWeight="900">1</text></>}
</g>})}
{/* Ball */}
<g style={{transition:"transform .4s ease"}} transform={`translate(${bp.x*105/100},${bp.y*68/100})`}>
<circle r="1.05" fill="#fff" stroke="#222" strokeWidth=".15"/>
<polygon points="0,-0.5 0.47,-0.15 0.29,0.4 -0.29,0.4 -0.47,-0.15" fill="#333" transform="scale(0.7)"/>
</g>
{ga&&<text x="52.5" y="34" textAnchor="middle" fill={T.go} fontSize="6" fontWeight="900" style={{animation:"gp .8s infinite"}}>GOOOL!</text>}
</svg>
{/* Progress */}
<div style={{width:"100%",display:"flex",alignItems:"center",gap:6,marginTop:3,padding:"0 4px"}}>
<span style={{fontSize:9,color:T.txd,minWidth:20}}>{mn}'</span>
<div style={{flex:1,height:4,background:T.bg3,borderRadius:2,overflow:"hidden",position:"relative"}}>
<div style={{width:`${(mn/90)*100}%`,height:"100%",background:`linear-gradient(90deg,${hc1},${ac1})`,transition:"width .15s"}}/>
<div style={{position:"absolute",left:"50%",top:0,width:1,height:"100%",background:"rgba(255,255,255,.3)"}}/>
</div>
<span style={{fontSize:9,color:T.txd}}>90'</span>
</div>
{!done&&<div style={{display:"flex",gap:4,marginTop:4}}>{[{id:"attack",l:"⚔️ HÜCUM",c:T.red},{id:"balanced",l:"⚖️ DENGELİ",c:T.cy},{id:"defend",l:"🛡️ SAVUNMA",c:T.li}].map(b=><button key={b.id} onClick={()=>chT(b.id)} style={{padding:"5px 14px",borderRadius:4,fontSize:9,fontWeight:800,background:lt===b.id?`${b.c}15`:T.bg3,border:`1px solid ${lt===b.id?b.c+"25":T.gb}`,color:lt===b.id?b.c:T.txd,cursor:"pointer"}}>{b.l}</button>)}</div>}
</div></div>
{done&&<div style={{flexShrink:0,padding:"8px",display:"flex",justifyContent:"center",gap:8,background:T.header,borderTop:`1px solid ${T.gb}`}}>
<button onClick={()=>setShowStats(true)} style={{padding:"8px 20px",borderRadius:6,background:T.bg3,border:`1px solid ${T.go}20`,color:T.go,fontSize:12,fontWeight:800,cursor:"pointer"}}>📊 İSTATİSTİKLER</button>
<button onClick={()=>onComplete({hg:plan.hg,ag:plan.ag,events:plan.events})} style={{padding:"8px 24px",borderRadius:6,background:T.bg3,border:`1px solid ${T.cy}20`,color:T.cy,fontSize:12,fontWeight:800,cursor:"pointer"}}>DEVAM ET →</button>
</div>}
</div>;}

/* ═══ MODE SELECT ═══ */
function ModeSelect({onSelect,hasSaveData,onContinue,onTutorial}){
const[page,setPage]=useState("home");const[hov,setHov]=useState(null);
// Counter animation
const Counter=({end,dur})=>{const[v,setV]=useState(0);useEffect(()=>{let s=0;const step=end/(dur/16);const iv=setInterval(()=>{s+=step;if(s>=end){setV(end);clearInterval(iv)}else setV(Math.floor(s))},16);return()=>clearInterval(iv)},[end,dur]);return<span>{v.toLocaleString()}</span>};

const modes=[
{id:"manager",icon:"🏢",title:"MENAJER KARİYERİ",desc:"Kulübü yönet, transfer yap, şampiyonluk kazan",color:T.accent,glow:"139,92,246",
detail:"Dünya'nın en prestijli kulüplerinden birini seç ve zirvere taşı. Transfer pazarında stratejik hamleler yap, genç yetenekleri keşfet, taktik kur ve takımını şampiyonluğa taşı. 36 ligde 600+ takım seni bekliyor."},
{id:"legend",icon:"⭐",title:"EFSANE OL",desc:"Kendi futbolcunu yarat, efsane bir kariyer inşa et",color:T.go,glow:"251,191,36",
detail:"Kendi futbolcunu sıfırdan yarat — isim, pozisyon, yetenekler senin elinde. Sahada gol at, asist yap, potansiyelini artır. Saha dışında lüks arabalar, malikâneler, sponsorluk anlaşmaları ve sosyal hayatınla bir efsane ol."},
{id:"spectator",icon:"📺",title:"İZLEYİCİ MODU",desc:"Ligleri izle, tahmin yap, sonuçları takip et",color:T.li,glow:"74,222,128",
detail:"Tanrı modunda 36 ligin tamamını izle. Maçları simüle et, puan tablolarını takip et, şampiyonluk yarışını gözlemle. Avrupa Kupası'nda hangi takım şampiyon olacak? Tahmin et ve izle."}
];

const nav=["home",...modes.map(m=>m.id)];
const navLabels={home:"ANA SAYFA",manager:"MENAJER",legend:"EFSANE OL",spectator:"İZLEYİCİ"};
const activeModeData=modes.find(m=>m.id===page);

return<div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:T.font,position:"relative",overflow:"hidden"}}>
<style>{`
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glow{0%,100%{opacity:.3}50%{opacity:.6}}
@keyframes moveLight{0%{transform:translateX(-100%) rotate(45deg)}100%{transform:translateX(200%) rotate(45deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
.nav-item{position:relative;padding:12px 18px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${T.txd};cursor:pointer;transition:all .2s;border:none;background:transparent}
.nav-item:hover,.nav-item.active{color:#fff}
.nav-item::after{content:'';position:absolute;bottom:0;left:50%;width:0;height:2px;background:linear-gradient(90deg,${T.accent},${T.go});transition:all .3s;transform:translateX(-50%);border-radius:2px}
.nav-item:hover::after,.nav-item.active::after{width:70%}
.nav-item:hover{text-shadow:0 0 20px rgba(139,92,246,.5)}
.mode-card{transition:all .3s ease;cursor:pointer}
.mode-card:hover{transform:scale(1.05) translateY(-8px)!important}
`}</style>

{/* Animated background lights */}
<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
<div style={{position:"absolute",top:"-20%",left:"-10%",width:"50%",height:"50%",background:`radial-gradient(ellipse,rgba(139,92,246,.08) 0%,transparent 70%)`,animation:"glow 6s ease infinite"}}/>
<div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"60%",height:"60%",background:`radial-gradient(ellipse,rgba(251,191,36,.05) 0%,transparent 70%)`,animation:"glow 8s ease infinite 2s"}}/>
<div style={{position:"absolute",top:"30%",left:"-20%",width:"140%",height:"2px",background:`linear-gradient(90deg,transparent,rgba(139,92,246,.15),transparent)`,animation:"moveLight 8s linear infinite",transform:"rotate(45deg)"}}/>
<div style={{position:"absolute",top:"60%",left:"-20%",width:"140%",height:"1px",background:`linear-gradient(90deg,transparent,rgba(251,191,36,.1),transparent)`,animation:"moveLight 12s linear infinite 3s",transform:"rotate(45deg)"}}/>
</div>

{/* GLASSMORPHISM NAVBAR */}
<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(26,16,64,.75)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${T.gb}`,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginRight:"auto",padding:"10px 0"}}>
<span style={{fontSize:22}}>⚽</span>
<span style={{fontSize:14,fontWeight:900,color:T.accent,letterSpacing:".06em"}}>FOOTBALL SIM</span>
</div>
<div style={{display:"flex",alignItems:"center"}}>
{Object.entries(navLabels).map(([k,label])=><button key={k} className={`nav-item${page===k?" active":""}`} onClick={()=>setPage(k)} style={{color:page===k?"#fff":T.txd}}>{label}</button>)}
</div>
<div style={{marginLeft:"auto",display:"flex",gap:6,padding:"10px 0"}}>
{hasSaveData&&<button onClick={onContinue} style={{padding:"7px 16px",borderRadius:8,background:`linear-gradient(135deg,${T.accent},${T.bg3})`,border:`1px solid ${T.accent}30`,color:"#fff",fontSize:11,fontWeight:800}}>▶ DEVAM ET</button>}
<button onClick={onTutorial} style={{padding:"7px 12px",borderRadius:8,background:"rgba(255,255,255,.05)",border:`1px solid ${T.gb}`,color:T.txd,fontSize:11,fontWeight:600}}>❓</button>
</div>
</nav>

{/* CONTENT AREA */}
<div style={{paddingTop:56,minHeight:"100vh",position:"relative",zIndex:1}}>

{/* HOME PAGE */}
{page==="home"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 56px)",padding:"40px 20px"}}>
<div style={{fontSize:90,marginBottom:20,animation:"float 3s ease-in-out infinite",filter:"drop-shadow(0 10px 30px rgba(139,92,246,.4))"}}>⚽</div>
<h1 style={{fontSize:52,fontWeight:900,margin:"0 0 10px",background:`linear-gradient(135deg,${T.accent},${T.go},${T.accent})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite",letterSpacing:".05em",textAlign:"center"}}>FOOTBALL SIMULATOR</h1>

{/* Counter stats */}
<div style={{display:"flex",gap:32,margin:"20px 0 40px",animation:"fadeUp .6s ease"}}>
{[{n:36,label:"LİG",suf:"+"},{n:600,label:"TAKIM",suf:"+"},{n:10000,label:"OYUNCU",suf:"+"}].map((s,i)=>
<div key={i} style={{textAlign:"center"}}>
<div style={{fontSize:28,fontWeight:900,color:"#fff"}}><Counter end={s.n} dur={2000}/><span style={{color:T.go}}>{s.suf}</span></div>
<div style={{fontSize:10,color:T.txd,letterSpacing:".12em",textTransform:"uppercase",marginTop:2}}>{s.label}</div>
</div>)}
</div>

{/* Mode cards */}
<div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center",maxWidth:1000}}>
{modes.map((m,i)=>
<div key={m.id} className="mode-card" onClick={()=>setPage(m.id)} onMouseEnter={()=>setHov(m.id)} onMouseLeave={()=>setHov(null)}
style={{width:280,padding:"48px 28px 36px",borderRadius:20,background:`linear-gradient(160deg,${T.card},${T.panel})`,border:`1px solid rgba(${m.glow},${hov===m.id?.35:.12})`,display:"flex",flexDirection:"column",alignItems:"center",gap:16,textAlign:"center",animation:`fadeUp .6s ${i*.12}s ease both`,boxShadow:hov===m.id?`0 12px 40px rgba(${m.glow},.25), 0 0 60px rgba(${m.glow},.1)`:`0 8px 32px rgba(0,0,0,.3)`}}>
<div style={{fontSize:60,marginBottom:4,filter:`drop-shadow(0 6px 16px rgba(${m.glow},.4))`,transition:"transform .3s",transform:hov===m.id?"scale(1.15)":"scale(1)"}}>{m.icon}</div>
<div style={{fontSize:18,fontWeight:900,color:m.color,letterSpacing:".12em",textTransform:"uppercase"}}>{m.title}</div>
<div style={{fontSize:12,color:T.txd,lineHeight:1.6}}>{m.desc}</div>
<div style={{marginTop:8,padding:"8px 28px",borderRadius:24,background:`rgba(${m.glow},.12)`,border:`1px solid rgba(${m.glow},.25)`,fontSize:12,fontWeight:800,color:m.color,transition:"all .2s",boxShadow:hov===m.id?`0 0 20px rgba(${m.glow},.3)`:"none"}}>KEŞFET →</div>
</div>)}
</div>

{/* SEO footer */}
<div style={{marginTop:50,textAlign:"center",maxWidth:600,animation:"fadeUp 1s ease"}}>
<p style={{fontSize:10,color:T.txd,lineHeight:1.7}}>Football Simulator — Türkiye, İspanya, Almanya, İngiltere, İtalya, Fransa, Hollanda, İskoçya, İsviçre, Yunanistan, Belçika ve Portekiz ligleriyle ücretsiz online futbol menajer simülasyonu.</p>
</div>
</div>}

{/* MODE DETAIL PAGES */}
{activeModeData&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 56px)",padding:"40px 20px",animation:"fadeIn .4s ease"}}>
<div style={{maxWidth:600,textAlign:"center"}}>
<div style={{fontSize:80,marginBottom:20,animation:"pulse 2s ease infinite",filter:`drop-shadow(0 8px 24px rgba(${activeModeData.glow},.4))`}}>{activeModeData.icon}</div>
<h2 style={{fontSize:36,fontWeight:900,color:activeModeData.color,letterSpacing:".1em",textTransform:"uppercase",margin:"0 0 16px",textShadow:`0 0 40px rgba(${activeModeData.glow},.3)`}}>{activeModeData.title}</h2>
<p style={{fontSize:14,color:T.tx2,lineHeight:1.8,margin:"0 0 32px",animation:"slideIn .5s ease"}}>{activeModeData.detail}</p>

<div style={{display:"flex",gap:12,justifyContent:"center",animation:"fadeUp .6s ease"}}>
<button onClick={()=>onSelect(activeModeData.id)} style={{padding:"14px 40px",borderRadius:14,background:`linear-gradient(135deg,rgba(${activeModeData.glow},.8),rgba(${activeModeData.glow},.4))`,border:"none",color:"#fff",fontSize:16,fontWeight:900,letterSpacing:".08em",cursor:"pointer",boxShadow:`0 6px 30px rgba(${activeModeData.glow},.35)`,textTransform:"uppercase"}}>KARİYERİ BAŞLAT</button>
<button onClick={()=>setPage("home")} style={{padding:"14px 24px",borderRadius:14,background:"rgba(255,255,255,.05)",border:`1px solid ${T.gb}`,color:T.txd,fontSize:13,fontWeight:700,cursor:"pointer"}}>← GERİ</button>
</div>

{/* Feature highlights */}
<div style={{display:"flex",gap:12,justifyContent:"center",marginTop:32,flexWrap:"wrap",animation:"fadeUp .8s ease"}}>
{(activeModeData.id==="manager"?["⚽ 36 Lig","💰 Transfer Pazarı","🏆 Avrupa Kupası","📊 Detaylı İstatistik"]:
activeModeData.id==="legend"?["🌟 Karakter Yaratma","💎 Lüks Yaşam","💕 Sosyal Hayat","🏷️ Sponsorluklar"]:
["📺 Canlı Simülasyon","📈 Puan Tablosu","🏆 Avrupa Kupası","🔄 Küme Düşme"]).map((f,i)=>
<div key={i} style={{padding:"8px 16px",borderRadius:10,background:T.card,border:`1px solid ${T.gb}`,fontSize:11,color:T.tx2,fontWeight:600}}>{f}</div>)}
</div>
</div>
</div>}

</div>
</div>}

/* ═══ TUTORIAL OVERLAY ═══ */
function Tutorial({onClose}){
const steps=[
{icon:"🏢",title:"Mod Seç",desc:"Menajer Kariyeri'nde kulüp yönet, Efsane Ol'da kendi futbolcunu oluştur, İzleyici'de ligleri takip et."},
{icon:"⚽",title:"Maç Simüle Et",desc:"Haftalık maçları simüle et. Canlı 2D sahada taktik değiştir, maçı durdur ve devam ettir."},
{icon:"📊",title:"Lig ve Puan",desc:"36 ligde puan tablosunu takip et. Sezon sonunda küme düşme/yükselme ve Avrupa Kupası."},
{icon:"💰",title:"Transfer Pazarı",desc:"Ağustos ve Ocak aylarında transfer penceresi açılır. Oyuncu al-sat, bütçeni yönet."},
{icon:"🏆",title:"Avrupa Kupası",desc:"Tüm ligler bitince 24 takımlı Avrupa Kupası başlar. Grup aşaması + eleme bracket."},
{icon:"💎",title:"Özel Hayat (Efsane Ol)",desc:"Maaş kazan, lüks arabalar ve evler al, kız arkadaş edin, sponsorluk anlaşmaları yap."}
];
return<div style={{position:"fixed",inset:0,zIndex:10020,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font,padding:20}} onClick={onClose}>
<div onClick={e=>e.stopPropagation()} style={{maxWidth:520,width:"100%",maxHeight:"80vh",overflowY:"auto",background:`linear-gradient(160deg,${T.bg},${T.bg3})`,borderRadius:16,border:`1px solid ${T.accent}20`,padding:24,boxShadow:`0 20px 60px rgba(0,0,0,.5)`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h2 style={{fontSize:20,fontWeight:900,color:T.accent,margin:0}}>❓ Nasıl Oynanır</h2><button onClick={onClose} style={{width:28,height:28,borderRadius:8,background:T.card,color:T.txd,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
{steps.map((s,i)=><div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<steps.length-1?`1px solid ${T.gb}`:"none"}}>
<div style={{width:40,height:40,borderRadius:10,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
<div><div style={{fontSize:13,fontWeight:800,color:T.tx,marginBottom:2}}>{s.title}</div><div style={{fontSize:11,color:T.txd,lineHeight:1.5}}>{s.desc}</div></div>
</div>)}
<button onClick={onClose} style={{marginTop:16,width:"100%",padding:10,borderRadius:10,background:`${T.accent}15`,border:`1px solid ${T.accent}25`,color:T.accent,fontSize:13,fontWeight:800}}>ANLADIM, OYNAYALIM! →</button>
</div></div>}

/* ═══ CHARACTER CREATOR ═══ */
function CharCreate({al,onComplete}){
const[name,setName]=useState("");const[surname,setSurname]=useState("");const[age,setAge]=useState(17);const[pos,setPos]=useState("FWD");
const[attrs,setAttrs]=useState({speed:60,shot:60,pass:60,defense:40,physical:50});const[teamLk,setTeamLk]=useState("turkey_1");const[team,setTeam]=useState("");
const total=Object.values(attrs).reduce((a,b)=>a+b,0);const maxPts=300;const remaining=maxPts-total;
const setAttr=(k,v)=>{const diff=v-attrs[k];if(diff>0&&remaining<diff)return;setAttrs(p=>({...p,[k]:Math.max(20,Math.min(99,v))}))};
const lg=al[teamLk];const cts=[...new Set(Object.values(al).map(l=>l.ck))];
const overall=Math.round((attrs.speed+attrs.shot+attrs.pass+attrs.defense+attrs.physical)/5);
const value=calcValue(overall,age,Math.min(99,overall+15),8);
return<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,padding:24,overflowY:"auto"}}>
<style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
<div style={{maxWidth:700,margin:"0 auto"}}>
<h1 style={{fontSize:24,fontWeight:900,color:T.cy,marginBottom:20,textAlign:"center"}}>⭐ FUTBOLCU YARAT</h1>
{/* Name & Age */}
<div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
<div style={{flex:1,minWidth:150}}><label style={{fontSize:10,color:T.txd,fontWeight:700}}>İSİM</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Adı" style={{width:"100%",padding:"10px 12px",borderRadius:8,background:T.glass,color:T.tx,border:`1px solid ${T.gb}`,outline:"none",fontSize:14,marginTop:4,backdropFilter:"blur(10px)"}}/></div>
<div style={{flex:1,minWidth:150}}><label style={{fontSize:10,color:T.txd,fontWeight:700}}>SOYİSİM</label><input value={surname} onChange={e=>setSurname(e.target.value)} placeholder="Soyadı" style={{width:"100%",padding:"10px 12px",borderRadius:8,background:T.glass,color:T.tx,border:`1px solid ${T.gb}`,outline:"none",fontSize:14,marginTop:4,backdropFilter:"blur(10px)"}}/></div>
<div style={{width:80}}><label style={{fontSize:10,color:T.txd,fontWeight:700}}>YAŞ</label><select value={age} onChange={e=>setAge(+e.target.value)} style={{width:"100%",padding:"10px",borderRadius:8,background:T.glass,color:T.tx,border:`1px solid ${T.gb}`,outline:"none",fontSize:14,marginTop:4}}>{[17,18,19,20].map(a=><option key={a} value={a}>{a}</option>)}</select></div>
</div>
{/* Position */}
<div style={{marginBottom:16}}><label style={{fontSize:10,color:T.txd,fontWeight:700}}>MEVKİ</label><div style={{display:"flex",gap:6,marginTop:6}}>{["GK","DEF","MID","FWD"].map(p=><button key={p} onClick={()=>setPos(p)} style={{flex:1,padding:"10px",borderRadius:8,fontSize:12,fontWeight:800,...G({borderRadius:8,border:`1px solid ${pos===p?PC[p]+"30":T.gb}`}),background:pos===p?`${PC[p]}15`:T.glass,color:pos===p?PC[p]:T.txd,cursor:"pointer"}}>{p}</button>)}</div></div>
{/* Attributes */}
<div style={{marginBottom:16,...G({padding:16})}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:12,fontWeight:800,color:T.tx}}>YETENEK PUANLARI</span><span style={{fontSize:12,fontWeight:800,color:remaining>0?T.li:remaining===0?T.cy:"#ef4444"}}>Kalan: {remaining}/{maxPts}</span></div>
{Object.entries(attrs).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<span style={{width:70,fontSize:11,fontWeight:700,color:T.txd,textTransform:"capitalize"}}>{k==="speed"?"Hız":k==="shot"?"Şut":k==="pass"?"Pas":k==="defense"?"Defans":"Fizik"}</span>
<input type="range" min="20" max="99" value={v} onChange={e=>setAttr(k,+e.target.value)} style={{flex:1,accentColor:T.cy}}/>
<span style={{width:30,fontSize:13,fontWeight:800,color:v>=80?T.go:v>=60?T.cy:T.txd,textAlign:"right"}}>{v}</span>
</div>)}
</div>
{/* Overall card */}
<div style={{textAlign:"center",marginBottom:16}}><div style={{display:"inline-block",padding:"20px 28px",borderRadius:14,...G({borderRadius:14,border:`1px solid ${overall>=80?T.go+"30":T.cy+"20"}`}),background:overall>=80?`${T.go}08`:`${T.cy}06`}}>
<div style={{fontSize:36,fontWeight:900,color:overall>=80?T.go:T.cy}}>{overall}</div>
<div style={{fontSize:11,color:T.txd}}>OVR • {pos}</div>
<div style={{fontSize:12,fontWeight:700,color:T.li,marginTop:4}}>{fV(value)}</div>
</div></div>
{/* Team selection */}
<div style={{marginBottom:16}}>
<label style={{fontSize:10,color:T.txd,fontWeight:700}}>TAKIM SEÇ</label>
<div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap",marginBottom:8}}>{cts.map(ck=>{const l=al[`${ck}_1`];const s=teamLk.startsWith(ck);return<button key={ck} onClick={()=>setTeamLk(`${ck}_1`)} style={{padding:"4px 8px",borderRadius:6,fontSize:9,fontWeight:600,...G({borderRadius:6,border:`1px solid ${s?T.cy+"25":T.gb}`}),background:s?`${T.cy}10`:T.glass,color:s?T.cy:T.txd,cursor:"pointer"}}>{l?.flag} {l?.country}</button>})}</div>
<div style={{display:"flex",gap:4,marginBottom:8}}>{[1,2,3].map(t=>{const k=`${teamLk.split("_")[0]}_${t}`;const s=teamLk===k;return<button key={t} onClick={()=>setTeamLk(k)} style={{padding:"4px 12px",borderRadius:6,fontSize:10,fontWeight:600,...G({borderRadius:6,border:`1px solid ${s?T.cy+"25":T.gb}`}),background:s?`${T.cy}10`:T.glass,color:s?T.cy:T.txd,cursor:"pointer"}}>{t}. Lig</button>})}</div>
{lg&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{lg.teams.map(t=>{const s=team===t.name;const[c1]=gc(t.name);return<button key={t.name} onClick={()=>setTeam(t.name)} style={{padding:"6px 10px",borderRadius:8,fontSize:10,fontWeight:s?800:500,...G({borderRadius:8,border:`1px solid ${s?c1+"30":T.gb}`}),background:s?`${c1}12`:T.glass,color:s?c1:T.txd,cursor:"pointer"}}>{t.name}</button>})}</div>}
</div>
<button disabled={!name||!surname||!team||remaining<0} onClick={()=>onComplete({name:`${name} ${surname}`,age,pos,attrs,overall,value,team,teamLk})} style={{width:"100%",padding:14,borderRadius:12,...G({borderRadius:12,border:`1px solid ${T.cy}30`}),background:`${T.cy}12`,color:T.cy,fontSize:16,fontWeight:900,cursor:"pointer",opacity:(!name||!surname||!team||remaining<0)?.4:1}}>KARİYERE BAŞLA →</button>
</div></div>}

/* ═══ TEAM SELECT (Manager mode) ═══ */
function TS({al,onSelect}){const[sc,setSc]=useState("turkey_1");const lg=al[sc];const cts=[...new Set(Object.values(al).map(l=>l.ck))];
return<div style={{minHeight:"100vh",background:T.bg,color:T.tx,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:T.font,padding:20,overflowY:"auto"}}>
<h1 style={{fontSize:24,fontWeight:900,margin:"12px 0 4px",background:`linear-gradient(90deg,${T.cy},${T.li})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>TAKIM SEÇ</h1>
<p style={{color:T.txd,fontSize:12,margin:"0 0 16px"}}>Menajer Kariyeri</p>
<div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:12,maxWidth:680}}>{cts.map(ck=>{const l=al[`${ck}_1`];const s=sc.startsWith(ck);return<button key={ck} onClick={()=>setSc(`${ck}_1`)} style={{padding:"5px 10px",borderRadius:8,fontSize:10,fontWeight:600,...G({borderRadius:8,border:`1px solid ${s?T.cy+"25":T.gb}`}),background:s?`${T.cy}10`:T.glass,color:s?T.cy:T.txd,display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><span style={{fontSize:13}}>{l?.flag}</span>{l?.country}</button>})}</div>
<div style={{display:"flex",gap:4,marginBottom:14}}>{[1,2,3].map(t=>{const k=`${sc.split("_")[0]}_${t}`;const s=sc===k;return<button key={t} onClick={()=>setSc(k)} style={{padding:"5px 14px",borderRadius:8,fontSize:11,fontWeight:600,...G({borderRadius:8,border:`1px solid ${s?T.cy+"25":T.gb}`}),background:s?`${T.cy}10`:T.glass,color:s?T.cy:T.txd,cursor:"pointer"}}>{t}. Lig</button>})}</div>
{lg&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6,width:"100%",maxWidth:720}}>{lg.teams.map(t=>{const[c1,c2]=gc(t.name);return<button key={t.name} onClick={()=>onSelect(t.name,sc)} style={{padding:"12px 8px",borderRadius:10,...G({borderRadius:10}),cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
<div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",boxShadow:`0 0 10px ${c1}30`}}>{t.name.charAt(0)}</div>
<div style={{fontSize:11,fontWeight:700,color:T.tx,textAlign:"center"}}>{t.name}</div><div style={{fontSize:9,color:T.cy}}>{t.str}</div></button>})}</div>}
</div>}

/* ═══ SQUAD VIEW ═══ */
function SqV({teams,sqs,uT,uc1,onToggleSale,myPlayer}){const[sel,setSel]=useState(()=>teams.find(t=>t.name===uT)?uT:teams[0]?.name);useEffect(()=>{setSel(teams.find(t=>t.name===uT)?uT:teams[0]?.name)},[teams,uT]);const sq=sqs[sel]||[];const isU=sel===uT;const sorted=[...sq].sort((a,b)=>{const o={GK:0,DEF:1,MID:2,FWD:3};return(o[a.pos]||0)-(o[b.pos]||0)});
return<div><div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:10}}>{teams.map(t=>{const s2=sel===t.name;return<button key={t.name} onClick={()=>setSel(t.name)} style={{padding:"4px 9px",borderRadius:6,fontSize:10,fontWeight:s2?700:500,...G({borderRadius:6,border:`1px solid ${s2?`${uc1}20`:T.gb}`}),background:s2?`${uc1}10`:T.glass,color:s2?uc1:T.txd,cursor:"pointer"}}>{t.name===uT?"⭐ ":""}{t.name}</button>})}</div>
<div style={{...G({borderRadius:10}),overflow:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:580}}>
<thead><tr style={{background:T.bg3}}>{["Mvk","Oyuncu","Yaş","Güç","Pot","Değer","⚽","🅰️","XP","Drm"].concat(isU&&onToggleSale?["Sat"]:[]).map(h=><th key={h} style={{padding:"8px 6px",textAlign:h==="Oyuncu"?"left":"center",fontSize:9,fontWeight:700,color:T.cy,letterSpacing:".04em",borderBottom:`2px solid ${T.gb}`}}>{h}</th>)}</tr></thead>
<tbody>{sorted.map(p=>{const dm=p.suspended||p.injured;const isGold=p.pot>=85;const isMy=myPlayer&&p.name===myPlayer.name;return<tr key={p.id} style={{borderBottom:`1px solid ${T.gb}`,opacity:dm?.4:1,background:isMy?`${T.go}08`:isGold?`${T.go}03`:"transparent"}}>
<td style={{padding:"5px",textAlign:"center"}}><span style={{padding:"1px 5px",borderRadius:4,fontSize:8,fontWeight:700,background:`${PC[p.pos]}12`,color:PC[p.pos]}}>{p.pos}</span></td>
<td style={{padding:"5px",textAlign:"left",fontWeight:700,color:isMy?T.go:isGold?T.go:T.tx}}>{isMy?"🌟 ":""}{p.nat?NAT_FLAG[p.nat]||"":""} {p.name}{isGold&&!isMy?" ✦":""}</td>
<td style={{padding:"5px",textAlign:"center",color:T.txd}}>{p.age}</td>
<td style={{padding:"5px",textAlign:"center",color:T.cy,fontWeight:700}}>{p.pwr}</td>
<td style={{padding:"5px",textAlign:"center",color:p.pot>p.pwr+10?T.li:T.txd}}>{p.pot}</td>
<td style={{padding:"5px",textAlign:"center",color:"#22c55e",fontSize:9}}>{fV(p.value)}</td>
<td style={{padding:"5px",textAlign:"center",fontWeight:p.goals?700:400,color:T.tx}}>{p.goals||"-"}</td>
<td style={{padding:"5px",textAlign:"center",color:T.txd}}>{p.assists||"-"}</td>
<td style={{padding:"5px",textAlign:"center",color:T.cy,fontSize:10}}>{(p.xp||0).toFixed(1)}</td>
<td style={{padding:"5px",textAlign:"center",fontSize:9}}>{p.suspended?"⛔":p.injured?"🚑":"✓"}</td>
{isU&&onToggleSale&&<td style={{padding:"5px",textAlign:"center"}}>{sq.length>18?<button onClick={()=>onToggleSale(p.id)} style={{padding:"2px 6px",borderRadius:4,fontSize:8,fontWeight:700,...G({borderRadius:4}),color:p.forSale?"#f87171":"#60a5fa",cursor:"pointer"}}>{p.forSale?"İptal":"Sat"}</button>:"-"}</td>}
</tr>})}</tbody></table></div></div>}

/* ═══ RESULTS ═══ */
function RV({fx,cw,uT,uc1}){const[s,setS]=useState(Math.max(0,cw-1));useEffect(()=>{setS(Math.max(0,cw-1))},[cw]);const wm=fx[s]||[];const pl=wm.length>0&&wm[0].hg!==null;
return<div><div style={{display:"flex",gap:3,marginBottom:8,overflowX:"auto"}}>{fx.slice(0,40).map((_,i)=>{const ic=i===s;return<button key={i} onClick={()=>setS(i)} style={{minWidth:26,height:22,borderRadius:5,fontSize:9,fontWeight:700,...G({borderRadius:5,border:`1px solid ${ic?`${uc1}20`:T.gb}`}),background:ic?`${uc1}10`:T.glass,color:ic?uc1:T.txd,flexShrink:0,cursor:"pointer"}}>{i+1}</button>})}</div>
<div style={{display:"flex",flexDirection:"column",gap:3}}>{wm.map((m,i)=>{const isU=m.home===uT||m.away===uT;return<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"8px 12px",borderRadius:8,...G({borderRadius:8}),gap:6}}>
<div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:pl&&m.hg>m.ag?T.tx:T.txd}}>{m.home}</div>
<div style={{minWidth:45,textAlign:"center",fontWeight:800,fontSize:14,color:pl?"#fff":T.txd}}>{pl?`${m.hg}-${m.ag}`:"vs"}</div>
<div style={{flex:1,fontSize:12,fontWeight:600,color:pl&&m.ag>m.hg?T.tx:T.txd}}>{m.away}</div>
</div>})}</div></div>}

/* ═══ CONFETTI ═══ */
function Confetti(){return<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{Array.from({length:40},(_,i)=><div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-20px",width:`${4+Math.random()*6}px`,height:`${3+Math.random()*4}px`,backgroundColor:[T.go,T.cy,T.li,"#ff2d87","#E040FB"][i%5],animation:`cF ${2+Math.random()*3}s ${Math.random()*2}s ease-in forwards`}}/>)}</div>}

/* ═══ TRANSFER MARKET ═══ */
function Mkt({sqs,uT,budget,onBuy,uc1,uc2,onClose}){
const[pF,setPF]=useState("ALL");const[aF,setAF]=useState("ALL");const[search,setSearch]=useState("");
const all=useMemo(()=>{const r=[];Object.entries(sqs).forEach(([team,sq])=>{if(team===uT||!Array.isArray(sq))return;sq.forEach(p=>r.push({...p,team}))});return r},[sqs,uT]);
const filtered=useMemo(()=>{let f=all;if(pF!=="ALL")f=f.filter(p=>p.pos===pF);if(aF==="U23")f=f.filter(p=>p.age<23);else if(aF==="23-30")f=f.filter(p=>p.age>=23&&p.age<=30);else if(aF==="30+")f=f.filter(p=>p.age>30);if(search)f=f.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));return f.sort((a,b)=>b.value-a.value).slice(0,60)},[all,pF,aF,search]);
const[offer,setOffer]=useState(null);const[ofAmt,setOfAmt]=useState(0);const uSq=sqs[uT]||[];
const tryBuy=p=>{if(uSq.length>=25)return alert("Kadro limiti 25!");if(ofAmt<~~(p.value*.85)){setOffer({...p,res:"reject"});return}if(ofAmt>budget){setOffer({...p,res:"nobudget"});return}onBuy(p,ofAmt);setOffer(null)};
return<div style={{position:"fixed",inset:0,zIndex:10003,background:T.bg,overflowY:"auto",fontFamily:T.font}}>
<div style={{maxWidth:860,margin:"0 auto",padding:"20px 24px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div><h2 style={{fontSize:18,fontWeight:900,color:T.tx,margin:0}}>🏪 TRANSFER PAZARI</h2><div style={{fontSize:11,color:T.txd}}>Bütçe: <strong style={{color:T.li}}>{fV(budget)}</strong> • Kadro: {uSq.length}/25</div></div>
<button onClick={onClose} style={{padding:"7px 16px",borderRadius:8,...G({borderRadius:8}),color:T.txd,fontSize:11,fontWeight:700}}>✕ KAPAT</button></div>
<div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
{["ALL","GK","DEF","MID","FWD"].map(p=><button key={p} onClick={()=>setPF(p)} style={{padding:"5px 10px",borderRadius:6,fontSize:10,fontWeight:700,...G({borderRadius:6,border:`1px solid ${pF===p?(PC[p]||uc1)+"20":T.gb}`}),background:pF===p?`${PC[p]||uc1}10`:T.glass,color:pF===p?(PC[p]||uc1):T.txd}}>{p==="ALL"?"TÜMÜ":p}</button>)}
{["ALL","U23","23-30","30+"].map(a=><button key={a} onClick={()=>setAF(a)} style={{padding:"5px 10px",borderRadius:6,fontSize:10,fontWeight:700,...G({borderRadius:6,border:`1px solid ${aF===a?`${uc1}20`:T.gb}`}),background:aF===a?`${uc1}10`:T.glass,color:aF===a?uc1:T.txd}}>{a==="ALL"?"YAŞ":a}</button>)}
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="İsim ara..." style={{padding:"5px 10px",borderRadius:6,fontSize:11,background:T.glass,color:T.tx,border:`1px solid ${T.gb}`,outline:"none",width:130,backdropFilter:"blur(10px)"}}/></div>
<div style={{display:"flex",flexDirection:"column",gap:4}}>{filtered.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",padding:"9px 12px",borderRadius:8,...G({borderRadius:8}),gap:8}}>
<span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:`${PC[p.pos]}10`,color:PC[p.pos]}}>{p.pos}</span>
<div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:T.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div><div style={{fontSize:9,color:T.txd}}>{p.team} • {p.age}y • PWR:{p.pwr}</div></div>
<div style={{fontSize:9,color:T.txd}}>⚽{p.goals} 🅰️{p.assists}</div>
<div style={{fontSize:12,fontWeight:700,color:T.li,minWidth:50,textAlign:"right"}}>{fV(p.value)}</div>
<button onClick={()=>{setOffer(p);setOfAmt(p.value)}} style={{padding:"5px 12px",borderRadius:6,...G({borderRadius:6,border:`1px solid ${uc1}20`}),background:`${uc1}08`,color:uc1,fontSize:10,fontWeight:800}}>TEKLİF</button>
</div>)}{filtered.length===0&&<div style={{padding:20,textAlign:"center",color:T.txd}}>Oyuncu bulunamadı.</div>}</div></div>
{offer&&<div style={{position:"fixed",inset:0,zIndex:10005,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setOffer(null)}><div onClick={e=>e.stopPropagation()} style={{...G({padding:20}),width:"100%",maxWidth:350}}>
<div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:900,color:T.tx}}>{offer.name}</div><div style={{fontSize:11,color:T.txd}}>{offer.pos} • {offer.age}y • {offer.team}</div><div style={{fontSize:14,fontWeight:700,color:T.li,marginTop:4}}>Değer: {fV(offer.value)}</div></div>
{offer.res==="reject"&&<div style={{padding:8,borderRadius:6,...G({borderRadius:6}),color:"#f87171",fontSize:11,textAlign:"center",marginBottom:8}}>❌ Min: {fV(~~(offer.value*.85))}</div>}
{offer.res==="nobudget"&&<div style={{padding:8,borderRadius:6,...G({borderRadius:6}),color:"#f87171",fontSize:11,textAlign:"center",marginBottom:8}}>❌ Bütçe yetersiz!</div>}
{!offer.res&&<><div style={{display:"flex",gap:3,marginBottom:8}}>{[.85,.95,1,1.1,1.2].map(m=><button key={m} onClick={()=>setOfAmt(~~(offer.value*m))} style={{flex:1,padding:4,borderRadius:5,fontSize:9,fontWeight:700,...G({borderRadius:5,border:`1px solid ${ofAmt===~~(offer.value*m)?`${uc1}25`:T.gb}`}),background:ofAmt===~~(offer.value*m)?`${uc1}10`:T.glass,color:ofAmt===~~(offer.value*m)?uc1:T.txd}}>{~~(m*100)}%</button>)}</div>
<div style={{fontSize:13,fontWeight:800,color:T.tx,textAlign:"center",marginBottom:8}}>Teklif: {fV(ofAmt)}</div>
<div style={{display:"flex",gap:5}}><button onClick={()=>setOffer(null)} style={{flex:1,padding:7,borderRadius:7,...G({borderRadius:7}),color:T.txd,fontSize:11,fontWeight:700}}>İPTAL</button><button onClick={()=>tryBuy(offer)} style={{flex:1,padding:7,borderRadius:7,...G({borderRadius:7,border:`1px solid ${uc1}25`}),background:`${uc1}10`,color:uc1,fontSize:11,fontWeight:800}}>GÖNDER</button></div></>}
{offer.res&&<button onClick={()=>setOffer(null)} style={{width:"100%",padding:7,borderRadius:7,...G({borderRadius:7}),color:T.txd,fontSize:10,fontWeight:700,marginTop:6}}>KAPAT</button>}
</div></div>}
</div>}

/* ═══ EURO CUP SYSTEM ═══ */
function genEuroCup(al,aFx,cW,savedStandings){
const cts=[...new Set(Object.values(al).map(l=>l.ck))];const teams=[];
cts.forEach(ck=>{const lk=`${ck}_1`;const ld=al[lk];if(!ld)return;
// Calculate standings directly from fixtures - immune to al.teams mutation
const fx=aFx[lk]||[];const wk=cW[lk]||0;
const tbl={};
// Collect ALL team names from fixtures (not from ld.teams which may be mutated)
for(let w=0;w<wk;w++){if(!fx[w])continue;fx[w].forEach(m=>{if(m.hg===null)return;
if(!tbl[m.home])tbl[m.home]={name:m.home,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};
if(!tbl[m.away])tbl[m.away]={name:m.away,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};
const h=tbl[m.home],a=tbl[m.away];h.p++;a.p++;h.gf+=m.hg;h.ga+=m.ag;a.gf+=m.ag;a.ga+=m.hg;
if(m.hg>m.ag){h.w++;h.pts+=3;a.l++}else if(m.hg<m.ag){a.w++;a.pts+=3;h.l++}else{h.d++;h.pts++;a.d++;a.pts++}})}
const st=Object.values(tbl).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);
if(st.length<2)return;
const getStr=(name)=>{for(const k of Object.keys(al)){const t=al[k].teams.find(t=>t.name===name);if(t)return t.str}return 70};
// st[0] = CHAMPION (1st place), st[1] = RUNNER-UP (2nd place)
teams.push({name:st[0].name,country:ld.country,flag:ld.flag,str:getStr(st[0].name),seed:"champ",pts:st[0].pts});
teams.push({name:st[1].name,country:ld.country,flag:ld.flag,str:getStr(st[1].name),seed:"runner",pts:st[1].pts});});
const champs=teams.filter(t=>t.seed==="champ");
const runners=[...teams.filter(t=>t.seed==="runner")].sort(()=>Math.random()-.5);
const groupA=runners.slice(0,6);const groupB=runners.slice(6,12);
const grpFx=(grp)=>{const fx=[];for(let i=0;i<grp.length;i++)for(let j=0;j<grp.length;j++){if(i!==j)fx.push({home:grp[i],away:grp[j],result:null})}return fx};
return{champs,groups:[{name:"A",teams:groupA,fixtures:grpFx(groupA)},{name:"B",teams:groupB,fixtures:grpFx(groupB)}],r16:[],qf:[],sf:[],final:[],champion:null,phase:"groups"}}

function simCupMatch(h,a,sqs){const hS=sqs[h.name]||[];const aS=sqs[a.name]||[];const r=prP(h.str,a.str,hS,aS);return{hg:r.hg,ag:r.ag,events:r.events}}

function EuroCup({cup,setCup,sqs,uT,onLiveMatch}){
const[uc1]=gc(uT||"");if(!cup)return null;
const grpSt=(grp)=>{const t={};grp.teams.forEach(x=>{t[x.name]={name:x.name,flag:x.flag,str:x.str,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}});grp.fixtures.forEach(m=>{if(!m.result)return;const h=t[m.home.name],a=t[m.away.name];if(!h||!a)return;h.p++;a.p++;h.gf+=m.result.hg;h.ga+=m.result.ag;a.gf+=m.result.ag;a.ga+=m.result.hg;if(m.result.hg>m.result.ag){h.w++;h.pts+=3;a.l++}else if(m.result.hg<m.result.ag){a.w++;a.pts+=3;h.l++}else{h.d++;h.pts++;a.d++;a.pts++}});return Object.values(t).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf)};
const simGroup=(gi)=>{const nc={...cup};nc.groups[gi].fixtures=nc.groups[gi].fixtures.map(m=>m.result?m:{...m,result:simCupMatch(m.home,m.away,sqs)});setCup(nc)};
const simAllGroups=()=>{const nc={...cup};nc.groups.forEach(g=>{g.fixtures=g.fixtures.map(m=>m.result?m:{...m,result:simCupMatch(m.home,m.away,sqs)})});setCup(nc)};
const playGrpMatch=(gi,fi,live)=>{const m=cup.groups[gi].fixtures[fi];if(!m||m.result)return;if(live&&onLiveMatch){onLiveMatch(m.home,m.away,`grp_${gi}`,fi);return}const r=simCupMatch(m.home,m.away,sqs);const nc={...cup};nc.groups[gi].fixtures[fi]={...m,result:r};setCup(nc)};
const advanceGroups=()=>{const nc={...cup};const qt=[];nc.groups.forEach(g=>{const st=grpSt(g);if(st[0])qt.push(g.teams.find(t=>t.name===st[0].name)||st[0]);if(st[1])qt.push(g.teams.find(t=>t.name===st[1].name)||st[1])});const r16t=[...nc.champs,...qt].sort(()=>Math.random()-.5);nc.r16=[];for(let i=0;i<r16t.length;i+=2){if(r16t[i+1])nc.r16.push({home:r16t[i],away:r16t[i+1],result:null,winner:null})}nc.phase="r16";setCup(nc)};
const playMatch=(round,idx,live)=>{const m=cup[round][idx];if(!m||m.winner)return;if(live&&onLiveMatch){onLiveMatch(m.home,m.away,round,idx);return}const r=simCupMatch(m.home,m.away,sqs);const nc={...cup};nc[round][idx]={...m,result:r,winner:r.hg>r.ag?m.home:r.hg<r.ag?m.away:Math.random()>.5?m.home:m.away};setCup(nc)};
const simRound=(round)=>{const nc={...cup};nc[round]=nc[round].map(m=>m.winner?m:{...m,result:simCupMatch(m.home,m.away,sqs),winner:null}).map(m=>{if(m.winner)return m;m.winner=m.result.hg>m.result.ag?m.home:m.result.hg<m.result.ag?m.away:Math.random()>.5?m.home:m.away;return m});setCup(nc)};
const advanceRound=(from,to)=>{const nc={...cup};const w=nc[from].filter(m=>m.winner).map(m=>m.winner);if(w.length!==nc[from].length)return;if(to==="champion"){nc.champion=w[0];nc.phase="done"}else{nc[to]=[];for(let i=0;i<w.length;i+=2){if(w[i+1])nc[to].push({home:w[i],away:w[i+1],result:null,winner:null})}nc.phase=to}setCup(nc)};
const simAll=()=>{const nc={...cup};if(nc.phase==="groups"){nc.groups.forEach(g=>{g.fixtures=g.fixtures.map(m=>m.result?m:{...m,result:simCupMatch(m.home,m.away,sqs)})});const qt=[];nc.groups.forEach(g=>{const st=grpSt(g);if(st[0])qt.push(g.teams.find(t=>t.name===st[0].name)||st[0]);if(st[1])qt.push(g.teams.find(t=>t.name===st[1].name)||st[1])});const r16t=[...nc.champs,...qt].sort(()=>Math.random()-.5);nc.r16=[];for(let i=0;i<r16t.length;i+=2){if(r16t[i+1])nc.r16.push({home:r16t[i],away:r16t[i+1],result:null,winner:null})}nc.phase="r16"}const rounds=["r16","qf","sf","final"];for(const rd of rounds){if(!nc[rd]||!nc[rd].length)continue;nc[rd]=nc[rd].map(m=>m.winner?m:(()=>{const r=simCupMatch(m.home,m.away,sqs);return{...m,result:r,winner:r.hg>r.ag?m.home:r.hg<r.ag?m.away:Math.random()>.5?m.home:m.away}})());const ws=nc[rd].map(m=>m.winner);const nm={r16:"qf",qf:"sf",sf:"final",final:null}[rd];if(!nm){nc.champion=ws[0];nc.phase="done";break}nc[nm]=[];for(let i=0;i<ws.length;i+=2){if(ws[i+1])nc[nm].push({home:ws[i],away:ws[i+1],result:null,winner:null})}}setCup(nc)};
const BM=({m,round,idx})=>{if(!m)return null;const w=m.winner?.name;const[c1]=gc(m.home?.name||"");const[c2]=gc(m.away?.name||"");return<div style={{background:T.bg3,border:`1px solid ${T.gb}`,borderRadius:4,overflow:"hidden",minWidth:150}}><div style={{display:"flex",alignItems:"center",padding:"6px 8px",borderBottom:`1px solid ${T.gb}`,background:w===m.home?.name?`${T.li}08`:"transparent"}}><div style={{width:16,height:16,borderRadius:2,background:`linear-gradient(135deg,${c1},${gc(m.home?.name||"")[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff",marginRight:6,flexShrink:0}}>{m.home?.name?.charAt(0)}</div><span style={{flex:1,fontSize:10,fontWeight:w===m.home?.name?800:500,color:w===m.home?.name?T.li:T.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.home?.name}</span>{m.result&&<span style={{fontSize:11,fontWeight:800,color:m.result.hg>m.result.ag?T.li:T.tx2}}>{m.result.hg}</span>}</div><div style={{display:"flex",alignItems:"center",padding:"6px 8px",background:w===m.away?.name?`${T.li}08`:"transparent"}}><div style={{width:16,height:16,borderRadius:2,background:`linear-gradient(135deg,${c2},${gc(m.away?.name||"")[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff",marginRight:6,flexShrink:0}}>{m.away?.name?.charAt(0)}</div><span style={{flex:1,fontSize:10,fontWeight:w===m.away?.name?800:500,color:w===m.away?.name?T.li:T.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.away?.name}</span>{m.result&&<span style={{fontSize:11,fontWeight:800,color:m.result.ag>m.result.hg?T.li:T.tx2}}>{m.result.ag}</span>}</div>{!m.winner&&<div style={{display:"flex",borderTop:`1px solid ${T.gb}`}}><button onClick={()=>playMatch(round,idx,true)} style={{flex:1,padding:"4px",background:`${T.cy}08`,color:T.cy,fontSize:9,fontWeight:700,cursor:"pointer",border:"none",borderRight:`1px solid ${T.gb}`}}>▶ CANLI</button><button onClick={()=>playMatch(round,idx,false)} style={{flex:1,padding:"4px",background:T.bg3,color:T.txd,fontSize:9,fontWeight:700,cursor:"pointer",border:"none"}}>⚡</button></div>}</div>};
const names={r16:"SON 16",qf:"ÇEYREK FİNAL",sf:"YARI FİNAL",final:"FİNAL"};
return<div style={{animation:"fadeUp .3s"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div><h2 style={{fontSize:20,fontWeight:900,color:T.go,margin:0}}>🏆 AVRUPA KUPASI</h2><div style={{fontSize:11,color:T.txd}}>24 Takım • {cup.phase==="done"?"Tamamlandı":cup.phase==="groups"?"GRUP":names[cup.phase]||""}</div></div><button onClick={simAll} style={{padding:"8px 16px",borderRadius:6,background:`${T.go}10`,border:`1px solid ${T.go}20`,color:T.go,fontSize:11,fontWeight:800,cursor:"pointer"}}>⚡ TÜM KUPAYI SİMÜLE ET</button></div>
{cup.champion&&<div style={{textAlign:"center",padding:24,borderRadius:10,background:`${T.go}0a`,border:`1px solid ${T.go}25`,marginBottom:16}}><div style={{fontSize:48}}>🏆</div><div style={{fontSize:22,fontWeight:900,color:T.go}}>{cup.champion.flag} {cup.champion.name}</div><div style={{fontSize:13,color:T.tx2}}>Avrupa Kupası Şampiyonu!</div></div>}
{cup.phase==="groups"&&<div style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:14,fontWeight:800,color:T.cy}}>GRUP AŞAMASI (Çift Devreli)</span><button onClick={simAllGroups} style={{padding:"6px 14px",borderRadius:4,background:T.bg3,border:`1px solid ${T.cy}20`,color:T.cy,fontSize:10,fontWeight:700,cursor:"pointer"}}>⚡ Grupları Simüle</button></div>
{cup.groups.map((grp,gi)=>{const st=grpSt(grp);return<div key={gi} style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:800,color:T.go,marginBottom:6}}>GRUP {grp.name}</div><div style={{borderRadius:4,overflow:"hidden",marginBottom:8,background:T.bg3}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.bg}}><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"left"}}>#</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"left"}}>Takım</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"center"}}>O</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"center"}}>G</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"center"}}>B</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"center"}}>M</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.cy,textAlign:"center"}}>AV</th><th style={{padding:"5px 6px",fontSize:8,fontWeight:700,color:T.go,textAlign:"center"}}>P</th></tr></thead><tbody>{st.map((t,i)=><tr key={t.name} style={{borderBottom:`1px solid ${T.gb}`,background:i<2?`${T.li}06`:"transparent"}}><td style={{padding:"4px 6px",fontSize:10,color:i<2?T.li:T.txd,fontWeight:700}}>{i+1}</td><td style={{padding:"4px 6px",fontSize:10,fontWeight:700,color:i<2?T.li:T.tx}}>{t.flag} {t.name}</td><td style={{padding:"4px 6px",fontSize:10,color:T.txd,textAlign:"center"}}>{t.p}</td><td style={{padding:"4px 6px",fontSize:10,color:T.li,textAlign:"center"}}>{t.w}</td><td style={{padding:"4px 6px",fontSize:10,color:T.txd,textAlign:"center"}}>{t.d}</td><td style={{padding:"4px 6px",fontSize:10,color:T.red,textAlign:"center"}}>{t.l}</td><td style={{padding:"4px 6px",fontSize:10,color:T.txd,textAlign:"center"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</td><td style={{padding:"4px 6px",fontSize:11,fontWeight:900,color:T.go,textAlign:"center"}}>{t.pts}</td></tr>)}</tbody></table></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>{grp.fixtures.map((m,fi)=><div key={fi} style={{padding:"5px 6px",borderRadius:4,background:T.bg3,border:`1px solid ${T.gb}`,fontSize:9}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,color:T.tx,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.home.name}</span>{m.result?<span style={{fontWeight:800,color:"#fff",margin:"0 3px"}}>{m.result.hg}-{m.result.ag}</span>:<button onClick={()=>playGrpMatch(gi,fi,true)} style={{padding:"2px 6px",borderRadius:3,background:`${T.cy}10`,color:T.cy,fontSize:8,fontWeight:700,cursor:"pointer",margin:"0 2px",border:"none"}}>▶</button>}<span style={{fontWeight:600,color:T.tx,flex:1,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.away.name}</span></div></div>)}</div>
<button onClick={()=>simGroup(gi)} style={{marginTop:4,padding:"4px 10px",borderRadius:3,background:T.bg3,border:`1px solid ${T.cy}15`,color:T.cy,fontSize:9,fontWeight:700,cursor:"pointer"}}>⚡ Grup {grp.name} Simüle</button></div>})}
{cup.groups.every(g=>g.fixtures.every(m=>m.result))&&<button onClick={advanceGroups} style={{width:"100%",padding:10,borderRadius:6,background:`${T.li}10`,border:`1px solid ${T.li}20`,color:T.li,fontSize:13,fontWeight:800,cursor:"pointer"}}>SON 16'YA GEÇ →</button>}</div>}
{cup.r16.length>0&&<div style={{overflowX:"auto",paddingBottom:10}}><div style={{display:"flex",gap:12,alignItems:"flex-start",minWidth:700}}>
{["r16","qf","sf","final"].map(round=>{if(!cup[round])return null;const allDone=cup[round].length>0&&cup[round].every(m=>m.winner);const nm={r16:"qf",qf:"sf",sf:"final",final:"champion"}[round];return<div key={round} style={{display:"contents"}}><div style={{display:"flex",flexDirection:"column",gap:6,minWidth:round==="final"?180:155}}><div style={{fontSize:round==="final"?13:11,fontWeight:800,color:cup.phase===round?T.go:T.txd,marginBottom:4,textAlign:"center"}}>{round==="final"?"🏆 ":""}{names[round]}</div>{cup[round].length>0?cup[round].map((m,i)=><BM key={i} m={m} round={round} idx={i}/>):<div style={{height:60,display:"flex",alignItems:"center",justifyContent:"center",color:T.txd,fontSize:10}}>—</div>}{allDone&&cup.phase===round&&<button onClick={()=>advanceRound(round,nm)} style={{padding:"6px",borderRadius:4,background:`${T.li}10`,border:`1px solid ${T.li}20`,color:T.li,fontSize:10,fontWeight:700,cursor:"pointer",marginTop:3}}>{nm==="champion"?"🏆 ŞAMPİYON!":"Sonraki →"}</button>}{cup.phase===round&&!allDone&&<button onClick={()=>simRound(round)} style={{padding:"4px",borderRadius:3,background:T.bg3,color:T.txd,fontSize:9,fontWeight:700,cursor:"pointer",marginTop:2}}>⚡ Tümü</button>}</div>{round!=="final"&&<div style={{display:"flex",alignItems:"center",color:T.txd,fontSize:16,alignSelf:"center"}}>→</div>}</div>})}
</div></div>}</div>}
/* ═══ LIVE SOCIAL FEED (right panel) ═══ */
const FEED_MSGS=[
{u:"@SporGazete",t:"transfer dönemi yaklaşıyor, büyük sürprizler bekleniyor!"},
{u:"@TransferMerkezi",t:"dev kulüpler genç yetenekleri takip ediyor 👀"},
{u:"@TaraftarUltra",t:"bu hafta tribünler doldu taştı! ⚽🔥"},
{u:"@FutbolYorumcusu",t:"taktik analiz: 4-3-3 bu sezonun trendi"},
{u:"@BreakingFootball",t:"sakatlık haberleri geliyor, kadrolar karışabilir"},
{u:"@YorumcuAli",t:"VAR kararları yine gündemde..."},
{u:"@FutbolHaber",t:"genç yıldız performansıyla göz kamaştırıyor ✨"},
{u:"@SporGazete",t:"şampiyonluk yarışı kızışıyor, puan farkları azalıyor"},
{u:"@TaraftarUltra",t:"deplasman galibiyeti moral verdi 💪"},
{u:"@TransferMerkezi",t:"serbest oyuncu pazarında kaliteli isimler var"},
{u:"@BreakingFootball",t:"teknik direktör basın toplantısında sert konuştu"},
{u:"@FutbolYorumcusu",t:"savunma hattında değişiklik şart görünüyor"},
{u:"@YorumcuAli",t:"maç temposu düşük, taraftarlar tepkili"},
{u:"@FutbolHaber",t:"alt yapıdan yükselen isimler dikkat çekiyor 🌟"},
{u:"@SporGazete",t:"lig tarihinde böyle bir sezon görülmedi!"},
{u:"@TaraftarUltra",t:"gol krallığı yarışı nefes kesiyor 🏆"},
{u:"@TransferMerkezi",t:"ocak transfer döneminde sürpriz bekleniyor"},
{u:"@BreakingFootball",t:"forma sponsorluğunda rekor anlaşma iddiası 💰"},
{u:"@FutbolYorumcusu",t:"kontratağa geçiş oyunları hızlandırdı"},
{u:"@YorumcuAli",t:"kaleci performansı maça damga vurdu 🧤"}
];
function LiveFeed({socialFeed,uT}){
const[posts,setPosts]=useState([]);const ctr=useRef(0);
useEffect(()=>{const iv=setInterval(()=>{const hasSocial=socialFeed.length>0&&Math.random()<.4;
let newPost;
if(hasSocial){const sf=socialFeed[rn(0,Math.min(socialFeed.length-1,5))];newPost={id:ctr.current++,u:sf.user,t:sf.text,time:sf.time,real:true}}
else{const fm=FEED_MSGS[rn(0,FEED_MSGS.length-1)];newPost={id:ctr.current++,u:fm.u,t:fm.t,time:"şimdi",real:false}}
setPosts(p=>[newPost,...p].slice(0,12))},3000);return()=>clearInterval(iv)},[socialFeed]);
return<div style={{width:260,minHeight:"100vh",background:T.sidebar,borderLeft:`1px solid ${T.gb}`,position:"sticky",top:0,height:"100vh",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
<div style={{padding:"10px 12px",borderBottom:`1px solid ${T.gb}`,display:"flex",alignItems:"center",gap:6}}>
<div style={{width:6,height:6,borderRadius:"50%",background:T.li,animation:"pulse 2s infinite"}}/>
<span style={{fontSize:10,fontWeight:800,color:T.tx2,letterSpacing:".1em"}}>CANLI AKIŞ</span>
</div>
<style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes slideIn{from{opacity:0;transform:translateY(-20px);max-height:0}to{opacity:1;transform:translateY(0);max-height:100px}}`}</style>
<div style={{flex:1,overflowY:"hidden",padding:"6px 8px",display:"flex",flexDirection:"column",gap:4}}>
{posts.map(p=><div key={p.id} style={{padding:"8px 10px",borderRadius:6,background:p.real?`${T.cy}08`:T.bg3,borderLeft:p.real?`2px solid ${T.cy}`:"2px solid transparent",animation:"slideIn .4s ease",flexShrink:0}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
<span style={{fontSize:9,fontWeight:700,color:p.real?T.cy:T.accent}}>{p.u}</span>
<span style={{fontSize:8,color:T.txd}}>{p.time}</span></div>
<div style={{fontSize:10,color:T.tx2,lineHeight:1.3}}>{p.t}</div>
</div>)}
</div>
</div>}

/* ═══ MAIN APP ═══ */
export default function App(){
const win=useWindowSize();const isMobile=win.w<768;
const[al]=useState(bLg);const LK=useMemo(()=>Object.keys(al),[al]);
const[gameMode,setGameMode]=useState(null);
const[myPlayer,setMyPlayer]=useState(null);
const[uT,setUT]=useState(null);const[uLK,setULK]=useState(null);
const[aFx,setAFx]=useState({});const[cW,setCW]=useState({});const[sqs,setSqs]=useState({});
const[budget,setBudget]=useState(0);const[season,setSeason]=useState(1);const[week,setWeek]=useState(0);
const[sL,setSL]=useState("");const[vw,setVw]=useState("matches");const[mS,setMS]=useState(null);
const[sC,setSC]=useState(false);const[cC,setCC]=useState(null);const[sm,setSm]=useState(false);
const[promo,setPromo]=useState(null);const[morale,setMorale]=useState(65);const promoShown=useRef(false);
const[style,setStyle]=useState("fast");const[weather,setWeather]=useState("sunny");
const[offers,setOffers]=useState([]);const[socialFeed,setSocialFeed]=useState([]);
const[signing,setSigning]=useState(null);const[showMkt,setShowMkt]=useState(false);
const[reputation,setReputation]=useState(50);
const[legendOffer,setLegendOffer]=useState(null);
const[euroCup,setEuroCup]=useState(null);const[cupMatch,setCupMatch]=useState(null);
const prePromoSt=useRef(null);
const[showTutorial,setShowTutorial]=useState(false);
const[sidebarOpen,setSidebarOpen]=useState(!isMobile);
const[showSaveMsg,setShowSaveMsg]=useState("");

// SEO injection
useEffect(()=>{injectSEO()},[]);

// Auto-save every 60 seconds — FULL game state
useEffect(()=>{if(!gameMode||!uT)return;const iv=setInterval(()=>{try{const data={gameMode,uT,uLK,season,week,budget,morale,sL,vw,myPlayer,weather,style,reputation,
aFx,cW,sqs,socialFeed:socialFeed.slice(0,10),offers,wallet,lifestyle,followers,ego,sponsor,gf,gfHappy,euroCup};
saveGame(data);setShowSaveMsg("✓ Kaydedildi");setTimeout(()=>setShowSaveMsg(""),2000)}catch(e){console.warn("Auto-save failed",e)}},60000);return()=>clearInterval(iv)},[gameMode,uT,season,week,budget,morale]);

// Manual save — FULL game state
const doSave=()=>{try{const data={gameMode,uT,uLK,season,week,budget,morale,sL,vw,myPlayer,weather,style,reputation,
aFx,cW,sqs,socialFeed:socialFeed.slice(0,10),offers,wallet,lifestyle,followers,ego,sponsor,gf,gfHappy,euroCup};
if(saveGame(data)){setShowSaveMsg("✓ Oyun kaydedildi!");setTimeout(()=>setShowSaveMsg(""),2500)}}catch(e){setShowSaveMsg("❌ Kayıt başarısız");setTimeout(()=>setShowSaveMsg(""),2500)}};

// Ad placeholder component
const AdSlot=({size,style:s})=><div style={{background:`${T.card}80`,border:`1px dashed ${T.gb}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:T.txd,fontSize:10,fontWeight:600,letterSpacing:".04em",...s}}>{size||"REKLAM ALANI"}</div>;
const launchCupMatch=(home,away,round,idx)=>{setCupMatch({home,away,round,idx})};
const onCupMatchComplete=(res)=>{if(!cupMatch)return;const nc={...euroCup};
if(cupMatch.round.startsWith("grp_")){const gi=parseInt(cupMatch.round.split("_")[1]);nc.groups[gi].fixtures[cupMatch.idx]={...nc.groups[gi].fixtures[cupMatch.idx],result:res};
}else{const m=nc[cupMatch.round][cupMatch.idx];if(m){m.result=res;m.winner=res.hg>res.ag?m.home:res.hg<res.ag?m.away:Math.random()>.5?m.home:m.away}}
setEuroCup(nc);setCupMatch(null)};
// Lifestyle system
const[wallet,setWallet]=useState(0);const[lifestyle,setLifestyle]=useState({car:0,house:0,acc:0});
const[followers,setFollowers]=useState(1000);const[ego,setEgo]=useState(10);const[sponsor,setSponsor]=useState(null);
const[gf,setGf]=useState(null);const[gfHappy,setGfHappy]=useState(50);
const[toasts,setToasts]=useState([]);
const addToast=(icon,text)=>{const id=Date.now()+Math.random();setToasts(t=>[...t,{id,icon,text}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4000)};
const CARS=[{n:"Sıradan Araba",cost:0,rep:0},{n:"Spor Araba",cost:500000,rep:10},{n:"Lüks SUV",cost:1500000,rep:20},{n:"Süper Araba",cost:5000000,rep:35},{n:"Özel Jet",cost:20000000,rep:60}];
const HOUSES=[{n:"Apartman",cost:0,rep:0},{n:"Rezidans",cost:800000,rep:8},{n:"Villa",cost:3000000,rep:20},{n:"Lüks Villa",cost:10000000,rep:40},{n:"Malikane",cost:30000000,rep:70}];
const ACCS=[{n:"Yok",cost:0,rep:0},{n:"Lüks Saat",cost:200000,rep:5},{n:"Marka Set",cost:1000000,rep:15},{n:"Koleksiyon",cost:5000000,rep:30}];
const GF_POOL=[{n:"Emma",job:"Model",img:"👩‍🦰"},{n:"Sofia",job:"Avukat",img:"👩‍💼"},{n:"Luna",job:"Oyuncu",img:"🎬"},{n:"Mia",job:"Sporcu",img:"🏃‍♀️"},{n:"Isla",job:"Şarkıcı",img:"🎤"},{n:"Aria",job:"Doktor",img:"👩‍⚕️"},{n:"Zara",job:"Tasarımcı",img:"👗"},{n:"Nina",job:"Fotoğrafçı",img:"📸"}];
const piScore=()=>{const perf=(myP?.goals||0)*3+(myP?.assists||0)*2;const lifeL=1+lifestyle.car+lifestyle.house;return Math.max(0,~~((perf*3-ego*.5)/Math.max(1,lifeL)))};
const repScore=()=>CARS[lifestyle.car].rep+HOUSES[lifestyle.house].rep+ACCS[lifestyle.acc].rep+(followers/10000);

const cMonth=MO[Math.min(~~(week/4),MO.length-1)]||"May";

const initGame=(tn,lk)=>{gID=0;const f={},w={},sq={};LK.forEach(k=>{const ld=al[k];f[k]=gFx(ld.teams.map(t=>t.name));w[k]=0;ld.teams.forEach(t=>{const s=gSq(ld.ck,t.str,ld.q);s.forEach(p=>p.team=t.name);sq[t.name]=s})});
setAFx(f);setCW(w);setSqs(sq);setWeek(0);setSeason(1);setMorale(65);setUT(tn);setULK(lk);setSL(lk);
setBudget(~~((al[lk]?.q||5)*(al[lk]?.teams.find(t=>t.name===tn)?.str||60)*20000+rn(1e6,5e6)))};

const handleManagerSel=useCallback((tn,lk)=>{initGame(tn,lk)},[LK,al]);

const handleLegendStart=useCallback((playerData)=>{
initGame(playerData.team,playerData.teamLk);
// Add player to team squad
setTimeout(()=>{setSqs(prev=>{const ns={...prev};const sq=[...(ns[playerData.team]||[])];
const newP={id:gID++,name:playerData.name,pos:playerData.pos,age:playerData.age,value:playerData.value,goals:0,assists:0,yellows:0,reds:0,suspended:false,injured:false,forSale:false,team:playerData.team,pot:Math.min(99,playerData.overall+rn(5,15)),pwr:playerData.overall,streak:0,xp:0,isMyPlayer:true};
sq.push(newP);ns[playerData.team]=sq;setMyPlayer(newP);return ns})},100)},[LK,al]);

const[uc1,uc2]=uT?gc(uT):[T.cy,"#1e2040"];
const ld=al[sL];const fx=aFx[sL]||[];const wk=cW[sL]||0;const tw=fx.length;const lgF=wk>=tw&&tw>0;
const st=useMemo(()=>ld?cSt(ld,fx,wk):[],[ld,fx,wk]);
const isUL=sL===uLK;const cWM=fx[wk]||[];const upl=cWM.filter(m=>m.hg===null);const aWP=cWM.length>0&&upl.length===0;
const uMI=cWM.findIndex(m=>m.home===uT||m.away===uT);
const sortM=useMemo(()=>{const ms=[...cWM];if(!isUL||uMI<0)return ms;const u=ms.splice(uMI,1);return[...u,...ms]},[cWM,isUL,uMI]);
const sortI=useMemo(()=>{const ix=cWM.map((_,i)=>i);if(!isUL||uMI<0)return ix;const u=ix.splice(uMI,1);return[...u,...ix]},[cWM,isUL,uMI]);
const allFin=useMemo(()=>LK.every(k=>{const f=aFx[k],w=cW[k];return f&&f.length>0&&w>=f.length}),[aFx,cW,LK]);
const mCol=morale>70?T.li:morale>40?T.go:T.red;

// Update myPlayer ref from sqs
const myP=useMemo(()=>{if(!myPlayer||!uT||!sqs[uT])return null;return sqs[uT].find(p=>p.name===myPlayer.name)||null},[myPlayer,uT,sqs]);

// Week advance
useEffect(()=>{if(aWP&&!lgF&&fx.length>0){clS(sqs,addSocial);setSqs({...sqs});setCW(p=>({...p,[sL]:wk+1}));setWeek(w=>w+1);setWeather(WE[rn(0,3)].id);setBudget(b=>b+50000);
// Legend lifestyle
if(gameMode==="legend"&&myP){
const weeklyWage=~~(myP.pwr*500+2000);setWallet(w=>w+weeklyWage+(sponsor?sponsor.income:0));
// Follower growth
const fGrow=~~((myP.goals||0)*5000+(myP.assists||0)*2000+repScore()*100+rn(100,500));setFollowers(f=>f+fGrow);
// Sponsor check
if(!sponsor&&followers>100000)setSponsor({name:"SportBrand",income:rn(5000,15000)});
if(!sponsor&&followers>500000)setSponsor({name:"Nike",income:rn(20000,50000)});
if(!sponsor&&followers>2000000)setSponsor({name:"Adidas Elite",income:rn(50000,100000)});
// GF happiness
if(gf){setGfHappy(h=>{let nh=h;if(myP.goals>0)nh+=3;if(lifestyle.car>=2)nh+=1;if(Math.random()<.1)nh-=rn(5,10);return Math.max(0,Math.min(100,nh))});
if(Math.random()<.08){const scandals=["kız arkadaşınla lüks restoranda görüntülendin","magazin basını aranızda kriz iddia ediyor","birlikte tatil fotoğrafları sosyal medyayı salladı"];const sc=scandals[rn(0,2)];addToast("💕",sc);addSocial("general",`📸 ${myP.name} ve ${gf.n}: ${sc}`);setFollowers(f=>f+rn(10000,50000));setEgo(e=>Math.min(100,e+3))}
if(gfHappy<=10){addToast("💔",`${gf.n} ile yollarınız ayrıldı!`);addSocial("general",`💔 ${myP.name} ve ${gf.n} ayrıldı!`);setGf(null);setMorale(m=>Math.max(0,m-15))}}
// Random life event
if(Math.random()<.12){const evts=[{t:"🎉 Arkadaşlarınla partiye gittin!",moral:5,ego:3,cond:-2},{t:"💪 Ek antrenman yaptın!",moral:-2,ego:0,cond:5},{t:"🎗️ Hayır kurumuna bağış yaptın!",moral:3,ego:-5,cond:0},{t:"🎮 Evde dinlendin.",moral:2,ego:0,cond:1}];const ev=evts[rn(0,3)];addToast("📋",ev.t);setMorale(m=>Math.min(100,Math.max(0,m+ev.moral)));setEgo(e=>Math.min(100,Math.max(0,e+ev.ego)))}}
// Hype check for legend mode
if(myP&&myP.streak>=3){addSocial("hype",`🔥 ${myP.name} REKORLARI ALT ÜST EDİYOR! Üst üste ${myP.streak} maç gol!`);const ns2={...sqs};const p=ns2[uT]?.find(x=>x.name===myP.name);if(p)p.value=~~(p.value*1.1);setSqs(ns2)}
// Legend mode: incoming transfer offers for YOUR player
if(gameMode==="legend"&&myP&&!legendOffer&&week>8){const form=(myP.goals*2+myP.assists)/(Math.max(1,wk));const chance=(myP.pwr*form)/200+(myP.streak>=3?.2:0);
if(Math.random()<Math.min(.35,chance)){const bigClubs=["Real Madrid","Barcelona","Manchester City","PSG","Bayern München","Liverpool","Chelsea","Juventus","Inter Milan","Arsenal"];const buyer=bigClubs[rn(0,bigClubs.length-1)];if(buyer!==uT){const offerAmt=~~(myP.value*(.8+Math.random()*.5));const wage=~~(myP.pwr*1000+rn(5000,20000));const role=myP.pwr>=80?"Yıldız Oyuncu":myP.pwr>=65?"İlk 11":"Rotasyon";
setLegendOffer({buyer,amount:offerAmt,wage,role});addSocial("transfer",`⚡ FLAŞ! ${buyer} ${myP.name} için resmi teklif yaptı!`)}}}
if(wk+1>=tw){const fs=cSt(ld,fx,wk+1);setCC({league:ld.name,team:fs[0]?.name});setSC(true);setTimeout(()=>setSC(false),4000)}}},[aWP,lgF,sL,wk,tw,ld,fx,sqs,myP]);

useEffect(()=>{if(allFin&&!promo&&!promoShown.current){
// Save standings BEFORE promo changes team lists
const saved={};const cts=[...new Set(Object.values(al).map(l=>l.ck))];
cts.forEach(ck=>{const lk=`${ck}_1`;const ld=al[lk];if(ld)saved[lk]=cSt(ld,aFx[lk]||[],cW[lk]||0)});
prePromoSt.current=saved;
// Generate Euro Cup NOW, before doPr mutates al
if(!euroCup){const ec=genEuroCup(al,aFx,cW,saved);if(ec&&ec.champs.length>0){setEuroCup(ec);addToast("🏆","Avrupa Kupası başladı!");setTimeout(()=>setVw("eurocup"),500)}}
promoShown.current=true;setPromo(doPr(al,aFx,cW))}},[allFin,promo]);
const newSeason=()=>{const f={},w={};LK.forEach(k=>{f[k]=gFx(al[k].teams.map(t=>t.name));w[k]=0});setAFx(f);setCW(w);setWeek(0);setSeason(s=>s+1);setPromo(null);setEuroCup(null);promoShown.current=false;prePromoSt.current=null;Object.values(sqs).forEach(sq=>{if(!Array.isArray(sq))return;sq.forEach(p=>{p.goals=0;p.assists=0;p.yellows=0;p.reds=0;p.suspended=false;p.injured=false;p.streak=0;p.age++;
// Recalculate value with new age factor
const af=p.age<=22?1.5:p.age<=28?1.2:p.age<=33?.8:.4;const oldAf=p.age-1<=22?1.5:p.age-1<=28?1.2:p.age-1<=33?.8:.4;
if(af<oldAf)p.value=~~(p.value*(af/oldAf)) // Age depreciation
})});setSqs({...sqs})};

const toggleSale=pid=>{const ns={...sqs};const sq=[...(ns[uT]||[])];const p=sq.find(x=>x.id===pid);if(p)p.forSale=!p.forSale;ns[uT]=sq;setSqs(ns)};

const launch=useCallback(i=>{const m=cWM[i];if(!m||m.hg!==null)return;const tm={};ld.teams.forEach(t=>(tm[t.name]=t.str));const wM=WE.find(w=>w.id===weather)?.m||1;const isU=m.home===uT||m.away===uT;
let hS=~~(tm[m.home]*wM),aS=~~(tm[m.away]*wM),cardMod=1;
if(isU){const mM=morale>70?1.05:morale<30?.9:1;if(style==="fast"){hS=~~(hS*1.2*mM);aS=~~(aS*1.15)}else if(style==="defend"){hS=~~(hS*.9*mM);aS=~~(aS*.8);cardMod=1.25}else{hS=~~(hS*mM)}}
setMS({lk:sL,wi:wk,mi:i,home:m.home,away:m.away,hs:hS,as:aS,cM:cardMod})},[cWM,ld,sL,wk,uT,style,morale,weather]);

const onLC=useCallback(res=>{const{lk,wi,mi}=mS;const uf={...aFx},lf=[...uf[lk]];const ns={...sqs};
lf[wi]=lf[wi].map((m,i)=>{if(i===mi){aEv(res.events,m.home,m.away,ns);return{...m,hg:res.hg,ag:res.ag,ev:res.events}}return m});uf[lk]=lf;setAFx(uf);setSqs(ns);setMS(null);
if(mS.home===uT||mS.away===uT){const isH=mS.home===uT;const won=isH?res.hg>res.ag:res.ag>res.hg;const lost=isH?res.hg<res.ag:res.ag<res.hg;setMorale(m=>Math.min(100,Math.max(0,m+(won?8:lost?-10:2))));
const winC=["Bu takım şampiyon olur! 🏆","3 puan harika, devam! 💪","Menajer taktik deha! 🧠","Taraftarlar çıldırıyor! 🔥","Lider olmaya layığız!","Rakipler titremeye başladı!"];
const loseC=["Bu ne biçim maç?! 😤","Menajer istifa! 👎","Savunma rezalet...","Taraftarlar stat terk etti","Küme düşme tehlikesi var mı?!","Acil transfer şart!"];
const drawC=["Berabere iyi ama yetmez.","2 puan kaybettik 😐","İdare eder, ama daha iyisini bekliyoruz","Maç sıkıcıydı..."];
if(won){addSocial("win",winC[rn(0,winC.length-1)]);if(res.hg+res.ag>=5||res.hg>=3||res.ag>=3)addSocial("goal",`🔥 Gol düellosu! ${mS.home} ${res.hg}-${res.ag} ${mS.away}`)}
else if(lost){addSocial("loss",loseC[rn(0,loseC.length-1)])}
else{addSocial("draw",drawC[rn(0,drawC.length-1)])}
// Check for top scorer hype
const mySq=sqs[uT]||[];const topG=mySq.reduce((a,b)=>b.goals>a.goals?b:a,{goals:0});
if(topG.goals>=5&&topG.goals%3===0)addSocial("hype",`⭐ ${topG.name} durdurulamıyor! ${topG.goals} gol! Avrupa devleri izliyor...`)
}},[mS,aFx,sqs,uT,wk,cMonth]);

const simRem=useCallback(()=>{if(lgF||!ld)return;const tm={};ld.teams.forEach(t=>(tm[t.name]=t.str));const uf={...aFx},lf=[...uf[sL]];const ns={...sqs};lf[wk]=lf[wk].map(m=>{if(m.hg!==null)return m;const r=prP(tm[m.home],tm[m.away],ns[m.home]||[],ns[m.away]||[]);aEv(r.events,m.home,m.away,ns);return{...m,hg:r.hg,ag:r.ag,ev:r.events}});uf[sL]=lf;setAFx(uf);setSqs(ns)},[lgF,ld,aFx,sL,wk,sqs]);

const simAll=useCallback(()=>{if(sm||lgF||!ld)return;setSm(true);setTimeout(()=>{const tm={};ld.teams.forEach(t=>(tm[t.name]=t.str));const uf={...aFx},lf=[...uf[sL]];const ns={...sqs};for(let w=wk;w<tw;w++){lf[w]=lf[w].map(m=>{if(m.hg!==null)return m;const r=prP(tm[m.home],tm[m.away],ns[m.home]||[],ns[m.away]||[]);aEv(r.events,m.home,m.away,ns);return{...m,hg:r.hg,ag:r.ag,ev:r.events}});clS(ns)}uf[sL]=lf;setAFx(uf);setSqs(ns);setCW(p=>({...p,[sL]:tw}));setSm(false);const fs=cSt(ld,lf,tw);setCC({league:ld.name,team:fs[0]?.name});setSC(true);setTimeout(()=>setSC(false),4e3)},1500)},[sm,lgF,wk,tw,ld,aFx,sL,sqs]);

// Transfer: offers for forSale players
useEffect(()=>{if(!uT||gameMode==="spectator")return;const mySq=sqs[uT]||[];const fs=mySq.filter(p=>p.forSale);if(!fs.length){setOffers([]);return}const no=[];fs.forEach(p=>{if(Math.random()<.4){const at=[];LK.forEach(k=>al[k].teams.forEach(t=>{if(t.name!==uT)at.push(t.name)}));no.push({pid:p.id,pn:p.name,buyer:at[rn(0,at.length-1)],amt:~~(p.value*(.9+Math.random()*.3))})}});setOffers(no)},[week,sqs,uT,gameMode]);
const acceptOffer=o=>{const ns={...sqs};const ms=[...(ns[uT]||[])];const ix=ms.findIndex(p=>p.id===o.pid);if(ix<0||ms.length<=18)return;const[pl]=ms.splice(ix,1);pl.forSale=false;pl.team=o.buyer;ns[uT]=ms;ns[o.buyer]=[...(ns[o.buyer]||[]),pl];setSqs(ns);setBudget(b=>b+o.amt);setOffers(of=>of.filter(x=>x.pid!==o.pid));addSocial("transfer",`💸 ${pl.name} → ${o.buyer} (${fV(o.amt)})`);
// Legend mode: if sold player is MY player, follow to new team with week sync
if(gameMode==="legend"&&myPlayer&&pl.name===myPlayer.name){const newLk=LK.find(k=>al[k].teams.some(t=>t.name===o.buyer));if(newLk){
const newWk=cW[newLk]||0;const curWk=wk;
if(newWk<curWk){const uf={...aFx};const lf=[...uf[newLk]];const tm2={};al[newLk].teams.forEach(t=>(tm2[t.name]=t.str));
for(let w=newWk;w<curWk;w++){if(lf[w])lf[w]=lf[w].map(m=>{if(m.hg!==null)return m;const r=prP(tm2[m.home],tm2[m.away],ns[m.home]||[],ns[m.away]||[]);aEv(r.events,m.home,m.away,ns);return{...m,hg:r.hg,ag:r.ag,ev:r.events}})}
uf[newLk]=lf;setAFx(uf);setCW(p=>({...p,[newLk]:curWk}))}
setUT(o.buyer);setULK(newLk);setSL(newLk);addSocial("transfer",`🌟 ${pl.name} yeni macerası ${o.buyer}'de başlıyor!`)}}};
const handleBuy=(p,amt)=>{const ns={...sqs};const ss=[...(ns[p.team]||[])];const ix=ss.findIndex(x=>x.id===p.id);if(ix<0)return;const[pl]=ss.splice(ix,1);pl.team=uT;pl.forSale=false;ns[p.team]=ss;ns[uT]=[...(ns[uT]||[]),pl];setSqs(ns);setBudget(b=>b-amt);setShowMkt(false);setSigning(pl);addSocial("transfer",`✍️ BOMBA! ${pl.name} ${uT} ile anlaştı!`)};
// Social feed helper
const addSocial=(type,text)=>{const users={"goal":"@SporGazete","transfer":"@TransferMerkezi","win":"@TaraftarUltra","loss":"@FutbolYorumcusu","draw":"@YorumcuAli","hype":"@BreakingFootball","general":"@FutbolHaber"};setSocialFeed(f=>[{id:Date.now()+Math.random(),user:users[type]||"@FutbolHaber",text,time:`${cMonth} H${wk+1}`},...f].slice(0,30))};

const simAllLg=useCallback(()=>{if(sm)return;setSm(true);setTimeout(()=>{const uf={...aFx};const ns={...sqs};const nw={...cW};LK.forEach(k=>{const lg2=al[k];if(!lg2)return;const fx2=uf[k];if(!fx2)return;const w2=nw[k]||0,tw2=fx2.length;if(w2>=tw2)return;const tm2={};lg2.teams.forEach(t=>(tm2[t.name]=t.str));const lf2=[...fx2];for(let w=w2;w<tw2;w++){lf2[w]=lf2[w].map(m=>{if(m.hg!==null)return m;const r=prP(tm2[m.home],tm2[m.away],ns[m.home]||[],ns[m.away]||[]);aEv(r.events,m.home,m.away,ns);return{...m,hg:r.hg,ag:r.ag,ev:r.events}});clS(ns)}uf[k]=lf2;nw[k]=tw2});setAFx(uf);setSqs(ns);setCW(nw);setSm(false)},[sm,aFx,sqs,cW,LK,al])},[sm,aFx,sqs,cW,LK,al]);

// ═══ RENDER ═══
if(!gameMode)return<>{showTutorial&&<Tutorial onClose={()=>setShowTutorial(false)}/>}<ModeSelect onSelect={setGameMode} hasSaveData={hasSave()} onContinue={()=>{const d=loadGame();if(d){
setGameMode(d.gameMode);setUT(d.uT);setULK(d.uLK);setSeason(d.season||1);setWeek(d.week||0);setBudget(d.budget||0);setMorale(d.morale||65);setMyPlayer(d.myPlayer||null);setWeather(d.weather||"sunny");setStyle(d.style||"fast");setReputation(d.reputation||50);setSL(d.sL||d.uLK||"");setVw(d.vw||"matches");
if(d.aFx)setAFx(d.aFx);if(d.cW)setCW(d.cW);if(d.sqs)setSqs(d.sqs);
if(d.socialFeed)setSocialFeed(d.socialFeed);if(d.offers)setOffers(d.offers);
if(d.wallet!==undefined)setWallet(d.wallet);if(d.lifestyle)setLifestyle(d.lifestyle);if(d.followers!==undefined)setFollowers(d.followers);if(d.ego!==undefined)setEgo(d.ego);if(d.sponsor)setSponsor(d.sponsor);if(d.gf)setGf(d.gf);if(d.gfHappy!==undefined)setGfHappy(d.gfHappy);if(d.euroCup)setEuroCup(d.euroCup);
addToast("✓","Oyun yüklendi! Kaldığın yerden devam et.")}}} onTutorial={()=>setShowTutorial(true)}/></>;
if(gameMode==="legend"&&!uT)return<CharCreate al={al} onComplete={d=>{setGameMode("legend");handleLegendStart(d)}}/>;
if(gameMode==="manager"&&!uT)return<TS al={al} onSelect={handleManagerSel}/>;
if(gameMode==="spectator"&&!uT){initGame("_spectator_","turkey_1");return null}
if(!ld)return null;

const th={padding:"9px 7px",textAlign:"center",fontSize:9,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:".05em",borderBottom:`2px solid ${T.accent}20`};
const td={padding:"8px 7px",textAlign:"center",color:T.tx2,fontSize:11};
const cts=[...new Set(Object.values(al).map(l=>l.ck))];

return<div style={{minHeight:"100vh",background:`linear-gradient(160deg,${T.bg} 0%,#1a0f45 40%,${T.bg} 100%)`,color:T.tx,fontFamily:T.font,display:"flex"}}>
<style>{`@keyframes cF{0%{top:-20px;opacity:1}100%{top:110vh;opacity:0;transform:rotate(720deg) translateX(80px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(139,92,246,.2);border-radius:4px}button{cursor:pointer;border:none;outline:none;transition:all .15s ease}button:hover{transform:translateY(-1px);filter:brightness(1.1)}`}</style>
{sC&&<Confetti/>}
{/* Toast Notifications */}
{toasts.length>0&&<div style={{position:"fixed",top:12,right:12,zIndex:10010,display:"flex",flexDirection:"column",gap:6,maxWidth:300}}>
{toasts.map(t=><div key={t.id} style={{padding:"10px 14px",borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.cy}15`}),display:"flex",alignItems:"center",gap:8,animation:"fadeUp .3s ease",boxShadow:`0 4px 20px rgba(0,0,0,.4)`}}>
<span style={{fontSize:16}}>{t.icon}</span><span style={{fontSize:11,fontWeight:600,color:T.tx}}>{t.text}</span>
</div>)}</div>}
{mS&&<MSV hN={mS.home} aN={mS.away} hStr={mS.hs} aStr={mS.as} hSq={sqs[mS.home]} aSq={sqs[mS.away]} onComplete={onLC} uT={uT} cM={mS.cM}/>}
{signing&&<div style={{position:"fixed",inset:0,zIndex:10004,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setSigning(null)}><Confetti/><div style={{textAlign:"center",padding:32}}><div style={{fontSize:13,fontWeight:800,color:"#ef4444",letterSpacing:".2em"}}>🔴 BREAKING</div><div style={{fontSize:40,margin:"8px 0"}}>✍️</div><div style={{fontSize:22,fontWeight:900,color:T.tx}}>{signing.name}</div><div style={{fontSize:12,color:T.txd}}>{signing.pos} • {signing.age}y • {fV(signing.value)}</div><button onClick={()=>setSigning(null)} style={{marginTop:16,padding:"10px 24px",borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.cy}25`}),background:`${T.cy}10`,color:T.cy,fontSize:13,fontWeight:800}}>TAMAM</button></div></div>}
{showMkt&&<Mkt sqs={sqs} uT={uT} budget={budget} onBuy={handleBuy} uc1={uc1} uc2={uc2} onClose={()=>setShowMkt(false)}/>}

{/* Legend Transfer Offer Modal */}
{legendOffer&&<div style={{position:"fixed",inset:0,zIndex:10005,background:"rgba(0,0,0,.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
<div style={{maxWidth:420,width:"100%",...G({padding:24}),textAlign:"center"}}>
<div style={{fontSize:12,fontWeight:800,color:"#ef4444",letterSpacing:".15em",marginBottom:6}}>⚡ FLAŞ GELİŞME</div>
<div style={{fontSize:32,marginBottom:8}}>📋</div>
<div style={{fontSize:18,fontWeight:900,color:T.tx,marginBottom:4}}>{legendOffer.buyer}</div>
<div style={{fontSize:13,color:T.txd,marginBottom:12}}>senin için resmi teklif yaptı!</div>
<div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
<div style={{...G({padding:"10px 16px",borderRadius:10}),textAlign:"center"}}><div style={{fontSize:10,color:T.txd}}>Bonservis</div><div style={{fontSize:16,fontWeight:800,color:T.li}}>{fV(legendOffer.amount)}</div></div>
<div style={{...G({padding:"10px 16px",borderRadius:10}),textAlign:"center"}}><div style={{fontSize:10,color:T.txd}}>Haftalık Maaş</div><div style={{fontSize:16,fontWeight:800,color:T.cy}}>{fV(legendOffer.wage)}</div></div>
<div style={{...G({padding:"10px 16px",borderRadius:10}),textAlign:"center"}}><div style={{fontSize:10,color:T.txd}}>Rol</div><div style={{fontSize:14,fontWeight:800,color:T.go}}>{legendOffer.role}</div></div>
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{
// Accept: move player to new team, follow from same week
const ns={...sqs};const ms=[...(ns[uT]||[])];const ix=ms.findIndex(p=>p.name===myP?.name);
if(ix>=0){const[pl]=ms.splice(ix,1);pl.team=legendOffer.buyer;ns[uT]=ms;ns[legendOffer.buyer]=[...(ns[legendOffer.buyer]||[]),pl];setSqs(ns);
setBudget(b=>b+legendOffer.amount);
const newLk=LK.find(k=>al[k].teams.some(t=>t.name===legendOffer.buyer));
if(newLk){
// Sync: simulate new league up to current global week if behind
const newWk=cW[newLk]||0;const curWk=wk;
if(newWk<curWk){const uf={...aFx};const lf=[...uf[newLk]];const tm2={};al[newLk].teams.forEach(t=>(tm2[t.name]=t.str));
for(let w=newWk;w<curWk;w++){if(lf[w])lf[w]=lf[w].map(m=>{if(m.hg!==null)return m;const r=prP(tm2[m.home],tm2[m.away],ns[m.home]||[],ns[m.away]||[]);aEv(r.events,m.home,m.away,ns);return{...m,hg:r.hg,ag:r.ag,ev:r.events}})}
uf[newLk]=lf;setAFx(uf);setCW(p=>({...p,[newLk]:curWk}))}
setUT(legendOffer.buyer);setULK(newLk);setSL(newLk)}
addSocial("transfer",`✍️ İMZA! ${myP.name} → ${legendOffer.buyer}! Yılın transferi!`);setSigning({name:myP.name,pos:myP.pos,age:myP.age,value:legendOffer.amount})}
setLegendOffer(null)}} style={{flex:1,padding:11,borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.li}25`}),background:`${T.li}10`,color:T.li,fontSize:13,fontWeight:800}}>✓ KABUL ET</button>
<button onClick={()=>{setLegendOffer(null);setMorale(m=>Math.max(0,m-5));addSocial("general",`${myP?.name} ${legendOffer.buyer} teklifini reddetti!`)}} style={{flex:1,padding:11,borderRadius:10,...G({borderRadius:10}),color:T.txd,fontSize:13,fontWeight:700}}>✕ REDDET</button>
</div>
<div style={{fontSize:9,color:T.txd,marginTop:8}}>Kabul edersen yeni takımına geçeceksin.</div>
</div>
</div>}

{/* Promo */}
{promo&&<div style={{position:"fixed",inset:0,zIndex:10001,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflow:"auto"}}><div style={{maxWidth:500,width:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",...G({padding:0})}}>
<div style={{padding:"16px 20px",borderBottom:`1px solid ${T.gb}`,flexShrink:0}}><h2 style={{fontSize:16,fontWeight:800,color:T.tx,margin:0,textAlign:"center"}}>🔄 Sezon {season} Sonu</h2></div>
<div style={{flex:1,overflowY:"auto",padding:"10px 18px",minHeight:0}}>
{promo.filter(c=>c.dir==="u").map((c,i)=><div key={`u${i}`} style={{padding:"6px 8px",borderRadius:6,...G({borderRadius:6,border:`1px solid ${T.li}12`}),marginBottom:3,fontSize:11,color:T.li}}>⬆ <strong>{c.team}</strong> {c.f}</div>)}
{promo.filter(c=>c.dir==="d").map((c,i)=><div key={`d${i}`} style={{padding:"6px 8px",borderRadius:6,...G({borderRadius:6}),marginBottom:3,fontSize:11,color:"#f87171"}}>⬇ <strong>{c.team}</strong> {c.f}</div>)}
</div>
<div style={{padding:"12px 18px",borderTop:`1px solid ${T.gb}`,flexShrink:0}}>
{euroCup&&euroCup.phase!=="done"?<>
<button onClick={()=>{setPromo(null);setVw("eurocup")}} style={{width:"100%",padding:12,borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.go}25`}),background:`${T.go}10`,color:T.go,fontSize:14,fontWeight:900,marginBottom:6,cursor:"pointer"}}>🏆 AVRUPA KUPASI'NA GİT</button>
<div style={{fontSize:10,color:T.txd,textAlign:"center"}}>Kupayı tamamla, sonra yeni sezon başlat</div>
</>:<button onClick={newSeason} style={{width:"100%",padding:12,borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.cy}25`}),background:`${T.cy}10`,color:T.cy,fontSize:14,fontWeight:900,cursor:"pointer"}}>SEZON {season+1} →</button>}
</div>
</div></div>}

{/* Mobile top bar */}
{isMobile&&<div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"8px 12px",background:T.header,borderBottom:`1px solid ${T.gb}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{width:32,height:32,borderRadius:6,background:T.card,color:T.tx,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
<span style={{fontSize:12,fontWeight:800,color:T.tx}}>{uT}</span>
<div style={{display:"flex",gap:4}}>
<button onClick={doSave} style={{padding:"4px 8px",borderRadius:6,background:T.card,color:T.accent,fontSize:10,fontWeight:700}}>💾</button>
<button onClick={()=>setShowTutorial(true)} style={{padding:"4px 8px",borderRadius:6,background:T.card,color:T.txd,fontSize:10}}>❓</button>
</div></div>}

{/* Save indicator */}
{showSaveMsg&&<div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:10011,padding:"8px 18px",borderRadius:8,background:`${T.li}15`,border:`1px solid ${T.li}25`,color:T.li,fontSize:11,fontWeight:700,animation:"fadeUp .3s"}}>{showSaveMsg}</div>}

{/* Tutorial overlay */}
{showTutorial&&<Tutorial onClose={()=>setShowTutorial(false)}/>}

{/* SIDEBAR */}
{(sidebarOpen||!isMobile)&&<div style={{width:isMobile?260:280,minHeight:"100vh",background:`linear-gradient(180deg,${T.sidebar},#0d0828)`,borderRight:`1px solid ${T.gb}`,display:"flex",flexDirection:"column",position:isMobile?"fixed":"sticky",top:isMobile?40:0,left:0,height:isMobile?"calc(100vh - 40px)":"100vh",overflowY:"auto",flexShrink:0,zIndex:isMobile?999:1}}>
{isMobile&&<div style={{position:"absolute",top:4,right:4}}><button onClick={()=>setSidebarOpen(false)} style={{width:24,height:24,borderRadius:6,background:T.card,color:T.txd,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>}
<div style={{padding:"16px 14px",borderBottom:`1px solid ${T.gb}`}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
<div style={{width:42,height:42,borderRadius:10,background:`linear-gradient(135deg,${uc1},${uc2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",boxShadow:`0 4px 12px ${uc1}40`}}>{uT?.charAt(0)}</div>
<div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:T.tx}}>{uT}</div><div style={{fontSize:9,color:T.accent,fontWeight:700,letterSpacing:".04em"}}>{gameMode==="legend"?"⭐ EFSANE OL":gameMode==="spectator"?"📺 İZLEYİCİ":"🏢 MENAJER"}</div></div>
{!isMobile&&<button onClick={doSave} title="Kaydet" style={{width:28,height:28,borderRadius:6,background:T.card,color:T.accent,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>💾</button>}
</div>
{gameMode!=="spectator"&&<div style={{display:"flex",gap:6,marginBottom:6}}>
<div style={{flex:1,padding:"6px 8px",borderRadius:8,background:T.card,textAlign:"center"}}><div style={{fontSize:8,color:T.txd,textTransform:"uppercase",letterSpacing:".06em"}}>Bütçe</div><div style={{fontSize:12,fontWeight:800,color:T.li}}>{fV(budget)}</div></div>
<div style={{flex:1,padding:"6px 8px",borderRadius:8,background:T.card,textAlign:"center"}}><div style={{fontSize:8,color:T.txd,textTransform:"uppercase",letterSpacing:".06em"}}>Sezon</div><div style={{fontSize:12,fontWeight:800,color:T.go}}>S{season}</div></div></div>}
<div style={{fontSize:10,color:T.txd,marginBottom:4}}>📅 {cMonth} • {WE.find(w=>w.id===weather)?.i}</div>
<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:8,color:T.txd}}>Moral</span><div style={{flex:1,height:5,background:T.card,borderRadius:3,overflow:"hidden"}}><div style={{width:`${morale}%`,height:"100%",background:mCol,borderRadius:3,transition:"width .3s",boxShadow:`0 0 8px ${mCol}40`}}/></div><span style={{fontSize:9,color:mCol,fontWeight:800}}>{morale}</span></div>
{/* Legend player stats */}
{myP&&<div style={{marginTop:6,padding:"6px 8px",borderRadius:6,...G({borderRadius:6,border:`1px solid ${T.go}15`}),background:`${T.go}06`}}>
<div style={{fontSize:10,fontWeight:800,color:T.go}}>🌟 {myP.name}</div>
<div style={{fontSize:9,color:T.txd}}>OVR: <strong style={{color:T.cy}}>{Math.round(myP.pwr)}</strong>→<span style={{color:T.li}}>{myP.pot}</span> • ⚽{myP.goals} • 🅰️{myP.assists}</div>
<div style={{fontSize:9,color:T.li}}>{fV(myP.value)} • 💰{fV(wallet)}</div>
<div style={{fontSize:8,color:T.txd}}>👥{followers>=1e6?(followers/1e6).toFixed(1)+"M":(followers/1e3).toFixed(0)+"K"}{gf?` • 💕${gf.n}`:""}{sponsor?` • 🏷️${sponsor.name}`:""}</div>
</div>}
</div>
{/* Leagues */}
<div style={{flex:1,overflowY:"auto",padding:"4px 6px"}}>{cts.map(ck=>{const tiers=[1,2,3].map(t=>`${ck}_${t}`).filter(k=>al[k]);const fl=al[tiers[0]]?.flag;const cn=al[tiers[0]]?.country;
return<div key={ck} style={{marginBottom:3}}><div style={{fontSize:9,fontWeight:700,color:T.txd,padding:"4px 6px",textTransform:"uppercase",letterSpacing:".04em"}}>{fl} {cn}</div>
{tiers.map(k=>{const l=al[k];const sel=sL===k;const f=aFx[k]||[];const w=cW[k]||0;const fin=f.length>0&&w>=f.length;const isU=k===uLK;
return<button key={k} onClick={()=>{setSL(k);setVw("matches")}} style={{width:"100%",display:"flex",alignItems:"center",gap:5,padding:"6px 8px",borderRadius:4,marginBottom:1,background:sel?T.bg3:"transparent",borderLeft:sel?`3px solid ${isU?uc1:T.cy}`:"3px solid transparent",color:sel?T.tx:T.txd,textAlign:"left",fontSize:10,border:"none"}}>
<span style={{fontWeight:600,flex:1}}>{l.tier}.Lig{isU?" ⭐":""}</span><span style={{color:fin?T.li:T.txd,fontSize:8,fontWeight:700}}>{fin?"✓":`${w}/${f.length||"?"}`}</span></button>})}</div>})}</div>
</div>}

{/* MAIN */}
<div style={{flex:1,minWidth:0,overflowY:"auto",height:"100vh",background:`linear-gradient(180deg,${T.bg2},${T.bg})`,paddingTop:isMobile?48:0}}><div style={{padding:isMobile?"12px 10px":"20px 24px",maxWidth:920,margin:"0 auto"}}>
{/* Ad slot - top banner */}
<AdSlot size="REKLAM — 728×90" style={{width:"100%",height:50,marginBottom:12}}/>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:isMobile?36:44,height:isMobile?36:44,borderRadius:10,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?18:24,boxShadow:`0 4px 12px rgba(0,0,0,.3)`}}>{ld.flag}</div><div><h1 style={{fontSize:isMobile?16:20,fontWeight:900,margin:0,color:T.tx}}>{ld.name}</h1><div style={{fontSize:10,color:T.txd}}>Tier {ld.tier} • {cMonth} • {WE.find(w=>w.id===weather)?.i}</div></div></div>
<div style={{padding:"4px 12px",borderRadius:8,background:T.card,fontSize:11,color:T.accent,fontWeight:700}}>H{Math.min(wk+(lgF?0:1),tw)}/{tw}</div></div>

{lgF&&cC&&cC.league===ld.name&&<div style={{padding:"14px 18px",borderRadius:12,background:`linear-gradient(135deg,${T.card},${T.bg3})`,border:`1px solid ${T.go}20`,marginBottom:16,textAlign:"center",boxShadow:`0 4px 20px rgba(251,191,36,.1)`}}><span style={{fontSize:20}}>🏆</span><div style={{fontSize:16,fontWeight:900,color:T.go}}>{cC.team}</div></div>}

{euroCup&&euroCup.phase!=="done"&&<button onClick={()=>setVw("eurocup")} style={{width:"100%",padding:"12px",borderRadius:8,background:`${T.go}08`,border:`1px solid ${T.go}20`,marginBottom:14,cursor:"pointer",textAlign:"center"}}><span style={{fontSize:14,fontWeight:900,color:T.go}}>🏆 AVRUPA KUPASI {euroCup.phase==="qual"?"ÖN ELEME":euroCup.phase==="r16"?"SON 16":euroCup.phase==="qf"?"ÇEYREK FİNAL":euroCup.phase==="sf"?"YARI FİNAL":"FİNAL"} — Tıkla!</span></button>}
{euroCup&&euroCup.champion&&<div style={{padding:"12px 16px",borderRadius:8,background:`${T.go}08`,border:`1px solid ${T.go}20`,marginBottom:14,textAlign:"center"}}><span style={{fontSize:14}}>🏆</span> <span style={{fontSize:14,fontWeight:900,color:T.go}}>Avrupa Şampiyonu: {euroCup.champion.flag} {euroCup.champion.name}</span>
<div style={{marginTop:8}}><button onClick={newSeason} style={{padding:"10px 24px",borderRadius:8,background:`${T.cy}10`,border:`1px solid ${T.cy}20`,color:T.cy,fontSize:13,fontWeight:900,cursor:"pointer"}}>SEZON {season+1}'İ BAŞLAT →</button></div></div>}

{!lgF&&<div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
<button onClick={simAll} disabled={sm} style={{padding:"7px 14px",borderRadius:8,fontWeight:800,fontSize:11,...G({borderRadius:8,border:"1px solid rgba(139,92,246,.18)"}),background:"rgba(139,92,246,.06)",color:"#a78bfa",opacity:sm?.5:1}}>⏩ BU LİG SEZON</button>
<button onClick={simAllLg} disabled={sm} style={{padding:"7px 14px",borderRadius:8,fontWeight:800,fontSize:11,...G({borderRadius:8,border:`1px solid ${T.go}18`}),background:`${T.go}06`,color:T.go,opacity:sm?.5:1}}>🌍 36 LİG SİMÜLE</button>
{(cMonth==="Ağu"||cMonth==="Oca")&&gameMode!=="spectator"&&<button onClick={()=>setShowMkt(true)} style={{padding:"7px 14px",borderRadius:8,fontWeight:800,fontSize:11,...G({borderRadius:8,border:`1px solid ${T.cy}18`}),background:`${T.cy}06`,color:T.cy}}>🏪 TRANSFER PAZARI</button>}
</div>}
{lgF&&!allFin&&<div style={{display:"flex",gap:5,marginBottom:14}}>
<button onClick={simAllLg} disabled={sm} style={{padding:"6px 12px",borderRadius:8,fontWeight:800,fontSize:10,...G({borderRadius:8,border:`1px solid ${T.go}18`}),background:`${T.go}06`,color:T.go}}>🌍 36 LİG</button>
</div>}

{/* Tabs */}
<div style={{display:"flex",gap:3,marginBottom:14,flexWrap:"wrap"}}>
{[{k:"matches",l:`HAFTA ${Math.min(wk+(lgF?0:1),tw)}`},{k:"standings",l:"PUAN"},{k:"squad",l:"KADRO"},{k:"offers",l:`📨${offers.length?` (${offers.length})`:""}`},gameMode==="legend"?{k:"life",l:"💎 HAYAT"}:null,euroCup?{k:"eurocup",l:"🏆 KUPA"}:null,{k:"social",l:"📱"},{k:"results",l:"GEÇMİŞ"}].filter(Boolean).map(t=>
<button key={t.k} onClick={()=>setVw(t.k)} style={{padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:700,...G({borderRadius:8,border:`1px solid ${vw===t.k?`${uc1}20`:T.gb}`}),background:vw===t.k?`${uc1}08`:T.glass,color:vw===t.k?uc1:T.txd}}>{t.l}</button>)}</div>

{/* MATCHES */}
{vw==="matches"&&!lgF&&<div style={{animation:"fadeUp .3s"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:5}}>
<div style={{fontSize:14,fontWeight:800,color:T.tx}}>Hafta {wk+1}</div>
{upl.length>0&&<button onClick={simRem} style={{padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:800,...G({borderRadius:8,border:"1px solid rgba(239,68,68,.15)"}),background:"rgba(239,68,68,.06)",color:"#f87171"}}>⚡ {upl.length===cWM.length?"TÜM HAFTA":`KALAN ${upl.length}`}</button>}</div>
{isUL&&uMI>=0&&cWM[uMI]?.hg===null&&<div style={{marginBottom:10,padding:"12px",...G({border:`1px solid ${uc1}15`})}}>
<div style={{fontSize:9,fontWeight:800,color:uc1,marginBottom:6}}>⭐ SENİN MAÇIN</div>
{(()=>{const m=cWM[uMI];return<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{flex:1,textAlign:"right",fontSize:14,fontWeight:800,color:m.home===uT?uc1:T.tx}}>{m.home}</div>
<button onClick={()=>launch(uMI)} style={{padding:"8px 20px",borderRadius:10,...G({borderRadius:10,border:`1px solid ${uc1}25`}),background:`${uc1}10`,color:uc1,fontSize:12,fontWeight:800}}>▶ CANLI</button>
<div style={{flex:1,fontSize:14,fontWeight:800,color:m.away===uT?uc1:T.tx}}>{m.away}</div></div>})()}
</div>}
<div style={{display:"flex",flexDirection:"column",gap:4}}>{sortM.map((m,si)=>{const oi=sortI[si];const pl=m.hg!==null;const isU=m.home===uT||m.away===uT;if(isUL&&isU&&!pl)return null;
return<div key={oi} style={{display:"flex",alignItems:"center",padding:"9px 12px",borderRadius:8,...G({borderRadius:8}),gap:6}}>
<div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:pl&&m.hg>m.ag?T.tx:T.txd}}>{m.home}</div>
{pl?<div style={{minWidth:50,textAlign:"center",fontWeight:900,fontSize:15,color:"#fff"}}>{m.hg}-{m.ag}</div>
:<button onClick={()=>launch(oi)} style={{minWidth:50,padding:"5px 8px",borderRadius:6,...G({borderRadius:6,border:`1px solid ${T.cy}18`}),background:`${T.cy}06`,color:T.cy,fontSize:10,fontWeight:800}}>▶</button>}
<div style={{flex:1,fontSize:12,fontWeight:600,color:pl&&m.ag>m.hg?T.tx:T.txd}}>{m.away}</div></div>})}</div>
{upl.length===0&&<div style={{marginTop:10,padding:"10px",borderRadius:8,...G({borderRadius:8,border:`1px solid ${T.li}12`}),textAlign:"center",fontSize:12,color:T.li,fontWeight:700}}>✅ Hafta bitti!</div>}
</div>}
{vw==="matches"&&lgF&&<div style={{color:T.txd,padding:16,textAlign:"center"}}>Lig tamamlandı.</div>}

{/* STANDINGS */}
{vw==="standings"&&<div style={{...G({borderRadius:10}),overflow:"hidden",animation:"fadeUp .3s"}}>
<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.bg3}}><th style={th}>#</th><th style={{...th,textAlign:"left"}}>Takım</th><th style={th}>O</th><th style={th}>G</th><th style={th}>B</th><th style={th}>M</th><th style={th}>AV</th><th style={{...th,color:T.go}}>P</th></tr></thead>
<tbody>{st.map((t,i)=>{const isU=t.name===uT;const pZ=i<3&&ld.tier>1;const rZ=i>=st.length-3&&ld.tier<3;
return<tr key={t.name} style={{background:isU?`${uc1}06`:pZ?`${T.li}03`:rZ?"rgba(239,68,68,.02)":"transparent",borderBottom:`1px solid ${T.gb}`}}>
<td style={{...td,fontWeight:800,fontSize:9,color:isU?uc1:pZ?T.li:rZ?"#ef4444":T.txd}}>{i+1}{pZ?"⬆":rZ?"⬇":""}</td>
<td style={{...td,textAlign:"left",fontWeight:isU?800:600,color:isU?uc1:i===0?T.tx:T.txd}}>{isU&&"⭐"}{t.name}</td>
<td style={td}>{t.p}</td><td style={{...td,color:T.li}}>{t.w}</td><td style={td}>{t.d}</td><td style={{...td,color:"#ef4444"}}>{t.l}</td>
<td style={{...td,color:(t.gf-t.ga)>=0?T.li:"#ef4444"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</td>
<td style={{...td,fontWeight:900,color:isU?uc1:T.go,fontSize:13}}>{t.pts}</td></tr>})}</tbody></table></div>}

{/* SQUAD */}
{vw==="squad"&&ld&&<div style={{animation:"fadeUp .3s"}}><SqV teams={ld.teams} sqs={sqs} uT={uT} uc1={uc1} onToggleSale={gameMode!=="spectator"?toggleSale:null} myPlayer={myP}/></div>}

{/* SOCIAL */}
{/* EURO CUP */}
{vw==="eurocup"&&euroCup&&<EuroCup cup={euroCup} setCup={setEuroCup} sqs={sqs} uT={uT} onLiveMatch={launchCupMatch}/>}
{cupMatch&&<MSV hN={cupMatch.home.name} aN={cupMatch.away.name} hStr={cupMatch.home.str} aStr={cupMatch.away.str} hSq={sqs[cupMatch.home.name]} aSq={sqs[cupMatch.away.name]} onComplete={onCupMatchComplete} uT={uT} cM={1}/>}

{/* LIFESTYLE */}
{vw==="life"&&gameMode==="legend"&&<div style={{animation:"fadeUp .3s"}}>
<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
{/* Stats cards */}
<div style={{flex:1,minWidth:120,...G({padding:14,borderRadius:10})}}>
<div style={{fontSize:9,color:T.txd}}>💰 Cüzdan</div><div style={{fontSize:18,fontWeight:900,color:T.li}}>{fV(wallet)}</div>
</div>
<div style={{flex:1,minWidth:120,...G({padding:14,borderRadius:10})}}>
<div style={{fontSize:9,color:T.txd}}>👥 Takipçi</div><div style={{fontSize:18,fontWeight:900,color:T.cy}}>{followers>=1e6?(followers/1e6).toFixed(1)+"M":followers>=1e3?(followers/1e3).toFixed(0)+"K":followers}</div>
</div>
<div style={{flex:1,minWidth:120,...G({padding:14,borderRadius:10})}}>
<div style={{fontSize:9,color:T.txd}}>⭐ İtibar</div><div style={{fontSize:18,fontWeight:900,color:T.go}}>{~~repScore()}</div>
</div>
<div style={{flex:1,minWidth:120,...G({padding:14,borderRadius:10})}}>
<div style={{fontSize:9,color:T.txd}}>😎 Ego</div><div style={{fontSize:18,fontWeight:900,color:ego>50?"#ef4444":T.cy}}>{ego}</div>
</div>
</div>
{/* Sponsor */}
{sponsor&&<div style={{marginBottom:12,padding:"10px 14px",borderRadius:10,...G({borderRadius:10,border:`1px solid ${T.go}15`}),background:`${T.go}06`}}>
<div style={{fontSize:11,fontWeight:800,color:T.go}}>🏷️ Sponsor: {sponsor.name}</div>
<div style={{fontSize:10,color:T.txd}}>Haftalık: {fV(sponsor.income)}</div></div>}
{/* GF */}
<div style={{marginBottom:14,...G({padding:14,borderRadius:10})}}>
<div style={{fontSize:12,fontWeight:800,color:T.tx,marginBottom:8}}>💕 İlişki Durumu</div>
{gf?<div>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{fontSize:32}}>{gf.img}</div>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.tx}}>{gf.n}</div><div style={{fontSize:10,color:T.txd}}>{gf.job}</div>
<div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:8,color:T.txd}}>Mutluluk</span><div style={{flex:1,height:4,background:T.bg3,borderRadius:2,overflow:"hidden"}}><div style={{width:`${gfHappy}%`,height:"100%",background:gfHappy>50?T.pink:T.red,transition:"width .3s"}}/></div><span style={{fontSize:8,color:T.pink}}>{gfHappy}</span></div></div>
</div>
<button onClick={()=>{addToast("💔",`${gf.n} ile ayrıldın.`);addSocial("general",`💔 ${myP?.name} ve ${gf.n} ayrıldı! "${gf.n}: İyi ki bitmişiz."`);setGf(null);setGfHappy(50);setMorale(m=>Math.max(0,m-8));setFollowers(f=>f+rn(20000,80000))}} style={{padding:"6px 12px",borderRadius:6,background:T.bg3,border:`1px solid ${T.red}20`,color:T.red,fontSize:10,fontWeight:700,cursor:"pointer"}}>💔 Ayrıl</button>
</div>
:<div><div style={{fontSize:10,color:T.txd,marginBottom:8}}>Bekar — Tanışma teklifi gönder:</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{GF_POOL.map(g=>{const chance=Math.min(90,20+repScore()*.5+(myP?.pwr||50)*.3);return<button key={g.n} onClick={()=>{if(Math.random()*100<chance){setGf(g);setGfHappy(60);addToast("💕",`${g.n} ile birliktesiniz!`);addSocial("general",`💕 ${myP?.name} ve ${g.n} (${g.job}) birlikte görüntülendi!`)}else{addToast("😔",`${g.n} teklifinizi reddetti.`)}}} style={{padding:"8px 10px",borderRadius:8,...G({borderRadius:8}),display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
<span style={{fontSize:20}}>{g.img}</span><div style={{textAlign:"left"}}><div style={{fontSize:11,fontWeight:700,color:T.tx}}>{g.n}</div><div style={{fontSize:9,color:T.txd}}>{g.job} • %{~~chance}</div></div></button>})}</div></div>}
</div>
{/* Shop */}
<div style={{fontSize:12,fontWeight:800,color:T.tx,marginBottom:8}}>🛒 Lüks Market</div>
{[{title:"🚗 Ulaşım",items:CARS,key:"car"},{title:"🏠 Gayrimenkul",items:HOUSES,key:"house"},{title:"💎 Aksesuar",items:ACCS,key:"acc"}].map(cat=>
<div key={cat.key} style={{marginBottom:10}}>
<div style={{fontSize:10,fontWeight:700,color:T.cy,marginBottom:4}}>{cat.title}</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{cat.items.map((item,i)=>{const owned=lifestyle[cat.key]>=i;const canBuy=wallet>=item.cost&&lifestyle[cat.key]===i-1;
return<button key={i} onClick={()=>{if(canBuy){setWallet(w=>w-item.cost);setLifestyle(l=>({...l,[cat.key]:i}));setEgo(e=>Math.min(100,e+item.rep/3));addToast("🛍️",`${item.n} satın alındı!`);addSocial("general",`💎 ${myP?.name} ${item.n} satın aldı!`);setFollowers(f=>f+item.rep*1000)}}} style={{padding:"8px 10px",borderRadius:8,...G({borderRadius:8,border:`1px solid ${owned?T.li+"20":canBuy?T.cy+"20":T.gb}`}),background:owned?`${T.li}08`:canBuy?`${T.cy}06`:T.glass,color:owned?T.li:canBuy?T.cy:T.txd,cursor:canBuy?"pointer":"default",opacity:!owned&&!canBuy?.4:1}}>
<div style={{fontSize:10,fontWeight:700}}>{item.n}</div>
{item.cost>0&&<div style={{fontSize:8,color:T.txd}}>{fV(item.cost)}{owned?" ✓":""}</div>}
</button>})}</div></div>)}
</div>}

{/* OFFERS */}
{vw==="offers"&&<div style={{animation:"fadeUp .3s"}}>
<div style={{fontSize:15,fontWeight:800,color:T.tx,marginBottom:10}}>📨 GELEN TEKLİFLER</div>
{offers.length===0&&<div style={{padding:16,textAlign:"center",color:T.txd,...G({borderRadius:10})}}>Teklif yok. Kadro'dan oyuncu satışa koyun.</div>}
{offers.map((o,i)=>{const[bc]=gc(o.buyer);return<div key={i} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderRadius:10,...G({borderRadius:10}),marginBottom:5,gap:8}}>
<div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${bc},#1a1a3e)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>{o.buyer.charAt(0)}</div>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:T.tx}}>{o.pn}</div><div style={{fontSize:9,color:T.txd}}>{o.buyer}</div></div>
<div style={{fontSize:13,fontWeight:800,color:T.li}}>{fV(o.amt)}</div>
<button onClick={()=>acceptOffer(o)} style={{padding:"5px 12px",borderRadius:6,...G({borderRadius:6,border:`1px solid ${T.li}20`}),background:`${T.li}08`,color:T.li,fontSize:10,fontWeight:800}}>KABUL</button>
<button onClick={()=>setOffers(of=>of.filter(x=>x.pid!==o.pid))} style={{padding:"5px 8px",borderRadius:6,...G({borderRadius:6}),color:T.txd,fontSize:10,fontWeight:700}}>✕</button>
</div>})}
</div>}

{vw==="social"&&<div style={{animation:"fadeUp .3s"}}>
<div style={{fontSize:15,fontWeight:800,color:T.tx,marginBottom:10}}>📱 SOSYAL MEDYA</div>
{socialFeed.length===0&&<div style={{padding:16,textAlign:"center",color:T.txd,...G({borderRadius:10})}}>Henüz paylaşım yok.</div>}
{socialFeed.map(p=><div key={p.id} style={{padding:"10px 14px",borderRadius:10,...G({borderRadius:10}),marginBottom:5}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:800,color:T.cy}}>{p.user}</span><span style={{fontSize:9,color:T.txd}}>{p.time}</span></div>
<div style={{fontSize:12,color:T.tx}}>{p.text}</div></div>)}
</div>}

{/* RESULTS */}
{vw==="results"&&<div style={{animation:"fadeUp .3s"}}><RV fx={fx} cw={wk} uT={uT} uc1={uc1}/></div>}

{/* Ad slot - bottom of content */}
<AdSlot size="REKLAM — 300×250" style={{width:"100%",maxWidth:300,height:160,margin:"16px auto"}}/>

</div></div>

{/* RIGHT: LIVE FEED - hidden on mobile */}
{!isMobile&&<LiveFeed socialFeed={socialFeed} uT={uT}/>}

</div>;}
