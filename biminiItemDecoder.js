/*
	Insert Comments here...
*/

//For the checking functions
var pos = [-1, -1];

//Lists
var objectList = [];
var unAssignables = [];

//The object constructor that attributes are assigned to.
function item () {

	this.partID = 0;
	this.availablePartID = 0;
	this.camo = 0;
	this.blackFrame = 0;
	this.fabric = 0;
	this.boot = 0;
	this.steel = 0;	
	this.buggy = 0;
	this.square = 0;
	this.stripeAvailable = 0;
	this.truckable = 0;
	this.freeStanding = 0;
	this.upsTop = 0;
	this.lightCut = 0;
}

//Decodes the product ID and outputs the characteristics of any item listed.
function biminiItemDecoder () {

	//Parses local CSVFile
	this.parseCSVFile = function () {
	
		//Get file selected	
		var file = document.getElementById("fileSystem").files[0];

		//Get data from file and place in array
		Papa.parse(file, {
			complete: function(results) {

				//Assign values to data
				loop(results.data);
			}
		});

		return this;
	};
	//Checks a string for character(s) at the beginning.
	this.checkAtPos0 = function (searchTerm, str, letter) {

		if (searchTerm == letter) {

			pos[0] = str.indexOf(letter);

			if (pos[0] != 0) { pos[0] = -1; };
		};

		return this;
	};
	//Checks a string for character(s) at the end.
	this.checkAtEnd = function (searchTerm, str, letter) {

		if (searchTerm == letter) {

			pos[0] = str.indexOf(letter);

			if (pos[0] != str.length - 1) { pos[0] = -1; };
		};

		return this;
	};
	this.checkForStorageBoot = function (searchTerm, str) {

		if (searchTerm == 'B') {

			pos[0] = str.indexOf('B');
			pos[1] = str.indexOf('BS');

			//Make sure not Storage Buggy
			if (pos[0] == pos[1]) { 

				//Restart starting after 'BS'
				pos[0] = str.indexOf('B', pos[0] + 1);
			};
		};

		return this;
	};
	//Looks for an item with character(s) in its ID
	this.searchFor = function (searchTerm, listItem) {

		//Item passed
		var str = listItem;

		//Find RegEx Numerical Position
		pos[0] = str.indexOf(searchTerm);

		//If RegEx has been detected
		if (pos[0] != -1) {

			if (searchTerm == 'S') {

				//Check for Full Stainless 
				checkForFullStainless(searchTerm, str);

				//Check for Sun-DURA
				if (pos[0] == -1) { 

					checkAtPos0(searchTerm, str, 'S'); 

					if (pos[0] == -1) { checkAtEnd(searchTerm, str, 'S'); };
				};
			};

			//Check for Sun-DURA Fabric
			checkAtPos0(searchTerm, str, '4S');
			//Check for Poly-Guard
			checkAtEnd(searchTerm, str, 'P');
			//Check for camo
			checkAtPos0(searchTerm, str, 'C');
			//Check for Storage Boot 'B'
			checkForStorageBoot(searchTerm, str);
		};

		return this;
	};
	//Auto-assigns objects with attributes given by the IDs provided.
	this.loop = function (list) {

		//Loop through parts ID list
		for (var i = 0; i < list.length; i++) {

			//Create new Object
			objectList.push(new item());
			
			//Assign part ID to object
			objectList[objectList.length - 1].partID = list[i][0];
			objectList[objectList.length - 1].availablePartID = list[i][0];

			//For all unassignable objects
			unAssignables.push(list[i][0]);

			//To check if value was assigned later.
			var assigned = false;

			//RegEx to search for. Most specific terms first.
			var searchTerm = ['(SSS)', '(SS)', '(8SQ)', '(9SQ)', '(10SQ)', 'A26', 'PG', 'BS', 'FS', 'ST', 'C', 'U', 'L', 'A', 'V', 'B', '4S', 'S', 'P', 'T'];

			//Look for items with codes from searchTerm
			for (var j = 0; j < searchTerm.length; j++) { 

				//Detect if item attribute exists
				searchFor(searchTerm[j], objectList[objectList.length - 1].availablePartID); 

				//Assign object attributes
				if (pos[0] != -1) { 

					assignObjectValues(searchTerm[j], objectList.length - 1);
					assigned = true;	
				};
			};

			//If attributes are assigned to object.
			if (assigned) { unAssignables.pop(); };

			//If no attributes assigned to object.
			if (!assigned) { objectList.pop(); };
		};

		//Output Object information to console
		console.log(objectList);
		console.log(unAssignables);
		console.log("Total items        " + (objectList.length + unAssignables.length));
		console.log("Identified         " + objectList.length + " items.");
		console.log("Unable to identify " + unAssignables.length + " items.");

		return this;
	};
	//Assign values to objects
	this.assignObjectValues = function (searchTerm, i) {

		if (searchTerm == 'A') { 

			objectList[i].fabric = "Sunbrella"; 
		};
		if (searchTerm == 'A26') {

			objectList[i].fabric = "9.25 oz. Sunbrella Acrylic for Tower Mounting Bimini Top";
		};
		if (searchTerm == '4S' || (searchTerm == 'S' && checkForFullStainless(searchTerm, objectList[i].availablePartID) == -1)) { 

			objectList[i].fabric = "Sun-DURA";
		};
		if (searchTerm == 'S' && checkForFullStainless(searchTerm, objectList[i].availablePartID) != -1) {

			objectList[i].steel = "Full";
		};
		if (searchTerm == 'V') { 

			objectList[i].fabric = "Vinyl";
		};
		if (searchTerm == 'PG' || searchTerm == 'P') { 

			objectList[i].fabric = "Poly-Guard";
		};
		if (searchTerm == 'B') { 

			objectList[i].boot = 1;
		};
		if (searchTerm == 'BS') { 

			objectList[i].buggy = 1;
			objectList[i].lightCut = 1;
		};
		if (searchTerm == 'FS') {

			objectList[i].freeStanding = 1;
			objectList[i].lightCut = 1;
		};
		if (searchTerm == 'ST') {

			objectList[i].stripeAvailable = 1;
		};
		if (searchTerm == '(SS)' || searchTerm == '(SSS)') { 

			objectList[i].steel = 'fittings';
		};
		if (searchTerm == '(8SQ)') { 

			objectList[i].steel = 0;
			objectList[i].buggy = 1;
			objectList[i].freeStanding = 1;
			objectList[i].lightCut = 1;
			objectList[i].square = 1;
		};
		if (searchTerm == '(9SQ)' || searchTerm == '(10SQ)') {

			objectList[i].steel = 0;
			objectList[i].lightCut = 1;
		};
		if (searchTerm == 'U') {

			objectList[i].upsTop = 1;
		};
		if (searchTerm == 'L') {

			objectList[i].lightCut = 1;
		};
		if (searchTerm == 'T') {

			objectList[i].truckable = 1;
		};
		if (searchTerm == 'C') {

			objectList[i].camo = 1;
			objectList[i].blackFrame = 1;
			objectList[i].availablePartID = makeUnavailable('B', objectList[i].availablePartID);
		};

		objectList[i].availablePartID = makeUnavailable(searchTerm, objectList[i].availablePartID);

		return this;
	};
	//Find Object With attribute and output to console
	this.logThisItem = function (userInput) {
		
		var identifiedItems = 0;
		var unIdentifiedItems = 0;

		//Search through identified items
		for (var i = 0; i < objectList.length; i++) {

			//Item to find RegEx in
			var listItem = objectList[i].partID;
			var availableListItem = objectList[i].availablePartID;

			//Find RegEx
			searchFor(userInput, listItem);

			//If RegEx detected
			if (pos[0] != -1) {

				console.log("Item #" + i + ": " + listItem);
				console.log("Item #" + i + ": " + availableListItem + " is available");
				identifiedItems++;
			};
		};
		//Search through unidentified items
		for (var j = 0; j < unAssignables.length; j++) {
			
			//Item to find RegEx in
			var listItem = unAssignables[j];

			//Find RegEx
			searchFor(userInput, listItem);

			//If RegEx detected
			if (pos[0] != -1) {

				console.log("Unassignable Item #" + j + ": " + listItem);
				unIdentifiedItems++;
			};
		};

		console.log("Found " + identifiedItems + " items with '" + userInput + "' in partID from currently Identified Items.");
		console.log("Found " + unIdentifiedItems + " items with '" + userInput + "' in partID from currently unidentified Items.");

		return this;
	};
	//Clear out all data that you have parsed so far.
	this.wipeData = function () {
		
		pos = [-1, -1];
		objectList = [];
		unAssignables = [];

		console.clear();
		console.log("There are now " + objectList.length + " identified items.");
		console.log("There are now " + unAssignables.length + " unidentified items.");
		console.log("There are now " + (objectList.length + unAssignables.length) + " total items.");
		console.log("All data has been wiped.");

		return this;
	};

}

/*
	End of File...
*/
