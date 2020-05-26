//DEFAULT ITEM LOAD RANGE
const skip = 0;
const limit = 12; //ITEMS TO LOAD
const interval = 10; //NEW ITEMS TO LOAD

//DEFAULT USER FILTER
let user_filter = {};
user_filter.skip = skip;
user_filter.limit = limit;

//CHART
let myChart;

//TEMP ITEM (MODAL), LAST OPENED ITEM
let temp_item;

let categories;

$(document).ready(function() {
    $("#ImgLoad").toggle(true); //SHOW LOAD IMAGE
    getItems(skip, limit); //GET ITEMS ON LOAD    
    
    //IF ADMIN - SETUP MODAL DROPDOWNS
    if($("#AdminModalItem").length){
        setupModalAdmin();
    }
    if($("#AddItemModal").length){
        setupAddItemModal();
    }
    if($("#UDCategoryModal").length){
        setupUDCategoryModal();
    }
    if($("#UDSellerModal").length){
        setupUDSellerModal();
    }

    myChart = drawChart([
        { x: "2015-07-09", y: 200},
        { x: "2016-01-17", y: 500},
        { x: "2018-11-18", y: 700},
        { x: "2019-02-20", y: 600}
    ]);

    //OPEN ITEM MODAL
    $(document).on('click', '.showmodal', function (event){
        let item_id = $(this).closest('div.item').attr('id'); //get item id from this div.card

        //TODO: UPDATE div.card VALUES

        $.ajax({
            method: "POST",
            url: "/getItemByID",
            contentType: "application/json",
            data: JSON.stringify({item_id: item_id})
        }).done(function(item){
            removeData(myChart);
            addData(myChart, item.item_price_history);
            temp_item = item;

            if($("#AdminModalItem").length){ //IF THERE IS ADMIN MODAL
                $("#AdminModalItemImg").attr("src", item.item_image);
                $("#AdminModalItemImgSrc").val(item.item_image);
                $("#AdminModalItemName").val(item.item_name);
                $("#AdminModalItemDescr").val(item.item_description);
                $("#AdminModalItemPrice").val(item.item_price);
                //SELECT DROPDOWN VALUES
                $('#AdminModalItemSeller').val(item.seller._id);
                $('#AdminModalItemCategory').val(item.item_category._id);

                $("#AdminModalItem").modal('show');
            } else {
                $("#ModalItemImg").attr("src", item.item_image);
                $("#ModalItemName").text(item.item_name);
                $("#ModalItemCategory").text(item.item_category.category_name);
                $("#ModalItemDescr").text(item.item_description);
                $("#ModalItemSeller").text(item.seller.seller_name);
                $("#ModalItemPrice").val(item.item_price);

                $("#ModalItem").modal('show');
            }
        });
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
        //ALTER LOAD RANGE
        let s = user_filter.skip;
        let l = user_filter.limit;
        let c = parseInt($("#ItemsTotal").text());

        if(l + interval > c){
            s = l;
            l = c;
            $("#ItemsLoadButton").toggle(false); //DISABLE BUTTON IF ALL ITEMS LOADED
        } else {
            s = l;
            l = l + interval;
        }
        user_filter.skip = s;
        user_filter.limit = l;

        getItems();
    });

    //ITEM UPDATE (ADMIN MODAL)
    $("#AdminModalUpdateButton").on('click', () => {
        updateItem();
    });

    //ITEM DELETE (ADMIN MODAL)
    $("#AdminModalDeleteButton").on('click', () => {
        deleteItem();
    });

    //ADD ITEM
    $("#AddItemModalAddButton").on('click', () => {
        addItem();
    });

    //ADD CATEGORY
    $("#AddCategoryModalAddButton").on('click', () => {
        addCategory();
    });

    //UPDATE CATEGORY
    //ON CHANGE SELECTED
    $('#UDCategoryModalCategory').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        $("#UDCategoryModalName").val(optionSelected[0].text);
        $("#UDCategoryModalDescr").val(optionSelected[0].dataset.descr);
    });
    //UPDATE
    $('#UDCategoryModalUpdateButton').on('click', () => {
        updateCategory();
    });

    //DELETE CATEGORY
    $('#UDCategoryModalDeleteButton').on('click', () => {
        deleteCategory();
    });

    //ADD SELLER
    $("#AddSellerModalAddButton").on('click', () => {
        addSeller();
    });

    //UPDATE SELLER
    //ON CHANGE SELECTED
    $('#UDSellerModalSeller').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        $("#UDSellerModalName").val(optionSelected[0].text);
        $("#UDSellerModalDescr").val(optionSelected[0].dataset.descr);
    });
    //UPDATE
    $("#UDSellerModalUpdateButton").on('click', () => {
        updateSeller();
    });
    
    //DELETE SELLER
    $("#UDSellerModalDeleteButton").on('click', () => {
        deleteSeller();
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
            $("#ItemsCurrRangeTo").text(res.total_count);
            $("#ItemsLoadButton").toggle(false);
        } else {
            $("#ItemsLoadButton").toggle(true);
        }
    });
}

