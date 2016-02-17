/*
	This file contains the Bimini-Item-Decoder 
		and the item object which has the attributes
		of the item being sold with the given partID
*/

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

	//For the checking functions
	this.pos = [-1, -1];

	//Lists
	this.objectList = [];
	this.unAssignables = [];

	//Parses local CSVFile
	this.parseCSVFile = function () {
	
		//Get file selected	
		var file = document.getElementById("fileSystem").files[0];

		//Get data from file and place in array
		Papa.parse(file, {
			complete: function(results) {

				//Assign values to data
				this.loop(results.data);
			}
		});

		return this;
	};
	//Returns a string with some characters changed to '*'
	this.makeUnavailable = function (searchTerm, str) {

		//Find RegEx
		this.pos[0] = str.indexOf(searchTerm);

		//Remove RegEx
		var begin = str.substring(0, this.pos[0]);
		var end = str.substring(this.pos[0] + searchTerm.length);
		var changed = '';

		//Label Removed RegEx area
		for (var i = 0; i < searchTerm.length; i++) { changed += '*'; };
		
		//Rebuild partID
		str = begin + changed + end;

		return str;
	}
	//Checks a string for character(s) at the beginning.
	this.checkAtPos0 = function (searchTerm, str, letter) {

		if (searchTerm == letter) {

			this.pos[0] = str.indexOf(letter);

			if (this.pos[0] != 0) { this.pos[0] = -1; };
		};

		return this;
	};
	//Checks a string for character(s) at the end.
	this.checkAtEnd = function (searchTerm, str, letter) {

		if (searchTerm == letter) {

			this.pos[0] = str.indexOf(letter);

			if (this.pos[0] != str.length - 1) { this.pos[0] = -1; };
		};

		return this;
	};
	//Returns a value of -1 if not Full Stainless
	this.checkForFullStainless = function (searchTerm, str) {

		if (searchTerm == 'S') {

			//Skip pos[0] = 'S' which is Sun-DURA
			this.pos[0] = str.indexOf('S', 1);
			this.pos[1] = str.indexOf('FS');

			//Make sure not Free Standing
			if (this.pos[0] == this.pos[1] + 1) {

				//Restart starting after 'FS'
				this.pos[0] = str.indexOf('S', this.pos[1] + 2);
			};

			//Make sure not Sun-Dura (for partID's like "10000S or 510S")
			if (this.pos[0] == str.length - 1 && str.indexOf('*') == -1) { this.pos[0] = -1; };
		};

		//Return value so asssignObjectValues can get a true/false
		return this.pos[0];
	}
	this.checkForStorageBoot = function (searchTerm, str) {

		if (searchTerm == 'B') {

			this.pos[0] = str.indexOf('B');
			this.pos[1] = str.indexOf('BS');

			//Make sure not Storage Buggy
			if (this.pos[0] == this.pos[1]) { 

				//Restart starting after 'BS'
				this.pos[0] = str.indexOf('B', this.pos[0] + 1);
			};
		};

		return this;
	};
	//Looks for an item with character(s) in its ID
	this.searchFor = function (searchTerm, listItem) {

		//Item passed
		var str = listItem;

		//Find RegEx Numerical this.Position
		this.pos[0] = str.indexOf(searchTerm);

		//If RegEx has been detected
		if (this.pos[0] != -1) {

			if (searchTerm == 'S') {

				//Check for Full Stainless 
				this.checkForFullStainless(searchTerm, str);

				//Check for Sun-DURA
				if (this.pos[0] == -1) { 

					this.checkAtthis.Pos0(searchTerm, str, 'S'); 

					if (this.pos[0] == -1) { this.checkAtEnd(searchTerm, str, 'S'); };
				};
			};
			
			this.checkAtthis.Pos0(searchTerm, str, '4S') //Check for Sun-DURA Fabric
				.checkAtEnd(searchTerm, str, 'P' )		//Check for Poly-Guard
				.checkAtthis.Pos0(searchTerm, str, 'C') //Check for camo
				.checkForStorageBoot(searchTerm, str); 	//Check for Storage Boot 'B'
		};

		return this;
	};
	//Auto-assigns objects with attributes given by the IDs provided.
	this.loop = function (list) {

		//Loop through parts ID list
		for (var i = 0; i < list.length; i++) {

			//Create new Object
			this.objectList.push(new item());
			
			//Assign part ID to object
			this.objectList[this.objectList.length - 1].partID = list[i][0];
			this.objectList[this.objectList.length - 1].availablePartID = list[i][0];

			//For all unassignable objects
			this.unAssignables.push(list[i][0]);

			//To check if value was assigned later.
			var assigned = false;

			//RegEx to search for. Most specific terms first.
			var searchTerm = ['(SSS)', '(SS)', '(8SQ)', '(9SQ)', '(10SQ)', 'A26', 'PG', 'BS', 'FS', 'ST', 'C', 'U', 'L', 'A', 'V', 'B', '4S', 'S', 'P', 'T'];

			//Look for items with codes from searchTerm
			for (var j = 0; j < searchTerm.length; j++) { 

				//Detect if item attribute exists
				this.searchFor(searchTerm[j], this.objectList[this.objectList.length - 1].availablePartID); 

				//Assign object attributes
				if (this.pos[0] != -1) { 

					this.assignObjectValues(searchTerm[j], this.objectList.length - 1);
					assigned = true;	
				};
			};

			//If attributes are assigned to object.
			if (assigned) { this.unAssignables.pop(); };

			//If no attributes assigned to object.
			if (!assigned) { this.objectList.pop(); };
		};

		//Output Object information to console
		console.log(this.objectList);
		console.log(this.unAssignables);
		console.log("Total items        " + (this.objectList.length + this.unAssignables.length));
		console.log("Identified         " + this.objectList.length + " items.");
		console.log("Unable to identify " + this.unAssignables.length + " items.");

		return this;
	};
	//Assign values to objects
	this.assignObjectValues = function (searchTerm, i) {

		if (searchTerm == 'A') { 

			this.objectList[i].fabric = "Sunbrella"; 
		};
		if (searchTerm == 'A26') {

			this.objectList[i].fabric = "9.25 oz. Sunbrella Acrylic for Tower Mounting Bimini Top";
		};
		if (searchTerm == '4S' || (searchTerm == 'S' && this.checkForFullStainless(searchTerm, this.objectList[i].availablePartID) == -1)) { 

			this.objectList[i].fabric = "Sun-DURA";
		};
		if (searchTerm == 'S' && this.checkForFullStainless(searchTerm, this.objectList[i].availablePartID) != -1) {

			this.objectList[i].steel = "Full";
		};
		if (searchTerm == 'V') { 

			this.objectList[i].fabric = "Vinyl";
		};
		if (searchTerm == 'PG' || searchTerm == 'P') { 

			this.objectList[i].fabric = "Poly-Guard";
		};
		if (searchTerm == 'B') { 

			this.objectList[i].boot = 1;
		};
		if (searchTerm == 'BS') { 

			this.objectList[i].buggy = 1;
			this.objectList[i].lightCut = 1;
		};
		if (searchTerm == 'FS') {

			this.objectList[i].freeStanding = 1;
			this.objectList[i].lightCut = 1;
		};
		if (searchTerm == 'ST') {

			this.objectList[i].stripeAvailable = 1;
		};
		if (searchTerm == '(SS)' || searchTerm == '(SSS)') { 

			this.objectList[i].steel = 'fittings';
		};
		if (searchTerm == '(8SQ)') { 

			this.objectList[i].steel = 0;
			this.objectList[i].buggy = 1;
			this.objectList[i].freeStanding = 1;
			this.objectList[i].lightCut = 1;
			this.objectList[i].square = 1;
		};
		if (searchTerm == '(9SQ)' || searchTerm == '(10SQ)') {

			this.objectList[i].steel = 0;
			this.objectList[i].lightCut = 1;
		};
		if (searchTerm == 'U') {

			this.objectList[i].upsTop = 1;
		};
		if (searchTerm == 'L') {

			this.objectList[i].lightCut = 1;
		};
		if (searchTerm == 'T') {

			this.objectList[i].truckable = 1;
		};
		if (searchTerm == 'C') {

			this.objectList[i].camo = 1;
			this.objectList[i].blackFrame = 1;
			this.objectList[i].availablePartID = this.makeUnavailable('B', this.objectList[i].availablePartID);
		};

		this.objectList[i].availablePartID = this.makeUnavailable(searchTerm, this.objectList[i].availablePartID);

		return this;
	};
	//Find Object With attribute and output to console
	this.logThisItem = function (userInput) {
		
		var identifiedItems = 0;
		var unIdentifiedItems = 0;

		//Search through identified items
		for (var i = 0; i < this.objectList.length; i++) {

			//Item to find RegEx in
			var listItem = this.objectList[i].partID;
			var availableListItem = this.objectList[i].availablePartID;

			//Find RegEx
			this.searchFor(userInput, listItem);

			//If RegEx detected
			if (this.pos[0] != -1) {

				console.log("Item #" + i + ": " + listItem);
				console.log("Item #" + i + ": " + availableListItem + " is available");
				identifiedItems++;
			};
		};
		//Search through unidentified items
		for (var j = 0; j < this.unAssignables.length; j++) {
			
			//Item to find RegEx in
			var listItem = this.unAssignables[j];

			//Find RegEx
			this.searchFor(userInput, listItem);

			//If RegEx detected
			if (this.pos[0] != -1) {

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
		
		this.pos = [-1, -1];
		this.objectList = [];
		this.unAssignables = [];

		console.clear();
		console.log("There are now " + this.objectList.length + " identified items.");
		console.log("There are now " + this.unAssignables.length + " unidentified items.");
		console.log("There are now " + (this.objectList.length + this.unAssignables.length) + " total items.");
		console.log("All data has been wiped.");

		return this;
	};
}

/*
	End of File...
*/
