var deleteOldSuggestions = function(){
    $("#suggestions-table tbody").remove();
};

function initializeSuggestions() {
    Parse.initialize("rMJLW7qybdglATi4FowrRFwmVqZkLoxuo6vntg1c", "cvrkyMx0c4X2oG8vI9OkvtjnAClum3K9HMTkCj4i");
    var suggestions = Parse.Object.extend("Sugestao");
    var querySuggestions = new Parse.Query(suggestions);
    querySuggestions.include("usuario");
    querySuggestions.addDescending("createdAt");

    return querySuggestions;
};

function fillSuggestionsArray(object) {
    suggests = [];

    var userName = object.get("usuario").get("nome");
    var suggestion = object.get("sugestao");
    var type = object.get("tipo");
    suggests.push(userName);
    suggests.push(suggestion);
    suggests.push(type);

    return suggests;
}

var getSuggestions = function() {
    var querySuggestions = initializeSuggestions();

    querySuggestions.find({
        success : function(results) {
            suggestions = [];

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var suggestion = fillSuggestionsArray(object);
                suggestions.push(suggestion);
            }
            deleteOldSuggestions(); //clean the table before adding the elements again (to avoid duplication)

            var table = document.getElementById("suggestions-table");
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);

            suggestions.forEach(function(items) {

                var row = document.createElement("tr");
                items.forEach(function(item){
                    var cell = document.createElement("td");
                    cell.textContent = item;
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
                var contentPanel = document.getElementById("content");
                contentPanel.appendChild(document.getElementById("suggestions-list"));
            });
        },
        error : function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
};