var $ = window.jQuery,
    $app = window.$app,
    CryptoJS = window.CryptoJS,
    FirebaseTokenGenerator = window.FirebaseTokenGenerator;

function activateLogIn() {
    $app.authenticateToFirebase = function (event) {
        event.preventDefault();
        if ($("#auth-form").find("[name='auth_username']").val() == "") {
            localStorage.setItem("username", null);
            location.reload();
        } else {
            localStorage.setItem("username", $("#auth-form").find("[name='auth_username']").val());
        }
        var username = localStorage.getItem("username").toLowerCase(),
            password = $("#auth-form").find("[name='auth_password']").val();
        $app.firebaseref.child("users/" + username + "/authkey").on("value", function (data) {
            var d = CryptoJS.AES.decrypt(data.val(), password).toString(CryptoJS.enc.Utf8),
                FTG = new FirebaseTokenGenerator(d),
                t = FTG.createToken({
                    uid: "#" + username,
                    userid: username,
                    user: true
                });
            //console.log(t);
            $app.firebaseref.authWithCustomToken(t, function (error, authData) {
                if ($app.loggedIn === undefined) {
                    $app.firebaseref.child("users/" + username + "/name").on("value", function (n) {
                        //$("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
                        $("#auth-form").find("input").val("");
                        $("#auth-form").hide();
                        $("#logged-in").show();
                        $app.username = n.val();
                        localStorage.setItem("fullname", n.val());
                        $("#username-p").text(n.val());
                        $app.loggedIn = true;
                        $app.initFirebase(username);
                    });
                } else {
                    return false;
                }
            });
        });
    };
    if (localStorage.getItem("username") === "null") {
        $("#auth-form").on("submit", $app.authenticateToFirebase).show();
    }

}
//var parent = parent.document.getElementById("auth");
$(activateLogIn);
