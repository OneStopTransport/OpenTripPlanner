/**
* @module Rotas
*/
/**
* Toda a gestão das rotas deverá passar por aqui
* @class Rotas
* @constructor
*/
Rotas = {
    /**
    * ID do formulário com as opções de pesquisa
    * @property formulario
    * @type {String}
    * @default "#trip_plan_form"
    * @example `<form class="form-horizontal" role="form" id="trip_plan_form">`
    */
    formulario:             '#trip_plan_form',
    /**
    * Qual a API que será consumida
    * @property tipo_api
    * @type {String}
    * @default "otp"
    */
    tipo_api:               'otp',
    /**
    * Distância a pé
    * @property distanciaPe
    * @type {Int}
    * @default "0"
    */
    distanciaPe:            0,
    /**
    * Distância por transportes
    * @property distanciaTransporte
    * @type {Int}
    * @default "0"
    */
    distanciaTransporte:    0,
    /**
    * Vetor com os itinerários. De ZERO à DOIS (três no total)
    * @property itinerarios
    * @type {Array}
    */
    itinerarios:            [],
    /**
    * Resposta JSON da API
    * @property objeto_json
    * @type {JSON}
    */
    objeto_json:            '',
    /**
    * Qual o itinerário a mostrar.
    * @property itinerario_mostrar
    * @type {Int}
    * @default "0"
    */
    itinerario_mostrar:     0,
    /**
    * Validações do formulário
    * @method validar
    * @returns {Boolean}
    */
    validar: function() {
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
            $('div.mensagem')
                .addClass('alert-danger')
                .removeClass('alert-success')
                .removeClass('alert-info')
                .removeClass('alert-warning')
                .html('<i class="glyphicon glyphicon-exclamation-sign"></i> ' + locale.messages.miss_origin);
            $("#myModal").modal();

            return false;
        }
        //Validar ponto de chegada
        if ( typeof(m2) == 'undefined' )
        {
            $('h4.modal-title').html('Error');
            $('div.mensagem')
                .addClass('alert-danger')
                .removeClass('alert-success')
                .removeClass('alert-info')
                .removeClass('alert-warning')
                .html('<i class="glyphicon glyphicon-exclamation-sign"></i> ' + locale.messages.miss_destiny);
            $("#myModal").modal();

            return false;
        }

        return true;
    },
    /**
    * Invoca a API e passa os dados necessários
    * @method invocar_api
    * @return {Object} ajax
    */
    invocar_api: function() {
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
            url = Config.api_url + 'trips/plan/?' + 
                'fromPlace=' + fromPlace +
                '&toPlace=' + toPlace +
                '&' + form +
                '&key=' + Config.api_key;
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
    /**
    * Invoca a API e traça a rota
    * @method tracar
    * @return {Void}
    */
    tracar: function() {
       
        Rotas.clearMap();
        Rotas.itinerario_mostrar = 0;

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
            Rotas.objeto_json = resultado;

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
    /**
    * Formatar resposta da Cloudmade
    * É apenas um teste e deverá ser removido
    * @method formatar_cloudmade
    * @return {Void}
    */
    formatar_cloudmade: function() {
        objeto_json = Rotas.objeto_json;
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
        // console.log(points);
    },
    /**
    * Formata a resposta da OTP
    * @method formatar_otp
    * @return {Void}
    */
    formatar_otp: function() {
        var toLat, toLon;
        var route, points       = [];
        var instrucoes          = [];
        var cores               = [];
        var instrucoes_gerais   = [];
        var itinerarios         = [];
        objeto_json             = Rotas.objeto_json;
        $.each(objeto_json, function(index, value){
            if ( typeof(value.from.lat) != 'undefined' || typeof(value.from.lon) != 'undefined' )
            {
                Rotas.distanciaPe           = 0;
                Rotas.distanciaTransporte   = 0;
                Rotas.itinerarios           = [];
                i = 0;
                toLat = value.to.lat;
                toLon = value.to.lon;
                var latlngs = new L.latLng(value.from.lat, value.from.lon);
                points.push(latlngs);
                $.each(value.itineraries, function(index, legs){

                    //No primeiro momento, Rotas.itinerario_mostrar = 0;
                    if ( i == Rotas.itinerario_mostrar )
                    {
                        Rotas.clearMap();
                        var primeiro_itinerario = Rotas.desenhar_rota(value, legs, instrucoes_gerais, instrucoes, i, true);
                        var array_it = {
                            polyline:   primeiro_itinerario,
                            startTime:  legs.startTime,
                            duration:   legs.duration,
                            endTime:    legs.endTime,
                            transfers:  legs.transfers,
                        };
                        Rotas.itinerarios.push(array_it);
                        // console.log(array_it);

                        //Escrever as direções
                        Rotas.escrever_direcoes(instrucoes, i + 1);

                        //Informações globais
                        Rotas.informacoes(instrucoes_gerais, i);                        
                    }
                    //Os outros itinerários
                    else
                    {
                        var retorno = Rotas.desenhar_rota(value, legs, instrucoes_gerais, instrucoes, i, false);
                        var array_it = {
                            polyline:   retorno,
                            startTime:  legs.startTime,
                            duration:   legs.duration,
                            endTime:    legs.endTime,
                            transfers:  legs.transfers
                        };
                        Rotas.itinerarios.push(array_it);
                        // console.log(retorno);
                    }
                    ++i;
                });
            }
        });
        // console.log('Contador ' + i);

        Rotas.mostra_itinerarios();

        //Just in case
        if ( typeof(primeiro_itinerario) != 'undefined' )
            primeiro_itinerario.bringToFront();
    },
    /**
    * Desenha as rotas (linhas) para cada trajeto
    *
    * @method desenhar_rota
    * @param {Object} value
    * @param {Object} legs
    * @param {Array} instrucoes_gerais
    * @param {Array} instrucoes
    * @param {Boolean} escrever_rota Se for true, desenha a rota no mapa
    * @return {Polyline}
    */
    desenhar_rota: function(value, legs, instrucoes_gerais, instrucoes, it, escrever_rota) {
        var ins_ger = {
            data_hora:      value.date,
            walkTime:       legs.walkTime,
            walkDistance:   legs.walkDistance,
            startTime:      legs.startTime,
            endTime:        legs.endTime,
            duration:       legs.duration
        };
        instrucoes_gerais.push(ins_ger);

        //Subcontador
        j = 0;
        var polylines = [];
        var centro = [];
        $.each(legs.legs, function(index, leg){
            //js/Polyline.encoded.js
            var fromEncoded = L.Polyline.fromEncoded(leg.legGeometry.points);

            //O retorno do fromEncoded é sempre um mega-objeto
            var obj_to_push = fromEncoded.getLatLngs();

            //Só é utilizada neste for.
            var points1 = [];
            for ( var i = 0; i < obj_to_push.length; i++ )
            {
                var latlngs = new L.latLng(obj_to_push[i].lat, obj_to_push[i].lng);
                points1.push(latlngs);
                centro.push(latlngs);
            }
            //Necessário para distinguir os tipos de rota
            polyline = new L.Polyline(points1, {
                weight:         5,
                opacity:        0.8,
                smoothFactor:   1,
                color:          Rotas.cores(leg.mode)
            })
            .bindPopup(Rotas.info_popup(leg), { 'minWidth': 400 })
            .addTo(map);
            polylines.push(polyline);

            //Se for para escrever a rota (itinerario selecionado OK)
            if ( escrever_rota == true )
            {
                // polyline.addTo(map);
                //@TODO: Verificar onde estão as paragens de autocarro.
                //Pontos para cada troca de rota
                Rotas.criar_pontos(leg, latlngs, it, true);

                //A rua quando for bus tem mais info (no. da carreira)
                var rua = '<span class="modos modo_' + leg.mode + '"></span>' + ' ' + leg.to.name;
                if ( leg.mode == 'BUS' )
                {
                    rua = '<span class="modos modo_' + leg.mode + '"></span>' + ' ' +
                        leg.from.stopCode + ' (Nº ' + leg.route + ')';
                }

                //Instruções. O step é array para gerar sub-steps - próximo bloco.
                var ins = {
                    distancia:  leg.distance.toFixed(2),
                    rua:        rua,
                    modo:       leg.mode,
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
                            modo:       leg.mode,
                            direcao:    step.relativeDirection,
                            norte_sul:  step.absoluteDirection,
                            lat:        step.lat,
                            lon:        step.lon
                        };
                        instrucoes[j].steps.push(passos);
                    });
                }

                //Informações dos transportes (lateral esquerda)
                if ( leg.mode == "BUS" )
                {
                    var div_ruas = '<div class="div_ruas">'
                        + locale.info.stop_depart + leg.from.stopCode + locale.info.at + Rotas.formata_hora(leg.startTime, 2) + '<br>~'
                        + Math.floor(leg.duration / 60000) + ' min.<br>'
                        + locale.info.stop_arrive + leg.to.stopCode + locale.info.at + Rotas.formata_hora(leg.endTime, 2) + '<br>'
                        + leg.agencyName
                        + '<br>'
                        + '<a href="#" class="trip_viewer" data-tripId="' + leg.tripId + '" data-stop-to="' + leg.to.stopId.id + '" data-stop-from="' + leg.from.stopId.id + '">[' + locale.info.see_stops + ']</a>'
                        + '</div>';
                    var info_paragens = {
                        distancia:  leg.distance.toFixed(2),
                        rua:        div_ruas,
                        direcao:    null,
                        norte_sul:  null,
                        lat:        null,
                        lon:        null
                    };
                    instrucoes[j].steps.push(info_paragens);
                    //Distância de transportes
                    Rotas.distanciaTransporte += leg.distance;
                }
                //Distância a lapatex
                else if ( leg.mode == "WALK" )
                    Rotas.distanciaPe += leg.distance;

                //Este contador serve para as sub-instruções
                ++j;
            }
            else
            {
                map.removeLayer(polyline);
                Rotas.criar_pontos(leg, latlngs, it, false);
            }
        });

        if ( escrever_rota == true )
        {
            map.fitBounds( centro );
        }
        
        return polylines;
    },
    /**
    * Escreve no html as informações globais
    * do itinerário escolhido
    * @method informacoes
    * @param {Array} info Vetor com as informações
    * @return {Void}
    */
    informacoes: function(info, it) {
        ++it;
        $.each(info, function(index, value){
            var data_hora   = Rotas.formata_data(value.data_hora);
            var hora        = Rotas.formata_hora(value.data_hora);
            var duration    = Math.floor( value.duration / 60000 );
            var walkTime    = Math.floor( value.walkTime / 60 );
            var startTime   = Rotas.formata_hora(value.startTime);
            var endTime     = Rotas.formata_hora(value.endTime);
            var du_trans    = duration - walkTime;
            var walkTotal   = Rotas.distanciaPe + Rotas.distanciaTransporte;
            div_it = 'div#coll_it' + it + ' div.panel-body ';
            link = 'div#coll_it' + it + ' a.esconder_info';
            link = $(link);
            $(div_it + 'div.info_trip').removeClass('escondido');

            var div_trip = div_it + 'div.info_trip ';
            // console.log(div_trip);
            $(div_trip + 'dt.data_hora').next('dd').html(data_hora);

            $(div_trip + 'dt.distancia_total').next('dd').children('.texto').html(walkTotal.toFixed(2) + ' m');
            $(div_trip + 'dt.distancia_pe').next('dd').html(Rotas.distanciaPe.toFixed(2) + ' m');
            $(div_trip + 'dt.distancia_transportes').next('dd').html(Rotas.distanciaTransporte.toFixed(2) + ' m');

            $(div_trip + 'dt.duracao_total').next('dd').children('.texto').html(duration + ' min');
            $(div_trip + 'dt.duracao_pe').next('dd').html(walkTime + ' min');
            $(div_trip + 'dt.duracao_transportes').next('dd').html(du_trans + ' min');
        });
        esconder_info(link, true);
        $('div.info_trip').show();
    },
    /**
    * Escreve as direções de cada parte da
    * rota como ul>li
    * @method escrever_direcoes
    * @param {Array} direcoes Vetor com as direções
    * @return {Void}
    */
    escrever_direcoes: function(direcoes, it) {
        //data-api é que faz a mágica (HTML + CSS)
        var html = '<ul class="direcoes" data-api="resultados_' + this.tipo_api + '">';
        
        div_it = 'div#coll_it' + it + ' div.panel-body div.direcoes ';
        
        // console.log(direcoes);
        
        //Exibir a div de instruções
        $(div_it).animate({
            display: 'block'
        }, 600).empty();
        //Gravo as direções
        var i = 1;
        $.each(direcoes, function(index, value){
            if ( typeof(value) != 'undefined' )
            {
                html += Rotas.formata_html(value, i);
                //Subrotas
                if ( typeof(value.steps) != 'undefined' )
                {
                    html += '<ul class="escondido">';
                    $.each(value.steps, function(index2, step){
                        html += Rotas.formata_html(step);
                    });
                    html += '</ul>';
                }
                ++i;
                html += '</li>';
            }
        });

        //O clearfix existe por causa do float
        html += '</ul><div class="clearfix"></div><br><br>';
        $(div_it).html(html);
    },
    /**
    * Coloca as informações com o HTML correto
    * O `<li>` é fechado depois do método ser invocado
    * @method formata_html
    * @param {Objeto} obj
    * @return {String} retorno
    */
    formata_html: function(obj, i) {
        retorno = '<li';
        if ( 'undefined' == typeof(obj.lat)
                && 'undefined' == typeof(obj.lon)
                && obj.lat == null )
        {
            retorno += ' class="primeiro_nivel"';
        }
        retorno += '>';

        retorno += '<span class="norte_sul ' + obj.norte_sul + '"></span> <span class="direcao ' + obj.direcao + '"></span>';
        retorno += '<span class="texto">';

        if ( 'undefined' != typeof(obj.lat)
                && 'undefined' != typeof(obj.lon)
                && obj.lat !== null )
            retorno += '<a href="#" class="mostra_informacao" data-lat="' + obj.lat + '" data-lon="' + obj.lon + '">';

        retorno += ' ' + obj.rua;

        if ( obj.modo == "WALK" )
            retorno += ' em ' + obj.distancia + ' metros';

        if ( 'undefined' != typeof(obj.lat)
                && 'undefined' != typeof(obj.lon)
                && obj.lat !== null )
            retorno += '</a>';

        retorno += '</span><div class="clearfix"></div>';
        // console.log(obj);

        return retorno;
    },
    /**
    * Cria um html (`<ul>`) com os 3 itinerários
    * @method mostra_itinerarios
    * @return {Void}
    */
    mostra_itinerarios: function() {
        for ( j = 1; j <= 3; ++j )
            $('div.it' + j).show();

        var contador = 1;
        $.each(Rotas.itinerarios, function(index, it){
            var inicio, fim, duracao;
            var html = '';
            inicio  = Rotas.formata_hora(it.startTime);
            fim     = Rotas.formata_hora(it.endTime);
            duracao = Math.floor(it.duration / 60000);

            div_it = 'div.it' + contador + ' ';
            i = contador - 1;

            $(div_it + 'a[href="#coll_it' + contador + '"]')
                .html(contador + '. ' + inicio + ' - ' + fim + ' (' + duracao + ' min)');
            $(div_it + 'a[href="#coll_it' + contador + '"]').attr('data-itinerario', i);

            ++contador;
        });

        $('div.itinerarios').removeClass('escondido');

        //Quem vai ser removido
        for ( j = contador; j <= 3; ++j )
            $('div.it' + j).hide();

        // console.log(Rotas.itinerarios);
    },
    /**
    * Define as cores para cada tipo de rota
    * @method cores
    * @param {String} modo
    * @return {String} cor em hexadecimal
    */
    cores: function(modo) {
        if ( modo == 'WALK' )
            return '#111';
        else if ( modo == 'BUS' )
            return '#FF0000';
        else
            return '#3E85C3';
    },
    /**
    * Limpa todos os percursos.
    * @method clearMap
    * @return {Void}
    */
    clearMap: function() {
        //É meio hack, mas o plugin não tem nada parecido.
        for(i in map._layers) {
            //Aqui é melhor testar com constante ao invés do typeof
            if(map._layers[i]._path != undefined) {
                try
                {
                    map.removeLayer(map._layers[i]);
                }
                catch(e)
                {
                    console.log("Verifique isso pois deu problema " + e + map._layers[i]);
                }
            }
        }
        //Apaga também os pontinhos (paragens e desvios)
        if ( typeof(pontos) != 'undefined' )
        {
            for ( var i = 0; i < pontos.length; ++i )
                map.removeLayer(pontos[i]);
            pontos = [];
        }
    },
    /**
    * Cria um pop-up na rota com
    * as informações da mesma
    * @method info_popup
    * @param {Object} obj
    * @return {String}
    */
    info_popup: function(obj) {
        var info = '<section class="info_popup row">';
        if ( obj.mode == 'BUS' )
        {
            info += '<div class="col-md-4 first">' + locale.info.bus + '</div><div class="col-md-8 first">' + obj.route + '</div>';
            info += '<div class="col-md-4">' + locale.info.get_in_stop + '</div><div class="col-md-8">' + obj.from.stopCode + '</div>';
            info += '<div class="col-md-4">' + locale.info.get_out_stop + '</div><div class="col-md-8">' + obj.to.stopCode + '</div>';
            info += '<div class="col-md-4">' + locale.info.depart_at + '</div><div class="col-md-8">' + this.formata_hora(obj.startTime) + '</div>';
            info += '<div class="col-md-4">' + locale.info.arrive_at + '</div><div class="col-md-8">' + this.formata_hora(obj.endTime) + '</div>';
            info += '<div class="col-md-4">' + locale.info.service_by + '</div><div class="col-md-8">' + obj.agencyName + '</div>';
        }
        else
            info += '@TODO Informações do caminho por outros métodos (a pé, bike, carro, etc...)';

        return info + '</section>';
    },
    /**
    * Criar pontos (bolinhas) para cada tipo de troca de rota
    * @method criar_pontos
    * @param {Object} leg
    * @param {Object} latlngs
    * @param {Int} it
    * @param {Boolean} escrever
    * @return {Void}
    */
    criar_pontos: function(leg, latlngs, it, escrever) {
        //Bolinhas para troca de tipo de rota
        if ( leg.mode == 'BUS' )
            icone_info = leg.to.stopCode;
        else
            icone_info = leg.to.name;
        icone = L.icon({
            iconUrl: 'images/xferdisk.png'
        });
        //Crio a bolinha
        marker = L.marker( latlngs, {
            draggable:  false,
            icon:       icone
        })
        .bindPopup(icone_info);
        if ( escrever == true )
        {
            marker.addTo(map);
            pontos.push(marker);
        }

        //este array (var pontos) serve para apagar aquando da atualização dos marcadores
        // pontos.push(marker);
        // console.log( pontos );
    },
    /**
    * Transforma um timestamp em horas:minutos
    * @method formata_hora
    * @param {Timestamp} hora
    * @return {String} hours:minutes
    */
    formata_hora: function(hora) {
        date    = new Date(hora);
        hours   = Rotas.zero_data(date.getHours());
        minutes = Rotas.zero_data(date.getMinutes(), 2);

        return hours + ':' + minutes;
    },
    /**
    * Transforma um timestamp em data mais hora:minutos
    * @method formata_data
    * @param {Timestamp} data
    * @return {String}
    */
    formata_data: function(data) {
        var data_obj = new Date(data);

        data = Rotas.zero_data(data_obj.getDate(), 2)
            + '/'
            + Rotas.zero_data(data_obj.getMonth() + 1, 2)
            + '/'
            + Rotas.zero_data(data_obj.getFullYear(), 4);
        hours = data_obj.getHours();
        minutes = data_obj.getMinutes();

        // console.log( data_obj );

        return data + ' ' + hours + ':' + minutes;
    },
    /**
    * Coloca um zero a mais na data (a esquerda)
    * @method zero_data
    * @param {Int} num
    * @param {Int} count
    * @return {Int} z
    */
    zero_data: function(num, count) {
        var z = num + '';
        while (z.length < count) {
            z = "0" + z;
        }

        return z;
    },
    /**
    * Corre todos os itinerarios e os esconde
    * @method oculta_itinerarios
    * @return {Void}
    */
    oculta_itinerarios: function() {
        $.each(Rotas.itinerarios, function(index, value){
            $.each(value.polyline, function(index2, pol){
                map.removeLayer(pol);
            });
        });

        // console.log(pontos);
        $.each(pontos, function(index, ponto){
            map.removeLayer(ponto);
        });
    },
    /**
    * Mostra apenas o primeiro itinerário
    * @method mostra_primeiro_itinerario
    * @Return {Void}
    */
    mostra_primeiro_itinerario: function() {
        $.each(Rotas.itinerarios[Rotas.itinerario_mostrar], function(index, value){
            $.each(value, function(index2, pol){
                map.addLayer(pol);
            });
        });
        $.each(pontos, function(index, ponto){
            map.addLayer(ponto);
        });
    },
    /**
    * Mostra o itinerário it
    * @method mostra_itinerario
    * @param {Int} it Itinerário a ser mostrado
    * @return {Void}
    */
    mostra_itinerario: function(it) {
        $.each(Rotas.itinerarios[it], function(index, value){
            $.each(value, function(index2, pol){
                map.addLayer(pol);
            });
        });
        //Só mostro quando for o primeiro it
        if ( it == Rotas.itinerario_mostrar )
        {
            $.each(pontos, function(index, ponto){
                map.addLayer(ponto);
            });
        }
    },
    /**
    * Mostra todas as paragens e seleciona as do meu interesse
    * @method trips
    * @param {Int} tripId Id da Trip, necessário para a API
    * @param {Object} stopId Objeto que mostra quais são as minhas paragens
    * @return {Void}
    */
    trips: function(tripId, stopIdto, stopIdfrom) {
        var url = Config.api_url + 'trips/' + tripId + '/?key=' + Config.api_key;
        $.ajax({url: url, dataType: 'JSONP'})
            .done(function(retorno){
                var html = '<ul class="trip_viewer">';
                var contador = 1;
                var maximo = 0;
                var minimo = 0;
                // console.log('====== ' + tripId + ' =======');
                // console.log(retorno.stoptime_set);
                // console.log('====== ' + tripId + ' =======');
                $.each(retorno.stoptime_set, function(index, value){
                    html += '<li ';
                    var sequencia = value.stop_sequence;

                    //Início das minhas paragens
                    if ( value.stop.id == stopIdfrom )
                    {
                        minimo = sequencia;
                        html += 'class="inicio"';
                    }
                    //Fim das minhas paragens
                    else if ( value.stop.id == stopIdto )
                    {
                        maximo = sequencia;
                        html += 'class="fim"';
                    }
                    //Paragens que estão no meu caminho
                    if ( minimo > 0 && sequencia >= minimo && maximo == 0 )
                    {
                        html += 'class="meu_caminho"';
                    }

                    html += '><span class="paragem"></span><span class="nome">' + contador + '. '
                        + value.stop.stop_name + '</span>';

                    //Os spans acima têm float ^-^
                    html += '<div class="clearfix"></div></li>';
                    ++contador;
                });
                html += '</ul>';

                var titulo = retorno.route.route_short_name + ' ' + retorno.trip_short_name;
                $('h4.modal-title').html(titulo);
                $('div.mensagem')
                    .removeClass('alert-success')
                    .removeClass('alert-danger')
                    .removeClass('alert-warning')
                    .html(html);
                $("#myModal").modal();
            })
            .fail(function(retorno){
                //
            }
        );
    }
};

