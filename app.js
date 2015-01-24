var $app = {
    buttonRoutingAndChangingView: function (button) {
        $("#nav-system").find("li").removeClass("active");
        $("#nav-system").find("[data-name='" + button + "']").toggleClass("active");
    },
    firebaseref: new Firebase("https://daily-checklist-points.firebaseio.com/"),
    centerElementOnPage: function (element, element_value, css_size_word, top_or_left) {
        //alert(element + " " + element_value + " " + css_size_word + " "+ top_or_left);
        var windowmeasure;
        if (css_size_word == "em") {
            var css_word = "em";
        }
        if (css_size_word == "px") {
            var css_word = "px";
        }
        if (top_or_left == "top") {
            windowmeasure = $(window).innerHeight()
        } else {
            windowmeasure = $(window).innerWidth()
        }
        //alert(windowmeasure);
        $(element).css("position", "relative");
        $(element).css(top_or_left, windowmeasure / 2 - (element_value * 0.5) + css_word);
    }
};
if (localStorage.getItem("username")) {
    $app.loggedIn = true;
$app.firebaseref.child("users/" + localStorage.getItem("username") + "/name").on("value", function (n) {
    $("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
});
} else {}
$app.voiceCommands = {
    "set username as :name": function (username) {
       $("[name='auth_username']").val(username.toLowerCase());
    }
}
Path.map("#home").to(function () {
    $app.buttonRoutingAndChangingView("home");
});
Path.map("#profile").to(function () {
    $app.buttonRoutingAndChangingView("profile");
});
Path.map("#messages").to(function () {
    $app.buttonRoutingAndChangingView("messages");
});
Path.root("#home");

//annyang.addCommands($app.voiceCommands);
function Start(app) {
    //app.authenticateToFirebase();
}
$(function () {
 //   Path.history.pushState({}, "", location.hash);
  //  annyang.start();
    Path.listen();
    //$.get("auth.html", function (data) {
    //    $(data).appendTo("body");
    //});
    Start($app);
    //$app.centerElementOnPage("#auth-form", $("#auth-form").innerWidth(), "px", "left");
    //alert();
    $(window).resize(function() {
    //$(".navbar-btns").find("a").height($("#navbar").innerHeight());
    });
});