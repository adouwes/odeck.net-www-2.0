Parse.initialize("Q7UvwoEPHbGikeMcQbrfnYy36Uw1m2xE3JwUvLog", "32pKOwxJLD25r8pjahUGVpIds0RTBdlFoWZ3Hy7Z");

var oDeck = Parse.Object.extend("oDeck");

// pull hash from url - should probably be able to do this without regex..

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// load sequence from url hash

function loadById() {
  var id = getParameterByName('id');
  var query = new Parse.Query(oDeck);
  query.equalTo("objectId", id);
  query.include("Username")
  query.find({
    success: function(results){
      var output = "";
      var username = results[0].get("Username").getUsername();
      var sequence = results[0].get("Sequence");
      var date1 = results[0].createdAt;
      //some moment.js fancy work with the date - a little overkill
      var m = moment(date1);
      var id = results[0].id;

      // this will be cleaned up with ascii art
      output += "<div class='col-md-8 col-md-offset-2'><div class='cardmd'><div class='card-content'><div class='row'>";
      output += "<div class='col-xs-4'>"+username+"</div><div class='col-xs-4 col-xs-offset-4'><p class='text-right'>"+m.format("MMM Do YYYY, hh:mm:ss")+"</p></div></div></div><div class='card-image text-center'>";
      output += cardRender(sequence);
      output += "</div><div class='card-action'>share: <a href='?id="+id+"'>"+id;
      output += "</a></div></div></div>";

      $('#id').attr('value', id);
      $("#postdump").html(output);

    }, error: function(error){
      console.log(error.message);
    }
  });
};


var cardRender = function(string) {
  var output = '';

  for (var i = 0; i < string.length; i+= 2) {
    // AD Blocker workaround around for Ace of Diamonds
    if (string[i] == "A" && string[i+1] == "D") {
      output += "<img src='/assets/img/Az.png'>";
    } else {
      output += "<img src='/assets/img/" + string[i] + string[i+1] + ".png'>";
    }
  }
  return output;
}

// Grab last 10 logged sequences

function getPosts() {
  var query = new Parse.Query(oDeck)
  query.descending("createdAt")
  query.limit(10)
  query.include("Username")

  query.find({
    success: function(results){
      var output = "";

      for (var i in results) {
        var username = results[i].get("Username").getUsername();
        var sequence = results[i].get("Sequence");
        //moment.js fancy work with the date
        var date1 = results[i].createdAt;
        var m = moment(date1);
        var id = results[i].id;

        //silly html formatting
        output += "<div class='col-md-8 col-md-offset-2'><div class='cardmd'><div class='card-content'><div class='row'>";
        output += "<div class='col-xs-4'>"+username+"</div><div class='col-xs-6 col-xs-offset-2'><p class='text-right'>"+m.format("MMM Do YYYY, hh:mm:ss")+"</p></div></div></div><div class='card-image text-center'>";
        output += cardRender(sequence);
        output += "</div><div class='card-action'>share: <a href='?id="+id+"'>"+id;
        output += "</a></div></div></div>";
      }
      //dump everything to the dom
      $("#postdump").html(output);
    },
    error: function(error){
      console.log("Query Error:"+error.message);
    }
  });
}

// if there is a url hash id, load that sequence, if not, load last 10
// don't need to define id so many times, change to global
var id = getParameterByName('id');
console.log(id)
if (id == "") {
  getPosts();
} else {
  loadById()
}
