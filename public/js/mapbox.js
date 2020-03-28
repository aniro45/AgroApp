export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWpzdHlsZTQ1IiwiYSI6ImNrODQ2NXAxMzAxcnYzbXQ0aHBldWpwb3MifQ.RDIrPEKych0EhXcV3dZrjg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ajstyle45/ck84bd6e56w6r1in06f4u5la1',
    center: [75.835779, 18.677448],
    zoom: 2
  });

  const bounds = new mapboxgl.LngLatBounds();

  //createMarker

  const el = document.createElement('div');
  el.className = 'marker';

  //Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(locations.coordinates)
    .addTo(map);

  //Add Popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(locations.coordinates)
    .setHTML(`<p>${locations.description}</p>`)
    .addTo(map);

  //Extend the map bound to include the location
  bounds.extend(locations.coordinates);

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 }
  });
};
