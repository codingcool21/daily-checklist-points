if (localStorage.getItem("username") == null || localStorage.getItem("username") == "") {
    localStorage.setItem("username", null);
}
var $app = {
    deleteItemFromChecklist: function (check_name, check_item) {

    },
    sendUpdateToFirebase: function (object, check_name, item_name) {
        //console.log("reached update func");

        $app.firebaseref.child("users/" + $app.firebaseUsername + "/checklists/" + check_name + "/" + item_name + "/done").set(String(object.prop("checked")));
        objectTemp = undefined;
        //$app.updateChecklistView();
    },
    initFirebase: function (firebaseusername) {
        $app.firebaseUsername = firebaseusername;
        $app.firebaseref.child("users/" + firebaseusername + "/name").on("value", function (n) {
            $app.loggedIn = true;
            //$("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
            localStorage.setItem("fullname", n.val());
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
    tempChecklistsData: {},
    updateChecklistView: function () {
        for (var obj in $app.receivedChecklists) {
            if (!$("[data-checklistname='" + obj + "']").length) {
                $('<div class="container-fluid"><div class="row"><div class="title" data-checklistname="' + obj + '"></div></div></div>').find(".title").html("<h2>" + obj + "</h2>").css("text-align", "center").appendTo("#body-container");
                if ($app.receivedChecklists[obj].empty == true) {
                    $("<h2 class='tasks'>No Items</h2>").appendTo("[data-checklistname='" + obj + "']");
                    return;
                }
                $app.tempChecklistsData[obj] = [];
                for (var objdata in $app.receivedChecklists[obj]) {
                    if ($app.receivedChecklists[obj].hasOwnProperty(objdata)) {
                        var number = Number(objdata.split("_")[1]);
                        $app.tempChecklistsData[obj][number - 1] = $app.receivedChecklists[obj][objdata];
                    }
                }
                for (var i = 0; i < $app.tempChecklistsData[obj].length; i++) {
                    var isTrueSet = ($app.tempChecklistsData[obj][i].done == 'true');
                    //console.log(isTrueSet);
                    var text = $("<div class='tasks col-xs-8 col-sm-9 col-md-9'>").html("<h4>" + $app.tempChecklistsData[obj][i].name + "</h4>");
                    var checkbox = $("<div class='tasks col-xs-3 col-sm-3 col-md-3'>").html("<div class='col-sm-10 col-sm-offset-2 col-md-10 col-md-offset-2 pull-left'><input class='checkboxes big' type='checkbox' id='" + obj + "_" + i + "'/><h4 style='font-weight: bold'>" + (isTrueSet ? "Done" : "Not done") + "</label></div>").find("input").attr("checked", isTrueSet).parent().parent();
                    $.checkbox = checkbox;
                    //console.log("text is ... " + text + " and checkbox is ... " + checkbox);
                    $($(text)).add($(checkbox)).appendTo("[data-checklistname='" + obj + "']");
                    $("#" + obj + "_" + i).change(function () {
                        var objcall = $(this);
                        //console.log("reached change");
                        objcall.prop("checked", (objcall.prop("checked") ? true : false));
                        $app.sendUpdateToFirebase(objcall, obj, "item_" + i);
                    });
                    $(checkbox).click(function () {
                        console.log("clicked the div for checklist " + obj + ", item " + i);
                        var obj_c = $(this);
                        obj_c.find("input").prop("checked", ($(obj_c.find("input")).prop("checked") ? false : true));
                        $app.sendUpdateToFirebase(obj_c.find("input"), obj, "item_" + i);
                    });
                }
                $app.tempChecklistsData = {};
            } else {
                $("[data-checklistname='" + obj + "']").html("<h2>" + obj + "</h2>").attr("data-checklistname", obj);
                $("[data-checklistname='" + obj + "'] > .tasks").remove();
                if ($app.receivedChecklists[obj].empty == true) {
                    $("<h2 class='tasks'>No Items</h2>").appendTo("[data-checklistname='" + obj + "']");
                    return;
                }
                $app.tempChecklistsData[obj] = [];
                for (var objdata in $app.receivedChecklists[obj]) {
                    if ($app.receivedChecklists[obj].hasOwnProperty(objdata)) {
                        var number = Number(objdata.split("_")[1]);
                        $app.tempChecklistsData[obj][number - 1] = $app.receivedChecklists[obj][objdata];
                    }
                }
                for (var i = 0; i < $app.tempChecklistsData[obj].length; i++) {
                    var isTrueSet = ($app.tempChecklistsData[obj][i].done == 'true');
                    //console.log(isTrueSet);
                    var text = $("<div class='tasks col-xs-8 col-sm-9 col-md-9'>").html("<h4>" + $app.tempChecklistsData[obj][i].name + "</h4>");
                    var checkbox = $("<div class='tasks col-xs-3 col-sm-3 col-md-3'>").html("<div class='col-sm-10 col-sm-offset-2 col-md-10 col-md-offset-2 pull-left'><input class='checkboxes big' type='checkbox' id='" + obj + "_" + i + "'/><h4 style='font-weight: bold'>" + (isTrueSet ? "Done" : "Not done") + "</label></div>").find("input").attr("checked", isTrueSet).parent().parent();
                    $.checkbox = checkbox;
                    //console.log("text is ... " + text + " and checkbox is ... " + checkbox);
                    $($(text)).add($(checkbox)).appendTo("[data-checklistname='" + obj + "']");
                    $("#" + obj + "_" + i).change(function () {
                        var objcall = $(this);
                        //console.log("reached change");
                        objcall.prop("checked", (objcall.prop("checked") ? true : false));
                        $app.sendUpdateToFirebase(objcall, obj, "item_" + i);
                    });
                    $(checkbox).click(function () {
                        console.log("clicked the div for checklist " + obj + ", item " + i);
                        var obj_c = $(this);
                        obj_c.find("input").prop("checked", ($(obj_c.find("input")).prop("checked") ? false : true));
                        $app.sendUpdateToFirebase(obj_c.find("input"), obj, "item_" + i);
                    });
                }
                $app.tempChecklistsData = {};
            }
        }
        $("[data-checklistname]").each(function (i) {
            if ($app.receivedChecklists[$(this).attr("data-checklistname")] == undefined) {
                $(this).remove();
                $app.receivedChecklists[$(this).attr("data-checklistname")] = undefined;
            } else {
                return;
            }
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
Mousetrap.bind("alt+p", function () {
    location.href = "#profile";
});
Mousetrap.bind("alt+h", function () {
    location.href = "#home";
});
Mousetrap.bind("alt+c+t", function () {
    location.href = "#templates";
});
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