$('body').on('mouseover', 'div.itinerarios h4.panel-title a', function(e){
    id_itinerario = $(this).data('itinerario');

    Rotas.oculta_itinerarios();
    Rotas.mostra_itinerario(id_itinerario);
});
$('body').on('mouseout', 'div.itinerarios h4.panel-title a', function(e){
    id_itinerario = $(this).data('itinerario');

    Rotas.oculta_itinerarios();
    Rotas.mostra_primeiro_itinerario();
});
$('body').on('click', ' div.itinerarios h4.panel-title a', function(e){
    id_itinerario = $(this).data('itinerario');

    Rotas.itinerario_mostrar = id_itinerario;
    Rotas.formatar_otp();
});

//Clique nas informações do percurso (não existe no DOM)
$('body').on('click', 'a.mostra_informacao', function(e) {
    lat = $(this).data('lat');
    lon = $(this).data('lon');
    if ( ('undefined' != typeof(lat) && lat !== null)
            && ('undefined' != typeof(lon) && lon !== null) )
    {
        latlng = new L.LatLng(lat, lon);
        map.panTo(latlng);
        span_css = $(this).parents('span').prev().attr('class');
        conteudo = '<span class="' + span_css + '"></span><span class="texto">' + $(this).html() + '</span>';

        var popup = L.popup()
            .setLatLng(latlng)
            .setContent( conteudo )
            .openOn(map);
    }

    e.preventDefault();
});

//Mostra as paragens da rota selecionada
$('body').on('click', 'a.trip_viewer', function(e) {
    tripId = $(this).data('tripid');
    stopIdto = $(this).data('stop-to');
    stopIdfrom = $(this).data('stop-from');

    Rotas.trips(tripId, stopIdto, stopIdfrom);

    e.preventDefault();
});