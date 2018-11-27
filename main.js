window.onload = start;

function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.

    var width = 800;
    var height = 500;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var nodes = [];
    var links = [];

    /*var input = d3.select(input)
        .append('input')
        .attr('width', width)
        .attr('height', height);*/

    d3.select(document.getElementById('button'))
      .on('click', function(d) {

        // Input Values
        if (document.getElementById('input1').value != null) {
          var input1 = document.getElementById('input1').value;
        }
        if (document.getElementById('input2').value != null) {
          var input2 = document.getElementById('input2').value;
        }
        nodes.push(input1, input2);
        console.log(nodes)
        // Load Data
        var commonDirectors = [];
        var actedWith = [];
        var moviesTogether = [];
        var actor1Array = [];
        var actor2Array = [];
        d3.csv('movies.csv', function(d) {
          return {
            director: d.director_name,
            actor1: d.actor_1_name,
            actor2: d.actor_2_name,
            actor3: d.actor_3_name,
            title: d.movie_title,
            rating: d.imdb_score
          };
        }, function(data) {
            for (let i=0; i<data.length; i++) {
              if (data[i].actor1 === input1 || data[i].actor2 === input1 || data[i].actor3 === input1) {
                // Gets movie with both actors
                if (data[i].actor1 === input2 || data[i].actor2 === input2 || data[i].actor3 === input2) {
                  moviesTogether.push(data[i].title);
                }
                // Array of actor 1
                actor1Array.push(data[i]);
              }
              // Array of actor 2
              if (data[i].actor1 === input2 || data[i].actor2 === input2 || data[i].actor3 === input2) {
                actor2Array.push(data[i]);
              }
            }
            // Compare Actor Arrays
            for (let i = 0; i < actor1Array.length; i++) {
              for (let j = 0; j < actor2Array.length; j++) {
                // Common Directors
                if (actor1Array[i].director === actor2Array[j].director) {
                  commonDirectors.push(actor1Array[i].director)
                }
                // Acted with
                if (actor1Array[i].actor1 === actor2Array[j].actor1 || actor1Array[i].actor1 === actor2Array[j].actor2 || actor1Array[i].actor1 === actor2Array[j].actor3) {
                  actedWith.push(actor1Array[i].actor1)
                }
                if (actor1Array[i].actor2 === actor2Array[j].actor2 || actor1Array[i].actor2 === actor2Array[j].actor3) {
                  actedWith.push(actor1Array[i].actor2)
                }
                if (actor1Array[i].actor3 === actor2Array[j].actor3) {
                  actedWith.push(actor1Array[i].actor3)
                }
              }
            }
              console.log(actor1Array)
              console.log(actor2Array)
              console.log(moviesTogether)
              console.log(commonDirectors)
              console.log(actedWith);
          });

    });
  }
