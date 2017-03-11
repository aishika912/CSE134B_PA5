var brandName = document.getElementById('brandname');
var stickName = document.getElementById('stickname');
var priceVal = document.getElementById("priceval");
var colorVal = document.getElementById("colorval");
var typeVal = document.getElementById('typeval');
var ownVal = document.getElementById('ownval');

/* canvas vars */
var myOwnedArray = [];
var myWantArray = [];

var auth = firebase.auth();
var storageRef = firebase.storage().ref();

function loadPageFn() {
	//window.alert("IT WORKED");
    //console.log("PAGE LOADED");
    firebase.auth().onAuthStateChanged(function(currentUser) {
    	//console.log(currentUser.email);
  		if (currentUser) {
    	// the user is logged in, you can bootstrap functionality now
    		var mystring = currentUser.email.replace(/\./g,'');
    		mystring = mystring.replace(/\@/g,'');
    		//console.log(mystring);
    		var lipstickRef = firebase.database().ref(mystring + "/lipsticks/");

    		lipstickRef.on('value', displaySticksFn);
  		}
  		else {

  		}
	});
    //var lipstickRef = firebase.database().ref(currentUser + "lipsticks/");
    //console.log("PAGE LOADED");
}

function displaySticksFn(data) {
	//console.log("MADE IT");
	var lipsticks = data.val();
	var keys = Object.keys(lipsticks);
	//console.log("MADE IT");
	for (var i = 0; i < keys.length; ++i) {
		var k = keys[i];
		if (lipsticks[k].own == true) {
			addStickToOwn(k);
			var colorBox = document.createElement("div");
			colorBox.className += "color-box"
			colorBox.style.backgroundColor = lipsticks[k].color;
			document.getElementById("data-owned").appendChild(colorBox);
		}
		else {
			addStickToWant(k);
			var colorBox = document.createElement("div");
			colorBox.className += "color-box"
			colorBox.style.backgroundColor = lipsticks[k].color;
			document.getElementById("data-wanted").appendChild(colorBox);
		}
		//console.log(k);
	}

	//log(data.val());

}
function displayWantData() {
	firebase.auth().onAuthStateChanged(function(currentUser) {
	    	//console.log(currentUser.email);
	  		if (currentUser) {
	  			var mystring = currentUser.email.replace(/\./g,'');
	    		mystring = mystring.replace(/\@/g,'');
				
				//console.log("OWN");
	  	}
	});
}
function addStickFn() {
	firebase.auth().onAuthStateChanged(function(currentUser) {
    	//.,...console.log(currentUser.email);
  		if (currentUser) {
    	// the user is logged in, you can bootstrap functionality now
    		var mystring = currentUser.email.replace(/\./g,'');
    		mystring = mystring.replace(/\@/g,'');
    		//console.log(mystring);
    		var firebaseRef = firebase.database().ref(mystring + "/lipsticks/");
    		var theBrand = brandName.value;
		    var theName = stickName.value;
		    var thePrice = priceVal.value;
		    var theColor = colorVal.value;
		    var theType = typeVal.value;
		    var theOwn = ownVal.checked;
		    var key = theBrand + theName;

		    var file = document.getElementById('uploadpic').files[0];
    		// the file is the first element in the files property
    		console.log("File name: " + file.name);
    		console.log("File size: " + file.size);

    		var metadata = {
        		'contentType': file.type
      		};

    		var uploadTask = storageRef.child(mystring + '/' + key).put(file, metadata);

		    //firebaseRef.push().set("MOFO");
		    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			  function(snapshot) {
			    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			    console.log('Upload is ' + progress + '% done');
			    switch (snapshot.state) {
			      case firebase.storage.TaskState.PAUSED: // or 'paused'
			        console.log('Upload is paused');
			        break;
			      case firebase.storage.TaskState.RUNNING: // or 'running'
			        console.log('Upload is running');
			        break;
			    }
			  }, function(error) {
			  switch (error.code) {
			    case 'storage/unauthorized':
			      // User doesn't have permission to access the object
			      break;

			    case 'storage/canceled':
			      // User canceled the upload
			      break;
			    case 'storage/unknown':
			      // Unknown error occurred, inspect error.serverResponse
			      break;
			  }
			}, function() {
			  	// Upload completed successfully, now we can get the download URL
			  	var downloadURL = uploadTask.snapshot.downloadURL;


			    firebaseRef.child(key).set({
			    	brand: theBrand,
			    	name: theName,
			    	price: thePrice,
			    	color: theColor,
			    	type: theType,
			    	own: theOwn
			    	//pic: downloadURL
			    });
	    		//lipstickRef.on('value', displaySticksFn);

	    		window.location.href = "home.html";
			});
  		}
	});
    
/*
    if (theOwn == true) {
    	//window.alert("HELLO MOFO");
    	addStickToOwn();
    }
    else {
    	//window.alert("IT SHOULD WORK");
    	addStickToWant();
    }*/
}

