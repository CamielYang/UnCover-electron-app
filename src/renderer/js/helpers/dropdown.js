/* listItems array example
const dropdownItems = [
    {
        "name": "Timer",
        "function": this.renderTimer
    },
    {
        "name": "Stopwatch",
        "function": function() {
            this.renderStopWatch();
        }.bind(this),
    }
];
*/


export const Dropdown = (function() {
    function createDropdownList(element, listItems, activeIndex = 0) {
        element.innerHTML += `
            <button class="material-icons icon-button">
                expand_more
            </button>
            <div class="dropdown-content"><ul></ul></div>
            <h3>${listItems[activeIndex].name}</h3>
        `;
        const dropdownUl = element.querySelector(".dropdown-content ul");

        listItems.forEach(item => {
            const itemLi = document.createElement("li");
            const itemButton = document.createElement("button");
            itemButton.textContent = item.name; item.name;
            itemButton.className = "text-button";

            itemButton.onclick = function() {
                updateActive(element, itemButton.textContent);
                item.function ? item.function() : null;
            };

            itemLi.appendChild(itemButton);
            dropdownUl.appendChild(itemLi);
        });
    }

    function updateActive(element, id) {
        element.querySelector("h3").innerHTML = id;
    }

    return {
        createDropdownList
    };
})();
