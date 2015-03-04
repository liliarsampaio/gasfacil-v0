var historyCount = 0;

var productType = "";
var productPrice = "";
var productImage = "";
var productDescription = "";

var createDropdownMenuHistory = function(dropdownId){
	var dd_process_order = document.createElement('select');
	dd_process_order.setAttribute('class','btn btn-primary');
	dd_process_order.setAttribute('id', dropdownId);
	var id = dd_process_order.id;
	addOptionToDropdownHistory(id,dd_process_order, "Alterar status");
	addOptionToDropdownHistory(id,dd_process_order, "Enviado");
	addOptionToDropdownHistory(id,dd_process_order, "Pendente");
	addOptionToDropdownHistory(id,dd_process_order, "Cliente ausente");
	addOptionToDropdownHistory(id,dd_process_order, "Cliente recusou ");
	return dd_process_order;

};

var addOptionToDropdownHistory = function(dropdownId, dropdown, optionName){
	var id = '#' + dropdownId;
	if( $(id).has('option').length < 3 ) {
		console.log("id inside IF: " + id);

		var option = document.createElement("option");
		option.innerHTML = optionName;
		option.text = optionName;
		option.value = optionName;
		if(optionName == "Alterar status"){
			option.selected = "selected";
			option.disabled = "disabled";
		}

		dropdown.appendChild(option);

	}
};

var clickOnHistory = function(){
	document.getElementById("menu-history").click();
};

var getHistory = function() {
	var queryOrders = initializeOrders();

	deleteOldHistory(); //clean the table before adding the elements again (to avoid duplication)

	queryOrders.find({
		success : function(results) {
			orders = [];
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				order = [];

				var status = object.get('status');
				var currentStatus = status;
				if(status != orderStatus.pending && status != "pendente" ) {
					var order = fillOrderArray(object, status);
					orders.push(order);
				}
			}


			var table = document.getElementById("history-table");

			var tbody = document.createElement("tbody");
			table.appendChild(tbody);
			orders.forEach(function(items) {
				var row = document.createElement("tr");

				historyCount++;
				var dropdownId = "dropdown-history" + historyCount ;
				var dd_process_order = createDropdownMenuHistory(dropdownId);
				dd_process_order.onchange= function() {
					var selected = $(this).find(':selected').val();
					queryOrders.equalTo("objectId", items[0]);
					queryOrders.first({
						success: function(object) {
							object.set("status", selected);
							object.save();
							currentStatus = selected;
							var canDismiss = false;
							var notification = alertify.success('Pedido alterado com sucesso!');
							notification.ondismiss = function(){ return canDismiss; };
							setTimeout(function(){ canDismiss = true;}, 1000);

							clickOnHistory();
						},
						error: function(error) {
							alert("Error: " + error.code + " " + error.message);
						}
					});

				};

				//items.splice(0,1);
				//items.forEach(function(item) {
				var temp_items = [];
				for(var i=0; i < items.length; i++){
					temp_items.push(items[i]);
				}
				temp_items.splice(0,1);
				temp_items.forEach(function(item) {
					var cell = document.createElement("td");
					cell.textContent = item;

					row.appendChild(cell);
				});


				row.appendChild(dd_process_order);
				tbody.appendChild(row);
				
				var contentPanel = document.getElementById("content");
				contentPanel.appendChild(document.getElementById("history-list"));
			});
		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};