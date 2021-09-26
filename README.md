# 8bit-sounds

<a href="https://gitmoji.carloscuesta.me">
<img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat" alt="Gitmoji">
</a>
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jengjeng/aural-coding-vscode/blob/master/LICENSE)

This Visual Studio Code extension to play old video-game sounds when you type :3.
> This is a fork from [hacker sounds](https://github.com/mattogodoy/hacker-sounds/)

## Requirements

### Linux

On Linux, you will need to have mplayer installed and on your PATH to get this extension working.

**Debian based**
```bash
sudo apt-get install mplayer
```

**Red Hat based**
```bash
sudo dnf install mplayer
```

**Arch based**
```bash
sudo pacman -S mplayer
```

### Windows and Mac

No special requirements.

## Installation NOT READY YET

Run `code --install-extension mattogodoy.8bit-sounds`

or search [8bit Sounds](https://marketplace.visualstudio.com/items?itemName=mattogodoy.8bit-sounds) in Extensions Marketplace.

## How to use

### Enable / Disable

8bit Sounds will start immediately when Visual Studio Code is started. However, you can enable and disable the extension by executing these commands in the Command Palette (Cmd+Shift+P):

- `8bit Sounds: Enable`
- `8bit Sounds: Disable`

### Volume control

You can adjust the volume of the sounds by executing these commands in the Command Palette (Cmd+Shift+P):

- `8bit Sounds: Volume Up`
- `8bit Sounds: Volume Down`

**NOTE:** The volume adjustments only apply to this extension's sounds. It does not affect the system volume.

## Known Issues & Bugs

The extension is in a very early stage. Please report any issues / bugs you find.

It take some seconds before it starts to work

## Contributing

Any pull request is welcome.
