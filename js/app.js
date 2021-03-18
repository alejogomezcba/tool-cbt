let searchbar = document.getElementById("searchbar");
let InternalApi = "https://internal-api.mercadolibre.com";
let result_item = document.getElementById("result_item");
let result_seller = document.getElementById("result_seller");
let links = document.getElementById('links');
let imageItemsCont = document.getElementById('images');

function valoresItem() {
    var i = document.getElementById("item").value;
    document.getElementById("url").href = InternalApi + "/items/" + i + "?caller.scopes=admin";
}


function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}


//** -  Tecla enter acciona busqueda - **//


//** - Función para buscar items - **//

function itemkeyword() {

    if (searchbar.value === "") {
        alert("Ingrese un valor en el campo de búsqueda.");
    } else {
        itemResult(searchbar.value);
    }
}

function userkeyword() {

    if (searchbaruser.value === "") {
        alert("Ingrese un valor en el campo de búsqueda.");
    } else {
        userResult(searchbaruser.value);
    }
}


let userResult = async search => {
    const textoSeller = document.createElement("p");

    const userfound = await fetch(`${InternalApi}/cbt/users/${search}?caller.scopes=admin`);
    const userjson = await userfound.json();
    var userID = userjson.user_id

    var userParentId = userjson.parent_id
    var userSite = userjson.site_id
    var userLogTyp = userjson.logistic_type
    var userStatus = userjson.status;

    const infoSellerFound = await fetch(`${InternalApi}/users/${userParentId}?caller.id=${userParentId}&caller.scopes=admin`);
    const infoSellerjson = await infoSellerFound.json();

    var nickname = infoSellerjson.nickname
    var email = infoSellerjson.email

    const emailBounce = await fetch(`${InternalApi}/internal/email_addresses/${email}`);
    const emailBouncejson = await emailBounce.json();
    var emailBounceStatus = emailBouncejson.bouncing_mails.bouncing_status;

    const sellerShipping = await fetch(`${InternalApi}/cbt/shipping_preferences/user/${search}?caller.scopes=admin`);
    const sellerShippingjson = await sellerShipping.json();

    var sellerShippingCarrier = sellerShippingjson[0].carrier;
    var sellerShippingCbtMode = sellerShippingjson[0].cbt_mode;
    var sellerShippingMode = sellerShippingjson[0].mode;
    var sellerShippingUser = sellerShippingjson[0].user_id;

    result_seller.appendChild(textoSeller);
    textoSeller.innerHTML = "User ID: " + sellerShippingUser + "<br />" + "Parent ID: " + userParentId + "<br />" + "Nickname: " + nickname + " <br /> " + "Email: " + email + "<br />" + "Bounce email status: " + emailBounceStatus + "<br />" + " Carrier: " + sellerShippingCarrier + "<br />" + "CBT mode: " + sellerShippingCbtMode + "<br />" + "Shipping Mode: " + sellerShippingMode;


    /*

    */

}







