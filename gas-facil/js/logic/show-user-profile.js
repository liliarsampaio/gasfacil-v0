function initializeUserInfo() {
	Parse.initialize("rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c", "cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i");
	var userInfo = Parse.Object.extend("User");
	var queryUserInfo = new Parse.Query(userInfo);

	return queryUserInfo;
};

var getUserInfo = function() {
	var queryUser = initializeUserInfo();
	var currentUser = Parse.User.current().get("username");
	queryUser.equalTo("username", currentUser);
	
	queryUser.first({
		success: function(object) {
			console.log(object.get("username"));
			
			var row_prod = document.getElementById("content");

			var div_panel_body = document.createElement('div');
			div_panel_body.setAttribute("class", "thumbnail");

			var div_white_header = document.createElement('div');
			div_white_header.setAttribute("class", "white-header");

			var title = document.createElement('h5');
			title.textContent = "Configurações de Usuário e Senha";
			div_white_header.appendChild(title);

			var div_caption = document.createElement('div');
			div_caption.setAttribute("class", "caption");

			var title_username = document.createElement('label');
			title_username.textContent = "Usuário:";
			var username_input = document.createElement('input');
			username_input.setAttribute("class", "form-control");
			username_input.setAttribute("value", object.get("username"));
			username_input.setAttribute("id", "user-username");

			var title_pwd = document.createElement('label');
			title_pwd.textContent = "Nova senha:";
			var pwd_input = document.createElement('input');
			pwd_input.setAttribute("class", "form-control");
			pwd_input.setAttribute("id", "user-pwd");
			pwd_input.setAttribute("type", "password");
			
			var div_error_msg = document.createElement('div');
			div_error_msg.setAttribute("display", "hidden");
			div_error_msg.setAttribute("class", "error-form");
			div_error_msg.setAttribute("id", "error-msg");

			var btn_edit = document.createElement('input');
			btn_edit.setAttribute("type", "button");
			btn_edit.setAttribute("class", "btn btn-theme");
			btn_edit.setAttribute("value", "Editar");
			
			btn_edit.onclick = function() {
				var new_username = document.getElementById("user-username").value;
				var new_pwd = document.getElementById("user-pwd").value;

				if (new_username == "") {
					var error = document.getElementById("error-msg");
					error.textContent = "Campo Usuário não pode ser deixado em branco.";
					error.style.padding = "0px";
				} else {
					object.set('username', new_username);
					
					if(new_pwd != "") {
						object.set('password', new_pwd);
					}

					object.save();

					var canDismiss = false;
					var notification = alertify.success('Alteração feita com sucesso! Novo login é necessário.');
					notification.ondismiss = function(){ return canDismiss; };
					setTimeout(function(){ canDismiss = true;}, 1000);

					while (row_prod.firstChild) {
						row_prod.removeChild(row_prod.firstChild);
					}
					setTimeout(function() {
						Parse.User.logOut();
						window.location = "login.html";
					}, 2000);
				}
			}
			div_caption.appendChild(title_username);
			div_caption.appendChild(username_input);
			div_caption.appendChild(title_pwd);
			div_caption.appendChild(pwd_input);
			div_caption.appendChild(div_error_msg);
			div_caption.appendChild(btn_edit);
			div_panel_body.appendChild(div_white_header);
			div_panel_body.appendChild(div_caption);
			row_prod.appendChild(div_panel_body);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};
