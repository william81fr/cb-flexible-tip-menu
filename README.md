# Configurable tip menu

This is a [tip menu app](https://chaturbate.com/apps/app_details/flexible-tip-menu/) for Chaturbate. Fill in your prices and their description, and the app will repeat them in the chat as notices for your viewers to see.

There are two levels of configuration: the settings in the standard Chaturbate admin panel to make the menu look how you want it to, and inside the source code to adjust the admin panel itself. All the options are described below.

Why not configure everything in the Chaturbate interface? One example is the number of items. For example, if 99 menu items are too many for you, feel free to reduce that value in the code of the app: the admin panel will be shorter as a result.

One great feature is the ability to fill in the tip menu items as you think them up, and not worry about the order in which you write them or the specifics of what you write. Just put the amount first in the box, and the display format will be handled globally by the app. It's configurable too.

Please feel free to [discuss issues on GitHub](https://github.com/william81fr/cb-flexible-tip-menu).

## Variables in the source code

- **nb_of_items**: the number of configurable menu items from the admin panel
- **min_repeat_minutes**: the minimum value for "repeat minutes" in the admin panel
- **max_repeat_minutes**: the maximum value for "repeat minutes" in the admin panel

## Settings in the admin panel

- **App name**: if set, this will be displayed in the chat at the top of the tip menu
- **Tip menu shown to**: Whether to enable the tip menu at all, show it to everyone or to a subset of users
- **Errors shown to**: either the room host or the moderators will be able to see the errors in the configuration of the app (in the chat), or nobody
- **Tip menu header**: if set, will be displayed after the app name and before the first item
- **Tip menu footer**: if set, will be displayed at the end of the tip menu
- **Inline separator**: if set, the tip menu will be displayed all in one line; but if left empty, the tip menu will be multiline
- **Inline spacing**: if the inline separator is set, the spacing can be used to separate items from each other
- **Background color**: color of the background for the whole tip menu; this needs to be in CSS/HTML format [1]
- **Text color**: color of the text for the whole tip menu; this needs to be in CSS/HTML format [1]
- **Boldness**: how thick the text is, for emphasis
- **Menu item prefix**: Prefix to all menu items; should allow for `:emoticons`
- **Menu item suffix**: Suffix to all menu items; should allow for `:emoticons`
- **Menu repeat minutes**: number of minutes before the menu is displayed again in the chat
- **Menu item display format**: all subsequent menu items will be reformatted to this pattern; remember to include both `{AMOUNT}` and `{LABEL}` in there; for example you could write `{AMOUNT} tokens - {LABEL}` or `{LABEL} ({AMOUNT}tk)`; should allow for `:emoticons`
- **Sort order**: in which order to sort the items (can be disabled too)
- **Menu item XYZ**: must start with a number followed by a text label; anything else will be ignored by the app (handy to disable an item temporarily); all items are sorted by lowest to highest amount before display; should allow for `:emoticons`

[1] Use [a tool like this one](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool) to pick your colors (focus on the "HEXA" label that changes as you click on different colors)

