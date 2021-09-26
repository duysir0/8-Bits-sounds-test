// Thes module 'vcode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { isContext } from 'vm';
import debounce = require('lodash.debounce');
import player, { PlayerConfig } from './player';

let listener: EditorListener;
let isActive: boolean;
let isNotArrowKey: boolean;
let config: PlayerConfig = {
    macVol: 1,
    winVol: 100,
    linuxVol: 100
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Initializing "8bit-sounds" extension');

    // is the extension activated? yes by default.
    isActive = context.globalState.get('8bit_sounds', true);
    config.macVol = context.globalState.get('mac_volume', 1);
    config.winVol = context.globalState.get('win_volume', 100);
    config.linuxVol = context.globalState.get('linux_volume', 1);

    // to avoid multiple different instances
    listener = listener || new EditorListener(player);
    
    vscode.commands.registerCommand('8bit_sounds.enable', () => {
        if(isActive){
            vscode.window.showWarningMessage('8bit Sounds extension is already enabled');
            return;
        }
        context.globalState.update('8bit_sounds', true);
        isActive = true;
        vscode.window.showInformationMessage('8bit Sounds extension enabled');
    });
    vscode.commands.registerCommand('8bit_sounds.disable', () => {
        if(!isActive){
            vscode.window.showWarningMessage('8bit Sounds extension is already disabled');
            return;
        }
        context.globalState.update('8bit_sounds', false);
        isActive = false;
        vscode.window.showInformationMessage('8bit Sounds extension disabled');

    });

    vscode.commands.registerCommand('8bit_sounds.volumeUp', () => {
        let newVol = null;

        switch (process.platform) {
            case 'darwin':
                config.macVol += 1;

                if(config.macVol > 10){
                    vscode.window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.macVol = 10;
                }

                newVol = config.macVol;
                context.globalState.update('mac_volume', newVol);
                break;

            case 'win32':
                config.winVol += 10;

                if(config.winVol > 100){
                    vscode.window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.winVol = 100;
                }

                newVol = config.winVol;
                context.globalState.update('win_volume', newVol);
                break;

            case 'linux':
                config.linuxVol += 1;

                if(config.linuxVol > 10){
                    vscode.window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.linuxVol = 10;
                }

                newVol = config.linuxVol;
                context.globalState.update('linux_volume', newVol);
                break;

            default:
                newVol = 0;
                break;
        }

        vscode.window.showInformationMessage('8bit Sounds volume raised: ' + newVol);
    });

    vscode.commands.registerCommand('8bit_sounds.volumeDown', () => {
        let newVol = null;

        switch (process.platform) {
            case 'darwin':
                config.macVol -= 1;

                if(config.macVol < 1){
                    vscode.window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.macVol = 1;
                }

                newVol = config.macVol;
                context.globalState.update('mac_volume', newVol);
                break;

            case 'win32':
                config.winVol -= 10;

                if(config.winVol < 10){
                    vscode.window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.winVol = 10;
                }

                newVol = config.winVol;
                context.globalState.update('win_volume', newVol);
                break;

            case 'linux':
                config.linuxVol -= 1;

                if(config.linuxVol < 1){//TODO: maybe show the message if the volumn is already 1 and break;
                    vscode.window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.linuxVol = 1;
                }

                newVol = config.linuxVol;
                context.globalState.update('linux_volume', newVol);
                break;

            default:
                newVol = 0;
                break;
        }

        vscode.window.showInformationMessage('8bit Sounds volume lowered: ' + newVol);
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(listener);

}

// this method is called when your extension is deactivated
export function deactivate() {}

// Listen to editor changes and play a sound when a key is pressed.
export class EditorListener {
    private _disposable: vscode.Disposable;
    private _subscriptions: vscode.Disposable[] = [];
    private _basePath: string = path.join(__dirname, '..');

    // Audio files
    private _deleteAudio: string = path.join(this._basePath, 'audio', 'backspace.wav');
    private _pasteAudio: string = path.join(this._basePath, 'audio', 'key_var_2.wav');
    private _otherKeysAudio: string = path.join(this._basePath, 'audio', 'key_var_6.wav');
    private _enterAudio: string = path.join(this._basePath, 'audio', 'key_var_4.wav');
    private _spaceAudio: string = path.join(this._basePath, 'audio', 'key_var_5.wav');
    private _tabAudio: string = path.join(this._basePath, 'audio', 'key_var_5.wav');
    private _arrowsAudio: string = path.join(this._basePath, 'audio', 'key_var_3.wav');
    private _opanBracketAudio: string = path.join(this._basePath, 'audio', 'bracket.wav');
    private _closeBracketAudio: string = path.join(this._basePath, 'audio', 'close_bracket.wav');
    private _chavesAudio: string = path.join(this._basePath, 'audio', 'chaves.wav');

    constructor(private player: any) {
        isNotArrowKey = false;
        vscode.window.showInformationMessage('Loading');
        
        vscode.workspace.onDidChangeTextDocument(this._keystrokeCallback, this, this._subscriptions);
        vscode.window.onDidChangeTextEditorSelection(this._arrowKeysCallback, this, this._subscriptions);
        this._disposable = vscode.Disposable.from(...this._subscriptions);
        this.player = {
            play: (filePath: string) => player.play(filePath, config)
        };
    }

    _keystrokeCallback = debounce((event: vscode.TextDocumentChangeEvent) => {
        if (!isActive){ return; }

        let activeDocument = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
        if (event.document !== activeDocument || event.contentChanges.length === 0) { return; }

        isNotArrowKey = true;
        let pressedKey = event.contentChanges[0].text;

        switch (pressedKey) { // TODO: get off of this switch cae
            case '[]':
            case '()':
                this.player.play(this._opanBracketAudio);
                break;
            case ']':
            case ')':
                this.player.play(this._closeBracketAudio);
                break;
            case '{}':
            case '}':
                this.player.play(this._chavesAudio);

            case '': // text cut or backspace
                this.player.play(this._deleteAudio);
                break;
                // if(event.contentChanges[0].rangeLength === 1){
                
            case ' ': // space bar pressed
                
                this.player.play(this._spaceAudio);
                break;

            case '\n': // enter pressed
                this.player.play(this._enterAudio);
                break;

            case '\t': // tab pressed
            case '  ':
            case '    ':
                this.player.play(this._tabAudio);
                break;

            default:
                let textLength = pressedKey.trim().length;
                
                if(textLength === 0){
                    this.player.play(this._enterAudio);
                    return;
                }
                if(textLength === 1){
                    this.player.play(this._otherKeysAudio);
                    return;
                }
                this.player.play(this._pasteAudio);
                return;
        }
    }, 30, { leading: true });

    _arrowKeysCallback = debounce((event: vscode.TextEditorSelectionChangeEvent) => {
        if (!isActive){ return; }

        // current editor

        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== event.textEditor.document) { return; }

        // check if there is no selection
        if (editor.selection.isEmpty && !isNotArrowKey) {
            this.player.play(this._arrowsAudio);
            return;
        }
        isNotArrowKey = false;
        
    }, 30, { leading: true });

    dispose() {
        this._disposable.dispose();
    }
}
