var locale = {
    titles: {
        panelTitle: 'Simulador de Viagens',
        tabTitle:   'Planear uma viagem',
        close:      'Fechar'
    },
    labels: {
        when:               'Quando',
        time:               'Hora',
        date:               'Data',
        depart:             'Partida',
        arrive:             'Chegada',
        mode:               'Tipo de Viagem',
        minimize:           'Preferência de percurso',
        maxWalkDistance:    'Distância máx. a pé',
        walkSpeed:          'Velocidade a pé',
        wheelchair:         'Accessível a cadeira de rodas',
        planTrip:           'Simular percurso',
        trip_details:       'Detalhes da viagem',
        date_time:          'Data e Hora',
        validity:           'Validade',
        total_distance:     'Distância total',
        by_foot:            'A pé', 
        by_transport:       'Transportes',
        total_duration:     'Duração total',
        startTime:          'Início',
        endTime:            'Fim',
        bike_options:       'Percurso de bicicleta',
        bikeFriendly:       'com ciclovia',
        flat:               'mais plano possivel',
        quick:              'mais rápido'
    },
    vectors: {
        modes: [
            ['TRANSIT,WALK',    'Transportes públicos'],
            ['BUSISH,WALK',     'Apenas autocarro'],
            ['TRAINISH,WALK',   'Apenas comboio'],
            ['WALK',            'Apenas a pé'],
            ['BICYCLE',         'Apenas de bicicleta'],
            ['TRANSIT,BICYCLE', 'Transportes e bicicleta']
        ],
        options: [
            ['TRANSFERS', 'Menos transferências'],
            ['QUICK',     'Viagem mais rápida'],
            ['SAFE',      'Bicicleta em segurança'],
            ['TRIANGLE',  'Personalizada de bicicleta...']
        ],
        maxWalkDistance: [
            ['500',     '500 metros'],
            ['1000',    '1 km'],
            ['5000',    '5 km'],
            ['10000',   '10 km'],
            ['20000',   '20 km']
        ],
        walkSpeed: [
            ['0.278',  '1 km/h'],
            ['0.556',  '2 km/h'],
            ['0.833',  '3 km/h'],
            ['1.111',  '4 km/h'],
            ['1.389',  '5 km/h'], 
            ['1.667',  '6 km/h'], 
            ['1.944',  '7 km/h'],
            ['2.222',  '8 km/h'],
            ['2.500',  '9 km/h'],
            ['2.778',  '10 km/h'] 
        ]
    },
    messages: {
        more_options:   '<i class="glyphicon glyphicon-plus"></i> Clique aqui para mais opções',
        less_options:   '<i class="glyphicon glyphicon-minus"></i> Clique aqui para menos opções',
        miss_origin:    'É necessário definir um ponto de partida',
        miss_destiny:   'É necessário definir um ponto de chegada.',
        hide_info:      'Esconder info',
        show_info:      'Mostrar info',
        right_mouse:    'Utilize o botão direito do rato para traçar rotas'
    },
    context_menu: {
        start_here:     'Começar aqui',
        end_here:       'Terminar aqui',
        center_map:     'Centrar mapa',
        more_zoom:      'Mais zoom',
        less_zoom:      'Menos zoom'
    },
    info: {
        stop_depart:    'Paragem: (embarque) ',
        stop_arrive:    'Paragem: (desembarque) ',
        see_stops:      'ver paragens',
        at:             ' às ',
        bus:            'Autocarro',
        get_in_stop:    'Entrar na paragem:',
        get_out_stop:   'Sair na paragem:',
        depart_at:      'Partida às:',
        arrive_at:      'Chegada às:',
        service_by:     'Serviço prestado por:'
    }
};