    var searchUrl = 'https://api-public.guidebox.com/v1.43/US/rKcE8UjpWG7r8hIkG3Dus9HltJxmoYxp/search/title/';
    var tvIdUrl = 'https://api-public.guidebox.com/v1.43/US/rKcE8UjpWG7r8hIkG3Dus9HltJxmoYxp/show/';
    var showParams = '/episodes/all/1/100/';
    var webContent = '/web/true';
    var checkStr = '';



    // clear search results when clear button is hit
    $('#resetbutton').on('click', function() {
        $('.show_description').empty();
        $('.list_of_episodes').empty();
        $('#searchbar').val('');

    });



    // When form is submitted get values
    $('#submitbutton').on('click', function() {
        event.preventDefault();
        $('.show_description').empty();
        var title = $('#searchbar').val();
        console.log(title);

        // get check box values
        var checkValues = [];

        $.each($('input[type=checkbox]:checked'), function() {
            checkValues.push($(this).val());
            return checkStr = checkValues.join(',');
        });
        console.log(checkStr);
        // Display all shows with title matches
        $.get(searchUrl + title, function(data) {
            searchResults = data;
            console.log(data);
            for (var i = 0; i < data.results.length; ++i) {
                $('.show_description').append('<div class="col l4 m6 s12 row shows hoverable"' + 'id="' + data.results[i].id + '">' +
                    '<div class="card">' +
                    // '<span class="card-title">' + data.results[i].title + '</span>' +
                    '<div class="card-image"> <img src="' + data.results[i].artwork_608x342 + '"/>' +
                    '</div></div>' +
                    '</div>');
            }
            return searchResults;
        })
    })



    $('div').on('click', '.shows', function(event) {
        var selected = $(this).attr('id');
        $('.show_description').empty();
        $('.list_of_episodes').empty();
        console.log(selected);
        var showinfo = $.get(tvIdUrl + selected, function(data) {
            $('.show_description').append('<section class="center-align">' +
                '<img src="' + data.banner + '"/>' +
                '<h1 class="grey-text text-darken-4">' + data.title + '</h1>' +
                '<p class="grey-text text-darken-1">' + data.overview + '</p>' +
                + '</section>'
              +'<div class="divider"></div>');

        });

        $.get(tvIdUrl + selected + showParams + checkStr + webContent, function(data) {

                var episodesBySeason = {};

                for (var i = 0; i < data.results.length; i++) {
                    var results = data.results[i];

                    if (!episodesBySeason[results.season_number]) {
                        episodesBySeason[results.season_number] = {};
                    }
                    var season = episodesBySeason[data.results[i].season_number];
                    season[results.episode_number] = results;


                        console.log(episodesBySeason)
                }
                for (var keys in episodesBySeason) {
                    $('.list_of_episodes').append('<h2 class=" col s12 grey-text text-darken-4"> Season '  + keys + '</h2>')
                    var epi = episodesBySeason[keys];
                    for (var prop in epi) {
                        $('.list_of_episodes').append(
                            '<div class="card row col l4 m6 s12 hoverable">'
                              +  '<div class="card-image waves-effect waves-block waves-light">'
                              +  '<img class="activator" src="'+ epi[prop].thumbnail_608x342 +'">'
                                + '</div>'
                              +  '<div class="card-content">'
                              +  '<span class="card-title activator grey-text text-darken-4 truncate">'+ epi[prop].title+'<i class="material-icons right">more_vert</i></span>'
                              + '<p><a class="lime-text"href="'+ epi[prop].subscription_web_sources[0].link  + '">Watch Now</a></p>'
                              +  '</div>'
                              +  '<div class="card-reveal">'
                              +  '<span class="card-title grey-text text-darken-4">'+ epi[prop].title + '<i class="material-icons right">close</i></span>'
                              +  '<p class="grey-text text-darken-1">'+ epi[prop].overview +'</p>'
                              +  '</div>'
                              +  '</div>'


                        );








                    }

                }
            }

        )


    })