//UPDATE ITEM
function updateItem(){
    let new_seller = $("#AdminModalItemSeller option:selected").val();     //ID
    let new_category = $("#AdminModalItemCategory option:selected").val(); //ID
    let new_img = $("#AdminModalItemImgSrc").val();
    let new_name = $("#AdminModalItemName").val();
    let new_descr = $("#AdminModalItemDescr").val();
    let new_price = $("#AdminModalItemPrice").val();

    //UPDATE ONLY CHANGED VALUES
    let query = {};
    query.item_id = temp_item._id;
    query.toChange = {};

    if(temp_item.seller._id != new_seller) { query.toChange.seller = new_seller }
    if(temp_item.item_category._id != new_category) { query.toChange.item_category = new_category }
    if(temp_item.item_image != new_img) { query.toChange.item_image = new_img }
    if(temp_item.item_name != new_name) { query.toChange.item_name = new_name }
    if(temp_item.item_description != new_descr) { query.toChange.item_description = new_descr }
    if(temp_item.item_price != new_price) { query.toChange.item_price = new_price }

    if(Object.keys(query.toChange).length === 0){ //IF NOTHING TO CHANGE
        return;
    }

    $.ajax({
        method: "POST",
        url: "/admin/updateItem",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        $("#AdminModalItem").modal('hide');
    });
}

//DELETE ITEM
function deleteItem(){
    let verify_name = $("#AdminModalDeleteInput").val();
    //ITEM DELETES ONLY IF ENTERED VALUE MATCHES ORIGINAL ITEM NAME
    if(verify_name != temp_item.item_name){
        $("#AdminModalDeleteInput").popover('enable');
        $("#AdminModalDeleteInput").popover('show');
        return;
    }
    $("#AdminModalDeleteInput").popover('hide');
    $("#AdminModalDeleteInput").popover('disable');

    $.ajax({
        method: "POST",
        url: "/admin/deleteItem",
        contentType: "application/json",
        data: JSON.stringify({item_id: temp_item._id})
    }).done(function(res){
        $("#AdminModalItem").modal('hide');
        $(`#${temp_item._id}`).remove(); //REMOVE ITEM CARD
        let count = parseInt($("#ItemsTotal").text()); //GET ITEMS COUNT
        $("#ItemsTotal").text(count-1); //SET NEW ITEMS COUNT LESS BY 1
    });
}

