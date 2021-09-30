"use strict";
var containerListArray = null;
var init = function () {
    console.log("init");
    containerListArray = Array.from(document.getElementsByClassName("container-list"));
    window.addEventListener("keydown", function (e) {
        console.log(e);
        var key = e.code;
        key = key.replace("Key", "");
        key = key.replace("Digit", "");
        console.log(key);
        key = key.toLowerCase();
        console.log(key);
        var keyEl = null;
        console.log("押されたキー");
        console.log(key);
        containerListArray.find(function (el) {
            if (el.dataset.key == key) {
                keyEl = el;
                console.log("ある");
                showKey(keyEl);
            }
        });
    });
};
var showKey = function (el) {
    el.classList.add("is-active");
};
window.onload = function () {
    init();
};
