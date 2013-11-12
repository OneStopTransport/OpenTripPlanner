$(function(){
    //HTML5 native geoLocation support
    if ( navigator.geoLocation )
    {
        navigator.geolocation.getCurrentPosition(function(position) {
            var fromPlace = [position.coords.latitude, position.coords.longitude];
        });
    }
    else
    {
        /*file:// fica bloqueado o uso do geoLocation, sempre vai cair aqui rodando local>
            >quer dizer, sem webserver: file://c:....
            Coordenadas de Coimbra */
        var fromPlace = [40.1922,-8.4139];
    }

    function marcador_inicio(e)
    {
        if ( typeof(m1) != 'undefined' )
            map.removeLayer(m1);

        icone_inicio = L.icon({
            iconUrl: 'images/start.png',
            iconAnchor: [10, 35]
        });
        m1 = L.marker(e.latlng, {
            draggable: true,
            icon: icone_inicio
        });
        m1.on('dragend', function(){
            if ( typeof(polyline) != 'undefined' )
                map.removeLayer(polyline);
            if ( typeof(m2) != 'undefined' )
                $('form#trip_plan_form').submit();
            if ( typeof(pontos) != 'undefined' )
            {
                for ( var i = 0; i < pontos.length; ++i )
                    map.removeLayer(pontos[i]);
            }
        });
        m1.addTo(map);
        if ( typeof(m2) != 'undefined' )
            $('form#trip_plan_form').submit();
    }

    function marcador_fim(e)
    {
        if ( typeof(m2) != 'undefined' )
            map.removeLayer(m2);

        icone = L.icon({
            iconUrl: 'images/end.png',
            iconAnchor: [10, 35]
        });
        m2 = L.marker(e.latlng, {
            draggable: true,
            icon: icone
        });
        m2.on('dragend', function(){

            if ( typeof(polyline) != 'undefined' )
                map.removeLayer(polyline);
            if ( typeof(m1) != 'undefined' )
                $('form#trip_plan_form').submit();
            if ( typeof(pontos) != 'undefined' )
            {
                for ( var i = 0; i < pontos.length; ++i )
                    map.removeLayer(pontos[i]);
            }

        });
        m2.addTo(map);
        if ( typeof(m1) != 'undefined' )
            $('form#trip_plan_form').submit();
    }
    //Zoom-in no mapa
    function zoomIn()
    {
        map.zoomIn();
    }
    //Zoom-out no mapa
    function zoomOut()
    {
        map.zoomOut();
    }
    //Centraliza o mapa conforme lat/lon do clique
    function centralizar(e)
    {
        map.panTo(e.latlng);
    }

    map = L.map('mapa', {
        center:             fromPlace,
        zoom:               17,
        contextmenu:        true,
        contextmenuWidth:   140,
        contextmenuItems: [{
            text:       '<i class="glyphicon glyphicon-flag"></i> ' + locale.context_menu.start_here,
            callback:   marcador_inicio
        }, {
            text:       '<i class="glyphicon glyphicon-flag"></i> ' + locale.context_menu.end_here,
            callback:   marcador_fim
        }, {
            separator: true
        }, {
            text:       '<i class="glyphicon glyphicon-screenshot"></i> ' + locale.context_menu.center_map,
            callback:   centralizar
        }, {
            text:       '<i class="glyphicon glyphicon-zoom-in"></i> ' + locale.context_menu.more_zoom,
            callback:   zoomIn
        }, {
            text:       '<i class="glyphicon glyphicon-zoom-out"></i> ' + locale.context_menu.less_zoom,
            callback:   zoomOut
        }]
    });

    map.on('resize', function(){
        // alert('Resized');
    });

    var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var osmCycleLayer = new L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var cloudmadeLayer = new L.tileLayer('http://{s}.tile.cloudmade.com/13e2ed112d194f36afc6c568fa65811d/997/256/{z}/{x}/{y}.png', {
        attribution: 'Imagery &copy; <a href="http://cloudmade.com">CloudMade</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var mapquestLayer = new L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
        attribution: 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.',
        subdomains: ['otile1','otile2','otile3','otile4']
    });

    //O padrão é OSM
    map.addLayer(osmLayer);
    map.addControl(new L.Control.Layers({
        'OSM': osmLayer,
        'OSM Cycle': osmCycleLayer,
        'CloudMade': cloudmadeLayer,
        'MapQuest': mapquestLayer
    }));
});