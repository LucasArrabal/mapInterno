var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 1
});

var bounds = [[0, 0], [1000, 1000]];
var image = L.imageOverlay('./planta.svg', bounds).addTo(map);
map.fitBounds(bounds);

map.on('click', function (e) {
    console.log("Você clicou no mapa em x: " + e.latlng.lat + " e y: " + e.latlng.lng);
});

const graph = {
    'Entrada': { 'Esquina1': 1, 'Eletronica': 5, 'Roupa': 10 },
    'Esquina1': { 'Eletronica': 2, 'Roupa': 3, 'Reta': 0 },
    'Reta': { 'Esquina2': 0 },
    'Eletronica': { 'Entrada': 5, 'Roupa': 1, 'Saida': 7, 'Esquina2': 2 },
    'Roupa': { 'Entrada': 10, 'Eletronica': 3, 'Casa': 3, 'Esquina2': 1 },
    'Esquina2': { 'Saida': 1 },
    'Casa': { 'Roupa': 3, 'Saida': 2 },
    'Saida': { 'Eletronica': 7, 'Casa': 2 }
};


function getLatLongFromAPI() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            var userLat = position.coords.latitude;
            var userLong = position.coords.longitude;
            // var userLat = -23.6183674;
            // var userLong = -46.5789418;
            resolve({ latitude: userLat, longitude: userLong });
        }, err => {
            reject(err);
        });
    });
}

// Coordenadas geográficas dos cantos e coordenadas correspondentes no mapa interno
// Diferenças físicas médias (latitude e longitude)
const corners = {
    fundoDireito: { lat: -23.6180424, long: -46.5796396, x: 677.2, y: 260.4 },
    fundoEsquerdo: { lat: -23.6180878, long: -46.5795774, x: 377.2, y: 260.4 },
    frenteEsquerdo: { lat: -23.6183554, long: -46.5790546, x: 374.2, y: 518 },
    frenteDireito: { lat: -23.6178546, long: -46.5789685, x: 675.2, y: 518 }
};

const escalaX = (corners.fundoDireito.x - corners.fundoEsquerdo.x) / (corners.fundoDireito.long - corners.fundoEsquerdo.long);

// Escala para Latitude (Y)
const escalaY = (corners.frenteEsquerdo.y - corners.fundoEsquerdo.y) / (corners.frenteEsquerdo.lat - corners.fundoEsquerdo.lat);

function convertLatLongToIndoorXY(latitude, longitude) {
    console.log(latitude, longitude)
    const x = (longitude - corners.fundoEsquerdo.long) * escalaX + corners.fundoEsquerdo.x;
    const y = (latitude - corners.fundoEsquerdo.lat) * escalaY + corners.fundoEsquerdo.y; // Inverte a direção pois a latitude diminui para o sul

    console.log(x, y)
    return { x, y };
}

// Função para adicionar um pin no mapa indoor com Leaflet
function addPinToIndoorMap(x, y) {
    L.marker([x, y]).addTo(map)
        .bindPopup('Localização no mapa indoor.').openPopup();
}

// Função principal para integrar os processos
async function integrateAPIWithIndoorMap() {
    const { latitude, longitude } = await getLatLongFromAPI(); // Obter lat e long da API

    // console.log(latitude, longitude)

    const { x, y } = convertLatLongToIndoorXY(latitude, longitude); // Converter para coordenadas do mapa indoor

    console.log(x, y)

    // addPinToIndoorMap(x, y); // Adicionar pin no mapa indoor
}
map.on('click', function(e){
    var coord = e.latlng;
    var view = L.marker(coord).addTo(map);
    view.bindPopup("clicou aqui").openPopup();
});

// Chamar a função principal
integrateAPIWithIndoorMap();


// // Implementação simplificada do algoritmo de Dijkstra
// function dijkstra(graph, start, end) {
//     let distances = {};
//     let prev = {};
//     let nodes = Object.keys(graph);
//     let visited = new Set();

//     nodes.forEach(node => distances[node] = node === start ? 0 : Infinity);

//     while (nodes.length) {
//         nodes.sort((a, b) => distances[a] - distances[b]);
//         const closest = nodes.shift();

//         if (closest === end) break;

//         for (const neighbor in graph[closest]) {
//             const dist = distances[closest] + graph[closest][neighbor];
//             if (dist < distances[neighbor]) {
//                 distances[neighbor] = dist;
//                 prev[neighbor] = closest;
//             }
//         }
//     }

//     const path = [];
//     let cur = end;
//     while (prev[cur] !== undefined) {
//         path.unshift(cur);
//         cur = prev[cur];
//     }

//     if (cur === start) path.unshift(start);

//     return path;
// }

// document.getElementById('findRoute').addEventListener('click', function () {
//     var start = document.getElementById('startLocation').value;
//     var end = document.getElementById('endLocation').value;

//     var path = dijkstra(graph, start, end);

//     // Remove caminhos anteriores
//     map.eachLayer(function (layer) {
//         if (layer instanceof L.Polyline) {
//             map.removeLayer(layer);
//         }
//     });

//     if (path.length > 1) {
//         // Converte os nomes dos locais para coordenadas e desenha a rota
//         var pathCoords = path.map(name => {
//             switch (name) {
//                 case 'Entrada': return [719, 498];
//                 case 'Esquina1': return [678, 284]
//                 case 'Eletronica': return [600, 210];
//                 case 'Roupa': return [378, 796];
//                 case 'Reta': return [504, 284]
//                 case 'Esquina2': return [312, 284]
//                 case 'Casa': return [220, 798];
//                 case 'Saida': return [256, 502];
//                 default: return null;
//             }
//         });

//         var polyline = L.polyline(pathCoords, { color: 'red' }).addTo(map);
//         map.fitBounds(polyline.getBounds());
//     } else {
//         alert('Não foi possível encontrar uma rota.');
//     }
// });