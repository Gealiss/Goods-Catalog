$(document).ready(function() {

    $("#ModalLoginSign").on('click',function(){
        let email;
        let pass;

        email = $("#ModalLoginEmail").val();
        pass = $("#ModalLoginPass").val();

        var $this = $(this);
        var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Wait...';
        if ($(this).html() !== loadingText) {
          $this.data('original-text', $(this).html());
          $this.html(loadingText);
        }

        /* var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        
        return fetch('/login', {
            method: 'POST',
            mode: 'same-origin',
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: headers,
            body: JSON.stringify({"email": email, "password": pass })
        }).then((res) => {
            return res.json();
        })
        .then((data) => {
            $this.html($this.data('original-text'));
            if(!data.err){
                $("#ModalLoginInfo").text("");
                $("#ModalLogin").modal('hide');
                window.location.replace(data.url);
            } else {
                $("#ModalLoginInfo").text(data.err);
            }
        }); */

        $.ajax({
            method: "POST",
            url: "/login",
            contentType: "application/json",
            credentials: "include",
            data: JSON.stringify({"email": email, "password": pass })
        }).done(function(res){
            $this.html($this.data('original-text'));
            if(!res.err){
                $("#ModalLoginInfo").text("");
                $("#ModalLogin").modal('hide');
                window.location.replace(res.url);
            } else {
                $("#ModalLoginInfo").text(res.err);
            }
        });
    });
});