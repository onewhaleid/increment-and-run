'use babel';

import IncrementAndRunView from './increment-and-run-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    incrementAndRunView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.incrementAndRunView = new IncrementAndRunView(state.incrementAndRunViewState);
        this.modalPanel = atom.workspace.addBottomPanel({
            item: this.incrementAndRunView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'increment-and-run:toggle': () => this.toggle(),
            'increment-and-run:minus': () => this.minus(),
            'increment-and-run:plus': () => this.plus(),
            'increment-and-run:divide': () => this.divide(),
            'increment-and-run:times': () => this.times()
        }));
    },


    increment(operation) {
        let editor = atom.workspace.getActiveTextEditor()

        // Move to end of current selection
        editor.moveRight(1)

        // Find start of selected number
        var left_length = -1
        var character = '0'
        while (/[0-9]|\./.test(character) && character.length > 0) {
            editor.moveLeft(1)
            editor.selectLeft(1)
            var character = editor.getSelectedText()
            left_length += 1
        }

        // Check if sign is negative
        if (character === '-') {
            left_length += 1
            editor.moveLeft(1)
        } else {
            editor.moveRight(1)
        }

        // Move back to original insertion point
        editor.moveRight(left_length)

        // Find end of selected number
        var right_length = -1
        var character = '0'
        editor.moveLeft(1)
        while (/[0-9]|\./.test(character) && character.length > 0) {
            editor.moveRight(1)
            editor.selectRight(1)
            var character = editor.getSelectedText()
            right_length += 1
        }

        // Move left one character if end of line not reached
        if (character.length > 0) {
            editor.moveLeft(1)
        }

        // Select whole number
        editor.selectLeft(right_length + left_length)

        // Return if no valid number found
        if (right_length + left_length === 0) {
            return
        }

        var selection = editor.getSelectedText()

        // Get precision of number
        is_integer = !/\./.test(selection)
        if (is_integer) {
            precision = 0
        } else {
            decimal_value = selection.match(/(?!\.)[0-9]*$/)
            precision = decimal_value[0].length
        }

        // Read selected number
        var old_val = Number(selection)

        switch (operation) {
            case "minus":
                x = Number(document.getElementById('minus-plus').value)
                new_val = old_val - x
                break;
            case "plus":
                x = Number(document.getElementById('minus-plus').value)
                new_val = old_val + x
                break;
            case "divide":
                x = Number(document.getElementById('divide-times').value)
                new_val = old_val / x
                break;
            case "times":
                x = Number(document.getElementById('divide-times').value)
                new_val = old_val * x
                break;
            default:
                new_val = old_val
        }

        // Round result back to original precision
        new_val = Math.round(new_val * Math.pow(10, precision)) / Math.pow(10, precision)

        // Update value in editor
        editor.insertText(new_val.toString())

        // Send command
        atomCommandString = document.getElementById('atom-command').value
        if (atomCommandString !== 'none') {
            editor = atom.views.getView(atom.workspace.getActiveTextEditor())
            atom.commands.dispatch(editor, atomCommandString);
        }
    },

    minus() {
        this.increment("minus")
    },

    plus() {
        this.increment("plus")
    },

    divide() {
        this.increment("divide")
    },

    times() {
        this.increment("times")
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.incrementAndRunView.destroy();
    },

    serialize() {
        return {
            incrementAndRunViewState: this.incrementAndRunView.serialize()
        };
    },

    toggle() {
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    }
};
