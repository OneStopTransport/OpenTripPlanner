Rotas = {
    formulario: '#trip_plan_form',
    tipo_api: 'otp',
    //Validações
    validar: function(){

        //Validação do formulário
        form = 'form' + this.formulario;
        error = 0;
        date = $(form + ' input#date');
        time = $(form + ' input#time');
        if ( $(date).val() == '' )
        {
            $(date).parents('.form-group').addClass('has-error');
            ++error;
        }
        else
            --error;
        if ( $(time).val() == '' )
        {
            $(time).parents('.form-group').addClass('has-error');
            ++error;
        }
        else
            --error;
        //Desta forma a validação corre todos os campos
        if ( error > 0 )
            return false;

        //Validar ponto de partida
        if ( typeof(m1) == 'undefined' )
        {
            $('h4.modal-title').html('Error');
            $('div.mensagem').html('<i class="glyphicon glyphicon-exclamation-sign"></i> É necessário definir um ponto de partida');
            $("#myModal").modal();

            return false;
        }
        //Validar ponto de chegada
        if ( typeof(m2) == 'undefined' )
        {
            $('h4.modal-title').html('Error');
            $('div.mensagem').html('<i class="glyphicon glyphicon-exclamation-sign"></i> É necessário definir um ponto de chegada.');
            $("#myModal").modal();

            return false;
        }

        return true;
    },
    invocar_api: function(){
        //Coordenadas
        fromPlace = m1.getLatLng().lat + ',' + m1.getLatLng().lng;
        toPlace = m2.getLatLng().lat + ',' + m2.getLatLng().lng;

        time = $('form' + this.formulario + ' input#time').val();
        time = time.toLowerCase();
        $('input#time').val( (time).replace(/\s/g, "") );
        form = $('form' + this.formulario).serialize();

        if ( Rotas.tipo_api == 'otp' )
        {
            //API da OST
            url = 'https://api.ost.pt/trips/plan/?' + 
                'fromPlace=' + fromPlace +
                '&toPlace=' + toPlace +
                '&' + form +
                '&key=WiWuixVPGHRjvGXRONqwtkhuUQAOalhAxDfemFiJ;';
        }
        else
        {     
            //API da Cloudmade - Para teste apenas
            url = 'http://routes.cloudmade.com/13e2ed112d194f36afc6c568fa65811d/api/0.3/' + 
              fromPlace + ',' + toPlace + '/foot.js';
        }
        ajax = $.ajax({ url: url, dataType: 'JSONP' });
        console.log(url);

        return ajax;
        
    },
    //Invoca a API e traça a rota
    tracar: function(){
       
        Rotas.clearMap();

        api = this.invocar_api();
        THIS = this;
        api
        //Deu certo
        .done( function(retorno){
            console.log( retorno );
            $('a[href="#trip_resultados"]').show();
            $('#Tab a[href="#trip_resultados"]').tab('show');
            // $('div#trip_resultados').empty();
            resultado = retorno;
            resultado = resultado.Objects;

            //Depende do serviço, a resposta é diferente.
            if ( THIS.tipo_api == 'otp' )
                objeto_json = THIS.formatar_otp( resultado );
            else
                objeto_json = THIS.formatar_cloudmade( retorno );
        })
        .fail(function(jqXHR, textStatus) {
            console.log( jqXHR );
            alert('Ops ' + textStatus);
            return false;
            //Mensagem de erro da chamada a API.
            /* A api pode entrar no .done() e mesmo
            assim não ser satisfatória para o utilizador.
            $('div#trip_resultados')
                .empty()
                .html('Ocorreu um erro: ' + textStatus);*/
        });
    },
    //Formatação da Cloudmade
    formatar_cloudmade: function(objeto_json){
        var point, route, points = [];
        var instrucoes = [];
        for (var i=0; i<objeto_json.route_geometry.length; i++)
        {
            point = new L.latLng(objeto_json.route_geometry[i][0], objeto_json.route_geometry[i][1]);
            points.push(point);
            //Gravar as instruções do caminho.
            if ( typeof(objeto_json.route_instructions[i]) != 'undefined' )
            {
                var ins = {
                    distancia:  objeto_json.route_instructions[i][6].toFixed(2),
                    rua:        objeto_json.route_instructions[i][0],
                    direcao:    objeto_json.route_instructions[i][7],
                    norte_sul:  objeto_json.route_instructions[i][5]
                };
                instrucoes.push(ins);
            }
        }

        /* Esta variável não pode ser alterada. Ou pode, mas tem que ser em todos os sítios.
        Senão as rotas antigas continuam no mapa. */
        polyline = new L.Polyline(points, {
            weight:         3,
            opacity:        0.5,
            smoothFactor:   1
        }).addTo(map);
        this.escrever_direcoes(instrucoes);

        //Centraliza a rota dentro do mapa.
        // map.fitBounds(polyline.getBounds());
        polyline.bringToFront();
        console.log(points);
    },
    //Formatação da OTP
    formatar_otp: function(objeto_json){
        var route, points = [];
        var instrucoes = [];
        var toLat, toLon;
        var cores = [];
        // console.log(objeto_json);
        $.each(objeto_json, function(index, value){
            if ( typeof(value.from.lat) != 'undefined' || typeof(value.from.lon) != 'undefined' )
            {
                i = 0;
                toLat = value.to.lat;
                toLon = value.to.lon;
                var latlngs = new L.latLng(value.from.lat, value.from.lon);
                points.push(latlngs);
                $.each(value.itineraries, function(index, legs){
                    //Pega o primeiro itinerário
                    //@TODO Programar as várias opções de itinerários.
                    if ( i == 0 )
                    {
                        //Subcontador
                        j = 0;
                        $.each(legs.legs, function(index, leg){
                            //js/Polyline.encoded.js
                            var fromEncoded = L.Polyline.fromEncoded(leg.legGeometry.points);
                            //O retorno do fromEncoded é sempre um mega-objeto
                            var obj_to_push = fromEncoded.getLatLngs();
                            var points1 = [];
                            for ( var i = 0; i < obj_to_push.length; i++ )
                            {
                                var latlngs = new L.latLng(obj_to_push[i].lat, obj_to_push[i].lng);
                                // points[j] = latlngs;
                                points1.push(latlngs);
                                // points.push(latlngs);
                            }
                            polyline = new L.Polyline(points1, {
                                weight:         5,
                                opacity:        0.8,
                                smoothFactor:   1,
                                color:          Rotas.cores(leg.mode)
                            })
                            .bindPopup(Rotas.info_popup(leg))
                            .addTo(map);

                            //@TODO Verificar onde estão as paragens de autocarro.

                            //Pontos para cada troca de rota
                            Rotas.criar_pontos(leg, latlngs);

                            //Instruções. O step é array para gerar sub-steps.
                            var ins = {
                                distancia:  leg.distance.toFixed(2),
                                rua:        leg.mode + ' ' + leg.to.name,
                                direcao:    '',
                                norte_sul:  '',
                                steps:      []
                            };
                            instrucoes.push(ins);

                            //@TODO: Há mais instruções fora dos steps.
                            if ( leg.steps )
                            {
                                $.each(leg.steps, function(index, step){
                                    var passos = {
                                        distancia:  step.distance.toFixed(2),
                                        rua:        step.streetName,
                                        direcao:    step.relativeDirection,
                                        norte_sul:  step.absoluteDirection
                                    }
                                    instrucoes[j].steps.push(passos);
                                });
                            }
                            ++j;
                        });
                    }
                    ++i;
                });
            }
        });
        //Não está sendo usada INICIO
        // var latlngs = new L.latLng(toLat, toLon);
        // points.push(latlngs);
        //Não está sendo usada FIM

        //Escrever as direções
        this.escrever_direcoes(instrucoes);

        /*O fitBounds mais o getBounds servem para centralizar a rota
         dentro do mapa. Porém as vezes se o width estiver
         mal, a centralização fica péssima. true story.*/
        // map.fitBounds(polyline.getBounds());

        //Just in case
        polyline.bringToFront();
        // console.log(points);
    },
    //Vai a div direcoes e escreve as direções como ul>li
    escrever_direcoes: function(direcoes){
        //data-api é que faz a mágica (HTML + CSS)
        var html = '<ul class="direcoes" data-api="resultados_' + this.tipo_api + '">';
        // console.log(direcoes);
        //Exibir a div de instruções
        $('div#direcoes').animate({
            display: 'block'
        }, 600).empty();
        //Gravo as direções
        $.each(direcoes, function(index, value){
            if ( typeof(value) != 'undefined' )
            {
                html += Rotas.formata_html(value);
                //Subrotas
                if ( typeof(value.steps) != 'undefined' )
                {
                    html += '<ul class="escondido">';
                    $.each(value.steps, function(index2, step){
                        html += Rotas.formata_html(step);
                    });
                    html += '</ul>';
                }
                html += '</li>';
            }
        });

        //O clearfix existe por causa do float
        html += '</ul><div class="clearfix"></div><br><br>';
        $('div#direcoes').html(html);
    },
    formata_html: function(obj)
    {
        return '<li><span class="norte_sul ' + obj.norte_sul + '"></span> <span class="direcao ' + obj.direcao + '"></span><span class="texto"> ' + obj.rua + ' em ' + obj.distancia + ' metros</span><div class="clearfix"></div>'
    },
    //Cor de autocarro, cor de automóvel, cor de moonwalk
    cores: function(modo) {
        if ( modo == 'WALK' )
            return '#111';
        else if ( modo == 'BUS' )
            return '#FF0000';
    },
    //Limpa todos os percursos.
    clearMap: function() {
        //É meio hack, mas o plugin não tem nada parecido.
        for(i in map._layers) {
            //Aqui é melhor testar com constante ao invés do typeof
            if(map._layers[i]._path != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                }
                catch(e) {
                    console.log("Verifique isso pois deu problema " + e + map._layers[i]);
                }
            }
        }
        //Apaga também os pontinhos (paragens e desvios)
        if ( typeof(pontos) != 'undefined' )
        {
            for ( var i = 0; i < pontos.length; ++i )
                map.removeLayer(pontos[i]);
        }
    },
    //@param object     obj     Objeto a ser tratado
    info_popup: function(obj) {
        var info = '';
        if ( obj.mode == 'BUS' )
        {
            info += 'Autocarro ' + obj.route + ' <br>';
            info += 'Entrar na paragem: ' + obj.from.stopCode + ' <br>';
            info += 'Descer na paragem: ' + obj.to.stopCode + '<br>Serviço prestado por: ' + obj.agencyName;
            info += '<br>Partida às: ' + this.formata_data(obj.to.departure) + ', Chegada ao destinho às: ' + this.formata_data(obj.to.arrival);
        }
        else
        {
            info += '@TODO Informações do caminho a pé';
        }
        return info;
    },
    //Criar pontos (bolinhas) para cada tipo de troca de rota
    criar_pontos: function(leg, latlngs) {
        //Bolinhas para troca de tipo de rota
        if ( leg.mode == 'BUS' )
            icone_info = leg.to.stopCode;
        else
            icone_info = leg.to.name;
        icone = L.icon({
            iconUrl: 'images/map/trip/xferdisk.png'
        });
        //Crio a bolinha
        marker = L.marker( latlngs, {
            draggable:  false,
            icon:       icone
        })
        .bindPopup(icone_info)
        .addTo(map);
        //este array (var pontos) serve para apagar aquando da atualização dos marcadores
        pontos.push(marker);
    },
    formata_data: function(data) {
        date = new Date(data / 1000);
        hours = date.getHours();
        minutes = date.getMinutes();

        return hours + ':' + minutes;
    }
};