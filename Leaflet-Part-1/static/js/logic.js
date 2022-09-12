// Background tile layer
var basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',

    });


// Create the map object with options
var map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});

// Add 'basemap' tile layer to the map
basemap.addTo(map);

// Make an AJAX call that retrieves earthquake geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    // This function returns style data
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    // This function determines the radius of the earthquake marker based on its magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    // Add a GeoJSON layer to the map once the file is loaded
    L.geoJson(data, {
        // turn each feature into a circle marker on the map
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // set the style for each circleMarker using styleInfo function
        style: styleInfo,
        // create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
        }
    }).addTo(map);

    // lengend control
    var legend = L.control({
        position: "bottomright"
    });
    // Here we create a legend control object.
    var legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Finally, we our legend to the map.
    legend.addTo(map);
});