let itemResult = async search => {
    const found = await fetch(
        `${InternalApi}/items/${search}?caller.scopes=admin`
    );
    const jsoned = await found.json();

    console.log(jsoned);

    var categoria = jsoned.category_id;
    var seller = jsoned.seller_id
    var titulo = jsoned.title
    var item = jsoned.id;
    var shipping = jsoned.shipping.logistic_type;
    var inventario = jsoned.inventory_id;
    var precio = jsoned.price;
    var cantidad = jsoned.available_quantity;
    var link = jsoned.permalink;
    var status = jsoned.status;
    var pictures = jsoned.pictures;
    let variacion = jsoned.variations;

 console.log(variacion);   



    const catfound = await fetch(`${InternalApi}/categories/${categoria}/shipping_preferences`);
    const catjsoned = await catfound.json();
    var largoCate = catjsoned.dimensions.length;
    var anchoCate = catjsoned.dimensions.width;
    var altoCate = catjsoned.dimensions.height;
    var pesoCate = catjsoned.dimensions.weight;



    const sellerfound = await fetch(`${InternalApi}/cbt/users/${seller}`);
    const sellerjsoned = await sellerfound.json();
    var sellerParent = sellerjsoned.parent_id

    const cbtItemFound = await fetch(`${InternalApi}/cbt/items/${search}`);
    const cbtItemjson = await cbtItemFound.json();
    var cbtItemParent = cbtItemjson.parent_id;

    

    if (cbtItemParent === undefined) {
        cbtItemParent = "No tiene un Item CBT asociado"
    }

    const parentItemPic = await fetch(`${InternalApi}/items/${cbtItemParent}?caller.scopes=admin`);
    const parentItemPicjson = await parentItemPic.json();

    const ParentItemPic = parentItemPicjson.pictures;
    const imgTitlePadre = document.createElement("h4");

    imgTitlePadre.innerHTML = `Imágenes del Item ${cbtItemParent}`;
    imageItemsCont.appendChild(imgTitlePadre);

    ParentItemPic.forEach(function (picture) {
    const imageParentItem = document.createElement("img");
        imageParentItem.src = picture.secure_url;
        imageParentItem.alt = "imagen del item Padre";
        imageItemsCont.appendChild(imageParentItem);
    })


    const itemResFBM = await fetch(`${InternalApi}/fulfillment/restrictions/${search}`);
    const itemResFBMjson = await itemResFBM.json();

    if (itemResFBMjson.fulfillable === true) {
        var itemFBMYesNo = "Está OK para mandar al WH"
    } else {
        var itemFBMYesNo = "Validar las restricciones para FBM"
    }

    const itemDimen = await fetch(`${InternalApi}/items/${search}/dimensions?caller.scopes=admin`);
    const itemDimenJson = await itemDimen.json();
    var largoItem = itemDimenJson.dimensions.length;
    var anchoItem = itemDimenJson.dimensions.width;
    var altoItem = itemDimenJson.dimensions.height;
    var pesoItem = itemDimenJson.dimensions.weight;

    var catShiOptMe1 = catjsoned.logistics[0].mode;
    var catShiOptMe2 = catjsoned.logistics[1].mode;
    var catShiOptMe3 = catjsoned.logistics[2].mode;

    if (catShiOptMe2 === "not_specified") {
        catShiOptMe2 = "No soporta me2";
    };

    if (catShiOptMe1 === "not_specified") {
        catShiOptMe1 = "No soporta me1";
    };

    if (catShiOptMe3 === "not_specified") {
        catShiOptMe3 = " ";
    };


    const textoItem = document.createElement("p");
    const catEquiURL = document.createElement("a");
    const imgTitleCont = document.createElement("h4");

    imgTitleCont.innerHTML = `Imágenes del site ${search}`;
    imageItemsCont.appendChild(imgTitleCont);

    pictures.forEach(function (picture) {
    const imageItem = document.createElement("img");
        imageItem.src = picture.secure_url;
        imageItem.alt = "imagen del item";
        imageItemsCont.appendChild(imageItem);
    })


    let itemResultlink = document.createElement("a");
    itemResultlink.href = link;
    itemResultlink.target = "_blank";
    itemResultlink.innerHTML = "Publicación";

    const titleVarItem = document.createElement("h4");
    titleVarItem.innerHTML = "Variaciones";
    const contVar = document.getElementById('result_variation');
    contVar.appendChild(titleVarItem);

    variacion.forEach(function (variation) {
        const varInventory = variation.inventory_id;
        const varID = variation.id;
        const varQuantity = variation.available_quantity;
        const textoVarItem = document.createElement("p");
        const contVar = document.getElementById('result_variation');
        textoVarItem.innerHTML = `Inventory_id: ${varInventory}, Variation_id: ${varID}, Cantidad: ${varQuantity}`;
        contVar.appendChild(textoVarItem);
        console.log(textoVarItem);
    })
    

    result_item.appendChild(textoItem);
    textoItem.innerHTML = "Título: " + titulo + " <br /> " + "Item: " + item + " <br /> " + "Item CBT: " + cbtItemParent + " <br /> " + "Seller: " + seller + " <br /> " + "Parent CBT: " + sellerParent + " <br /> " + "Categoría: " + categoria + "  soporta " + catShiOptMe1 + ", " + catShiOptMe2 + ", " + catShiOptMe3 + " <br /> " + "Dimensiones de la categoría --> " + "Largo: " + largoCate + "; " + "Ancho: " + anchoCate + "; " + "Alto: " + altoCate + "; " + "Peso: " + pesoCate + " <br /> " + "Dimensiones del item --> " + "Largo: " + largoItem + "; " + "Ancho: " + anchoItem + "; " + "Alto: " + altoItem + "; " + "Peso: " + pesoItem + " <br /> " + "Apto para FBM: " + itemFBMYesNo + " <br /> " + "Inventario FBM: " + inventario + " <br /> " + "Opciones de Envío: " + shipping + " <br /> " + "Estado: " + status;
   
    

    
    links.appendChild(catEquiURL);
    links.appendChild(itemResultlink);
    

    catEquiURL.innerHTML = `Equivalente para ${categoria}`;
    catEquiURL.href = `${InternalApi}/equivalent_categories/categories/${categoria}`;
    catEquiURL.target = "_blank";

};

