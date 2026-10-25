
mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
            style: "mapbox://styles/mapbox/standard-satellite", // style URL
            center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9.5 // starting zoom
    });

    const marker = new mapboxgl.Marker({ color: 'red', rotation: 45 })
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h5>${listing.location}</h5><p>Exact location provided after booking!</p>`
            )
        )
        .addTo(map);