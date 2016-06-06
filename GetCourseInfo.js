/**
 * Created by richardhodson on 5/26/16.
 */
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
        }
    };
//update the URL with the ID as I call it dynamically
    xhttp.open("GET","https://golf-courses-api.herokuapp.com/courses/" + id, true);
    xhttp.send();
}

getCourseInfo()