//ADD NEW ITEM
function addItem(){
    let new_seller = $("#AddItemModalSeller option:selected").val();     //ID
    let new_category = $("#AddItemModalCategory option:selected").val(); //ID
    let new_img = $("#AddItemModalImgSrc").val();
    let new_name = $("#AddItemModalName").val();
    let new_descr = $("#AddItemModalDescr").val(); //not required
    let new_price = $("#AddItemModalItemPrice").val();

    let query = {};

    //THIS FIELDS IS REQUIRED
    if(!new_seller) { return; }
    if(!new_category) { return; }
    if(!new_img) { return; }
    if(!new_name) { return; }
    if(!new_price) { return; }

    query.seller = new_seller;
    query.item_category = new_category;
    query.item_image = new_img;
    query.item_name = new_name;
    query.item_price = new_price;
    if(new_descr){
        query.item_description = new_descr;
    }

    $.ajax({
        method: "POST",
        url: "/admin/addItem",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.item == false) {
            alert("There is some error occurred.")
        }
        $("#AddItemModal").modal('hide');
    });
}

//ADD NEW CATEGORY
function addCategory(){
    let new_category = $("#AddCategoryModalName").val();
    let new_descr = $("#AddCategoryModalDescr").val();
    let query = {};
    if(!new_category) { alert("Enter category name"); return; }

    if(new_descr){ query.category_description = new_descr };
    query.category_name = new_category;

    $.ajax({
        method: "POST",
        url: "/admin/addCategory",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.category == false) {
            alert("There is some error occurred.")
        }
        $("#AddCategoryModal").modal('hide');
    });
}

//UPDATE CATEGORY
function updateCategory(){
    let category = $("#UDCategoryModalCategory option:selected").val(); //ID
    let category_name = $("#UDCategoryModalName").val();
    let category_description = $("#UDCategoryModalDescr").val();
    let query = {};
    query.toChange = {};

    if(!category_name) { alert("Enter category name"); return; }

    query.category_id = category;
    query.toChange.category_name = category_name;
    if(category_description){ query.toChange.category_description = category_description };

    $.ajax({
        method: "POST",
        url: "/admin/updateCategory",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.category == false) {
            alert("There is some error occurred.")
        }
        $("#UDCategoryModal").modal('hide');
    });
}

//DELETE CATEGORY
function deleteCategory(){
    let category = $("#UDCategoryModalCategory option:selected").val(); //ID
    let category_name = $("#UDCategoryModalName").val();
    
    let verify_name = $("#UDCategoryModalDeleteInput").val();
    //ITEM DELETES ONLY IF ENTERED VALUE MATCHES ORIGINAL ITEM NAME
    if(verify_name != category_name){
        $("#UDCategoryModalDeleteInput").popover('enable');
        $("#UDCategoryModalDeleteInput").popover('show');
        return;
    }
    $("#UDCategoryModalDeleteInput").popover('hide');
    $("#UDCategoryModalDeleteInput").popover('disable');

    let query = {};
    query.category_id = category;

    $.ajax({
        method: "POST",
        url: "/admin/deleteCategory",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.category == false) {
            alert("There is some error occurred.")
        }
        $("#UDCategoryModal").modal('hide');
    });
}

//ADD SELLER
function addSeller(){
    let new_seller = $("#AddSellerModalName").val();
    let new_descr = $("#AddSellerModalDescr").val();
    let new_img = $("#AddSellerModalImg").val();
    let query = {};
    if(!new_seller) { alert("Enter seller name"); return; }

    if(new_descr){ query.seller_description = new_descr };
    if(new_img){ query.seller_image = new_img };
    query.seller_name = new_seller;

    $.ajax({
        method: "POST",
        url: "/admin/addSeller",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.seller == false) {
            alert("There is some error occurred.")
        }
        $("#AddSellerModal").modal('hide');
    });
}

//UPDATE SELLER
function updateSeller(){
    let seller = $("#UDSellerModalSeller option:selected").val(); //ID
    let seller_name = $("#UDSellerModalName").val();
    let seller_description = $("#UDSellerModalDescr").val();
    let query = {};
    query.toChange = {};

    if(!seller_name) { alert("Enter seller name"); return; }

    query.seller_id = seller;
    query.toChange.seller_name = seller_name;
    if(seller_description){ query.toChange.seller_description = seller_description };

    $.ajax({
        method: "POST",
        url: "/admin/updateSeller",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.seller == false) {
            alert("There is some error occurred.")
        }
        $("#UDSellerModal").modal('hide');
    });
}

