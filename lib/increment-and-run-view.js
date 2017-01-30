'use babel';

import incrementAndRun from './increment-and-run';

export default class IncrementAndRunView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('increment-and-run');
        this.element.classList.add('inline-block');

        var createButton = function(id, value, action) {
            button = document.createElement('button')
            button.classList.add('inline-block', 'btn');
            button.innerHTML = value
            button.onclick = () => incrementAndRun[action]()
            button.id = id
            return button
        }

        var createNumberInput = function(id, value) {
            input = document.createElement('input')
            input.classList.add('inline-block', 'input-number');
            input.value = value
            input.id = id
            return input
        }

        var createTextInput = function(id, value) {
            input = document.createElement('input')
            input.classList.add('inline-block', 'input-text');
            input.placeholder = value
            input.id = id
            return input
        }

        // Create controls element
        const controls = document.createElement('div');
        controls.appendChild(createButton("minus", "-", "minus"))
        controls.appendChild(createNumberInput("minus-plus", "1"))
        controls.appendChild(createButton("plus", "+", "plus"))
        controls.appendChild(createButton("divide", "&divide", "divide"))
        controls.appendChild(createNumberInput("divide-times", "1.1"))
        controls.appendChild(createButton("times", "&times", "times"))
        controls.appendChild(createTextInput("atom-command", "package:command"))

        this.element.appendChild(controls);

    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

}
