handlebars_parser = {
    run: function(userData)
    {
        var data = userData.userData;
        $('body *').each(function(){
            var tag = $(this);
            if ( typeof($(tag).attr('data-handlebars')) != 'undefined' )
            {
                var source = $(tag).html();
                var template = Handlebars.compile(source);

                var result = template(data);
                $(tag).html(result);
            }
        });
    }
};