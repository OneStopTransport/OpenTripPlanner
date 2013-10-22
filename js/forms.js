$(function() {

    $('form#trip_plan_form').on('submit', function(e){

        if ( !Rotas.validar() )
            return false;

        Rotas.tracar();

        $('div#sidebar').show();

        altura = $(window).height();
        largura = $(window).width();

        fechado = $('a.direcoes').hasClass('fechado');
        if ( fechado != false )
        {
            $('a.direcoes').removeClass('fechado');
            $('div#sidebar').show();
            // $('div.mapa')
            //     .animate({
            //         width: '68%',
            //         left: '31%'
            // }, 600);
        }

        e.preventDefault();
    });


});