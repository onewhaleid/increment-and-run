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
        // Find start of selected number
        editor.moveLeft(1)
        editor.moveRight(1)
        editor.selectToBeginningOfWord()
        var selection = editor.getSelectedText()
        while (/-|[0-9]|\./.test(selection) && selection.length > 0) {
            editor.moveLeft(1)
            editor.selectLeft(1)
            selection = editor.getSelectedText()
        }
        // Ignore invalid character at start of string
        editor.moveRight(1)

        // Find end of selected umber
        editor.selectToEndOfWord()
        selection = editor.getSelectedText()
        while (/(-|[0-9]|\.)$/.test(selection)) {
            editor.selectRight(1)
            // Break if we have found the end of the string
            if (editor.getSelectedText().length == selection.length) {
                break
            }
            selection = editor.getSelectedText()
        }

        // Remove last character if not valid
        if (!/[0-9]|\./.test(selection.slice(-1))) {
            editor.selectLeft(1)
        }

        // Get precision of number
        decimal_value = selection.match(/(?!\.)[0-9]*$/)
        precision = decimal_value[0].length

        // Read selected number
        var old_val = Number(editor.getSelectedText())

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
        console.log('increment-and-run was toggled!');
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    }
};
