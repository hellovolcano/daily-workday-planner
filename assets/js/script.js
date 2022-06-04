// Initializing empty array
var tasks = [];

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
        var descriptionP = $("<p>")
            .addClass("p-desc");
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
// Edit a task time block
$(".container").on("click", "p", function() {
    var text = $(this)
      .text()
      .trim();

    var textInput = $("<textarea>")
      .addClass("edit-task")
      .val(text);

    // swap in a textarea for the p element
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
  });

// Save the task when the user clicks the save button
$(".container").on("click","button", function () {
    
    var text = $("textarea")
    .val()
    // handle the button click when nothing is selected
    console.log(typeof(text))
    if (!text) {
        return;
    } else {
        var taskP = $("<p>")
        .addClass("p-desc")
        .text(text);
    
        // get the time that this task should be associated with from the parent
        var timeId = $(this)
        .closest(".time-block")
        .attr("id")
        // add tasks to an object to save them
        var task = {
            hour: timeId,
            name: text
        }
        console.log(task)
        debugger;
        // search to see if there is already a task associated with the time
        var findObj = tasks.findIndex(o => o.hour == timeId);
        
        if (findObj === -1) {
            // if no tasks for that time exist, go ahead and ask this task to the array
            tasks.push(task);
        } else {
            // otherwise, replace the item in the array
            tasks.splice(findObj,1,task)
        }
        console.log(tasks)
        saveTasks(tasks);
        // replace textarea with p element
        $("textarea").replaceWith(taskP);
        
    }
    
}); 

// When the user clicks away from the task, just replace it with the p and do nothing else
// $(".container").on("blur","textarea", function () {
//     // get the textarea's current value
//     var text = $(this)
//         .val()
//         .trim()
    
//     // recreate the p element
//     var taskP = $("<p>")
//         .addClass("p-desc")
//         .text(text)
        
//     // replace textarea with p element
//     $(this).replaceWith(taskP);

// });

// Audit the time of day for proper coloring
var auditTimeBlock = function(timeBlock) {
    // get current hour
    var currentHour = luxon.DateTime.now().hour;
    var hourToCompare = $(timeBlock).find(".hour-span").text();

    // Add 12 hours here if the time is 1PM or later for an easier comparison
    if (hourToCompare >= 1 && hourToCompare <= 5) {
        hourToCompare = parseInt(hourToCompare) + 12;
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
// Save the work day time block
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage

addTimeBlocks(buildWorkHourSet(workDayStart,workHoursNum));


// set an interval to regularly update the coloring of the work day scheduler