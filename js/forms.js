$(function() {

    $('form#trip_plan_form').on('submit', function(e){

        if ( !Rotas.validar() )
            return false;

        Rotas.tracar();

        var fechado = $('a.direcoes').hasClass('fechado');
        if ( fechado !== false )
        {
            $('a.direcoes').removeClass('fechado');
            $('div#sidebar').show();
            $('div.direita')
                .removeClass('col-md-12')
                .addClass('col-md-push-4');

            resize_window();
        }
        mostra_esquerda();
        setTimeout( map.invalidateSize.bind(map) );

        if ( $('div#coll_it1').css('display') == 'none' )
            $('a[href="#coll_it1"]').trigger('click');

        e.preventDefault();
    });
});