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
            iconUrl: 'images/map/trip/start.png',
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
            iconUrl: 'images/map/trip/end.png',
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
            text:       '<i class="glyphicon glyphicon-flag"></i> Começar daqui',
            callback:   marcador_inicio
        }, {
            text:       '<i class="glyphicon glyphicon-flag"></i> Terminar aqui',
            callback:   marcador_fim
        }, {
            separator: true
        }, {
            text:       '<i class="glyphicon glyphicon-screenshot"></i> Centralizar mapa',
            callback:   centralizar
        }, {
            text:       '<i class="glyphicon glyphicon-zoom-in"></i> Mais zoom',
            callback:   zoomIn
        }, {
            text:       '<i class="glyphicon glyphicon-zoom-out"></i> Menos zoom',
            callback:   zoomOut
        }]
    });

    map.on('resize', function(){
        // alert('Resized');
    });

    //OpenStreetMaps
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
});