var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var refresh = message.refresh;
    if (refresh === "quote") {
        getJSON('http://quotes.rest/qod.json?category=inspire').then(function(data) {
            var sec = new Date().getTime() / 1000;
            chrome.storage.local.set({
                'chm-quote': {
                    'quote': data.contents.quotes[0],
                    'time': sec
                }
            });
        });
    } else if(refresh === "weather") {
        getJSON("http://api.openweathermap.org/data/2.5/weather?q=Taipei&units=metric&APPID=6b75ba0d8c8118e7c0bcf3d64f5376cf").then(function(data){
            var sec = new Date().getTime() / 1000;
            chrome.storage.local.set({
                'chm-weather': {
                    'weather': data.weather[0],
                    'time': sec
                }
            });
        });
    } else {
        getJSON("https://www.reddit.com/r/all/hot/.json?count=10").then(function(data){
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
