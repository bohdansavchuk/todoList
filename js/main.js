document.addEventListener("DOMContentLoaded", function(){
    "use strict";

    const todoControl = document.querySelector(".todo-control"), 
        todoList = document.getElementById("todo"),
        todoCompleted = document.getElementById("completed"),
        headerInput = document.querySelector(".header-input");

    // создаем обьект
    let data = {
        todo: [],
        completed: []
    };

    
    // проверяем LocalStorage на наличие данных
    if (localStorage.getItem("localData")) {
        data = JSON.parse(localStorage.getItem("localData"));
    }

    // функция, которая рендерит наши данные, если они есть в LocalStorage
    const renderItemsForUpdate = function() {
        if(!data.todo.length && !data.completed.length) return;

        for(let i = 0; i < data.todo.length; i++) {
            renderItem(data.todo[i]);
        }

        for(let i = 0; i < data.completed.length; i++) {
            renderItem(data.completed[i], true);
        }
          
    };

    // функция, которая пишет в LocalStorage
    const dataUpdateToLocalS = function() {
        localStorage.setItem("localData", JSON.stringify(data));
    };
    
    // функция, которая добавляет элемент на страницу
    const addItem = function (text) {
        renderItem(text);
        headerInput.value = "";
        data.todo.push(text);

        dataUpdateToLocalS();
    };

    // функция удаляет один элемент
    const itemRemove = function (elem) {
        const item = elem.parentNode.parentNode;
        const itemParent = item.parentNode;
        const id = itemParent.id;
        const text = item.textContent;

        if(id === "todo") {
            data.todo.splice(data.todo.indexOf(text), 1);
        } else {
            data.completed.splice(data.todo.indexOf(text), 1);
        }

        itemParent.removeChild(item);

        dataUpdateToLocalS();
    };

    // функция переносит элементы
    const itemComplete = function (elem) {
        const item = elem.parentNode.parentNode;
        const itemParent = item.parentNode;
        const id = itemParent.id;
        const text = item.textContent;

        let target;

        if (id === "todo") {
            target = todoCompleted;
        } else {
            target = todoList;
        }

        if(id === "todo") {
            data.todo.splice(data.todo.indexOf(text), 1);
            data.completed.push(text);
        } else {
            data.completed.splice(data.todo.indexOf(text), 1);
            data.todo.push(text);
        }

        itemParent.removeChild(item);
        target.insertBefore(item, target.childNodes[0]);

        dataUpdateToLocalS();
    };

    // функция рендеринга одного элемента
    const renderItem = function (text, completed = false) {
        const item = document.createElement("li");
        const btnBlock = document.createElement("div");
        const btnRemove = document.createElement("button");
        const btnComplete = document.createElement("button");

        let list = todoList;
        if(completed) {
            list = todoCompleted;
        } else {
            list = todoList;
        }

        item.classList.add("todo-item");
        btnBlock.classList.add("todo-buttons");
        btnRemove.classList.add("todo-remove");
        btnComplete.classList.add("todo-complete");

        btnRemove.addEventListener("click", function (event){
            itemRemove(event.target);
        });

        btnComplete.addEventListener("click", function (event){
            itemComplete(event.target);
        });

        item.textContent = text;

        btnBlock.appendChild(btnRemove);
        btnBlock.appendChild(btnComplete);
        item.appendChild(btnBlock);

    
        list.insertBefore(item, list.childNodes[0]);
    
    };

    // обработчик сабмита
    todoControl.addEventListener("submit", function(event){
        event.preventDefault();
        
        if(headerInput.value !== "") {
            addItem(headerInput.value.trim());
        }
    });

    // вызов функции, которая при наличии даних в сторадже, отрендерит их
    renderItemsForUpdate();
 
 
});