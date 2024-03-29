# Flexible tip menu usage & configuration details


This is a [tip menu bot](https://chaturbate.com/apps/app_details/flexible-tip-menu/) for [Chaturbate](https://chaturbate.com). Fill in your prices and their description, and the bot will repeat them in the chat as notices for your viewers to see.

One great feature of this bot is the ability to fill in the tip menu items as you think them up, and not worry about the order in which you write them or the specifics of what you write. Just put the amount first in the box, and the display format will be handled globally by the app. It's configurable too. Any empty menu item box will be ignored. Menu items that don't start with a number are ignored as well.

There are two levels of configuration: the settings in the "Launch Bot" admin panel to make the menu look how you want it to, and inside the source code to adjust the admin panel itself. All the options are described below.

Why not configure everything in the "Launch Bot" page? One example is to translate the admin panel itself; another is the number of items: if 99 menu items are too many for you, feel free to reduce that value in the code of the app: the admin panel will be shorter as a result.

Please feel free to [discuss improvements and issues on GitHub](https://github.com/william81fr/cb-flexible-tip-menu)  (or to read a proper changelog).

## Variables in the source code

- **lang**: the language of the admin panel
- **nb_of_menu_items**: the number of configurable menu items from the admin panel

## Global settings in the admin panel

- **App name**: if set, this will be displayed in the chat at the top of the tip menu
- **Errors shown to**: either the broadcaster or the moderators will be able to see the errors in the configuration of the app (in the chat), or nobody
- **Thank tippers**: if set to "n/a", the module is disabled; otherwise, tippers are thanked either publicly or privately

## Thank Tippers module settings in the admin panel

- **Thank tippers above tokens**: allows to avoid thanking every single low tip; NB: this is off-by-one on purpose, so that to thank people for their tips from 25 tokens and up, you have to set this to 24
- **Thank tippers publicly background color**: color of the text for the public notice; written in CSS/HTML format [1]
- **Thank tippers publicly text color**: color of the text for the public notice; written in CSS/HTML format [1]
- **Thank tippers publicly boldness**: thickness of the the text for the public notice (NB: "bold" and "bolder" are often the same)
- **Thank tippers publicly format**: template to format the public notice; available variables are: {AMOUNT} for the tip amount, {TIPPER} for the tipper's nickname, {SERVICE} for the label of the item corresponding to the tip amount
- **Thank tippers privately background color**: color of the text for the private notice; written in CSS/HTML format [1]
- **Thank tippers privately text color**: color of the text for the private notice; written in CSS/HTML format [1]
- **Thank tippers privately boldness**: thickness of the the text for the private notice (NB: "bold" and "bolder" are often the same)
- **Thank tippers privately format**: template to format the private notice; available variables are: {AMOUNT} for the tip amount, {TIPPER} for the tipper's nickname, {SERVICE} for the label of the item corresponding to the tip amount
- **Thank tippers remind tip note format**: template to format the personal reminder of the tip message (to its author, not in public chat); same format options as the private thanks; available variables are: {MESSAGE}

## Tip Menu settings in the admin panel

- **Tip menu shown to**: Whether to enable the tip menu at all, show it to everyone or to a subset of users
- **Tip menu header**: if set, will be displayed after the app name and before the first item
- **Tip menu footer**: if set, will be displayed at the end of the tip menu
- **Inline separator**: if left empty, the tip menu will be multiline; but if set, the tip menu will be displayed all in one line: in that case, the separator an be a comma or a dash or whatever text should appear between two tip menu items
- **Inline spacing**: if the inline separator is set, this option can be used to apply spacing to either side of the separator; for example a comma might need only "right" spacing, while a dash might be better with spacing on both sides
- **Menu background color**: color of the background for the whole tip menu; written in CSS/HTML format [1]
- **Menu text color**: color of the text for the whole tip menu; written in CSS/HTML format [1]
- **Menu boldness**: thickness of the the text (NB: "bold" and "bolder" are often the same)
- **Menu repeat minutes**: number of minutes before the menu is displayed again in the chat; set to zero to display only once (on app startup)
- **Menu item prefix**: Prefix to all menu items; should allow for `:emoticon`s
- **Menu item suffix**: Suffix to all menu items; should allow for `:emoticon`s
- **Menu item display format**: all subsequent menu items will be rewritten to this pattern; remember to include both `{AMOUNT}` and `{LABEL}`; see examples below; should allow for `:emoticon`s
- **Sort order**: in which order to sort the items (can be disabled too)
- **Menu item XYZ**: must start with a number followed by a text label; anything else will be ignored by the app (handy to disable an item temporarily); should allow for `:emoticon`s

Examples of menu item display formats (here an example where the service is a PM, for a cost of 25 tokens):
- `{AMOUNT} tokens - {LABEL}` to send a notice like `25 tokens - PM`
- `{LABEL} ({AMOUNT}tk)` to send a notice like `PM (25tk)`
- `tip {AMOUNT} tokens for: {LABEL}` to send a notice like `tip 25 tokens for: PM`
- simply write `{AMOUNT}` and `{LABEL}` anywhere in the box, with anything around them

[1] Feel free to use [a tool like this one](https://mdn.github.io/css-examples/tools/color-picker/) to pick your colors (focus on the "HEXA" label that changes as you click on different colors). Flexible Tip Menu accepts both lowercase and uppercase color codes, and the # symbol is not required at the start.
