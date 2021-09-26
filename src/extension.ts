'use strict';

import { window,ExtensionContext, commands} from 'vscode';
import { EditorListener } from './EditorListener';
import player, { PlayerConfig } from './player';

let listener: EditorListener;
let isActive: boolean;

let config: PlayerConfig = {
    macVol: 1,
    winVol: 100,
    linuxVol: 100
};


export function activate(context: ExtensionContext) {
    console.log('Initializing "8bit-sounds" extension');

    // is the extension activated? yes by default.
    isActive = context.globalState.get('8bit_sounds', true);
    config.macVol = context.globalState.get('mac_volume', 1);
    config.winVol = context.globalState.get('win_volume', 100);
    config.linuxVol = context.globalState.get('linux_volume', 1);

    // to avoid multiple different instances
    listener = listener || new EditorListener(player, isActive, config);
    
    commands.registerCommand('8bit_sounds.enable', () => {
        // if(isActive){
        //     window.showWarningMessage('8bit Sounds extension is already enabled');
        //     return;
        // }
        context.globalState.update('8bit_sounds', true);
        listener.enable();
        window.showInformationMessage('8bit Sounds extension enabled');
    });
    commands.registerCommand('8bit_sounds.disable', () => {
        // if(!isActive){
        //     window.showWarningMessage('8bit Sounds extension is already disabled');
        //     return;
        // }
        context.globalState.update('8bit_sounds', false);
        listener.desable();
        window.showInformationMessage('8bit Sounds extension disabled');

    });

    commands.registerCommand('8bit_sounds.volumeUp', () => {
        let newVol = null;

        switch (process.platform) {
            case 'darwin':
                config.macVol += 1;

                if(config.macVol > 10){
                    window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.macVol = 10;
                }

                newVol = config.macVol;
                context.globalState.update('mac_volume', newVol);
                break;

            case 'win32':
                config.winVol += 10;

                if(config.winVol > 100){
                    window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.winVol = 100;
                }

                newVol = config.winVol;
                context.globalState.update('win_volume', newVol);
                break;

            case 'linux':
                config.linuxVol += 1;

                if(config.linuxVol > 10){
                    window.showWarningMessage('8bit Sounds already at maximum volume');
                    config.linuxVol = 10;
                }

                newVol = config.linuxVol;
                context.globalState.update('linux_volume', newVol);
                break;

            default:
                newVol = 0;
                break;
        }

        window.showInformationMessage('8bit Sounds volume raised: ' + newVol);
    });

    commands.registerCommand('8bit_sounds.volumeDown', () => {
        let newVol = null;

        switch (process.platform) {
            case 'darwin':
                config.macVol -= 1;

                if(config.macVol < 1){
                    window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.macVol = 1;
                }

                newVol = config.macVol;
                context.globalState.update('mac_volume', newVol);
                break;

            case 'win32':
                config.winVol -= 10;

                if(config.winVol < 10){
                    window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.winVol = 10;
                }

                newVol = config.winVol;
                context.globalState.update('win_volume', newVol);
                break;

            case 'linux':
                config.linuxVol -= 1;

                if(config.linuxVol < 1){//TODO: maybe show the message if the volumn is already 1 and break;
                    window.showWarningMessage('8bit Sounds already at minimum volume');
                    config.linuxVol = 1;
                }

                newVol = config.linuxVol;
                context.globalState.update('linux_volume', newVol);
                break;

            default:
                newVol = 0;
                break;
        }

        window.showInformationMessage('8bit Sounds volume lowered: ' + newVol);
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(listener);

}

export function deactivate() {}
