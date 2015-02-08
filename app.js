if (localStorage.getItem("username") == null || localStorage.getItem("username") == "") {
    localStorage.setItem("username", null);
}
var $app = {
    initFirebase: function (firebaseusername) {
        $app.firebaseref.child("users/" + firebaseusername + "/name").on("value", function (n) {
            $app.loggedIn = true;
            //$("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
            $("#auth-form").hide();
            $("#logged-in").find("#username-p").text(localStorage.getItem("fullname"));
            $("#logged-in").show();
        }, function (e) {
            switch (e.code) {
            case "PERMISSION_DENIED":
                localStorage.setItem("username", null);
                $("#auth-form").on("submit", $app.authenticateToFirebase).show();
                localStorage.clear()
                location.reload();
                break;
            }
        });
        $app.firebaseref.child("users/" + firebaseusername + "/checklists/").on("value", function (cu, la) {
            if (cu.val() == null) {
                $("#statusBar").text("No checklists found!");
            } else {
                $("#statusBar").text("");
                $app.firebaseref.child("users/" + firebaseusername + "/checklists/").on("value", function (e) {
                    //console.log(e.val());
                    console.log(e.val());
                    $app.receivedChecklists = {};
                    for (var prop in e.val()) {
                        if (e.val().hasOwnProperty(prop)) {
                            $app.receivedChecklists[prop] = e.val()[prop];
                        }
                    }
                    $app.updateChecklistView();
                });
            }
        });

    },
    updateChecklistView: function () {
        for (var obj in $app.receivedChecklists) {
            if (!$("[data-checklistname='" + obj + "']").length) {
                $('<div class="title" data-checklistname="' + obj + '"></div>').html("<h2>" + obj + "</h2>").css("text-align", "center").appendTo("#body-container");
            } else {
                $("[data-checklistname='" + obj + "']").html("<h2>" + obj + "</h2>").attr("data-checklistname", obj);
            }
        }
        $("[data-checklistname]").each(function (i) {
            if ($app.receivedChecklists[$(this).attr("data-checklistname")] == undefined) {
                $(this).remove();
                $app.receivedChecklists[$(this).attr("data-checklistname")] = undefined;
            } else {}
        });
        //$('<div class="title" data-checklistname="' + prop + '"></div>').attr("data-checklistname ", prop).html(" < h2 > " + prop + " < /h2>").css("text-align", "center").appendTo("#body-container");
    },
    receivedChecklists: {},
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
    var firebaseusername = localStorage.getItem("username");
    $app.initFirebase(firebaseusername);
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
    $app.loggedIn = undefined;
    $app.firebaseref.unauth();
    location.href = "#home";
    localStorage.clear();
    location.reload();
});
Path.root("#home");

annyang.addCommands($app.voiceCommands);

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
