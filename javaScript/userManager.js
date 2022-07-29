(function(){

    const auth = firebase.auth();

    const user = auth.currentUser;

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (document.getElementById("login-button")){
                document.getElementById("login-button").style.display = "none";
            }

            if (document.getElementById("logout-button")){
                document.getElementById("logout-button").style.display = "block";
                document.getElementById('logout-button').addEventListener("click", function(e)
                {
                    firebase.auth().signOut();
                    location.href = 'login.html';
                });
            }
        }else {
            if (document.getElementById("login-button")){
                document.getElementById("login-button").style.display = "block";
            }

            if (document.getElementById("logout-button")){
                document.getElementById("logout-button").style.display = "none";
            }
        }
    });

})();