var getOrders = function() {
	var queryOrders = initializeOrders();

	queryOrders.find({
		success : function(results) {
			orders = [];
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				order = [];

				var status = object.get('status');
				if(status == orderStatus.pending) {
					var order = fillOrderArray(object, status);
					orders.push(order);
				}
			}

			deleteOldOrders(); //clean the table before adding the elements again (to avoid duplication)

			var table = document.getElementById("orders-table");

			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			orders.forEach(function(items) {
				var row = document.createElement("tr");
				var bt_process_order = document.createElement('input');

				//items.splice(0,1);//remove the id (not display it)
				//items.forEach(function(item) {
				var order_id = items[0];
				var temp_items = [];
				for(var i=0; i < items.length; i++){
					temp_items.push(items[i]);
				}
				temp_items.splice(0,1);//remove the id (not display it)
				temp_items.forEach(function(item) {
					var cell = document.createElement("td");
					cell.textContent = item;
					
					bt_process_order.setAttribute('type','button');
					bt_process_order.setAttribute('class','btn btn-theme');
					bt_process_order.setAttribute('value','Processar');

					bt_process_order.onclick = function() {
						//queryOrders.equalTo("objectId", items[0]);
						queryOrders.equalTo("objectId", order_id);
						queryOrders.first({
							success: function(object) {
								object.set("status", orderStatus.sent);
								object.save();

								var canDismiss = false;
								var notification = alertify.success('Pedido processado com sucesso!');
								notification.ondismiss = function(){ return canDismiss; };
								setTimeout(function(){ canDismiss = true;}, 1000);

								clickOnOrders();
							},
							error: function(error) {
								alert("Error: " + error.code + " " + error.message);
							}
						});
					};
					
					row.appendChild(cell);
				});

				row.appendChild(bt_process_order);
				tbody.appendChild(row);
				
				var contentPanel = document.getElementById("content");
				contentPanel.appendChild(document.getElementById("orders-list"));
			});
		},
		error : function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};