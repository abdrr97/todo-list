"use strict";

// functions

let check = (item, _class) => item.classList.contains(_class);

let add = (item, _class) => item.classList.add(_class);

let remove = (item, _class) => item.classList.remove(_class);

let toggle = (item, _class) =>
  check(item, _class) ? remove(item, _class) : add(item, _class);

let updateListDom = (list, domElement, activeList, filterType) => {
  if (!list.length) {
    domElement.innerHTML = `
        <li class="list-item empty">The Todo list is empty add more tasks</li>
        `;
  } else {
    domElement.innerHTML = `
        ${list
          .map((item) => {
            return `<li class="list-item ${
              item.state ? `list-item--completed` : ``
            }">
          <div class="checkmark checkmark-item"></div>
          <p>${item.text}</p>
          <i class="fas fa-times delete-item"></i>
        </li>`;
          })
          .join("")}`;
  }
  domElement.insertAdjacentHTML(
    "beforeend",
    `<ul class="list-control">
          <li class="list-control__item">${activeList.length} items left</li>
          <ul class="items-categories items-categories-desktop">
            <li class="items-categories__item ${
              filterType === "All" ? "items-categories--selected" : ""
            }">All</li>
            <li class="items-categories__item ${
              filterType === "Active" ? "items-categories--selected" : ""
            }">Active</li>
            <li class="items-categories__item ${
              filterType === "Completed" ? "items-categories--selected" : ""
            }">Completed</li>
          </ul>
          <li class="list-control__item clear-completed-items">Clear Completed</li>
        </ul>`
  );
};

let updateListData = () => {
  activeList = list.filter((item) => {
    return item.state === false;
  });
  completedList = list.filter((item) => {
    return item.state === true;
  });
};
//dom elements

let theList = document.querySelector(".list");

let toggleThemeBtn = document.querySelector(".theme-toggle");

let listElement = document.querySelector(".list");

let inputNewItem = document.querySelector(".new-item input");

//drag and deop

let sortable = Sortable.create(theList);

//local storage

let list = localStorage.getItem("list");

let theme = localStorage.getItem("theme");

theme ? add(document.body, theme) : add(document.body, "light");

list = list ? JSON.parse(list) : [];

//variables
let filter = "All";

let activeList = [];

let completedList = [];

//main

updateListData();

updateListDom(list, theList, activeList, filter);

//event listners

//toggle themes
toggleThemeBtn.addEventListener("click", () => {
  if (check(document.body, "light")) {
    document.body.classList.replace("light", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.replace("dark", "light");
    localStorage.setItem("theme", "light");
  }
});

//add item
inputNewItem.addEventListener("keyup", (e) => {
  if (e.keyCode == 13 && e.target.value) {
    list.push({ text: e.target.value, state: false });
    localStorage.setItem("list", JSON.stringify(list));
    updateListData(list, activeList, completedList);
    updateListDom(list, theList, activeList, filter);
    e.target.value = "";
  }
});

// item events
document.addEventListener("click", (e) => {
  let allItems = [...document.querySelectorAll(".list-item")];
  let index = allItems.indexOf(e.target.parentElement);

  //complete item
  if (check(e.target, "checkmark-item")) {
    list[index].state = list[index].state ? false : true;
    localStorage.setItem("list", JSON.stringify(list));
    updateListData();
    updateListDom(list, theList, activeList, filter);
  }

  //delete item
  else if (check(e.target, "delete-item")) {
    list.splice(index, 1);
    localStorage.setItem("list", JSON.stringify(list));
    updateListData();
    updateListDom(list, theList, activeList, filter);
  }

  //clear completed items
  else if (check(e.target, "clear-completed-items")) {
    list = [...activeList];
    localStorage.setItem("list", JSON.stringify(list));
    updateListData();
    updateListDom(list, theList, activeList, filter);
  }

  //filter
  else if (check(e.target, "items-categories__item")) {
    [...document.querySelectorAll(".items-categories__item")].forEach(
      (item) => {
        remove(item, "items-categories--selected");
      }
    );
    add(e.target, "items-categories--selected");
    filter = e.target.textContent;

    if (filter === "All") {
      updateListDom(list, theList, activeList, filter);
    } else if (filter === "Active") {
      updateListDom(activeList, theList, activeList, filter);
    } else if (filter === "Completed") {
      updateListDom(completedList, theList, activeList, filter);
    }
  }
});
