function time() {
    var h = new Date().getHours();
    var m = new Date().getMinutes();
    h = h > 9 ? h : "0" + h;
    m = m > 9 ? m : "0" + m;
    $("#time").text(h + ":" + m);
}

function quote() {
    chrome.storage.local.get('chm-quote', function(result){
        if (!jQuery.isEmptyObject(result)) {
            var quote = result['chm-quote'].quote.quote;
            quoteSplit = quote.split(/[.\(;\)]+/);
            for(var i in quoteSplit) {
                if (quoteSplit[i] !== "") {
                    $("#quote").append($("<p></p>")
                                       .addClass("quote-text")
                                       .text(quoteSplit[i]));
                }
            }
            $("#quote").append($("<i></i>")
                               .addClass("quote-author")
                               .text("- " + result['chm-quote'].quote.author));

            var sec = new Date().getTime() / 1000;
            if (Math.abs(sec - result['chm-quote'].time) > 3600) {
                // Do a refresh in an event page
                chrome.runtime.sendMessage({refresh: "quote"});
            }
        } else {
            $.getJSON('http://quotes.rest/qod.json?category=inspire', function(data) {
                var sec = new Date().getTime() / 1000;
                chrome.storage.local.set({
                    'chm-quote': {
                        'quote': data.contents.quotes[0],
                        'time': sec
                    }
                });
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

function weather() {
    chrome.storage.local.get('chm-weather', function(result){
        if (!jQuery.isEmptyObject(result)) {
            var weather = result['chm-weather'].weather;
            $("#weather-img").attr("src", "http://openweathermap.org/img/w/"+weather.icon+".png");
            $("#weather-descr").text(weather.main);
            $("#weather-temp").text(weather.temp);

            var sec = new Date().getTime() / 1000;
            if (Math.abs(sec - result['chm-weather'].time) > 120) {
                // Do a refresh in an event page
                chrome.runtime.sendMessage({refresh: "weather"});
            }
        } else {
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Taipei&units=metric&APPID=6b75ba0d8c8118e7c0bcf3d64f5376cf", function(data){
                var sec = new Date().getTime() / 1000;
                chrome.storage.local.set({
                    'chm-weather': {
                        'weather': data.weather[0],
                        'time': sec
                    }
                });
                $("#weather-img").attr("src", "http://openweathermap.org/img/w/"+data.weather[0].icon+".png");
                $("#weather-descr").text(data.weather[0].main);
                $("#weather-temp").text(data.main.temp);
            });
        }
    });
}

function news() {
    chrome.storage.local.get('chm-news', function(result){
        if (!jQuery.isEmptyObject(result)) {
            var news = $("#news");
            var posts = result['chm-news'].news;

            for(var p in posts) {
                var post = posts[p];
                var domain = post.data.subreddit;
                var thumb = post.data.thumbnail;
                if (thumb === "default" ||
                    thumb === "self" ||
                    thumb === "icon" ||
                    thumb === "image" ||
                    thumb === "nsfw") {
                        thumb = "default.png";
                    }

                var title = post.data.title;
                var trimmedTitle = title.substr(0, 100);
                if (trimmedTitle !== title) {
                    title = trimmedTitle + "...";
                }

                var text = post.data.selftext;
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
                    .append($('<div></div>')
                            .addClass("img-wrapper")
                            .append($('<img>')
                                    .attr("src", thumb)))
                    .append(cardblock);

                news.append(card);
            }

            var sec = new Date().getTime() / 1000;
            if (Math.abs(sec - result['chm-news'].time) > 360) {
                // Do a refresh in an event page
                chrome.runtime.sendMessage({refresh: "news"});
            }
        }
        else {
            $.getJSON("https://www.reddit.com/r/all/hot/.json?count=10", function(data){
                var sec = new Date().getTime() / 1000;
                chrome.storage.local.set({
                    'chm-news': {
                        'news': data.data.children,
                        'time': sec
                    }
                });
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", quote());
document.addEventListener("DOMContentLoaded", weather());
document.addEventListener("DOMContentLoaded", time());
document.addEventListener("DOMContentLoaded", news());