function addStickToOwn(uniqueId) {


firebase.auth().onAuthStateChanged(function(currentUser) {
    	console.log(currentUser.email);
  		if (currentUser) {
  			var mystring = currentUser.email.replace(/\./g,'');
    		mystring = mystring.replace(/\@/g,'');
  		
			//console.log(uniqueId);
			var node = document.createElement("li");
			//var a = document.createElement("a");
			//a.setAttribute('href', "#popup2");

			var img = document.createElement("img");
			


			//var storageRef = firebase.storage();
			var imgRef = storageRef.child(mystring + '/' + uniqueId).getDownloadURL().then(function(url) {
				// `url` is the download URL for 'images/stars.jpg'

			  	// Or inserted into an <img> element:
			  	//var img = document.getElementById('myimg');
			  	img.src = url;

			}).catch(function(error) {
			  // Handle any errors
			  img.src = "IMG/lipstick.jpg";
			});



			// Get metadata properties
/*			imgRef.getMetadata().then(function(metadata) {
			  // Metadata now contains the metadata for 'images/forest.jpg'
			  console.log(metadata);
			  //img.src = metadata.fullPath;
			}).catch(function(error) {
			  // Uh-oh, an error occurred!
			});
*/
			/*
			imgRef.getMetadata().then(funtion(metadata) {
				console.log(metadata);
			}).catch(function(error){});

*/

			//img.src = "lipstick.jpg";
			img.width = "80";
			img.height = "100";
			//console.log(uniqueId);
		    var att = "displayStickInfoFn(" + uniqueId +");";
		    //console.log(att);
			img.setAttribute("onclick", att);
		    //console.log(att);
		    //a.appendChild(img);

			//var textnode = document.createTextNode("MOFO");
			node.appendChild(img);
			node.setAttribute("id", uniqueId);
			document.getElementById("theCollectionList").appendChild(node);
			//console.log("OWN");


  		}
	});

}








function addStickToWant(uniqueId) {


firebase.auth().onAuthStateChanged(function(currentUser) {
    	console.log(currentUser.email);
  		if (currentUser) {
  			var mystring = currentUser.email.replace(/\./g,'');
    		mystring = mystring.replace(/\@/g,'');
  		
			//console.log(uniqueId);
			var node = document.createElement("li");
			//var a = document.createElement("a");
			//a.setAttribute('href', "#popup2");

			var img = document.createElement("img");
			


			//var storageRef = firebase.storage();
			var imgRef = storageRef.child(mystring + '/' + uniqueId).getDownloadURL().then(function(url) {
				// `url` is the download URL for 'images/stars.jpg'

			  	// Or inserted into an <img> element:
			  	//var img = document.getElementById('myimg');
			  	img.src = url;

			}).catch(function(error) {
			  // Handle any errors
			  	img.src = "IMG/lipstick.jpg";
			});


			//img.src = "lipstick.jpg";
			img.width = "80";
			img.height = "100";
			//console.log(uniqueId);
		    var att = "displayStickInfoFn(" + uniqueId +");";
		    //console.log(att);
			img.setAttribute("onclick", att);
		    //console.log(att);
		    //a.appendChild(img);

			//var textnode = document.createTextNode("MOFO");
			node.appendChild(img);
			node.setAttribute("id", uniqueId);
			document.getElementById("theWishList").appendChild(node);
			//console.log("OWN");


  		}
	});

}






function deleteStickFn() {
	firebase.auth().onAuthStateChanged(function(currentUser) {
    	console.log(currentUser.email);
  		if (currentUser) {
    	// the user is logged in, you can bootstrap functionality now
    		var theBrand = document.getElementById("updatedbrand").innerHTML;
			var theName = document.getElementById("updatedname").innerHTML;
			var key = theBrand + theName;

			//var lipstickRef = firebase.database().ref("lipsticks/");
			//var lipstickRef = firebase.database().ref(currentUser.email + "/lipsticks/");

			var mystring = currentUser.email.replace(/\./g,'')
		    mystring = mystring.replace(/\@/g,'')
		    //console.log(mystring);
		    var lipstickRef = firebase.database().ref(mystring + "/lipsticks/");



		    var imgRef = storageRef.child(mystring + '/' + key);
		    imgRef.delete().then(function() {
				// File deleted successfully
			}).catch(function(error) {
			  	// Uh-oh, an error occurred!
			});



			lipstickRef.child(key).remove();
			window.location.href = "home.html";
  		}
	});
}


