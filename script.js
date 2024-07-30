document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filters = document.querySelectorAll('.filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        tasks
            .filter(task => filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed))
            .forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div>
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                        <button class="toggle">${task.completed ? 'Unmark' : 'Complete'}</button>
                    </div>
                `;
                taskList.appendChild(li);

                li.querySelector('.delete').addEventListener('click', () => {
                    tasks = tasks.filter(t => t !== task);
                    saveTasks();
                    renderTasks();
                });

                li.querySelector('.edit').addEventListener('click', () => {
                    const newText = prompt('Edit task:', task.text);
                    if (newText !== null) {
                        task.text = newText;
                        saveTasks();
                        renderTasks();
                    }
                });

                li.querySelector('.toggle').addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                });
            });
    };

    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        const newTask = {
            text: taskInput.value,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    });

    filters.forEach(button => {
        button.addEventListener('click', () => {
            filters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filter = button.id;
            renderTasks();
        });
    });

    renderTasks();
});
