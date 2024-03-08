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
var userLat = 0;
var userLong = 0;


const getCoord = () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(Position, Erro);
    }else{
        alert("Geolocalização não é suportado pelo Browser");
    }
};

const Position = (position) => {
    userLat = -23.6183674;
    userLong = -46.5789418; 
    console.log("Latitude: "+ userLat +" Longitude: " + userLong );

    L.marker([userLat ,userLong]).addTo(map).bindPopup('Localização no mapa indoor.').openPopup();

}
const Erro = (error) => {
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("Localização desligada");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Localização não está disponivel");
            break; 
            default:
                alert("erro desconhecido");  
    }
}
//getCoord();

map.on('click', function(e){
    var coord = e.latlng;
    var view = L.marker(coord).addTo(map);
    view.bindPopup("clicou aqui").openPopup();
});

function realToMapCoordinates(realCoords) {
    // Bounds do mapa
    var mapBounds = map.getBounds();
    var mapWidth = mapBounds.getEast() - mapBounds.getWest();
    var mapHeight = mapBounds.getSouth() - mapBounds.getNorth();

    // Bounds da imagem
    var imageBounds = image.getBounds();
    var imageWidth = imageBounds.getEast() - imageBounds.getWest();
    var imageHeight = imageBounds.getSouth() - imageBounds.getNorth();

    // Fator de escala
    var scaleX = mapWidth / imageWidth;
    var scaleY = mapHeight / imageHeight;

    // Coordenadas no mapa
    var mapX = (realCoords[1] - imageBounds.getWest()) * scaleX;
    var mapY = (imageBounds.getSouth() - realCoords[0]) * scaleY;

    return [mapY, mapX];
}
// Suponha que você tenha coordenadas reais [latitude, longitude]
var realCoords = [userLat, userLong];

// Converter coordenadas reais para coordenadas do mapa
var mapCoords = realToMapCoordinates(realCoords);

// Adicionar marcador ao mapa usando as coordenadas do mapa
//L.marker(mapCoords).addTo(map).bindPopup('Localização no mapa indoor.').openPopup();
