// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    
    articleCardBody = $("<div class='card-body'>");
      articleTitle = $("<div class='card-header h3'>").text(data[i].title);
      articleTitle.attr("data-id", data[i]._id);
      articleTitle.attr("data-toggle", "modal");
      articleTitle.attr("data-target", "noteModal");
      articleText = $("<p class='card-text'>").text(data[i].summary);
      articleLink = $("<a>").attr("href", data[i].link).text("Click here for the full article!");
      articleCardBody.append(articleTitle).append(articleText).append(articleLink);
      $("#articles").append(articleTitle).append(articleCardBody).append("<br>");
      
  }
});

$(".btn-primary").on("click", function(){
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/scrape" 
  })
  .then(function(data) {
    console.log(data);
    location.reload();
  })
})

$(".btn-warning").on("click", function(){
  event.preventDefault();
  $("#articles").empty();
  
})
  



// Whenever someone clicks a p tag
$(document).on("click", ".card-header", function() {
  // Empty the notes from the note section
  
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#dataTitle").append("<h2>" + data.title + "</h2>");
      
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#saveButton").attr("data-id", thisId);
      // If there's a note in the article
      if (data.note) {
        console.log(data.note);
        // Place the title of the note in the title input
        $("#noteTitle").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#noteBody").val(data.note.body);
        
      }
      else {
        $("#noteTitle").val("");
        $("#noteBody").val("");
      }

      $("#noteModal").modal("toggle");
    });
});

$(document).on("click", "#close", function() {
  event.preventDefault();
  $("#noteTitle").empty();
  $("#noteBody").empty();
  $("#dataTitle").empty();
  $("#saveButton").removeAttr();

});
// When you click the savenote button
$(document).on("click", "#saveButton", function() {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#noteTitle").val(),
      // Value taken from note textarea
      body: $("#noteBody").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteModal").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#noteTitle").empty();
  $("#noteBody").empty();
  $("#dataTitle").empty();
});
