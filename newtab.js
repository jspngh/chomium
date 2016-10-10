$( document ).ready(function() {
    $.getJSON('http://quotes.rest/qod.json?category=inspire', function(data) {
        var quoteDiv = document.getElementById("quote");
        quote = data.contents.quotes[0].quote;
        quoteSplit = quote.split(/[.\(;\)]+/);
        for(var i in quoteSplit) {
            if (quoteSplit[i] !== "") {
                var p = document.createElement("p");
                p.className = "quote-string";
                p.innerHTML = quoteSplit[i];
                quoteDiv.appendChild(p);
            }
        }
    });

    $.getJSON("https://www.reddit.com/r/all/hot/.json?count=10", function(data){
        var firstCol = $("#first-col");
        var secondCol = $("#second-col");
        var thirdCol = $("#third-col");

        var cntr = 0;

        posts = data.data.children;
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
    });

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Taipei&units=metric&APPID=6b75ba0d8c8118e7c0bcf3d64f5376cf", function(data){
        $("#weather-img").attr("src", "http://openweathermap.org/img/w/"+data.weather[0].icon+".png");
        $("#weather-descr").text(data.weather[0].main);
        $("#weather-temp").text(data.main.temp);
    });
});

// document.addEventListener("DOMContentLoaded", function() {
//     chrome.management.getAll(getAllCallback);
// });

var getAllCallback = function(list) {
    var apps = document.getElementById("apps");
    var cnt = 0;
    var row = document.createElement("div");
    row.className += "row";
    apps.appendChild(row);

    for(var i in list) {
        if (cnt == 3) {
            cnt = 0;
            row = document.createElement("div");
            row.className += "row";
            apps.appendChild(row);
        }
        // we don't want to do anything with extensions yet.
        var extInf = list[i];
        if(extInf.isApp && extInf.enabled) {
            var app = document.createElement("div");

            var img = new Image();
            img.className = "image";
            img.src = find128Image(extInf.icons);
            img.addEventListener("click", (function(ext) {
                return function() {
                    chrome.management.launchApp(ext.id);
                };
            })(extInf));

            var name = document.createElement("div");
            name.className = "name";
            name.textContent = extInf.name;

            app.className = "app";
            app.appendChild(img);
            app.appendChild(name);
            row.appendChild(app);

            cnt = cnt+1;
        }
    }
};

var find128Image = function(icons) {
    for(var icon in icons) {
        if(icons[icon].size == "128") {
            return icons[icon].url;
        }
    }

    return "/noicon.png";
};
