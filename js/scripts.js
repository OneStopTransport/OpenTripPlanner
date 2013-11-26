$(function(){
    var largura;
    //Altura e Largura dinamica
    resize_window = function(){
        var altura  = $(window).height();
        largura = $(window).width();
        $('div.mapa, div.esquerda, div.direita')
            .height(altura);
        $('div.esquerda article, div.direita article')
            .height(altura)
            .css('overflow-y', 'auto');
    };
    $(window).resize(function(){ resize_window(); });

    largura_barras = function() {
        if ( $('body').hasClass('mobile') || largura <= 760 )
            return '96%';
        else
            return '40%';
    };

    toggle_abas = function(aba) {
        var largura = '40px';
        div = 'div.' + aba;

        if ( $(div).hasClass('fechado') )
        {
            largura = largura_barras();
        }
        $(div).toggleClass('fechado');

        $(div).animate({
            width: largura
        }, 400, function(){
            if ( largura == '40px' )
            {
                $(div)
                    .find('article')
                    .css('background', 'transparent')
                    .hide();
            }
            else
            {
                $(div)
                    .find('article')
                    .css('background', '#FFF')
                    .show();
            }
        });
    };

    mostrar_aba = function(aba) {
        div = 'div.' + aba;
        $(div).removeClass('fechado');
        $(div).animate({
            width: largura_barras()
        }, 400, function(){
            $(div)
                .find('article')
                .css('background', '#FFF')
            .show();
        });
    };

    esconder_aba = function(aba) {
        div = 'div.' + aba;
        $(div).addClass('fechado');
        $(div).animate({
            width: '40px'
        }, 400, function(){
            $(div)
                .find('article')
                .css('background', 'transparent')
            .hide();
        });
    }

    $('.toggle_direita').on('click', function(e) {
        toggle_abas('direita');

        e.preventDefault();
    });

    $('.toggle_esquerda').on('click', function(e) {
        toggle_abas('esquerda');

        e.preventDefault();
    });

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

    $('button.btn-wheelchair').on('click', function(e){
        $(this).toggleClass('active');

        if ( $(this).hasClass('active') )
        {
            $('input#wheelchair').val('true');
        }
        else
        {
            $('input#wheelchair').val('false');
        }

        e.preventDefault();
    })
});