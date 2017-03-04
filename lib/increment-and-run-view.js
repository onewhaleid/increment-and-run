'use babel';

import incrementAndRun from './increment-and-run';

export default class IncrementAndRunView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('increment-and-run');
        this.element.classList.add('inline-block');

        var createButton = function(id, action) {
            button = document.createElement('button')
            button.classList.add('inline-block', 'btn');

            var imagePath = 'atom://increment-and-run/lib/icons/'
            icon = document.createElement('img')
            icon.src = imagePath + id + '.svg'
            button.appendChild(icon)

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

        var createSelect = function(id, options) {
            select = document.createElement('select');
            select.classList.add('inline-block', 'input-select');
            select.id = id;
            select.onchange = console.log('value changed');

            for (var i = 0; i < options.length; i++) {
                var option = document.createElement('option');
                option.value = options[i];
                option.text = options[i];
                select.appendChild(option);
            }
            return select
        }

        var createTextNode = function(id, text) {
            textNode = document.createTextNode(text)
            textNode.id = id
            return textNode
        }

        // Create controls element
        const controls = document.createElement('div');
        controls.appendChild(createButton("minus", "minus"))
        controls.appendChild(createNumberInput("minus-plus", "1"))
        controls.appendChild(createButton("plus", "plus"))
        controls.appendChild(createButton("divide", "divide"))
        controls.appendChild(createNumberInput("divide-times", "1.1"))
        controls.appendChild(createButton("times", "times"))

        controls.appendChild(createTextNode("command-label", "Atom command: ", ))
        var options = atom.config.get('increment-and-run.atomCommands').trim().split(/\s*,\s*/);
        controls.appendChild(createSelect("atom-command", options))

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
