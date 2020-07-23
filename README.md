# Fenix

Fenix is a powerful and easy to use project generator for Visual Studio Code

## Getting started

1. Open a new folder in Visual Studio Code (Ctrl+K, Ctrl+O)
2. Press F1 and search for "Open Fenix"
3. Enjoy ;)

You can also use the new Fenix icon added to the activity bar (the one on the left). It allows you to add new repositories, pin your favourite templates, edit Fenix enviroment variables and add repositories from my recommended list, which I will update from time to time.

## Getting started (Español)

1. Abre una nueva carpeta en Visual Studio Code (Ctrl+K, Ctrl+O)
2. Pulsa F1 y busca "Open Fenix"
3. Disfruta ;)

Tambien puedes utilizar el nuevo icono añadido en la barra de actividad (la de la izquierda). Te permite añadir nuevos repositorios, marcar tus plantillas como favoritas, editar las variables de entorno de Fenix y añadir repositorios de mi lista de recomendados, la cual actualizaré de vez en cuando.

## Features

- Decentralized, you can create your own template repositories and share them!
- Fast, the interface supports filters and search, so you can have as many repos as you want and still find templates in a few seconds!
- Pinned templates, you can pin the templates you use more often and run them wihtout even opening the interface, they will use the variables you have set in your Fenix environment!
- Easy to develop templates, you can start with simple templates and learn your way to more complex ones!

## Extension Settings

This extension contributes the following settings:

* `fenix.repos`: List of repositories to fetch for templates
* `fenix.runCommands`: Templates can have a commands section, Fenix will ask by default if you want to run those commands, but you can set it to never run them, to always ask or to run them without asking (only recommended if you trust the template author).
* `fenix.env`: Object with stored Fenix variables that can be used in templates.
* `fenix.pinned`: List of all pinned templates.

## Known Issues

- You tell me :)

## Release Notes

### 1.1.5

- Fixed Webview not loading on VSCode 1.47.0 or newer