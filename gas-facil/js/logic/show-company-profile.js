function initializeProfileInfo() {
	Parse.initialize("rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c", "cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i");
	var companyInfo = Parse.Object.extend("Empresa");
	var queryCompanyInfo = new Parse.Query(companyInfo);

	return queryCompanyInfo;
};

var getProfileInfo = function() {
	var queryCompany = initializeProfileInfo();

	queryCompany.find({
		success : function(results) {
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				var name = object.get("nome");
				var address = object.get("endereco");
				var telephone = object.get("telefone");
				var id = object.id;
			}

			var row_prod = document.getElementById("content");

			var div_panel_body = document.createElement('div');
			div_panel_body.setAttribute("class", "thumbnail");

			var div_white_header = document.createElement('div');
			div_white_header.setAttribute("class", "white-header");

			var title = document.createElement('h5');
			title.textContent = "Perfil da Empresa";
			div_white_header.appendChild(title);

			var div_caption = document.createElement('div');
			div_caption.setAttribute("class", "caption");

			var title_company = document.createElement('label');
			title_company.textContent = "Nome da empresa:";
			var title_company_input = document.createElement('input');
			title_company_input.setAttribute("class", "form-control");
			title_company_input.setAttribute("value", name);
			title_company_input.setAttribute("id", "company-name");

			var title_address = document.createElement('label');
			title_address.textContent = "Endereço:";
			var company_addr_input = document.createElement('input');
			company_addr_input.setAttribute("class", "form-control");
			company_addr_input.setAttribute("value", address);
			company_addr_input.setAttribute("id", "company-address");

			var title_telephone = document.createElement('label');
			title_telephone.textContent = "Telefone para contato:";
			var company_tel_input = document.createElement('input');
			company_tel_input.setAttribute("class", "form-control");
			company_tel_input.setAttribute("value", telephone);
			company_tel_input.setAttribute("id", "company-telephone");

			var div_error_msg = document.createElement('div');
			div_error_msg.setAttribute("display", "hidden");
			div_error_msg.setAttribute("class", "error-form");
			div_error_msg.setAttribute("id", "error-msg");

			var btn_edit = document.createElement('input');
			btn_edit.setAttribute("type", "button");
			btn_edit.setAttribute("class", "btn btn-theme");
			btn_edit.setAttribute("value", "Editar Perfil");

			btn_edit.onclick = function() {
				queryCompany.equalTo("objectId", id);
				queryCompany.first({
					success: function(object) {
						var new_name = document.getElementById("company-name").value;
						var new_address = document.getElementById("company-address").value;
						var new_telephone = document.getElementById("company-telephone").value;

						if (new_name == "") {
							var error = document.getElementById("error-msg");
							error.textContent = "Insira um nome para sua empresa.";
							error.style.padding = "0px";
						} else if (new_address == ""){
							var error = document.getElementById("error-msg");
							error.textContent = "Insira um endereço para sua empresa.";
							error.style.padding = "0px";
						} else if (new_telephone == "" || isValidNumber(new_telephone) == false) {
							var error = document.getElementById("error-msg");
							error.textContent = "Insira um telefone para sua empresa apenas com números";
							error.style.padding = "0px";
						}  
						else {
							object.set('nome', new_name);
							object.set('endereco', new_address);
							object.set('telefone', new_telephone);

							object.save();

							var canDismiss = false;
							var notification = alertify.success('Perfil editado com sucesso.');
							notification.ondismiss = function(){ return canDismiss; };
							setTimeout(function(){ canDismiss = true;}, 1000);

							while (row_prod.firstChild) {
								row_prod.removeChild(row_prod.firstChild);
							}
							setTimeout(function() {
								getProfileInfo();
							}, 2000);
						}
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			};
			
			div_caption.appendChild(title_company);
			div_caption.appendChild(title_company_input);
			div_caption.appendChild(title_address);
			div_caption.appendChild(company_addr_input);
			div_caption.appendChild(title_telephone);
			div_caption.appendChild(company_tel_input);
			div_caption.appendChild(div_error_msg);
			div_caption.appendChild(btn_edit);
			div_panel_body.appendChild(div_white_header);
			div_panel_body.appendChild(div_caption);
			row_prod.appendChild(div_panel_body);
		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};
