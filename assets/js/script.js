// Set the start of the work day to 9 am
var workDayStart = {
    hour: 9,
    meridiem: "AM"
}

// Specify the number of hours to work in a given day
var workHoursNum = 9;

// Build an array of objects to store the work hour set
var buildWorkHourSet = function(startTime,hours) {
    var workHourSet = [];
    for (var i = 0; i < hours; i++) {
        var newHour = startTime.hour + i;
        if (newHour < 12) {
            var newMeridiem = "AM"
        } else if (newHour == 12) {
            newMeridiem = "PM" 
        } else {
            newHour -= 12;
            newMeridiem = "PM"
        }
        workHourSet.push({
            hour: newHour,
            meridiem: newMeridiem
        })
    }
    return workHourSet;
}

// Display current day in the header
var currentTime = luxon.DateTime.now().toFormat('MMMM dd, yyyy')
$("#currentDay").text(currentTime);

var workHourSet = buildWorkHourSet(workDayStart, workHoursNum);

// Build out the calendar
var addTimeBlocks = function (array) {

    // grab the container to which we add time blocks
    var containerDiv = $(".container");

    for (var i = 0; i < array.length; i++) {
        // create a time block for each hour in the working hours array
        var timeBlock = $("<div>")
            .addClass("time-block row")
            .attr("id",array[i].hour + array[i].meridiem); // use the time value in the array as an id
        var hourDiv = $("<div>")
            .addClass("col-1 hour text-right");
        var hourP = $("<p>")
        var hourSpan = $("<span>")
            .addClass("hour-span")
            .text(array[i].hour)
        var meridiemSpan = $("<span>")
            .addClass("meridiem-span")
            .text(array[i].meridiem)

        var descriptionDiv = $("<div>")
            .addClass("col-10 description");
        var descriptionP = $("<p>");
        
        var startButton = $("<button>")
            .addClass("col-1 saveBtn")
            .text('<i class="bi bi-lock-fill"></i>');

        // append spans to hourP
        hourP.append(hourSpan,meridiemSpan)    

        // append nested p to parent divs
        hourDiv.append(hourP);
        descriptionDiv.append(descriptionP);

        // append top-level elements to the time block div
        timeBlock.append(hourDiv, descriptionDiv, startButton);

        // append to container
        containerDiv.append(timeBlock);

        // add correct coloring to time blocks
        auditTimeBlock(timeBlock);
    }
}

// Audit the time of day for proper coloring
var auditTimeBlock = function(timeBlock) {
    // get current hour
    var currentHour = luxon.DateTime.now().hour;
    var hourToCompare = $(timeBlock).find(".hour-span").text();
    console.log(hourToCompare);
    // Add 12 hours here if the time is 1PM or later for an easier comparison
    if (hourToCompare >= 1 && hourToCompare <= 5) {
        hourToCompare = parseInt(hourToCompare) + 12;
        console.log(hourToCompare)
    }
    
    var descriptionDiv = $(timeBlock)
    .find(".description")
    if (hourToCompare < currentHour) {
        descriptionDiv.addClass("past")
        .removeClass("present")
        .removeClass("future")
    } else if (hourToCompare == currentHour) {
        descriptionDiv.addClass("present")
        .removeClass("past")
        .removeClass("future")
    } else {
        descriptionDiv.addClass("future")
        .removeClass("past")
        .removeClass("present")
        }

}
// Load tasks from local storage

// Edit the work day time block

// Save the work day time block

addTimeBlocks(buildWorkHourSet(workDayStart,workHoursNum));


// set an interval to regularly update the coloring of the work day scheduler