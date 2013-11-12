$(function() {

    $('form#trip_plan_form').on('submit', function(e){

        if ( !Rotas.validar() )
            return false;

        Rotas.tracar();

        altura  = $(window).height();
        largura = $(window).width();

        fechado = $('a.direcoes').hasClass('fechado');
        if ( fechado != false )
        {
            $('a.direcoes').removeClass('fechado');
            $('div#sidebar').show();
            $('div.direita')
                .removeClass('col-md-12')
                .addClass('col-md-push-4');

            resize_window();
        }
        setTimeout( map.invalidateSize.bind(map) );

        e.preventDefault();
    });
});