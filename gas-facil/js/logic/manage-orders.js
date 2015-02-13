var orderStatus = {sent:"Enviado", pending:"Pendente"};

function initializeOrders() {
	Parse.initialize("rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c", "cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i");
	var orders = Parse.Object.extend("Pedido");
	var queryOrders = new Parse.Query(orders);

	queryOrders.include("comprador");
	queryOrders.include("produto");
	var buyers = Parse.Object.extend("User");
	queryOrders.addDescending("createdAt");

	return queryOrders;
};

function fillOrderArray(object, status) {
	order = [];

	order.push(object.id);
	order.push(status);
	var date = getOrderDate(object);
	order.push(date);

	var buyer = object.get('comprador');
	order.push(buyer.get('nome'));
	order.push(buyer.get('endereco'));

	var product = object.get('produto');
	order.push(product.get('type'));

	order.push(object.get('quantidade'));
	order.push(object.get('price'));
	order.push(object.get('troco'));

	return order;
}

function getOrderDate(object){
	var orderDate = object.createdAt;
	var orderDay = orderDate.getDate();
	if(orderDay >= '1' && orderDay <= '9'){
		orderDay = '0' + orderDay; // add zero to day if necessary
	}
	var orderDateFormat = orderDay+"/"+(orderDate.getMonth()+1)+"/"+orderDate.getFullYear();
	return orderDateFormat;
}

var deleteOldOrders = function(){
	$("#orders-table tbody").remove();
}