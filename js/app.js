var defaultRating = 1500;
var numDataPoints = 10;

//Insert each item into an array in localStorage
function addItem(event) {
    
    //get the new item that wants to be added to the list, strip the non-alphanumeric characters
    var defaultRatingArr = [];
    for (var i = 0; i < numDataPoints; i++) {
        defaultRatingArr.push(defaultRating);
    }
    
    var newItem = {"name": document.getElementById("newItem").value.replace(/[^a-z0-9]+/gi, ""),
                   "rating": defaultRatingArr,
                   "dataPoint": Array.apply(null, Array(numDataPoints)).map(function (_, i) {return i;})
                  };

    //get the previous items in the list from localStorage
    var previousItems = JSON.parse(localStorage.getItem("itemList"));
    var previousItemsNamesOnly = [];
    
    //only run the function if the key pressed was enter and if the new item isn't blank
    var key = event.keyCode || event.which;
    if (key == 13 && newItem.name.length > 0) {

        //Error messages for the custom list box
        if (previousItems != null) {
            for (var i = 0; i < previousItems.length; i++) {
                previousItemsNamesOnly.push(previousItems[i].name);
            }
            if (previousItemsNamesOnly.indexOf(newItem.name) > -1) {
                document.getElementById("newItem").value = "";
                document.getElementById("demo").innerHTML = "You already entered an item with the same name";
                return;
            }
            if (previousItemsNamesOnly.length >= 10) {
                document.getElementById("newItem").value = "";
                document.getElementById("demo").innerHTML = "Maximum number of items reached (10)";
                return;
            }
            if (newItem.name.length >= 10) {
                document.getElementById("newItem").value = "";
                document.getElementById("demo").innerHTML = "Your items must be 10 characters or less";
                return;
            }
            if (newItem.name.length == null) {
                document.getElementById("newItem").value = "";
                document.getElementById("demo").innerHTML = "Your items must be 10 characters or less";
                return;
            }
        }
     
        //if list isn't empty
        if (previousItems != null) {
            previousItems.push(newItem);
        }
        
        //if list is empty
        else {
            previousItems = [];
            previousItems.push(newItem);
        
        }
        
        //format the list for display by inserting <br> where there are commas
        var formattedItems = "";
        for (var items in previousItems) {
            formattedItems = formattedItems + items;
        }

        localStorage.setItem("itemList", JSON.stringify(previousItems));
        var itemList = JSON.parse(localStorage.getItem("itemList"));
        var status = "Item count: "+ itemList.length;
        
        document.getElementById("demo").innerHTML = status;
        document.getElementById("newItem").value = "";
    }
}


//shuffle the array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function beginRanking() {
    var itemList = JSON.parse(localStorage.getItem("itemList"));
    
    if (itemList == null || itemList.length < 5 ) { 
        document.getElementById("demo").innerHTML = "Must have 5 or more items";
    } 
    else {
    document.getElementById("options").style.display = "none";
    document.getElementById("controls").style.display = "";
    
    //itemList = toObj(itemList);
    itemList = shuffle(itemList);
    localStorage.setItem("choice1", JSON.stringify(itemList[0]));
    localStorage.setItem("choice2", JSON.stringify(itemList[1]));
    buttonLabels();
    //drawLineGraph("new");
    document.getElementById("bargraph").style.display = "";
    drawBarGraph("new");
    }
}

function presetCats() {
    localStorage.setItem("itemList", JSON.stringify([{"name":"Chinese","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"French","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Italian","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"German","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Japanese","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"American","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Mexican","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Spanish","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Greek","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]},{"name":"Persian","rating":[1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],"dataPoint":[0,1,2,3,4,5,6,7,8,9]}]));
    beginRanking();
}

function endRanking() {
    document.getElementById("options").style.display = "";
    document.getElementById("controls").style.display = "none";
    document.getElementById("bargraph").style.display = "none";
    localStorage.removeItem("itemList");
    document.getElementById("demo").innerHTML = "";
    d3.selectAll("svg > *").remove();
}

function leftChoice() {
    rankUpdater("choice1", "choice2");
    document.getElementById("options").style.display = "none";
    var itemList = JSON.parse(localStorage.getItem("itemList"));
    itemList = shuffle(itemList);
    localStorage.setItem("choice1", JSON.stringify(itemList[0]));
    localStorage.setItem("choice2", JSON.stringify(itemList[1]));
    buttonLabels();
    drawBarGraph("update");
}

function rightChoice() {
    rankUpdater("choice2", "choice1");
    document.getElementById("options").style.display = "none";
    var itemList = JSON.parse(localStorage.getItem("itemList"));
    itemList = shuffle(itemList);
    localStorage.setItem("choice1", JSON.stringify(itemList[0]));
    localStorage.setItem("choice2", JSON.stringify(itemList[1]));
    buttonLabels();
    drawBarGraph("update");
}

//add the items to the button labels
function buttonLabels() {
    document.getElementById("leftChoice").innerHTML = JSON.parse(localStorage.getItem("choice1")).name;
    document.getElementById("rightChoice").innerHTML = JSON.parse(localStorage.getItem("choice2")).name;
}

function rankUpdater(winner, loser) {
    var winnerName = JSON.parse(localStorage.getItem(winner)).name;
    var loserName = JSON.parse(localStorage.getItem(loser)).name;
    var winnerOldScore = JSON.parse(localStorage.getItem(winner)).rating[0];
    var loserOldScore = JSON.parse(localStorage.getItem(loser)).rating[0];
    var newScores = eloCalculator(winnerOldScore, loserOldScore);
    var winnerNewScore = newScores[0];
    var loserNewScore = newScores[1];
    var itemList = JSON.parse(localStorage.getItem("itemList"));
    
    for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].name == winnerName) {
            itemList[i].rating.unshift(winnerNewScore);
            itemList[i].rating.pop();
        }
        if (itemList[i].name == loserName) {
            itemList[i].rating.unshift(loserNewScore);
            itemList[i].rating.pop();
        }
    }
    
    
    //replace the old score list with the new one
    localStorage.removeItem("itemList");
    localStorage.setItem("itemList", JSON.stringify(itemList));

}

function eloCalculator (winner, loser) {
    var realWinner = winner;
    var realLoser = loser;
    var expectedWinner;
    var expectedLoser;
    var weighingFactor = 15;
    var newWinner;
    var newLoser;
    
    expectedWinner = 1 / (1 + Math.pow(10, (realLoser - realWinner) / 400));
    expectedLoser = 1 / (1 + Math.pow(10, (realWinner - realLoser) / 400));
    
    newWinner = Math.ceil(realWinner + weighingFactor * (1 - expectedWinner));
    newLoser = Math.ceil(realLoser + weighingFactor * (0 - expectedLoser));
    
    return [newWinner, newLoser];
}