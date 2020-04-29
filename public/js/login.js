$(document).ready(function() {

    $("#form1").submit(function(){
        let email;
        let pass;

        email = $("#login").val();
        pass = $("#pass").val();

        $.ajax({
            method: "POST",
            url: "/login",
            contentType: "application/json",
            data: JSON.stringify({"email": email, "password": pass })
        }).done(function(url){
            window.location.replace(url);
        });
        return false;
    });
});