//DELETE SELLER
function deleteSeller(){
    let seller = $("#UDSellerModalSeller option:selected").val(); //ID
    let seller_name = $("#UDSellerModalName").val();
    
    let verify_name = $("#UDSellerModalDeleteInput").val();
    //SELLER DELETES ONLY IF ENTERED VALUE MATCHES ORIGINAL SELLER NAME
    if(verify_name != seller_name){
        $("#UDSellerModalDeleteInput").popover('enable');
        $("#UDSellerModalDeleteInput").popover('show');
        return;
    }
    $("#UDSellerModalDeleteInput").popover('hide');
    $("#UDSellerModalDeleteInput").popover('disable');

    let query = {};
    query.seller_id = seller;

    $.ajax({
        method: "POST",
        url: "/admin/deleteSeller",
        contentType: "application/json",
        data: JSON.stringify(query)
    }).done(function(res){
        if(res.error){
            alert(res.error.message);
        } else if(res.seller == false) {
            alert("There is some error occurred.")
        }
        $("#UDSellerModal").modal('hide');
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

//SETUP ADMIN MODAL DROPDOWNS
function setupModalAdmin(){ 
    let sellers = [];
    ($("#Seller input").toArray()).forEach(seller => { //GET ALL SELLERS FROM PAGE
        sellers.push({value: seller.id, text: seller.value});
    });
    let categories = [];
    ($("#Category input").toArray()).forEach(category => { //GET ALL CATEGORIES FROM PAGE
        categories.push({value: category.id, text: category.value});
    });

    $.each(sellers, (i, s) => {
        $('#AdminModalItemSeller').append($('<option>', { 
            value: s.value,
            text : s.text 
        }));
    });
    $.each(categories, (i, c) => {
        $('#AdminModalItemCategory').append($('<option>', { 
            value: c.value,
            text : c.text 
        }));
    });
}

//SETUP ADD ITEM MODAL DROPDOWNS
function setupAddItemModal(){ 
    let sellers = [];
    ($("#Seller input").toArray()).forEach(seller => { //GET ALL SELLERS FROM PAGE
        sellers.push({value: seller.id, text: seller.value});
    });
    let categories = [];
    ($("#Category input").toArray()).forEach(category => { //GET ALL CATEGORIES FROM PAGE
        categories.push({value: category.id, text: category.value});
    });

    $.each(sellers, (i, s) => {
        $('#AddItemModalSeller').append($('<option>', { 
            value: s.value,
            text : s.text 
        }));
    });
    $.each(categories, (i, c) => {
        $('#AddItemModalCategory').append($('<option>', { 
            value: c.value,
            text : c.text 
        }));
    });
}

//SETUP UPDATE CATEGORY MODAL DROPDOWNS
function setupUDCategoryModal(){ 
    let categories = [];
    ($("#Category input").toArray()).forEach(category => { //GET ALL CATEGORIES FROM PAGE
        let descr = category.dataset.descr;
        if(descr){
            categories.push({value: category.id, text: category.value, descr: descr});
        } else {
            categories.push({value: category.id, text: category.value});
        }
        
    });
    $.each(categories, (i, c) => {
        let option = $('<option>', { 
            value: c.value,
            text : c.text
        });
        option.attr("data-descr", c.descr);
        $('#UDCategoryModalCategory').append(option);
    });
}

function setupUDSellerModal(){
    let sellers = [];
    ($("#Seller input").toArray()).forEach(seller => { //GET ALL SELLERS FROM PAGE
        let descr = seller.dataset.descr;
        if(descr){
            sellers.push({value: seller.id, text: seller.value, descr: descr});
        } else {
            sellers.push({value: seller.id, text: seller.value});
        }
        
    });
    $.each(sellers, (i, c) => {
        let option = $('<option>', { 
            value: c.value,
            text : c.text
        });
        option.attr("data-descr", c.descr);
        $('#UDSellerModalSeller').append(option);
    });
}