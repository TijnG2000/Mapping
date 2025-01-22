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


//create variables for map location
const map_location_left=[51.436985789108306,5.464274124489311]
const map_location_right=[51.436985789108306,5.464274124489311]

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

function createPhotoIcon(imageUrl) {
    return L.divIcon({
        className: 'photo-icon',
        html: `<img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover;">`, // Made square and added object-fit
        iconSize: [50, 50],
        iconAnchor: [25, 25] // Center the image
    });
}

// Define layer groups for each map
var layerGroupLeft = L.layerGroup().addTo(map_left);
var layerGroupRight = L.layerGroup().addTo(map_right);

// map start up locations 
const ourLocations={
Military: [51.4836017378253,5.36258159765619],
Canal: [51.4933530712901, 5.38188283867369],
Best: [51.5061290558538,5.38267018682391],
Oirschot: [51.496408741217, 5.33606503906852]
}
//function change the location on click
const locationButton = (location, position) => {

    if (position === "left"){
        map_left.setView(ourLocations[location], 17);
        map_left.setMaxBounds(ourBoundingBoxes["BoundingBox_"]);
    }

    if (position === "right"){
        map_right.setView(ourLocations[location], 17);
        map_right.setMaxBounds(ourBoundingBoxes["BoundingBox_"]);
    }

}

// Path to your GeoJSON file
const geojsonFilePath = '/data/WebsiteItems_Final_relativeFilepaths.geojson';
let geojsonData = [];

// Function to load and process the GeoJSON file
const loadGeoJSONData = () => {
    fetch('/data/WebsiteItems_Final_relativeFilepaths.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load GeoJSON file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Parse the required fields and fix the filepath
            geojsonData = data.features.map(feature => ({
                category: feature.properties.Category,
                // Remove the duplicate 'photos' in the path
                filepath: `/photos/${feature.properties.Category}/${feature.properties.filename}.jpg`,
                coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                filename: feature.properties.filename
            }));
            console.log("GeoJSON Data Loaded:", geojsonData);
            addMarkersToMaps();
        })
        .catch(error => {
            console.error("Error loading GeoJSON data:", error);
        });
};


// Function to handle just the map background blurring (easiest I could come up with was blurring the ui components themselves rather than to draw a canvas in between in leaflet etc)
const updateMapTileStyle = (isChecked) => {
    const tilePane_left = map_left.getPane('tilePane');
    const tilePane_right = map_right.getPane('tilePane');
    
    if (!isChecked) {
        // Fade out and blur the map tiles
        tilePane_left.style.opacity = '0.1';
        tilePane_right.style.opacity = '0.1';
        tilePane_left.style.filter = 'blur(5px)';
        tilePane_right.style.filter = 'blur(5px)';
    } else {
        // Restore the tiles back to visible
        tilePane_left.style.opacity = '1';
        tilePane_right.style.opacity = '1';
        tilePane_left.style.filter = 'blur(0px)';
        tilePane_right.style.filter = 'blur(0px)';
    }
};

const categoryButton = (category) => {
    const checkbox = Array.from(document.querySelectorAll('.category')).find(el =>
        el.querySelector('span').innerText.toLowerCase() === category.toLowerCase()
    )?.querySelector('.checkbox');
    
    // Conversion of categories because I'm too lazy to change all the categories in the geojson
    const categoryMapping = {
        'ground': 'Ground',
        'signs': 'Sign',
        'trees': 'Tree',
        'sound': 'Sound'
    };
    
    const geoJsonCategory = categoryMapping[category.toLowerCase()];
    
    if (checkbox && checkbox.checked) {
        // Load data if not already loaded
        if (geojsonData.length === 0) {
            fetch('/data/WebsiteItems_Final_relativeFilepaths.geojson')
                .then(response => response.json())
                .then(data => {
                    // Parse the required fields and fix the filepaths, which are inconsistent ;/
                    geojsonData = data.features.map(feature => ({
                        category: feature.properties.Category,
                        filepath: `/photos/${feature.properties.Category}/${feature.properties.filename}.jpg`,
                        coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                        filename: feature.properties.filename
                    }));
                    // After loading data, add the filtered markers
                    addFilteredMarkers(category, geoJsonCategory);
                })
                .catch(error => {
                    console.error("Error loading GeoJSON data:", error);
                });
        } else {
            // If data is already loaded, just add the filtered markers (so it doesn't need to load them every time the buttons are checked)
            addFilteredMarkers(category, geoJsonCategory);
        }
    } else if (checkbox) {
        // Remove markers for when category is unchecked, lowercase conversion again here for consistency!!
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
    
    if (category.toLowerCase() === 'map') {
        updateMapTileStyle(checkbox?.checked);
        return;
    }
};

// Handling the audio player, now with fadein/fadeout to make it a bit more dynamic
const createAudioHandler = (audioPath) => {
    const audio = new Audio(audioPath);
    let fadeInterval;
    const fadeDuration = 1000;
    const fadeSteps = 20;

    const fadeIn = () => {
        if (audio.paused) {
            audio.volume = 0;
            audio.play().catch(err => console.error('Audio playback error:', err));
        }
        clearInterval(fadeInterval);
        
        const fadeStep = 1 / fadeSteps;
        let currentVolume = audio.volume;
        
        fadeInterval = setInterval(() => {
            currentVolume = Math.min(currentVolume + fadeStep, 1.0);
            audio.volume = currentVolume;
            
            if (currentVolume >= 1.0) {
                clearInterval(fadeInterval);
            }
        }, fadeDuration / fadeSteps);
    };

    const fadeOut = () => {
        clearInterval(fadeInterval);
        
        const fadeStep = 1 / fadeSteps;
        let currentVolume = audio.volume;
        
        fadeInterval = setInterval(() => {
            currentVolume = Math.max(currentVolume - fadeStep, 0.0);
            audio.volume = currentVolume;
            
            if (currentVolume <= 0) {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
            }
        }, fadeDuration / fadeSteps);
    };

    return { fadeIn, fadeOut };
};

// Creating audio patches
const createAudioMarker = (coordinates, audioHandler) => {
    const audioIcon = L.divIcon({
        className: 'audio-icon',
        html: '<div class="audio-box"></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    return L.marker(coordinates, {
        icon: audioIcon
    })
    .on('mouseover', audioHandler.fadeIn)
    .on('mouseout', audioHandler.fadeOut);
};

// Splitting image from sound files, because of all the inconsistencies some more lowercase conversion
const addFilteredMarkers = (category, geoJsonCategory) => {
    geojsonData
        .filter(item => item.category === geoJsonCategory)
        .forEach(item => {
            if (category.toLowerCase() === 'sound') {
                const audioPath = `/photos/Sound/${item.filename}`;
                const audioHandler = createAudioHandler(audioPath);
                const coordinates = [item.coordinates[1], item.coordinates[0]];

                const markerLeft = createAudioMarker(coordinates, audioHandler).addTo(layerGroupLeft);
                const markerRight = createAudioMarker(coordinates, audioHandler).addTo(layerGroupRight);

                markerLeft._category = category.toLowerCase();
                markerRight._category = category.toLowerCase();
            } else {
                const photoIcon = createPhotoIcon(item.filepath);
                
                const markerLeft = L.marker([item.coordinates[1], item.coordinates[0]], {
                    icon: photoIcon
                }).addTo(layerGroupLeft);

                const markerRight = L.marker([item.coordinates[1], item.coordinates[0]], {
                    icon: photoIcon
                }).addTo(layerGroupRight);

                markerLeft._category = category.toLowerCase();
                markerRight._category = category.toLowerCase();
            }
        });
};