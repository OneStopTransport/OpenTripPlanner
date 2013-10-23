$(function(){
    $('a[href="#trip_resultados"]').hide();
    //Altura e Largura dinamica
    $(window).resize(function(){ resize_window(); });
    resize_window = function(){
        altura  = $(window).height();
        largura = $(window).width();
        $('div.mapa').height( altura - 70 );
    };
    resize_window();

    //Início
    $('div#sidebar').hide();
    $('div.direita')
        .addClass('col-md-12')
        .removeClass('col-md-push-4');

    //Date & Time Pickers
    $('#date').datepicker();
    $('input#time').timepicker();

    //Mostra os passos de cada instrução
    $('a.direcoes').on('click', function(e){
        fechado = $(this).hasClass('fechado');
        //Pai do <a>, neste caso <li>
        link    = $(this).parent();

        if ( true == fechado )
        {
            $(link).addClass('active');
            $(this).removeClass('fechado');
            $('div#sidebar').show();
            $('div.direita')
                .removeClass('col-md-12')
                .addClass('col-md-push-4');

        }
        else
        {
            $(link).removeClass('active');
            $(this).addClass('fechado');
            $('div#sidebar').hide();
            $('div.direita')
                .addClass('col-md-12')
                .removeClass('col-md-push-4');
        }

        e.preventDefault();
    });

    //Opções avançadas
    $('div.opcoes_avancadas a.mostrar').on('click', function(e){
        link = $(this);
        $('div.escondido').toggle('slow', function(){
            if ( $(this).css('display') == 'none')
                $(link).html(locale.messages.more_options);
            else
                $(link).html(locale.messages.less_options);
        });

        e.preventDefault();
    });

    //Objetos que não estão no DOM original
    $('body').on('click', 'ul.direcoes li', function() {
        proximo = $(this).children(".escondido");
        if ( proximo.html() == '' )
            $(this).css('cursor', 'auto');
        proximo.toggle();
    });
    $('body').on('click', 'ul.direcoes li ul li', function() {
        return false;
    });
});