var locale;

locale = {};

locale = {
    titles: {
        panelTitle: 'Simulador de Viagens',
        tabTitle:   'Planear uma viagem',
        close:      'Fechar'
    },
    labels: {
        when:               'Quando',
        time:               'Hora',
        date:               'Data',
        depart:             'Embarcar',
        arrive:             'Chegada',
        mode:               'Viaja por',
        minimize:           'Mostrar o(a)',
        maxWalkDistance:    'Distância máxima a pé',
        walkSpeed:          'Velocidade a pé',
        wheelchair:         'Accessível à cadeira de rodas',
        planTrip:           'Simular percurso',
        trip_details:       'Detalhes da viagem',
        date_time:          'Data e Hora',
        time:               'Hora',
        validity:           'Validade',
        total_distance:     'Distância total',
        by_foot:            'A pé', 
        by_transport:       'Transportes',
        total_duration:     'Duração total',
        startTime:          'Início',
        endTime:            'Fim'
    },
    vectors: {
        modes: [
            ['TRANSIT,WALK',    'Transportes'],
            ['BUSISH,WALK',     'Apenas Autocarro'],
            ['TRAINISH,WALK',   'Apenas Comboio'],
            ['WALK',            'Apenas a pe'],
            ['BICYCLE',         'Apenas de bicicleta'],
            ['TRANSIT,BICYCLE', 'Carros & Bicicletas']
        ],
        options: [
            ['TRANSFERS', 'Menos transferências'],
            ['QUICK',     'Viagem curta'],
            ['SAFE',      'Possivel por bicicleta'],
            ['TRIANGLE',  'Viagem personalizada...']
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
        more_options:   'Clique aqui para mais opções',
        less_options:   'Clique aqui para menos opções',
        miss_origin:    'É necessário definir um ponto de partida',
        miss_destiny:   'É necessário definir um ponto de chegada.'
    }
}