$(function(){
    //Altura e Largura dinamica
    resize_window = function(){
        var altura  = $(window).height();
        var largura = $('div.direita').width();

        // console.log( $('div.mapa').width() );
        $('div.mapa')
            .width(largura)
            .height( altura - 70 );
        // console.log( $('div.mapa').width() );
    };
    $(window).resize(function(){ resize_window(); });

    //Início
    $('div#sidebar').hide();
    $('div.direita')
        .addClass('col-md-12')
        .removeClass('col-md-push-4');

    resize_window();

    //Date & Time Pickers
    $('#date')
        .datepicker()
        .on('changeDate', function(){
            $('#date').datepicker('hide');
        });
    $('input#time').timepicker();

    //Mostra os passos de cada instrução
    $('a.direcoes').on('click', function(e){
        var fechado = $(this).hasClass('fechado');
        //Pai do <a>, neste caso <li>
        var link    = $(this).parent();

        if ( true === fechado )
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
        resize_window();

        e.preventDefault();
    });

    //Opções avançadas
    $('div.opcoes_avancadas a.mostrar').on('click', function(e){
        var link = $(this);
        $('div.mais_opcoes').toggle('slow', function(){
            if ( $(this).css('display') == 'none')
            {
                $(link).html(locale.messages.more_options);
            }
            else
            {
                $(link).html(locale.messages.less_options);
            }
        });

        e.preventDefault();
    });

    $('dd.link').on('click', function(){
        var data_mostrar = $(this).data('mostrar');
        // THIS = $(this);
        var dtds = 'dt[data-mostrado="' + data_mostrar + '"], dd[data-mostrado="' + data_mostrar + '"]';
        $(dtds).toggle();
        var visivel = $(dtds).css('display');

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

    esconder_info = function(link, esconder) {
        if ( 'undefined' !== typeof(esconder) )
        {
            $('div.info_trip dl').hide();
        }
        else
        {
            $('div.info_trip dl').toggle();
        }

        var dl_show = $('div.info_trip dl').css('display');
        if ( dl_show == 'block' )
        {
            link.html('<i class="glyphicon glyphicon-eye-close"></i>');
        }
        else
        {
            link.html('<i class="glyphicon glyphicon-eye-open"></i>');
        }
    };
    //
    $('a.esconder_info').on('click', function(e){
        esconder_info($(this));

        e.preventDefault();
    });

    //Objetos que não estão no DOM original
    $('body').on('click', 'ul.direcoes li.primeiro_nivel', function() {
        var proximo = $(this).children('.escondido');
        if ( proximo.html() === '' )
        {
            $(this).css('cursor', 'auto');
        }

        //Escondo todas
        $('ul.escondido').each(function(){
            $(this).hide();
        });

        //Mostro a clicada
        proximo.toggle();
    });
    $('body').on('click', 'ul.direcoes li ul li', function() {
        return false;
    });

    $('form select#optimize').on('change', function(){
        if ( $(this).val() == 'TRIANGLE' )
        {
            $('div.bike_options').removeClass('escondido');
            $('input#triangleSafetyFactor,input#triangleTimeFactor,input#triangleSlopeFactor')
                .attr('disabled', 'disabled');
        }
        else
        {
            $('div.bike_options').addClass('escondido');
            $('input#triangleSafetyFactor,input#triangleTimeFactor,input#triangleSlopeFactor')
                .removeAttr('disabled');
        }
    });
    $('input#triangleSafetyFactor,input#triangleTimeFactor,input#triangleSlopeFactor')
        .attr('disabled', 'disabled');
});