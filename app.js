var $app = {
    createDialogWithHTML: function (html) {
        vex.open({
            content: html
        });
    },
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
if (localStorage.getItem("username") !== "null") {
    $app.firebaseref.child("users/" + localStorage.getItem("username") + "/name").on("value", function (n) {
        $app.loggedIn = true;
        $("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
        $("#auth-form").hide();
        $("#logged-in").find("#username-p").text(localStorage.getItem("fullname"));
        $("#logged-in").show();
    });
} else {
    $("#auth-form").on("submit", $app.authenticateToFirebase).show();
}
$app.voiceCommands = {
    "set username as :name": function (username) {
        $("[name='auth_username']").val(username.toLowerCase());
    }
};
Path.map("#home").to(function () {
    $app.buttonRoutingAndChangingView("home");
});
Path.map("#profile").to(function () {
    $app.buttonRoutingAndChangingView("profile");
});
Path.map("#templates").to(function () {
    $app.buttonRoutingAndChangingView("templates");
});
Path.map("#logout").to(function () {
    localStorage.setItem("username", null);
    $app.loggedIn = undefined;
    $app.firebaseref.unauth();
    location.href = "#home";
    location.reload();
});
Path.root("#home");

//annyang.addCommands($app.voiceCommands);
function start(app) {
    //app.authenticateToFirebase();
}
$(function () {
    //   Path.history.pushState({}, "", location.hash);
    //  annyang.start();
    Path.listen();
    //$.get("auth.html", function (data) {
    //    $(data).appendTo("body");
    //});
    start($app);
    //$app.centerElementOnPage("#auth-form", $("#auth-form").innerWidth(), "px", "left");
    //alert();
    $(window).resize(function () {
        //$(".navbar-btns").find("a").height($("#navbar").innerHeight());
    });
});
