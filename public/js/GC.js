//DEFAULT ITEM LOAD RANGE
const skip = 0;
const limit = 4; //ITEMS TO LOAD
const interval = 4; //NEW ITEMS TO LOAD

//DEFAULT USER FILTER
let user_filter = {};
user_filter.skip = skip;
user_filter.limit = limit;

$(document).ready(function() {

    getItems(skip, limit); //GET ITEMS ON LOAD

    $("#ImgLoad").toggle(false); //HIDE LOAD IMAGE

    let myChart = drawChart([
        { x: "2015-07-09", y: 200},
        { x: "2016-01-17", y: 500},
        { x: "2018-11-18", y: 700},
        { x: "2019-02-20", y: 600}
    ]);

    //OPEN ITEM MODAL
    $(document).on('click', '.showmodal', function (event){
        let item_id = $(this).closest('div.card').attr('id'); //get item id from this div.card

        $.ajax({
            method: "POST",
            url: "/getItemByID",
            contentType: "application/json",
            data: JSON.stringify({item_id: item_id})
        }).done(function(item){
            removeData(myChart);
            addData(myChart, item.item_price_history);

            $("#ModalItemImg").attr("src", item.item_image);
            $("#ModalItemName").text(item.item_name);
            $("#ModalItemCategory").text(item.item_category.category_name);
            $("#ModalItemDescr").text(item.item_description);
            $("#ModalItemSeller").text(item.seller.seller_name);
            $("#ModalItemPrice").val(item.item_price);
        });

        $("#ModalItem").modal('show');
    });

    //FORM SEARCH
    $("#SearchButton").on("click", () => {
        getFilterInfo();
        $("#items_table").html(""); //CLEAR ITEMS

        $("#ImgLoad").toggle(true);
        $("#ItemsLoadButton").toggle(true);

        getItems();
    });

    //RESET FILTER
    $("#ResetFilter").on('click', () => {
        $("#filter_menu input:checked").prop('checked', false);
        $("#PriceSortBy").val('');
        $("#PriceMin").val('');
        $("#PriceMax").val('');
    });

    //GET NEW ITEMS
    $("#ItemsLoadButton").on('click', () => {
        let s = user_filter.skip;
        let l = user_filter.limit;
        let c = parseInt($("#ItemsTotal").text());

        if(l + interval > c){
            s = l;
            l = c;
            $("#ItemsLoadButton").toggle(false);
        } else {
            s = l;
            l = l + interval;
        }

        user_filter.skip = s;
        user_filter.limit = l;
        
        getItems();
    });
});

//---------

function getItems(){ //APPEND NEW ITEMS
    //GET ITEMS
    $.ajax({
        method: "POST",
        url: "/getItems",
        contentType: "application/json",
        data: JSON.stringify({"skip": user_filter.skip, "limit": user_filter.limit, "filter": user_filter})
    }).done(function(res){
        $("#ImgLoad").toggle(false);
        $("#items_table").append(res.list_html); //add items
        //$("#ItemsCurrRangeFrom").text(skip);
        $("#ItemsCurrRangeTo").text(user_filter.limit);
        $("#ItemsTotal").text(res.total_count);

        if(user_filter.limit >= res.total_count){
            $("#ItemsLoadButton").toggle(false);
        } else {
            $("#ItemsLoadButton").toggle(true);
        }
    });
}

function getFilterInfo(){
    let input = $("#SearchInput").val();
    let name = input.replace(/^\s+/ig, ''); //Delete whitespaces

    user_filter = {};            //Global filter
    user_filter.item = {};       //item filter
    user_filter.seller = {};     //seller filter
    user_filter.category = {};   //category filter
    user_filter.item_sort = {};  //item sort filter
    user_filter.skip = skip;
    user_filter.limit = limit;

    //ITEM FILTER
    if(name){ //search by item name
        user_filter.item.item_name = name;
    }

    //SELLER FILTER
    let checked_s = $("#Seller input:checked");
    if(checked_s.length > 0){
        user_filter.seller.seller_name = {$in: []}; //create array of seller_name to search for
        for(let i = 0; i < checked_s.length; i++){
            user_filter.seller.seller_name.$in.push(checked_s[i].value);
        }
    }

    //CATEGORY FILTER
    let checked_c = $("#Category input:checked");
    if(checked_c.length > 0){
        user_filter.category.category_name = {$in: []}; //create array of category_name to search for
        for(let i = 0; i < checked_c.length; i++){
            user_filter.category.category_name.$in.push(checked_c[i].value);
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

        if(price_min && price_max && parseFloat(price_min[0]) < parseFloat(price_max[0])){
            user_filter.item.item_price = { $gte: price_min[0], $lte: price_max[0] };
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
        user_filter.item_sort.item_price = sort;
    }
}