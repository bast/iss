function initialize() {
    var iss_api = 'https://api.wheretheiss.at/v1/satellites/25544'

    axios.get(iss_api)
        .then(function(response) {
            var lat = response.data.latitude;
            var lon = response.data.longitude;

            var earth_options = {
                zoom: 2.5,
                position: [lat, lon]
            };
            var earth = new WE.map('earth_div', earth_options);
            WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '(c) OpenStreetMap contributors'
            }).addTo(earth);

            var marker = WE.marker([lat, lon]).addTo(earth)
            marker.bindPopup('the ISS is here');

            var polygon_options = {
                color: '#ff0000',
                opacity: 1,
                fillColor: '#ff0000',
                fillOpacity: 1.0,
                weight: 1
            };

            setInterval(function() {
                axios.get(iss_api)
                    .then(function(response) {
                        var small = 0.05;
                        WE.polygon([
                            [lat - small, lon - 2.0 * small],
                            [lat + small, lon - 2.0 * small],
                            [lat + small, lon + 2.0 * small],
                            [lat - small, lon + 2.0 * small]
                        ], polygon_options).addTo(earth);

                        lat = response.data.latitude;
                        lon = response.data.longitude;

                        marker.setLatLng([lat, lon]);
                    })
            }, 2000);
        })
}
