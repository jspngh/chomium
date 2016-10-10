function quote(){
    chrome.storage.local.get('quote', function(result){
        if (!jQuery.isEmptyObject(result)) {
            var quote = result.quote.quote;
            quoteSplit = quote.split(/[.\(;\)]+/);
            for(var i in quoteSplit) {
                if (quoteSplit[i] !== "") {
                    $("#quote").append($("<p></p>")
                                       .addClass("quote-text")
                                       .text(quoteSplit[i]));
                }
            }
            $("#quote").append($("<p></p>")
                               .addClass("quote-author")
                               .text(result.quote.author));

            // Do a refresh in an event page
            //chrome.storage.local.set({'quote': quote});
        } else {
            $.getJSON('http://quotes.rest/qod.json?category=inspire', function(data) {
                chrome.storage.local.set({'quote': data.contents.quotes[0]});
                var quote = data.contents.quotes[0].quote;
                quoteSplit = quote.split(/[.\(;\)]+/);
                for(var i in quoteSplit) {
                    if (quoteSplit[i] !== "") {
                        $("#quote").append($("<p></p>")
                                           .addClass("quote-text")
                                           .text(quoteSplit[i]));
                    }
                }
                $("#quote").append($("<p></p>")
                                   .addClass("quote-author")
                                   .text(data.contents.quotes[0].author));
            });
        }
    });
}

function news() {
    chrome.storage.local.get('news', function(result){
        if (!jQuery.isEmptyObject(result)) {
            alert("is loaded");
            var firstCol = $("#first-col");
            var secondCol = $("#second-col");
            var thirdCol = $("#third-col");

            var cntr = 0;

            var posts = result.news;

            for(var p in posts) {
                var post = posts[p];
                var title = post.data.title;
                var domain = post.data.subreddit;
                var text = post.data.selftext;
                var trimmedTitle = title.substr(0, 100);
                if (trimmedTitle !== title) {
                    title = trimmedTitle + "...";
                }
                var trimmedText = text.substr(0, 100);
                if (trimmedText !== text) {
                    text = trimmedText + "...";
                }

                var cardblock = $('<div></div>')
                    .addClass("card-block")
                    .append($('<h4></h4>')
                            .text(title))
                    .append($('<p></p>')
                            .text(text))
                    .append($('<div></div>')
                            .addClass("btn-wrapper")
                            .append($('<a></a>')
                                    .addClass("btn btn-primary")
                                    .attr("href", "https://www.reddit.com" + post.data.permalink)
                                    .text(domain)));
                var card = $('<div></div>')
                    .addClass("news card")
                    .append($('<img>')
                            .addClass("card-img-top")
                            .attr("src", post.data.thumbnail))
                    .append(cardblock);

                if (cntr == 0) {
                    firstCol.append(card);
                    cntr = 1;
                } else if (cntr == 1) {
                    secondCol.append(card);
                    cntr = 2;
                } else if (cntr == 2) {
                    thirdCol.append(card);
                    cntr = 0;
                }
            }

            // Do a refresh in an event page
            //chrome.storage.local.set({'news': news});
        }
        else {
            $.getJSON("https://www.reddit.com/r/all/hot/.json?count=10", function(data){
                chrome.storage.local.set({'news': data.data.children});
            });
        }
    });
}

function weather() {
    chrome.storage.local.get('weather', function(result){
        if (!jQuery.isEmptyObject(result)) {
            var weather = result.weather;
            $("#weather-img").attr("src", "http://openweathermap.org/img/w/"+weather.icon+".png");
            $("#weather-descr").text(weather.main);
            $("#weather-temp").text(weather.temp);

            // Do a refresh in an event page
            //chrome.storage.local.set({'weather': weather});
        } else {
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Taipei&units=metric&APPID=6b75ba0d8c8118e7c0bcf3d64f5376cf", function(data){
                chrome.storage.local.set({'weather': data.weather[0]});
                $("#weather-img").attr("src", "http://openweathermap.org/img/w/"+data.weather[0].icon+".png");
                $("#weather-descr").text(data.weather[0].main);
                $("#weather-temp").text(data.main.temp);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", quote());
document.addEventListener("DOMContentLoaded", news());
document.addEventListener("DOMContentLoaded", weather());
