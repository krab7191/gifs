
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

// Empty the gif container
$("#clear").on("click", function () {
    $("#img-box").empty();
});

// Stop all animation
$("#stop").on('click', function () {
    var imgs = $(".gif");
    for (var i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr("src", $(imgs[i]).attr("data-still"));
    }
});

// Preset topics
var topics = ["metallica", "iron maiden", "drums", "whitesnake", "guitar", "meshuggah", "black sabbath", "thrash metal", "mosh pit", "motorhead", "djent", "pantera"];

// Request object
var request = {
    apiKey: "fMBGvCbtPU31pSIvQPvQucGwYkicKgOf",
    baseUrl: "https://api.giphy.com/v1/gifs/search?api_key=",
    amount: 10,
    send: function (topic) {
        $.get({
            url: this.baseUrl + this.apiKey + "&limit=" + this.amount + "&q=" + topic
        }).then(function (response) {
            console.log(response.data[0]);
            for (var i = 0; i < response.data.length; i++) {
                appendImage(response.data[i], i);
            }
            scrollToNew(response.data[0].id);

        }, function () {
            alert("Please check your internet connection");
        });
    }
};

function scrollToNew(id) {
    // Show where the new images start
    $("#" + id).css("background-color", "green");
    // Scroll down the img container
    $("#img-box").animate({
        scrollTop: $("#img-box").scrollTop() + $("#" + id).position().top
    }, "slow", function () {
        setTimeout(function () {
            // Then remove the background color
            $("#" + id).css("background-color", "rgba(255, 236, 199, 0.6)");
        }, 500);
    });
}

// Create image box on the fly with title, rating, click handlers, etc.
function appendImage(responseObject, which) {
    var $d = $("<div>");
    if (which == 0) {
        $d.attr("id", responseObject.id);
    }
    $d.addClass('img-box').addClass("col-md-3");
    $d.append($("<img>").addClass('gif').attr("src", responseObject.images.downsized_still.url).attr("data-animated", responseObject.images.original.url).attr("data-still", responseObject.images.downsized_still.url).attr("data-state", "still"));
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

// Pre-attach click handlers to incoming gifs (to toggle animation)
$(document.body).on('click', ".gif", function () {
    var $img = $(this);
    if ($img.attr("data-state") == "still") {
        $img.attr("src", $img.attr("data-animated"));
        $img.attr("data-state", "animated");
    } else {
        $img.attr("src", $img.attr("data-still"));
        $img.attr("data-state", "still");
    }
});