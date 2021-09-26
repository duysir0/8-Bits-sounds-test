import {join}  from 'path';
import {
    window,
    Disposable,
    workspace,
    TextEditorSelectionChangeEvent,
    TextDocumentChangeEvent,
} from 'vscode';
import debounce = require('lodash.debounce');
import { PlayerConfig } from './player';

let isArrowKey: boolean = true;



export class EditorListener {
    private _isActive: boolean;
    private _disposable: Disposable;
    private _subscriptions: Disposable[] = [];
    private _basePath: string = join(__dirname, '..');

    private _deleteAudio: string = "";
    private _pasteAudio: string = "";
    private _arrowsAudio: string = "";
    private _enterAudio: string = "";
    private _spaceAudio: string = "";
    private _otherKeysAudio: string = "";
    private _tabAudio: string = "";
    private _opanBracketAudio: string = "";
    private _closeBracketAudio: string = "";
    private _chavesAudio: string = "";
    

    constructor(private player: any, isActive: boolean, configuration: PlayerConfig) {
        this._disposable = Disposable.from(...this._subscriptions);
        this._isActive = isActive;
        
        if(!this._isActive){return;}
        
        this._loadAudioFiles();
        this.player = {
            play: (filePath: string) => player.play(filePath, configuration)
        };
        
        workspace.onDidChangeTextDocument(this._keystrokeCallback, this, this._subscriptions);
        window.onDidChangeTextEditorSelection(this._arrowKeysCallback, this, this._subscriptions);
        window.showInformationMessage('8-Bits Sounds is ready');
    }

    _keystrokeCallback = debounce((event: TextDocumentChangeEvent) => {
        if (event.contentChanges.length === 0 || !this._isActive){ return; }

        let activeEditor = this.getActiveEditor()
        
        if (activeEditor!= undefined && event.document !== activeEditor.document ) { return; }

        isArrowKey = false;
        
        let pressedKey = event.contentChanges[0].text;
        this.playAudioByKey(pressedKey);
    }, 100, { leading: true });

    _arrowKeysCallback = debounce((event: TextEditorSelectionChangeEvent) => {
        if(!this._isActive){return;}
        const currentEditor = this.getActiveEditor();

        if (!currentEditor || currentEditor.document !== event.textEditor.document) { return; }

        // check if there is no selection
        if (currentEditor.selection.isEmpty && isArrowKey) {
            this.player.play(this._arrowsAudio);
            return;
        }
        isArrowKey = true;
        
    }, 100, { leading: true });

    playAudioByKey(pressedKey: string){
        switch (pressedKey) {
            case '[]':
            case '()':
            case '[':
            case '(':
                this.player.play(this._opanBracketAudio);
                break;
            case ']':
            case ')':
                this.player.play(this._closeBracketAudio);
                break;
            case '{}':
            case '{':
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
    }

    getActiveEditor(){
        return window.activeTextEditor 
    }

    enable(){
        this._isActive = true;
    }
    desable(){
        this._isActive = false;
    }

    _loadAudioFiles(){
        this._deleteAudio= join(this._basePath, 'audio', 'backspace.wav');
        this._enterAudio=  join(this._basePath, 'audio', 'key_var_1.wav');
        this._pasteAudio= join(this._basePath, 'audio', 'key_var_2.wav');
        this._arrowsAudio= join(this._basePath, 'audio', 'key_var_3.wav');
        this._tabAudio= join(this._basePath, 'audio', 'key_var_4.wav');
        this._spaceAudio= join(this._basePath, 'audio', 'key_var_5.wav');      
        this._otherKeysAudio= join(this._basePath, 'audio', 'key_var_6.wav');
        this._opanBracketAudio= join(this._basePath, 'audio', 'bracket.wav');
        this._closeBracketAudio= join(this._basePath, 'audio', 'close_bracket.wav');
        this._chavesAudio= join(this._basePath, 'audio', 'chaves.wav');
    }

    dispose() {
        this._disposable.dispose();
    }
}
