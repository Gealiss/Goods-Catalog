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
                //window.location.replace(res.url);
                window.location.reload(true);
            } else {
                $("#ModalLoginInfo").text(res.err);
            }
        });
    });
});