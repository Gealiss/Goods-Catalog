$(document).ready(function() {

    $.ajax({
        method: "POST",
        url: "/getItemsRange",
        contentType: "application/json",
        data: JSON.stringify({"from": 1, "to": 20 })
    }).done(function(html){
        $("#items_table").html(html);
    });
});