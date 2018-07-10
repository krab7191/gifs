
// Ajax prefilter for CORS
// Thanks to: https://github.com/Rob--W/cors-anywhere/
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

// When doc ready, populate page with button for each topic in array
$(function () {
    topics.forEach(function (index) {
        createButton(index);
    });
});

// Hit enter in form or click submit: prevent page reload, get value, trim whitespace, call createButton
$("#search-button").on("click", function (event) {
    event.preventDefault();
    var inputText = $("#search-input").val().trim();
    if (inputText.length != 0) {
        createButton(inputText);
    }
    $("#search-input").val("");
    $("html, body").animate({
        scrollTop: 0
    }, 500);
});

$("#clear").on("click", function() {
    $("#img-box").empty();
});

// Preset topics
var topics = ["metallica", "iron maiden"];

// Request object
var request = {
    apiKey: "fMBGvCbtPU31pSIvQPvQucGwYkicKgOf",
    baseUrl: "https://api.giphy.com/v1/gifs/search?api_key=",
    amount: 10,
    send: function(topic) {
        $.get({
            url: this.baseUrl+this.apiKey+"&limit=" + this.amount + "&q=" + topic
        }).then(function (response) {
            for (var i=0; i<response.data.length; i++) {
                appendImage(response.data[i]);
            }
        }, function () {
            alert("Please check your internet connection");
        });
    }
};

function appendImage(responseObject) {
    var $d = $("<div>");
    $d.addClass('img-box').addClass("col-md-3");
    $d.append($("<img>").attr("src", responseObject.images.downsized_still.url));
    $d.append($("<a>").attr("href", responseObject.url).attr("target", "_blank").html("Title: " + responseObject.title));
    $d.append($("<p>").html("Rating: " + responseObject.rating));
    $("#img-box").append($d);
}

// Make jQuery button and attach a click handler to it
function createButton(text) {
    var $b = $("<button>");
    $b.html(text);
    $b.addClass('btn');
    $b.on('click', function () {
        request.send(this.innerText);
    });
    $("#button-box").append($b);
}
