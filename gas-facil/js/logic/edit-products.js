var getPhotos = function() {
	Parse.initialize("rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c", "cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i");
	var productsImages = Parse.Object.extend("Produto");
	var query = new Parse.Query(productsImages);
	query.find({
		success : function(results) {
			products = [];
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				var product = [];
				if(object.get('emCirculacao')) {
					product.push(object.get('photo').url());
					product.push(object.get('type'));
					var price_str = object.get('price_int').toString();
					price_str = price_str.replace(".", ",");
					product.push(price_str);
					product.push(object.id);
					product.push(object.get('descricao'));

					products.push(product);
				}
			}

			deleteOldProducts();
			var row_prod = document.getElementById("content");

			products.forEach(function(items) {

				var div_col = document.createElement('div');
				div_col.setAttribute("class", "col-xs-6 col-sm-3");

				var div_thumb = document.createElement('div');
				div_thumb.setAttribute("class", "thumbnail");

				var div_white_header = document.createElement('div');
				div_white_header.setAttribute("class", "white-header");
				
				var title = document.createElement('h5');
				title.textContent = items[1];
				div_white_header.appendChild(title);
				
				var prod_img = document.createElement('img');
				prod_img.setAttribute("src", items[0]);

				var div_caption = document.createElement('div');
				div_caption.setAttribute("class", "caption");

				var title_price = document.createElement('label');
				title_price.textContent = "Preço:";
				var price_input = document.createElement('input');
				price_input.setAttribute("class", "form-control");
				price_input.setAttribute("value", items[2]);
				price_input.setAttribute("id", "price-"+items[3]+"-prod");

				var title_desc = document.createElement('label');
				title_desc.textContent = "Descrição:";
				var desc_input = document.createElement('input');
				desc_input.setAttribute("class", "form-control");
				desc_input.setAttribute("value", items[4]);
				desc_input.setAttribute("id", "desc-"+items[3]+"-prod");

				var title_photo = document.createElement('label');
				title_photo.textContent = "Nova imagem:";

				var photo_input = document.createElement('input');
				photo_input.setAttribute("type", "file");
				photo_input.setAttribute("id", "image-"+items[3]+"-thumb");

				var div_error_msg = document.createElement('div');
				div_error_msg.setAttribute("display", "hidden");
				div_error_msg.setAttribute("class", "error-form");
				div_error_msg.setAttribute("id", "error-"+items[3]+"-msg");

				var btn_edit = document.createElement('input');
				btn_edit.setAttribute("type", "button");
				btn_edit.setAttribute("class", "btn btn-theme btn-block");
				btn_edit.setAttribute("value", "Editar");

				btn_edit.onclick = function() {
					query.equalTo("objectId", items[3]);
					query.first({
						success: function(object) {
							var new_price = document.getElementById("price-"+items[3]+"-prod").value;
							var new_desc = document.getElementById("desc-"+items[3]+"-prod").value;
							var fileUploadControl = $("#image-"+items[3]+"-thumb")[0];

							if (new_price == "" || isNumber(new_price) == false) {
								var error = document.getElementById("error-"+items[3]+"-msg");
								error.textContent = "Preço deve conter apenas números.";
								error.style.padding = "0px";
							} else if (new_desc == "") {
								var error = document.getElementById("error-"+items[3]+"-msg");
								error.textContent = "Entre com uma descrição para o produto.";
								error.style.padding = "0px";
							} else if (fileUploadControl.files.length > 0 && !(checkFileType(fileUploadControl.files[0].type, fileUploadControl.files[0]))){
								var error = document.getElementById("error-"+items[3]+"-msg");
								error.textContent = "Apenas imagens jpeg, jpg e png são permitidas.";
								error.style.padding = "0px";
							}  
							else {
								object.set('price_int', parseFloat(new_price));
								object.set('descricao', new_desc);

								if(fileUploadControl.files.length > 0 && checkFileType(fileUploadControl.files[0].type, fileUploadControl.files[0])) {
									file = fileUploadControl.files[0];
									productImage = file;

									parseFile = new Parse.File(productImage.name, productImage);
									object.set('photo', parseFile);
									object.set('thumbnailBlur', parseFile);
								}

								object.save();

								var canDismiss = false;
								var notification = alertify.success('Produto editado com sucesso.');
								notification.ondismiss = function(){ return canDismiss; };
								setTimeout(function(){ canDismiss = true;}, 1000);

								while (row_prod.firstChild) {
									row_prod.removeChild(row_prod.firstChild);
								}
								setTimeout(function() {
									getPhotos();
								}, 2000);
							}
						},
						error: function(error) {
							alert("Error: " + error.code + " " + error.message);
						}
					});
				};

				var btn_remove = document.createElement('input');
				btn_remove.setAttribute("type", "button");
				btn_remove.setAttribute("class", "btn btn-theme04 btn-block");
				btn_remove.setAttribute("value", "Excluir");

				btn_remove.onclick = function() {
					query.equalTo("objectId", items[3]);
					query.first({
						success: function(object) {
							object.set('emCirculacao', false);
							object.save();

							var canDismiss = false;
							var notification = alertify.success('Produto excluído com sucesso.');
							notification.ondismiss = function(){ return canDismiss; };
							setTimeout(function(){ canDismiss = true;}, 1000);

							while (row_prod.firstChild) {
								row_prod.removeChild(row_prod.firstChild);
							}
							setTimeout(function() {
								getPhotos();
							}, 2000);
						},
						error: function(error) {
							alert("Error: " + error.code + " " + error.message);
						}
					});
				};

				//div_caption.appendChild(title);
				div_caption.appendChild(title_price);
				div_caption.appendChild(price_input);
				div_caption.appendChild(title_desc);
				div_caption.appendChild(desc_input);
				div_caption.appendChild(title_photo);
				div_caption.appendChild(photo_input);
				div_caption.appendChild(div_error_msg);
				div_caption.appendChild(btn_edit);
				div_caption.appendChild(btn_remove);
				div_thumb.appendChild(div_white_header);
				div_thumb.appendChild(prod_img);
				div_thumb.appendChild(div_caption);
				div_col.appendChild(div_thumb);
				row_prod.appendChild(div_col);
			});

		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};

var deleteOldProducts = function(){
	var row_prod = document.getElementById("content");
	while (row_prod.firstChild) {
		row_prod.removeChild(row_prod.firstChild);
	}
};
