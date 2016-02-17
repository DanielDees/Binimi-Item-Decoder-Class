//THESE ITEMS ARE NOT IN THE CLASS YET!

function makeUnavailable (searchTerm, str) {

	//Find RegEx
	pos[0] = str.indexOf(searchTerm);

	//Remove RegEx
	var begin = str.substring(0, pos[0]);
	var end = str.substring(pos[0] + searchTerm.length);
	var changed = '';

	//Label Removed RegEx area
	for (var i = 0; i < searchTerm.length; i++) { changed += '*'; };
	
	//Rebuild partID
	str = begin + changed + end;

	return str;
}
function checkForFullStainless (searchTerm, str) {

	if (searchTerm == 'S') {

		//Skip pos[0] = 'S' which is Sun-DURA
		pos[0] = str.indexOf('S', 1);
		pos[1] = str.indexOf('FS');

		//Make sure not Free Standing
		if (pos[0] == pos[1] + 1) {

			//Restart starting after 'FS'
			pos[0] = str.indexOf('S', pos[1] + 2);
		};

		//Make sure not Sun-Dura (for partID's like "10000S or 510S")
		if (pos[0] == str.length - 1 && str.indexOf('*') == -1) { pos[0] = -1; };
	};

	//Return value so asssignObjectValues can get a true/false
	return pos[0];
}
