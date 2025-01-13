const map = L.map('map', {});

map.setView([51.436985789108306, 5.464274124489311], 13);
var hash = new L.Hash(map);
// Adding a background map 
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// Set the variables used 
const photoLocation = "../data";
const chosenCategory = "Trees";

// Function to create a custom icon for each marker (photo as the icon)
function createPhotoIcon(imageUrl) {
    return L.divIcon({
        className: 'photo-icon',
        html: `<img src="${photoLocation}/${imageUrl}.JPG" style="width: 100px; height: auto;">`,
        iconSize: [50, 50], // Set the size of the icon
        iconAnchor: [25, 25] // Center the image in the icon
    });
}
// Using GeoJSON to render photos on the  map
fetchData = () => {
    fetch(
        "../data/Trees_signs_merged.geojson"
    )
        .then((response) => response.json())
        .then((geojson) => {
            const myPhotosLayer = L.geoJson(geojson, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties.layer === chosenCategory) {
                        var imageUrl = feature.properties.filename;
                        var photoIcon = createPhotoIcon(imageUrl);

                        // Set the custom icon on the layer
                        layer.setIcon(photoIcon);
                    }
                }
            }).addTo(map);


        })
}

map.on('load', fetchData())

