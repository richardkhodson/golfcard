var numplayers = 5;
var numholes = 18;
var teetime = 45;
var seconds = 59;

function buildcard(){
    beginTimer();
    var holecollection = "";
    var playercollection = "";
    var grandtotalcollection = "";

    // create column of player labels
    for(var pl = 1; pl <= numplayers; pl++ ){
        playercollection += "<div id='player" + pl +"' class='holebox playerbox'> Player " + pl + "</div>";
        grandtotalcollection += "<div id='grand" + pl +"' class='holebox'>g</div>";
    }

    // create golf hole columns before you add holes to them.
    for(var c = numholes; c >= 1; c-- ){
        holecollection += "<div id='column" + c +"' class='holecol'><div class='holenumbertitle'>" + c + "</div></div>";
    }
    $("#leftcard").html(playercollection);
    $("#rightcard").html(holecollection + "<div class='holecol'><div>Total</div>" + grandtotalcollection + "</div>");

    // call the function that builds the holes into the columns
    buildholes();
}

function buildholes() {
    // add 18 holes to the columns
    for(var p = 1; p <= numplayers; p++ ){
        for(var h = 1; h <= numholes; h++){
            $("#column" + h).append("<input onkeyup='calculatescore(" + p +")' id='player" + p +"hole" + h +"' class='holebox'></input>");
        }
    }
}

    // This is the 'teetime' clock in upper right corner.
function beginTimer(){
    var thetimer = setInterval(function(){clocktick()}, 1000);
}

function clocktick(){
    if(seconds > 0){
        seconds --;
        if(seconds < 10){
            seconds = "0" + seconds;
        }
    }
    else{
        teetime --;
        seconds = 59;
    }
    document.getElementById("countdown").innerHTML = teetime + ":" + seconds;
}

    // This is the openweathermap.org function.
function getmyinfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var myobj = JSON.parse(xhttp.responseText);
            document.getElementById("weather").innerHTML = myobj.weather[0].description;
            document.getElementById("weatherimage").src = "http://openweathermap.org/img/w/" + myobj.weather[0].icon + ".png";
        }
    }

     xhttp.open("GET","http://api.openweathermap.org/data/2.5/weather?q=PROVO&APPID=3ebf39e8f35e6e908ef6646efcdb0637", true);
     xhttp.send();
}
getmyinfo();

    // This is the Course Info using Blake's code.
var testCourse = {};
var closeCourse  = {};
var xhttp = new XMLHttpRequest();
//Cali
//var local_obj = {latitude: 38.860573, longitude: -121.529398, radius: 100};
//Me Utah
var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};

function loadMe() {
    $.post("https://golf-courses-api.herokuapp.com/courses",local_obj,function(data,status) {
        closeCourse = JSON.parse(data);
        for (var p in closeCourse.courses){
            var mydisplaydiv = "<div id='"+ closeCourse.courses[p].id +"' class='thisCourse' onclick='getCourseInfo(this.id)'>" + closeCourse.courses[p].name +"</div>"
            $("#selectCourse").append(mydisplaydiv);
        }
        document.getElementById('golfDiv').style.display = 'block';

    });
};

function getCourseInfo(id) {
    xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            testCourse = JSON.parse(xhttp.responseText);
            //buildPage(testCourse.course.hole_count);
            console.log(testCourse.course.city);

            for(var t = 0; t > (testCourse.course.holes[0].tee_boxes.length - 1); t++){
                var teeboxdisplay = "<option value='" + t + "'>"+ testCourse.course.holes[0].tee_boxes[t].tee_color_type +"</option>";
                $("#selectTeebox").append(teeboxdisplay);
            }
        }
    };
//update the URL with the ID as I call it dynamically
    xhttp.open("GET","https://golf-courses-api.herokuapp.com/courses/" + id, true);
    xhttp.send();
}

function  setCourseInfo(teeboxid) {
    buildcard(teeboxid);
}

function calculatescore(theplayer) {
    var thetotal = 0;
    for (var t = 1; t <= numholes; t++) {
        thetotal += Number($("#player" + theplayer + "hole" + t).val());
    }
    $("#grand" + theplayer).html(thetotal);
}