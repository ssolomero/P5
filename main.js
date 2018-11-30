window.onload = start;

function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.

    var width = 800;
    var height = 500;

    var commonElements = [];
    var commonDirectors = [];
    var actedWithArr = [];
    var moviesTogether = [];
    var actor1Array = [];
    var actor2Array = [];

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.select(document.getElementById('button'))
      // When button is clicked
      .on('click', function(d) {
        // Clears Arrays
        commonElements = [];
        commonDirectors = [];
        actedWithArr = [];
        moviesTogether = [];
        actor1Array = [];
        actor2Array = [];

        d3.selectAll("svg > *").remove();

        // Input Values
        if (document.getElementById('input1').value != null) {
          var input1 = document.getElementById('input1').value;
          commonElements.push({Actor1: input1})
        }
        if (document.getElementById('input2').value != null) {
          var input2 = document.getElementById('input2').value;
          commonElements.push({Actor2: input2})
        }

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
                actor1Array.push(data[i])
                commonElements.push({Left: data[i]});
                // Gets movie with both actors
                if (data[i].actor1 === input2 || data[i].actor2 === input2 || data[i].actor3 === input2) {
                  moviesTogether.push(data[i].title);
                }
              }
              // Array of actor 2
              if (data[i].actor1 === input2 || data[i].actor2 === input2 || data[i].actor3 === input2) {
                actor2Array.push(data[i])
                commonElements.push({Right: data[i]});
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
                if ((actor1Array[i].actor1 === actor2Array[j].actor1 || actor1Array[i].actor1 === actor2Array[j].actor2 || actor1Array[i].actor1 === actor2Array[j].actor3)
                      && actor1Array[i].actor1 != input1 && actor1Array[i].actor1 != input2) {
                  actedWithArr.push(actor1Array[i].actor1)
                }
                if ((actor1Array[i].actor2 === actor2Array[j].actor1 || actor1Array[i].actor2 === actor2Array[j].actor2 || actor1Array[i].actor2 === actor2Array[j].actor3)
                    && actor1Array[i].actor2 != input1 && actor1Array[i].actor2 != input2) {
                  actedWithArr.push(actor1Array[i].actor2)
                }
                if ((actor1Array[i].actor3 === actor2Array[j].actor1 || actor1Array[i].actor3 === actor2Array[j].actor2 || actor1Array[i].actor3 === actor2Array[j].actor3)
                    && actor1Array[i].actor3 != input1 && actor1Array[i].actor3 != input2) {
                  actedWithArr.push(actor1Array[i].actor3)
                }
              }
            }
              // Removes Duplicates and coppies array in to commonElements array
              moviesTogether = removeDuplicates(moviesTogether)
              moviesTogether.forEach(function(i) {
                commonElements.push({Title: i})
              });
              commonDirectors = removeDuplicates(commonDirectors)
              commonDirectors.forEach(function(i) {
                commonElements.push({Director: i})
              });
              actedWithArr = removeDuplicates(actedWithArr)
              actedWithArr.forEach(function(i) {
                commonElements.push({ActedWith: i})
              });

              console.log(actor1Array)
              console.log(actor2Array)
              console.log(moviesTogether)
              console.log(commonDirectors)
              console.log(actedWithArr)
              console.log(commonElements)


              // Add circles
              var circles = svg.selectAll("circle")
                  .data(commonElements)
                  .enter()
                  .append("circle")
                  .attr("cx", 250)
                  .attr("cy", 150)
                  .attr("r", 35)
                  .attr("class", "circle")
                  .classed('actor1', function(d) { return d.Actor1 != null})
                  .classed('actor2', function(d) { return d.Actor2 != null})
                  .classed('director', function(d) { return d.Director != null})
                  .classed('movie', function(d) { return d.Title != null})
                  .classed('actedWith', function(d) { return d.ActedWith != null})
                  .classed('left', function(d) { return d.Left != null})
                  .classed('right', function(d) { return d.Right != null})
                  .on("mouseover", function(d) {
                    if (d.Actor1 != null) {
                      tooltip.text("Actor 1: " + d.Actor1);
                    } else if (d.Actor2 != null) {
                      tooltip.text("Actor 2: " + d.Actor2);
                    } else if (d.Director != null) {
                      tooltip.text("Director by: " + d.Director);
                    } else if (d.Title != null) {
                      tooltip.text("Movie Together: " + d.Title);
                    } else if (d.ActedWith != null) {
                      tooltip.text("Acted with: " + d.ActedWith);
                    } else if (d.Left != null) {
                        tooltip.text (
                        "Film: " + d.Left.title
                        + "\n Director: " + d.Left.director
                        + "\n Actor 1: " + d.Left.actor1
                        + "\n Actor 2: " + d.Left.actor2
                        + "\n Actor 3: " + d.Left.actor3
                        + "\n IMDB Score: " + d.Left.rating);
                    }
                      else { tooltip.text(
                        "Film: " + d.Right.title
                      + "Director: " + d.Right.director
                      + "Actor 1: " + d.Right.actor1
                      + "Actor 2: " + d.Right.actor2
                      + "Actor 3: " + d.Right.actor3
                      + "IMDB Score: " + d.Right.rating)
                    }
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(d) {
                  return tooltip
                      .style("top", (d3.event.pageY - 10) + "px")
                      .style("left", (d3.event.pageX + 10) + "px")
                })
                .on("mouseout", function(d) {
                  return tooltip.style("visibility", "hidden")
                });

                // text to show when hovering over a circle
                var tooltip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("visibility", "hidden")
                  .text("testing one two three");

              // Change location of Actor 2 circle
              d3.select('.actor2')
                .attr("cx", 550);
              // Change size and location of common elements
              d3.selectAll('.director, .movie, .actedWith')
                .attr("r", 10)
                .attr("cx", function() { return 400})
                .attr("cy", function(d,i) { return i*25 + 80});

              var lefty = 100;
              d3.selectAll('.left')
                .attr("r", 8)
                .attr("cx", function(d,i) {  return 140+((i%4)*20)})
                .attr("cy", function(d,i) {
                  if (i%4 == 0) {
                    lefty = lefty+25;
                    return lefty;
                  } else return lefty;
                });
              var righty = 100;
              d3.selectAll('.right')
                .attr("r", 8)
                .attr("cx", function(d,i) { return 600+((i%4)*20)})
                .attr("cy", function(d,i) {
                  if (i%4 == 0) {
                    righty = righty+25;
                    return righty;
                  } else return righty;
                });

          });

    });
  }


  // Remove Duplicates in Array
function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
