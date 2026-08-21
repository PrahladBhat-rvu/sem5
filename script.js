const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

const taskPage = document.getElementById("taskPage");
const learningPage = document.getElementById("learningPage");

const taskListButton = document.getElementById("taskListButton");
const learnedButton = document.getElementById("learnedButton");
const backButton = document.getElementById("backButton");


/* =========================
   ADD TASK
========================= */

function addTask() {

    const taskText = taskInput.value.trim();

    /* Check if input is empty */

    if (taskText === "") {

        errorMessage.textContent = "Please enter a task.";

        taskInput.focus();

        return;
    }


    /* Clear error */

    errorMessage.textContent = "";


    /* Create task container */

    const taskItem = document.createElement("div");

    taskItem.classList.add("task-item");


    /* Create checkbox */

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";


    /* Create task text */

    const taskTextElement = document.createElement("span");

    taskTextElement.textContent = taskText;


    /* Create remove button */

    const removeButton = document.createElement("button");

    removeButton.textContent = "Remove";

    removeButton.classList.add("remove-button");


    /* =========================
       COMPLETE TASK
    ========================= */

    checkbox.addEventListener("change", function () {

        if (checkbox.checked) {

            taskItem.classList.add("completed");

        } else {

            taskItem.classList.remove("completed");

        }

    });


    /* =========================
       REMOVE TASK
    ========================= */

    removeButton.addEventListener("click", function () {

        taskItem.remove();

    });


    /* Add elements to task */

    taskItem.appendChild(checkbox);

    taskItem.appendChild(taskTextElement);

    taskItem.appendChild(removeButton);


    /* Add task to list */

    taskList.appendChild(taskItem);


    /* Clear input */

    taskInput.value = "";

    taskInput.focus();
}


/* =========================
   ADD BUTTON
========================= */

addButton.addEventListener("click", addTask);


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});


/* =========================
   CLEAR ERROR WHEN TYPING
========================= */

taskInput.addEventListener("input", function () {

    if (taskInput.value.trim() !== "") {

        errorMessage.textContent = "";

    }

});


/* =========================
   SHOW TASK PAGE
========================= */

function showTaskPage() {

    taskPage.classList.remove("hidden");

    learningPage.classList.add("hidden");

}


/* =========================
   SHOW WHAT I LEARNT PAGE
========================= */

function showLearningPage() {

    taskPage.classList.add("hidden");

    learningPage.classList.remove("hidden");

}


/* =========================
   NAVIGATION
========================= */

taskListButton.addEventListener("click", showTaskPage);

learnedButton.addEventListener("click", showLearningPage);

backButton.addEventListener("click", showTaskPage);