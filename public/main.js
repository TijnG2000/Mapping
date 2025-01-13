//Initial background map, position, and zoom level right after loading website
var map = new maplibregl.Map({
    container: 'map', 
    style: 'https://api.maptiler.com/maps/d06f2b08-5a57-4354-a53c-e9e997030524/style.json?key=uUBjZLywPic3D2JTYgOE', 
    center: [5.3559, 51.4964],
    zoom: 14, 
    hash: false
});

// JavaScript to control the pop-up and filter over map
const popup = document.getElementById('popup');
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

//Ma8plibregl specifications (not so important)
map.addControl(new maplibregl.FullscreenControl({container: document.querySelector('body')}));
let nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');

//This loop adds the images and positions them, I thought it would be cool to cut out the images of the canvas and see the map behind it, that's why it's in the same loop
map.on('load', async () => {
    try {
        const response = await fetch('/api/photos');
        const photos = await response.json();

        //Eventually all the layers will be on the site, but for now here where you choose the layer, the photo location, and position of photo, which is the midpoint
        photos.forEach(photo => {
            const point = map.project([photo.longitude, photo.latitude]);
            const img = document.createElement('img');
            img.src = photo.url.replace('/photos/signs/');
            img.className = 'photo-fund';
            img.style.left = (point.x - 75) + 'px';
            img.style.top = (point.y - 75) + 'px';
            
            document.getElementById('map').appendChild(img);

            //moves images with map when dragged (when map is clicked and dragged, see below (img.addEventListener))
            map.on('move', () => {
                const point = map.project([photo.longitude, photo.latitude]);
                img.style.left = (point.x - 150) + 'px';
                img.style.top = (point.y - 150) + 'px';
            });
        });
    } catch (error) {
        console.error('Error loading photos:', error);
    }

    // const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // overlay.id = 'mask-overlay';
    // overlay.innerHTML = `
    //     <defs>
    //         <mask id="holes">
    //             <rect width="100%" height="100%" fill="white"/>
    //         </mask>
    //     </defs>
    //     <rect width="100%" height="100%" fill="white" mask="url(#holes)"/>
    // `;
    // document.getElementById('map').appendChild(overlay);
});

// //This code is useless now, will use it for cut out fucntionality idea

// function addCircleCutout(x, y, radius) {
//     const mask = document.getElementById('holes');
//     if (mask) {
//         const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//         circle.setAttribute('cx', x);
//         circle.setAttribute('cy', y);
//         circle.setAttribute('r', radius);
//         circle.setAttribute('fill', 'black');
//         mask.appendChild(circle);
//     }
// }

// function addPolygonCutout(points) {
//     const mask = document.getElementById('holes');
//     if (mask) {
//         const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
//         const pointsString = points.map(p => `${p[0]},${p[1]}`).join(' ');
//         polygon.setAttribute('points', pointsString);
//         polygon.setAttribute('fill', 'black');
//         mask.appendChild(polygon);
//     }
// }