function displayStickInfoFn(liElement) {
	firebase.auth().onAuthStateChanged(function(currentUser) {
    	console.log(currentUser.email);
  		if (currentUser) {
			var mystring = currentUser.email.replace(/\./g,'')
		    mystring = mystring.replace(/\@/g,'')
		    //console.log(mystring);
		    var lipstickRef = firebase.database().ref(mystring + "/lipsticks/");

			uniqueId = liElement.id;
			//console.log(MOFO);
			//window.location.href = "#popup2";
			//var lipstickRef = firebase.database().ref("lipsticks/");
			//var lipstickRef = firebase.database().ref(currentUser.email + "/lipsticks/"); 
			var mystring = currentUser.email.replace(/\./g,'')
		    mystring = mystring.replace(/\@/g,'')
		    //console.log(mystring);
		    var lipstickRef = firebase.database().ref(mystring + "/lipsticks/");

		    lipstickRef.on('value', function(data) {
		    	var lipsticks = data.val();

		    	if (lipsticks[uniqueId].own == true) {
		    		var ownAns = "Yes";
		    	}
		    	else
		    		var ownAns = "No";
				//var keys = Object.keys(lipsticks);
				//var correctKey;
				
				//var brandIn = document.createElement("input");
				//brandIn.setAttribute("type","text");
				//brandIn.setAttribute("value", "PIZZA");

				//document.getElementById("brandp").innerHTML = 
				//	"Brand: <input id=\"updatedbrand\" type=\"text\" value=\"" + lipsticks[uniqueId].brand + "\">"
				document.getElementById("brandp").innerHTML = "Brand: <span id=\"updatedbrand\">" 
					+ lipsticks[uniqueId].brand + "</span>";
				//document.getElementById("namep").innerHTML = 
				//	"Name: <input id=\"updatedname\" type=\"text\" value=\"" + lipsticks[uniqueId].name + "\">"
				document.getElementById("namep").innerHTML = "Name: <span id=\"updatedname\">" 
					+ lipsticks[uniqueId].name+ "</span>";
				
				document.getElementById("colorp").innerHTML = 
					"Color: <input id=\"updatedcolor\" type=\"color\" value=\"" 
					+ lipsticks[uniqueId].color + "\">"

				document.getElementById("pricep").innerHTML = 
					"Price: <input id=\"updatedprice\" type=\"text\" value=\"" 
					+ lipsticks[uniqueId].price + "\">"
				

				if (lipsticks[uniqueId].type == "Lipstick")
					var typeString = "<select id=\"updatedtype\"><option selected=\"selected\">Lipstick</option><option>Liquid</option>" + 
					"<option>Lip Gloss</option><option>Lip Liner</option></select>";

				else if (lipsticks[uniqueId].type == "Liquid")
					var typeString = "<select id=\"updatedtype\"><option>Lipstick</option><option selected=\"selected\">Liquid</option>" + 
					"<option>Lip Gloss</option><option>Lip Liner</option></select>";

				else if (lipsticks[uniqueId].type == "Lip Gloss")
					var typeString = "<select id=\"updatedtype\"><option>Lipstick</option><option>Liquid</option>" + 
					"<option selected=\"selected\">Lip Gloss</option><option>Lip Liner</option></select>";

				else if (lipsticks[uniqueId].type == "Lip Liner")
					var typeString = "<select id=\"updatedtype\"><option>Lipstick</option><option>Liquid</option>" + 
					"<option >Lip Gloss</option><option selected=\"selected\">Lip Liner</option></select>";

				document.getElementById("typep").innerHTML = typeString;
					
				var ownString;
				//console.log(lipsticks[uniqueId].own);
				


				if (lipsticks[uniqueId].own == false)
					ownString = "<input id=\"updatedown\" type=\"checkbox\">";
				
				else 
					ownString = "<input id=\"updatedown\" type=\"checkbox\" checked>";
				
				document.getElementById("ownp").innerHTML = ownString + "Own? ";
				




				var theImg = document.getElementById("imgp");
				



				var imgRef = storageRef.child(mystring + '/' + uniqueId).getDownloadURL().then(function(url) {
				// `url` is the download URL for 'images/stars.jpg'

			  	// Or inserted into an <img> element:
			  	//var img = document.getElementById('myimg');
			  		theImg.src = url;

				}).catch(function(error) {
			  		// Handle any errors
			  		theImg.src = "IMG/lipstick.jpg";
				});




				window.location.href = "#popup2";
				//console.log(k);
				//}
		    });
  		}
	});



	
}



function updateStickFn() {
	firebase.auth().onAuthStateChanged(function(currentUser) {
    //	console.log(currentUser.email);
  		if (currentUser) {
    	// the user is logged in, you can bootstrap functionality now
		    //console.log(mystring);
		    var firebaseRef = firebase.database().ref(mystring + "/lipsticks/");
		    var theBrand = document.getElementById("updatedbrand").innerHTML;
			var theName = document.getElementById("updatedname").innerHTML;
			var newPrice = document.getElementById("updatedprice").value;
		    var newColor = document.getElementById("updatedcolor").value;
		    var newType = document.getElementById("updatedtype").value;
		    var newOwn = document.getElementById("updatedown").checked;
		    console.log(newOwn);
			var key = theBrand+theName;


			//var firebaseRef = firebase.database().ref("lipsticks/");
			//var firebaseRef = firebase.database().ref(currentUser.email + "/lipsticks/");

			var mystring = currentUser.email.replace(/\./g,'')
		    mystring = mystring.replace(/\@/g,'')
		    //console.log(mystring);
		    var firebaseRef = firebase.database().ref(mystring + "/lipsticks/");

			firebaseRef.child(key).set({
		    	brand: theBrand,
		    	name: theName,
		    	price: newPrice,
		    	color: newColor,
		    	type: newType,
		    	own: newOwn
		    });

			window.location.href = "home.html";

		}
	});
}


function signOut() {
	firebase.auth().signOut();
	window.location.replace('index.html');
}





