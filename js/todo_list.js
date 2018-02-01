window.onload = init;
var LOCAL_STORAGE_KEY_TASKS = "todo.oliverstreuli.ch_tasks";

function init() {
	// Navigation
	$('#navigation a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	})

	// Form
	$(function() {
		$("#form_input_date").datepicker({ dateFormat: "dd.mm.yy" });
	});
	$("#form_button_create").click(createTask);

	// Tasks
	loadTasks();
}

// TODO List
// -----------------------------------------------------------------------------
function createTask() {
	var task = {
		title:			$('#form_input_title').val(),
		date:				$('#form_input_date').val(),
		priority:		$('#form_select_priority').val(),
		description:	$('#form_textarea_description').val(),
		done:				false,
		id:				generateGUID()
	};

	if (task.title && task.date && task.priority) {
		var tasks = getLocalStorageItem(LOCAL_STORAGE_KEY_TASKS);
		tasks.push(task);
		setLocalStorageItem(LOCAL_STORAGE_KEY_TASKS, tasks);
	}
}

function completeTask(taskId) {
	var tasks = getLocalStorageItem(LOCAL_STORAGE_KEY_TASKS);
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == taskId) {
			tasks[i].done = true;
			break;
		}
	}
	setLocalStorageItem(LOCAL_STORAGE_KEY_TASKS, tasks);
	loadTasks();
}

function deleteTask(taskId) {
	var tasks = getLocalStorageItem(LOCAL_STORAGE_KEY_TASKS);
	var newTasks = new Array();

	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id != taskId) {
			newTasks.push(tasks[i]);
		}
	}

	setLocalStorageItem(LOCAL_STORAGE_KEY_TASKS, newTasks);
	loadTasks();
}

function loadTasks() {
	var tasks = getLocalStorageItem(LOCAL_STORAGE_KEY_TASKS);
	tasks.sort(sortTaskByDateAndPriority);

	var tasksTodo = new Array();
	var tasksDone = new Array();

	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].done)
			tasksDone.push(tasks[i]);
		else
			tasksTodo.push(tasks[i]);
	}

	$( "#taskListTodo" ).html(
		$( "#taskTemplate" ).render( tasksTodo )
	);
	$( "#taskListDone" ).html(
		$( "#taskTemplate" ).render( tasksDone )
	);
}

function sortTaskByDateAndPriority(a, b) {
	// sort by date
	var sort = getDate(a.date).getTime() - getDate(b.date).getTime();

	// sort by priority
	if (sort == 0) {
		if (a.priority == b.priority)
			sort = 0;
		else if ( (a.priority == "high") || (a.priority == "medium " && b.priority == "low"))
			sort = -1;
		else
			sort = 1;
	}

	return sort;
}

function getDate(strDate) {
	var splits = strDate.split(".");
	return new Date(splits[2], splits[1], splits[0]);
}

function generateGUID() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Local Storage
// -----------------------------------------------------------------------------
function getLocalStorageItem(key) {
	var value = localStorage.getItem(key);
	return !value ? new Array() : JSON.parse(value);
}

function setLocalStorageItem(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}