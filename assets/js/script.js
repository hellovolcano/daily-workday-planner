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
// For each item in the array, find the hour that matches and then add the name from the same index 
// at the next p tag that includes class p-desc 
var loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    // find the parent time block for the hour of each task and then add the name of the text to the p child that has p-desc as the time block
    for (var i = 0; i < tasks.length; i++) {
        $("[id='" + tasks[i].hour + "']")
            .find(".p-desc")
            .text(tasks[i].name);

       // 
    }
    
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
            .attr("id",array[i].hour); // use the time value in the array as an id -- removing this for now  + array[i].meridiem
        var hourDiv = $("<div>")
            .addClass("col-12 col-md-1 hour");
        var hourP = $("<div>")
            .addClass("mt-3")
        var hourSpan = $("<span>")
            .addClass("hour-span")
            .text(array[i].hour)
        var meridiemSpan = $("<span>")
            .addClass("meridiem-span")
            .text(array[i].meridiem)

        var descriptionDiv = $("<div>")
            .addClass("col-12 col-md-10 description");
        var descriptionP = $("<p>")
            .addClass("p-desc");
        var startButton = $("<button>")
            .addClass("col-12 col-md-1 saveBtn")
        var iconEl = $("<i>")
            .addClass("bi bi-lock-fill");

        // add icon to start button
        startButton.append(iconEl); 
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
    
    // get the ID of the task that we want to save    
    var textToSaveId = $("textarea")
        .closest(".time-block")
        .attr("id")   
    
    // get the time that this task should be associated with from the parent
    var timeId = $(this)
    .closest(".time-block")
    .attr("id")

    // p class to use to replace the textarea
    var taskP = $("<p>")
        .addClass("p-desc")
        .text(text);

    // make sure we're not deleting a task from local storage when someome clicks the save
    // button next to a p (vs an editable textarea) 
    var paraTask = taskP.text()
    
    // only save if we've clicked the same ID button as the textarea edited
    if (textToSaveId === timeId) {    
        // handle the button click when nothing is selected
        if (!text && !paraTask) {
            
            // Delete an existing task if need be

            deleteTask(timeId);
            // replace textarea with p element
            $("textarea").replaceWith(taskP);
        } else {
            

            // add tasks to an object to save them
            var task = {
                hour: timeId,
                name: text
            }

            // search to see if there is already a task associated with the time
            var findObj = tasks.findIndex(o => o.hour == timeId);
            
            if (findObj === -1) {
                // if no tasks for that time exist, go ahead and ask this task to the array
                tasks.push(task);
            } else {
                // otherwise, replace the item in the array
                tasks.splice(findObj,1,task)
            }
            
            saveTasks(tasks);
            
            
        } // replace textarea with p element
        $("textarea").replaceWith(taskP);
    }
});

// Delete a task when the user clears the text from the textarea
var deleteTask = function(timeId) {
    var findObj = tasks.findIndex(o=> o.hour == timeId);

    if (findObj !== -1) {
        // delete the item from the task array
        tasks.splice(findObj,1);
        
        //save new array to local storage
        saveTasks(tasks);
    }
}

// When the user clicks away from a task that didn't have any text in it, let's just keep that blank

$(".container").on("blur","textarea", function () {
   // if there's no text, just put in a p element
   var text = $(this)
        .val()
        .trim()

    var timeId = $(this)
        .closest(".time-block")
        .attr("id")

    var taskExists = tasks.findIndex(o=> o.hour == timeId)


   if (text === "" && taskExists == -1) {
        // recreate the p element
        var taskP = $("<p>")
            .addClass("p-desc")
            .text(text)
        // replace textarea with p element
            $(this).replaceWith(taskP);
   } else {  
        // don't save the textarea and add a red border to let the user know it's unsaved
        $(this)
            .css("border", "1px solid red")
   }
});

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




addTimeBlocks(buildWorkHourSet(workDayStart,workHoursNum));
loadTasks();



// set an interval to regularly update the coloring of the work day scheduler
setInterval(function() {
    var getTimeBlocks = document.querySelectorAll(".time-block")
 
    for (var i = 0; i < getTimeBlocks.length; i++) {
        auditTimeBlock(getTimeBlocks[i])
    }
},
600000)


