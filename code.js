"use strict"

// functions
let check = (item, _class) => item.classList.contains(_class);
let add = (item, _class) => item.classList.add(_class);
let remove = (item, _class) => item.classList.remove(_class);
let toggle = (item, _class) => check(item, _class) ? remove(item, _class) : add(item, _class);

let toggleThemeBtn = document.querySelector(".theme-toggle");
let theme = localStorage.getItem("theme");

theme ? add(document.body, theme) : add(document.body, "light");



//event listners
toggleThemeBtn.addEventListener("click", (e) => {
    if (check(document.body, "light")) {
        document.body.classList.replace("light", "dark");
        localStorage.setItem("theme", "dark");

    }
    else {
        document.body.classList.replace("dark", "light");
        localStorage.setItem("theme", "light");
    }
})




