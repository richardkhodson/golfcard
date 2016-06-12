var numplayers = 3;
var numholes = 18;
var numpar = 0;
var teetime = 45;
var seconds = 59;

var testCourse = {};
var closeCourses = {};
var golfxhttp = new XMLHttpRequest();
//Cali
//var local_obj = {latitude: 38.860573,longitude: -121.529398,radius: 100}
//Me Utah
var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};

function loadMe() {
    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function (data, status) {
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses) {
            //var mydisplaydiv = "<div id='"+ closeCourses.courses[p].id +"' class='thisCourse' onclick='getCourseInfo(this.id)'>" + closeCourses.courses[p].name +"</div>";
            var selectdisplay = "<option value='" + closeCourses.courses[p].id + "'>" + closeCourses.courses[p].name + "</option>";
            $("#selectCourse").append(selectdisplay);
        }
        //document.getElementById('golfDiv').style.display = 'block';

    });
};

function getCourseInfo(id) {
    golfxhttp = new XMLHttpRequest;
    golfxhttp.onreadystatechange = function () {
        if (golfxhttp.readyState == 4 && golfxhttp.status == 200) {
            testCourse = JSON.parse(golfxhttp.responseText);
            $("#golfcourselabel").html(testCourse.course.name);
            gettheWeather(testCourse.course.city);
            for (var t = 0; t < (testCourse.course.holes[0].tee_boxes.length - 1); t++) {
                var teeboxdisplay = "<option value='" + t + "'>" + testCourse.course.holes[0].tee_boxes[t].tee_type + "</option>";
                $("#selectTeebox").append(teeboxdisplay);
            }

        }
    };
    golfxhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + id, true);
    golfxhttp.send();

}

function setCourseInfo(teeboxid) {
    buildcard(teeboxid);
}

function gettheWeather(thecityname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            document.getElementById("currentconditions").innerHTML = obj.weather[0].description;
            document.getElementById("currenttemp").innerHTML = fullconverter(Number(obj.main.temp));
            document.getElementById("weatherimage").src = "http://openweathermap.org/img/w/" + obj.weather[0].icon + ".png";
        }
    }

    xhttp.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + thecityname + "&appid=cc8ef8e5c209d938ab3801daa42b5e31", true);
    xhttp.send();
}

function initMap() {
    var myLatLng = {lat: 40.4295033232823, lng: -111.902993917466};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Thanksgiving Point Golf Course'
    });
}

function fullconverter(k) {
    var toc = +k - 273.15;
    var tof = toc * 9 / 5 + 32;
    return Math.round(tof);
}

function buildcard(theteeboxid) {
    // beginTimer();
    var holecollection = "";
    var playercollection = "";
    var grandtotalcollection = "";

    // create column of player labels
        for (var pl = 1; pl <= numplayers; pl++) {
        //playercollection += "<div id='player" + pl + "' class='holebox playerbox'> Player " + pl + " <span onclick='deleteplayer(" + pl + ")' class='deletebtn glyphicon glyphicon-minus-sign'></span></div>";
        playercollection += "<div id='player" + pl + "' class='holebox playerbox'><input id='name' value='Player " + pl + "'><div id='deleteName' onclick='deleteplayer(" + pl + ")' class='deletebtn glyphicon glyphicon-minus-sign'></div></div>";

            grandtotalcollection += "<div id='grand" + pl + "' class='holebox'>0</div>";
    }

    // create golf hole columns before you add holes to them.
    for (var c = numholes; c >= 1; c--) {
        var adjusthole = c - 1;
        //holecollection += "<div id='column" + c + "' class='holecol'><div class='holenumbertitle'>" + c + "<div>par " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].par + "<div>yards " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].yards + "<div>hcp " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].hcp + "</div></div></div></div></div>";
        holecollection += "<div id='column" + c + "' class='holecol'><div class='holenumbertitle'>" + c + "</div></div>";
    }



    
    $("#leftcard").html(playercollection);
    $("#rightcard").html(("<div class='holecol totalcol'><div class='totalheader'>Total</div>" + grandtotalcollection + "</div>") + holecollection);
        
    //console.log();
    // call the function that builds the holes into the columns
    buildholes();

}

//function buildpar() {
    // add 18 pars to the columns
  //  for (var p = 1; p <= numpar; p++) {
   //     for (var h = 1; h <= numholes; h++) {
            // $("#column" + h).append("<input onkeyup='calculatescore(" + p + ")' id='player" + p + "hole" + h + "' class='holebox'/>");
    //        $("#column" + h).append("<div>par " + testCourse.course.holes[adjusthole].tee_boxes[theteeboxid].par + " id='player" + p + "hole" + h + "' class='holebox'</div>");
    //    }
   // }

function buildholes() {
    // add 18 holes to the columns
    for (var p = 1; p <= numplayers; p++) {
        for (var h = 1; h <= numholes; h++) {
            $("#column" + h).append("<input onkeyup='calculatescore(" + p + ")' id='player" + p + "hole" + h + "' class='holebox'/>");
        }
        }
    
}

/** function beginTimer() {
    var thetimer = setInterval(function () {
        clocktick()
    }, 1000);
} **/

/** function clocktick(){
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
} **/

function calculatescore(theplayer) {
    var thetotal = 0;
    for (var t = 1; t <= numholes; t++) {
        thetotal += Number($("#player" + theplayer + "hole" + t).val());
    }
    $("#grand" + theplayer).html(thetotal);
}


function addplayer() {
    var parentlength = $('#leftcard').children().size();

    var bignum;

    for (var l = 1; l <= parentlength; l++) {
        var grabid = $("#leftcard :nth-child(" + l + ")").attr("id");
        var idsplit = grabid.split("player");
        console.log(idsplit);
        bignum = Number(idsplit[1]);
    }
    var adjnum = bignum + 1;
    /* $("#leftcard").append("<div id='player" + adjnum + "' class='holebox playerbox'> Player " + adjnum + "<span onclick='deleteplayer(" + adjnum + ")' class='deletebtn glyphicon glyphicon-minus-sign'></span></div>"); */
    $("#leftcard").append("<div id='player" + adjnum + "' class='holebox playerbox'><input id='name' value='Player " + adjnum + "'><div id='deleteName' onclick='deleteplayer(" + adjnum + ")' class='deletebtn glyphicon glyphicon-minus-sign'></div></div>");
    for (var h = 1; h <= numholes; h++) {
        $("#column" + h).append("<input onkeyup='calculatescore(" + adjnum + ")' id='player" + adjnum + "hole" + h + "' class='holebox'/>");
    }
    $(".totalcol").append("<div id='grand" + adjnum + "' class='holebox'>0</div>");

}

function deleteplayer(playerid) {
    $("#player" + playerid).remove();
    $("#grand" + playerid).remove();
    for (var p = 1; p <= numholes; p++) {
        $("#player" + playerid + "hole" + p).remove();
    }
}



















