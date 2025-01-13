// /////////////////////////////////////////

// JavaScript to control the welcome pop-up and filter over map
const popup = document.getElementById('welcome-popup');
const enterButton = document.getElementById('enterButton');
const backgroundFilter = document.getElementById('background-filter');

// Show the pop-up and filter when the page loads
window.onload = () => {
    popup.style.display = 'block';
    backgroundFilter.style.display = 'block'; // Show the filter
};

// Hide the pop-up and filter when the "Enter" button is clicked
enterButton.addEventListener('click', () => {
    popup.style.display = 'none';
    backgroundFilter.style.display = 'none'; // Hide the filter
});

// /////////////////////////////////////////

//create variables for map location
const map_location_left=[51.436985789108306,5.464274124489311]
const map_location_right=[51.436985789108306,5.464274124489311]

// /////////////////////////////////////////

const map_left = L.map('map_left', {
    zoomControl: false});
const map_right = L.map('map_right', { 
    zoomControl: false});



L.control.zoom({
    position: 'bottomleft'
}).addTo(map_left);

L.control.zoom({
    position: 'bottomright'
}).addTo(map_right);

map_left.setView(map_location_left, 13);
map_right.setView(map_location_right, 13);

//var hash = new L.Hash(map_left);
// Adding a background map 
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 }).addTo(map_left);

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


//creat empty layers for category buttons

const newLayer_left_Map = L.geoJson ()
const newLayer_left_Ground = L.geoJson ()
const newLayer_left_Trees = L.geoJson ()
const newLayer_left_Sound = L.geoJson ()

const newLayer_right_Map = L.geoJson ()
const newLayer_right_Ground = L.geoJson ()
const newLayer_right_Trees = L.geoJson ()
const newLayer_right_Sound = L.geoJson ()



// Using GeoJSON to render photos on the  map
fetchData = () => {
    fetch(
        "../data/Trees_signs_merged.geojson"
    )
        .then((response) => response.json())
        .then((geojson) => {



            // left layer
            const myPhotosLayer_left = L.geoJson(geojson, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties.layer === chosenCategory) {
                        var imageUrl = feature.properties.filename;
                        var photoIcon = createPhotoIcon(imageUrl);
                        
                        /// ADD: popup with audio, access file name from geoGson
                        //<audio src ="${feature.properties.filename}" type = "wav"/>

                        // Set the custom icon on the layer
                        layer.setIcon(photoIcon);
                    }
                }
            });

            // right layer
            const myPhotosLayer_right = L.geoJson(geojson, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties.layer === chosenCategory) {
                        var imageUrl = feature.properties.filename;
                        var photoIcon = createPhotoIcon(imageUrl);

                        // Set the custom icon on the layer
                        layer.setIcon(photoIcon);
                    }
                }
            });
            myPhotosLayer_left.addTo(map_left);
            myPhotosLayer_right.addTo(map_right);


        })
}

fetchData()

/////////////////////////

// map locations , we had to reverse lat and lon coordinates
const ourLocations={

Military: [51.4836017378253,5.36258159765619],
Canal: [51.4933530712901, 5.38188283867369],
Best: [51.5061290558538,5.38267018682391],
Oirschot: [51.496408741217, 5.33606503906852]

}

//function change the location on click
const locationButton = (location, position) => {

    if (position === "left"){
        map_left.setView(ourLocations[location], 14        );
    }

    if (position === "right"){
        map_right.setView(ourLocations[location], 14        );
    }

}


const categoryButton = (category) => {

    console.log(category)

}

