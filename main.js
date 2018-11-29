window.onload = start;

function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.

    var width = 800;
    var height = 500;

    var commonElements = [];

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.select(document.getElementById('button'))
      // When button is clicked
      .on('click', function(d) {

        // Input Values
        if (document.getElementById('input1').value != null) {
          var input1 = document.getElementById('input1').value;
          commonElements.push({Actor1: input1})
        }
        if (document.getElementById('input2').value != null) {
          var input2 = document.getElementById('input2').value;
          commonElements.push({Actor2: input2})
        }

        var commonDirectors = [];
        var actedWith = [];
        var moviesTogether = [];
        var actor1Array = [];
        var actor2Array = [];


        // Load Data
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
            for (let i = 0; i < data.length; i++) {
              if (data[i].actor1 === input1 || data[i].actor2 === input1 || data[i].actor3 === input1) {
                // Array of actor 1
                actor1Array.push(data[i]);
                // Gets movie with both actors
                if (data[i].actor1 === input2 || data[i].actor2 === input2 || data[i].actor3 === input2) {
                  moviesTogether.push({Title: data[i].title});
                  commonElements.push({Title: data[i].title});
                }
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
                  commonDirectors.push({Director: actor1Array[i].director})
                  commonElements.push({Director: actor1Array[i].director})

                }
                // Acted with
                if ((actor1Array[i].actor1 === actor2Array[j].actor1 || actor1Array[i].actor1 === actor2Array[j].actor2 || actor1Array[i].actor1 === actor2Array[j].actor3)
                      && actor1Array[i].actor1 != input1 && actor1Array[i].actor1 != input2) {
                  actedWith.push({ActedWith:actor1Array[i].actor1})
                  commonElements.push({ActedWith:actor1Array[i].actor1})
                }
                if ((actor1Array[i].actor2 === actor2Array[j].actor1 || actor1Array[i].actor2 === actor2Array[j].actor2 || actor1Array[i].actor2 === actor2Array[j].actor3)
                    && actor1Array[i].actor2 != input1 && actor1Array[i].actor2 != input2) {
                  actedWith.push({ActedWith: actor1Array[i].actor2})
                  commonElements.push({ActedWith: actor1Array[i].actor2})
                }
                if ((actor1Array[i].actor3 === actor2Array[j].actor1 || actor1Array[i].actor3 === actor2Array[j].actor2 || actor1Array[i].actor3 === actor2Array[j].actor3)
                    && actor1Array[i].actor3 != input1 && actor1Array[i].actor3 != input2) {
                  actedWith.push({ActedWith:actor1Array[i].actor3})
                  commonElements.push({ActedWith:actor1Array[i].actor3})
                }
              }
            }

              console.log(moviesTogether)
              console.log(commonDirectors)
              console.log(actedWith)
              console.log(actor1Array)
              console.log(actor2Array)
              console.log(commonElements)
              

              // Add circles
              var actorCircles = svg.selectAll("circle")
                  .data(commonElements)
                  .enter()
                  .append("circle")
                  .attr("cx", 100)
                  .attr("cy", 150)
                  .attr("r", 35)
                  .classed('actor1', function(d) { return d.Actor1 != null})
                  .classed('actor2', function(d) { return d.Actor2 != null})
                  .classed('director', function(d) { return d.Director != null})
                  .classed('movie', function(d) { return d.Title != null})
                  .classed('actedWith', function(d) { return d.ActedWith != null});
              // Change location of Actor 2 circle
              d3.select('.actor2')
                .attr("cx", 700);
              // Change size and location of common elements
              d3.selectAll('.director, .movie, .actedWith')
                .attr("r", 10)
                .attr("cx", 400);
          });

    });
  }


  // Remove Duplicates in Array
/*  function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}*/

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
