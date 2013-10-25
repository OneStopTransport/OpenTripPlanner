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

    $('dd.link').on('click', function(e){
        data_mostrar = $(this).data('mostrar');
        // THIS = $(this);
        var dtds = 'dt[data-mostrado="' + data_mostrar + '"], dd[data-mostrado="' + data_mostrar + '"]';
        $(dtds).toggle();
        visivel = $(dtds).css('display');

        if ( visivel == 'block' )
        {
            $(this)
                .children('.setinhas')
                .removeClass('baixo')
                .addClass('cima');
        }
        else
        {
            $(this)
                .children('.setinhas')
                .removeClass('cima')
                .addClass('baixo');
        }
    });

    //
    $('a.esconder_info').on('click', function(e){
        $('div.info_trip dl').toggle();

        dl_show = $('div.info_trip dl').css('display');
        if ( dl_show == 'block' )
            $(this).html('<i class="glyphicon glyphicon-eye-close"></i>');
        else
            $(this).html('<i class="glyphicon glyphicon-eye-open"></i>');

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