function activateLogIn() {
    $app.authenticateToFirebase = function (event) {
        event.preventDefault();
        localStorage.setItem("username", $("#auth-form").find("[name='auth_username']").val());
        var username = localStorage.getItem("username");
        var password = $("#auth-form").find("[name='auth_password']").val();
        $app.firebaseref.child("users/" + username + "/authkey").on("value", function (data) {
            var d = CryptoJS.AES.decrypt(data.val(), password).toString(CryptoJS.enc.Utf8);
            var FTG = new FirebaseTokenGenerator(d);
            var t = FTG.createToken({
                uid: "#" + username,
                userid: username,
                user: true
            });
            $app.firebaseref.authWithCustomToken(t, function (error, authData) {
                if ($app.loggedIn == undefined) {
                    $app.firebaseref.child("users/" + username + "/name").on("value", function (n) {
                        $("#statusBar").text("Welcome back, " + n.val() + ". Firebase is now connected!");
                    });
                    $app.loggedIn = true;
                } else {
                    return false;
                }
            });
        });
    }
    $("#auth-form").show().on("submit", $app.authenticateToFirebase);
    $("#statusBar").text("Please log in to see your checklists");
}
//var parent = parent.document.getElementById("auth");
$(activateLogIn);