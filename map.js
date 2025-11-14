import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
console.log('Mapbox GL JS Loaded:', mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoicWl6aGFuZzExMDIiLCJhIjoiY21odm95bTg5MGRhaDJscHZha252dGdzdyJ9.893n-8_lYlGZPVuz4sN3AQ';
function getCoords(station) {
  const point = new mapboxgl.LngLat(+station.lon, +station.lat);
  const { x, y } = map.project(point);
  return { cx: x, cy: y };
}


const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18,
});


map.on('load', async () => {
  const svg = d3.select('#map').select('svg');

  map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
});


  map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston_route',
    paint: {
  'line-color': '#32D400',  // A bright green using hex code
  'line-width': 5,          // Thicker lines
  'line-opacity': 0.6       // Slightly less transparent
},
  });



map.addSource('cambridge_route', {
  type: 'geojson',
  data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
});

map.addLayer({
  id: 'cambridge-bike-lanes',
  type: 'line',
  source: 'cambridge_route',
  paint: {
    'line-color': '#32D400',
    'line-width': 5,
    'line-opacity': 0.6
  }
});



  const INPUT_BLUEBIKES_CSV_URL =
    "https://dsc106.com/labs/lab07/data/bluebikes-stations.json";

  let jsonData;

  try {
    const jsonurl = INPUT_BLUEBIKES_CSV_URL;

    jsonData = await d3.json(jsonurl); 
    console.log('Loaded JSON Data:', jsonData);
  } catch (error) {
    console.error('Error loading JSON:', error);
  }

  let stations = jsonData.data.stations;
  console.log('Stations Array:', stations);

  const circles = svg
  .selectAll('circle')
  .data(stations)
  .enter()
  .append('circle')
  .attr('r', 5) // Radius of the circle
  .attr('fill', 'steelblue') // Circle fill color
  .attr('stroke', 'white') // Circle border color
  .attr('stroke-width', 1) // Circle border thickness
  .attr('opacity', 0.8); // Circle opacity

  function updatePositions() {
    circles
      .attr('cx', d => getCoords(d).cx)
      .attr('cy', d => getCoords(d).cy);
  }

  updatePositions();

  map.on('move', updatePositions);
  map.on('zoom', updatePositions);
  map.on('resize', updatePositions);
  map.on('moveend', updatePositions);
});
