function removeTask(taskElement) {
  const request = new XMLHttpRequest();
  const id = taskElement.dataset.taskId;

  request.open('DELETE', 'tasks/' + id, true);
  request.onload = (event) => {
    if (request.status === 200) {
      taskElement.parentElement.removeChild(taskElement);
    }
  }
  request.send();
}

function toggleTask(taskElement) {
  let taskStatus = taskElement.dataset.taskStatus || 'open';
  taskStatus = (taskStatus === 'open' ? 'done' : 'open');

  const request = new XMLHttpRequest();
  const id = taskElement.dataset.taskId;
  request.open('PATCH', 'tasks/' + id, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = (event) => {
    if (request.status === 200) {
      taskElement.dataset.taskStatus = taskStatus;
    }
  }
  request.send(JSON.stringify({status: taskStatus }));
}

function initButtons(selector, callback) {
  const collection = document.querySelectorAll(selector);

  for (let i = 0; i < collection.length; i++) {
    const element = collection[i];
    const taskElement = element.parentElement;
    element.addEventListener("click", () => callback(taskElement));
  }
}

initButtons('.toggle-task', toggleTask);
initButtons('.remove-task', removeTask);
