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

//creat map_left and Map_right
const map_left = L.map('map_left', {
    zoomControl: false});
const map_right = L.map('map_right', { 
    zoomControl: false});


//change zoombutton position
L.control.zoom({
    position: 'bottomleft'
}).addTo(map_left);

L.control.zoom({
    position: 'bottomright'
}).addTo(map_right);

map_left.setView(map_location_left, 12);
map_right.setView(map_location_right, 12);


// Adding a background map 
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 }).addTo(map_left);

 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map_right);

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

// Define layer groups for each map
var layerGroupLeft = L.layerGroup().addTo(map_left);
var layerGroupRight = L.layerGroup().addTo(map_right);


// Using GeoJSON to render photos on the  map
fetchData = () => {
    fetch(
        "../data/Website Items_with relative Filepaths.geojson"
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

                            // repository/phozos/ground.filename ../ how to relative filepath!!!!!!

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
                        console.log("Banana zone")
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

// map start up locations 
const ourLocations={

Military: [51.4836017378253,5.36258159765619],
Canal: [51.4933530712901, 5.38188283867369],
Best: [51.5061290558538,5.38267018682391],
Oirschot: [51.496408741217, 5.33606503906852]

}


// Bounding box Coordinates
const ourBBMinMaxCoord={

    //Min
    Oirschot_min: [51.493999186096,5.33159002071537],
    Military_min: [51.4809726107094,5.35842826187457],
    Canal_min: [51.4900286009849,5.37669441081177],
    Best_min: [51.5029743115137,5.37683652289951],

    //max
    Oirschot_max: [51.5007934334576,5.34217031310066],
    Military_max: [51.4864966891659,5.3669799878723],
    Canal_max: [51.4965471706786,5.38612022990409],
    Best_max: [51.5087686314987,5.38670028090874]

}

// creat boundingbox coordinates for "setMaxBounds" function

const ourBoundingBoxes={

     BoundingBox_Oirschot:  L.latLngBounds(ourBBMinMaxCoord.Oirschot_min, ourBBMinMaxCoord.Oirschot_max),
     BoundingBox_Military:  L.latLngBounds(ourBBMinMaxCoord.Military_min, ourBBMinMaxCoord.Military_max),
     BoundingBox_Canal:  L.latLngBounds(ourBBMinMaxCoord.Canal_min, ourBBMinMaxCoord.Canal_max),
     BoundingBox_Best:  L.latLngBounds(ourBBMinMaxCoord.Best_min, ourBBMinMaxCoord.Best_max)

}


//function change the location on click
const locationButton = (location, position) => {

    if (position === "left"){
        map_left.setView(ourLocations[location], 17       );
        map_left.setMaxBounds(ourBoundingBoxes["BoundingBox_"]);
    }

    if (position === "right"){
        map_right.setView(ourLocations[location], 17        );
        map_right.setMaxBounds(ourBoundingBoxes["BoundingBox_"]);
    }

}

/*/function returns category as a string when checkbox is clicked
const categoryButton = (category) => {

    console.log(category)
    
    if (category = "ground"){

        //create popup markers with ground images
    }

    else{

        //remove popup markers with ground images
    }
   

}

/*define Geojson data

// Example GeoJSON data
const geojsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.09, 51.505]
        },
        "properties": {
          "category": "Ground",
          "image": "path/to/ground.jpg"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.1, 51.506]
        },
        "properties": {
          "category": "Signs",
          "image": "path/to/sign.jpg"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.11, 51.507]
        },
        "properties": {
          "category": "Trees",
          "image": "path/to/trees.jpg"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.12, 51.508]
        },
        "properties": {
          "category": "Sound",
          "image": "path/to/sound.jpg"
        }
      }
    ]
  };
  */



//////
// Path to your GeoJSON file
const geojsonFilePath = '../data/Website Items_with relative Filepaths.geojson';

// Global variable to hold the processed data
let geojsonData = [];

// Function to load and process the GeoJSON file
const loadGeoJSONData = () => {
    fetch(geojsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load GeoJSON file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Parse the required fields
            geojsonData = data.features.map(feature => ({
                category: feature.properties.Category,
                filepath: feature.properties.filepath_relative,
                coordinates: [feature.properties.longitude, feature.properties.latitude],
            }));
            console.log("GeoJSON Data Loaded:", geojsonData);

            // Optionally, you can add markers to the maps on load
            addMarkersToMaps();
        })
        .catch(error => {
            console.error("Error loading GeoJSON data:", error);
        });
};

// Function to add markers to the maps based on loaded GeoJSON data
const addMarkersToMaps = () => {
    geojsonData.forEach(item => {
        const markerLeft = L.marker([item.coordinates[1], item.coordinates[0]])
            .bindPopup(`<b>${item.category}</b><br><img src="${item.filepath}" alt="${item.category}" style="width:100px;">`)
            .addTo(layerGroupLeft);

        const markerRight = L.marker([item.coordinates[1], item.coordinates[0]])
            .bindPopup(`<b>${item.category}</b><br><img src="${item.filepath}" alt="${item.category}" style="width:100px;">`)
            .addTo(layerGroupRight);

        // Store category for later filtering
        markerLeft._category = item.category.toLowerCase();
        markerRight._category = item.category.toLowerCase();
    });
};

// Call the function to load GeoJSON when the page loads
loadGeoJSONData();








//function returns ""category" is selected/deselected" as a consolelog when checkbox is clicked

// Function to handle category toggling
const categoryButton = (category) => {

    // Find the checkbox associated with the category
    const checkbox = Array.from(document.querySelectorAll('.category')).find(el => 
        el.querySelector('span').innerText.toLowerCase() === category.toLowerCase()
    )?.querySelector('.checkbox');

    if (checkbox) {
        if (checkbox.checked) {
            console.log(`${category} is selected.`);
            // Add popup markers for the selected category
            geojsonData.features
                .filter(feature => feature.properties.category.toLowerCase() === category.toLowerCase())
                .forEach(feature => {
                    const coordinates = feature.geometry.coordinates;
                    const imageUrl = feature.properties.image;

                    // Add marker with popup
                    const marker = L.marker([coordinates[1], coordinates[0]])
                        .bindPopup(`<img src="${imageUrl}" alt="${category}" style="width:100px;">`)
                        .addTo(layerGroupLeft); // Add to left map
                        
                    L.marker([coordinates[1], coordinates[0]])
                        .bindPopup(`<img src="${imageUrl}" alt="${category}" style="width:100px;">`)
                        .addTo(layerGroupRight); // Add to right map

                    // Store marker for removal if needed
                    marker._category = category.toLowerCase();
                });
        } else {
            console.log(`${category} is deselected.`);
            // Remove markers for the deselected category
            layerGroupLeft.eachLayer(layer => {
                if (layer._category === category.toLowerCase()) {
                    layerGroupLeft.removeLayer(layer);
                }
            });
            layerGroupRight.eachLayer(layer => {
                if (layer._category === category.toLowerCase()) {
                    layerGroupRight.removeLayer(layer);
                }
            });
        }
    }
};









