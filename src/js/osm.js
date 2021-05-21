//<![CDATA[

/*    var map;
    var layer_mapnik;
    var layer_tah;
    var layer_markers;
    
    function drawmap() {
        // Popup und Popuptext mit evtl. Grafik
        var popuptext="<font color=\"black\"><b>Thomas Heiles<br>Stra&szlig;e 123<br>54290 Trier</b><p><img src=\"test.jpg\" width=\"180\" height=\"113\"></p></font>";
    
        OpenLayers.Lang.setCode('de');
        
        // Position und Zoomstufe der Karte
        var lon = 6.641389;
        var lat = 49.756667;
        var zoom = 7;
    
        map = new OpenLayers.Map('map', {
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.LayerSwitcher(),
                new OpenLayers.Control.PanZoomBar()],
            maxExtent:
                new OpenLayers.Bounds(-20037508.34,-20037508.34,
                                        20037508.34, 20037508.34),
            numZoomLevels: 18,
            maxResolution: 156543,
            units: 'meters'
        });
    
        layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
        layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"), 
                                                      visibility: true, displayInLayerSwitcher: false });
    
        map.addLayers([layer_mapnik, layer_markers]);
        jumpTo(lon, lat, zoom);
     
        // Position des Markers
        addMarker(layer_markers, 6.641389, 49.756667, popuptext);
    
    }*/
    
    //]]>