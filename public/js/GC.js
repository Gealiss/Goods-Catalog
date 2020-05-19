$(document).ready(function() {

    //FORM SEARCH
    $("#SearchButton").on("click", () => {
        let input = $("#SearchInput").val();
        let name = input.replace(/^\s+/ig, ''); //Delete whitespaces
        let obj = {};

        obj.filter = {};            //Global filter
        obj.filter.item = {};       //item filter
        obj.filter.seller = {};     //seller filter
        obj.filter.category = {};   //category filter
        obj.filter.item_sort = {};  //item sort filter
        obj.from = 1;
        obj.to = 20;

        //ITEM FILTER
        if(name){ //search by item name
            obj.filter.item.item_name = name;
        }

        //SELLER FILTER
        let checked_s = $("#Seller input:checked");
        if(checked_s.length > 0){
            obj.filter.seller.seller_name = {$in: []}; //create array of seller_name to search for
            for(let i = 0; i < checked_s.length; i++){
                obj.filter.seller.seller_name.$in.push(checked_s[i].value);
            }
        }

        //CATEGORY FILTER
        let checked_c = $("#Category input:checked");
        if(checked_c.length > 0){
            obj.filter.category.category_name = {$in: []}; //create array of category_name to search for
            for(let i = 0; i < checked_c.length; i++){
                obj.filter.category.category_name.$in.push(checked_c[i].value);
            }
        }

        //PRICE FILTER
        let price_min = $("#PriceMin").val();
        let price_max = $("#PriceMax").val();
        let price_pattern = /^(\d{1,10})([.](\d{1,10}))?$/mg;

        if(!price_min && !price_max){ //if fields empty

        } else {
            price_min = price_min.match(price_pattern);
            price_max = price_max.match(price_pattern);
    
            if(price_min && price_max && price_min < price_max){
                obj.filter.item.item_price = { $gte: price_min[0], $lte: price_max[0] }
                $("#Price").popover('hide');
                $("#Price").popover('disable');
            } else {
                $("#Price").popover('enable');
                $('#Price').popover('update');
                $("#Price").popover('show');
                return;
            }
        }

        let sort = $("#PriceSortBy option:selected").val();
        if(sort){
            obj.filter.item_sort.item_price = sort;
        }

        $.ajax({
            method: "POST",
            url: "/getItems",
            contentType: "application/json",
            data: JSON.stringify(obj)
        }).done(function(html){
            $("#items_table").html(html);
        });
    });

    $("#ResetFilter").on('click', () => {
        $("#filter_menu input:checked").prop('checked', false);
        $("#PriceSortBy").val('');
        $("#PriceMin").val('');
        $("#PriceMax").val('');
    });

    //GET ITEMS ON LOAD
    $.ajax({
        method: "POST",
        url: "/getItems",
        contentType: "application/json",
        data: JSON.stringify({"from": 1, "to": 20 })
    }).done(function(html){
        $("#items_table").html(html);
    });
});