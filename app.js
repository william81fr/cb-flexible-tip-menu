/*
 * Made by william81fr for goddesssrina
 */

// modify the next few lines to adjust the admin panel
const nb_of_items = 99; // max number of configurable menu items
const min_repeat_minutes = 1; // constrains the configurable value
const max_repeat_minutes = 60; // constrains the configurable value

// don't modify anything from here on
const prefix_menu_item = 'menu item #'; // name in the admin of the app
const regexp_tip_pattern = /^([0-9]+)[^a-z]+(.+)$/i; // format of the entries in the admin of the app

const weight_normal = 'normal';
const weight_bold = 'bold';
const weight_bolder = 'bolder';

const color_black = '#000000';
const color_white = '#FFFFFF';
const color_bright_red = '#FF0000';
const color_bright_green = '#00FF00';
const color_bright_blue = '#0000FF'
const color_pastel_red = '#ea9999';
const color_pastel_green = '#b6d7a8';
const color_pastel_blue = '#a4c2f4'

const group_mods = 'red';
const group_fans = 'green';
const group_50tk = 'darkblue';
const group_250tk = 'lightpurple';
const group_1000tk = 'darkpurple';
const group_havetk = 'lightblue';

const lbl_not_applicable = 'n/a';
const lbl_tip_menu_shown_to_all = 'everybody';
const lbl_tip_menu_shown_to_mods = 'only the mods';
const lbl_tip_menu_shown_to_fans = 'only the fans';
const lbl_tip_menu_shown_to_50tk = '50tk and above';
const lbl_tip_menu_shown_to_250tk = '250tk and above';
const lbl_tip_menu_shown_to_1000tk = '1000tk and above';
const lbl_tip_menu_shown_to_havetk = 'only people with tokens';
const lbl_inline_spacing_before = 'before';
const lbl_inline_spacing_after = 'after';
const lbl_inline_spacing_both = 'both';
const lbl_errors_shown_to_host = 'room host';
const lbl_errors_shown_to_mods = 'moderators';
const lbl_errors_shown_to_hostmods = 'room host + moderators';
const lbl_sort_amount_asc = 'tip amount, lowest to highest';
const lbl_sort_amount_desc = 'tip amount, highest to lowest';


cb.settings_choices = [];

cb.settings_choices.push({
    'name': 'app_name',
    'type': 'str',
    'minLength': 1,
    'maxLength': 99,
    'required': false
});

cb.settings_choices.push({
    'name': 'tip_menu_shown_to',
    'type': 'choice',
    'choice1': lbl_tip_menu_shown_to_all,
    'choice2': lbl_tip_menu_shown_to_mods,
    'choice3': lbl_tip_menu_shown_to_fans,
    'choice4': lbl_tip_menu_shown_to_50tk,
    'choice5': lbl_tip_menu_shown_to_250tk,
    'choice6': lbl_tip_menu_shown_to_1000tk,
    'choice7': lbl_tip_menu_shown_to_havetk,
    'choice8': lbl_not_applicable,
    'defaultValue': lbl_tip_menu_shown_to_all
});

cb.settings_choices.push({
    'name': 'errors_shown_to',
    'type': 'choice',
    'choice1': lbl_errors_shown_to_host,
    'choice2': lbl_errors_shown_to_mods,
    'choice3': lbl_errors_shown_to_hostmods,
    'choice4': lbl_not_applicable,
    'defaultValue': lbl_errors_shown_to_host
});

cb.settings_choices.push({
    'name': 'tip_menu_header',
    'type': 'str',
    'minLength': 1,
    'maxLength': 99,
    'required': false
});

cb.settings_choices.push({
    'name': 'tip_menu_footer',
    'type': 'str',
    'minLength': 1,
    'maxLength': 99,
    'required': false
});

cb.settings_choices.push({
    'name': 'inline_separator',
    'type': 'str',
    'minLength': 0,
    'maxLength': 10,
    'required': false
});

cb.settings_choices.push({
    'name': 'inline_spacing',
    'type': 'choice',
    'choice1': lbl_inline_spacing_before,
    'choice2': lbl_inline_spacing_after,
    'choice3': lbl_inline_spacing_both,
    'choice4': lbl_not_applicable,
    'defaultValue': lbl_not_applicable,
    'required': false
});

cb.settings_choices.push({
    'name': 'background_color',
    'type': 'str',
    'minLength': 6,
    'maxLength': 7,
    'defaultValue': color_white
});

cb.settings_choices.push({
    'name': 'text_color',
    'type': 'str',
    'minLength': 6,
    'maxLength': 7,
    'defaultValue': color_black
});

cb.settings_choices.push({
    'name': 'boldness',
    'type': 'choice',
    'choice1': weight_normal,
    'choice2': weight_bold,
    'choice3': weight_bolder,
    'defaultValue': weight_normal
});

cb.settings_choices.push({
    'name': 'menu_repeat_minutes',
    'type': 'int',
    'minValue': min_repeat_minutes,
    'maxValue': max_repeat_minutes,
    'defaultValue': 10
});

cb.settings_choices.push({
    'name': 'menu_item_prefix',
    'type': 'str',
    'minLength': 0,
    'maxLength': 100,
    'required': false
});

cb.settings_choices.push({
    'name': 'menu_item_suffix',
    'type': 'str',
    'minLength': 0,
    'maxLength': 100,
    'required': false
});

cb.settings_choices.push({
    'name': 'menu_item_display_format',
    'type': 'str',
    'minLength': 10,
    'maxLength': 99,
    'defaultValue': '{LABEL} ({AMOUNT}tk)'
});

cb.settings_choices.push({
    'name': 'sort_order',
    'type': 'choice',
    'choice1': lbl_sort_amount_asc,
    'choice2': lbl_sort_amount_desc,
    'choice3': lbl_not_applicable,
    'defaultValue': lbl_sort_amount_asc
});

let items_list = [];
for(i=0; i<nb_of_items; ++i) {
    let new_item = {
        'name': prefix_menu_item + (i+1),
        'type': 'str',
        'minLength': 1,
        'maxLength': 99,
        'defaultValue': '',
        'required': false
    };
    cb.settings_choices.push(new_item);
}

function alert_error(setting_name, error_lbl, bg_color=null, txt_color=null) {
    bg_color = bg_color ? bg_color : color_bright_red;
    txt_color = txt_color ? txt_color : color_white;
    const msg = '/!\\ ATTN '+cb.room_slug+': "'+setting_name+'" setting in the tip menu app '+error_lbl;

    switch(cb.settings.errors_shown_to) {
        case lbl_errors_shown_to_host:
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
        break;

        case lbl_errors_shown_to_mods:
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder, group_mods);
        break;

        case lbl_errors_shown_to_hostmods:
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder, group_mods);
        break;

        default:
            // never mind
    }
}

function show_menu() {
    const bg_match = cb.settings.background_color.match(/^#?([0-9a-f]{6})$/i);
    if(!bg_match) {
        alert_error('background_color', 'should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)');
        return;
    }

    const txt_match = cb.settings.text_color.match(/^#?([0-9a-f]{6})$/i);
    if(!txt_match) {
        alert_error('text_color', 'should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)');
        return;
    }

    if(!cb.settings.menu_item_display_format.includes('{AMOUNT}')) {
        alert_error('menu_item_display_format', 'requires an {AMOUNT} value');
        return;
    }

    if(!cb.settings.menu_item_display_format.includes('{LABEL}')) {
        alert_error('menu_item_display_format', 'requires a {LABEL} value');
        return;
    }

    let menu_options = [];
    for(const setting_name in cb.settings) {
        if(!setting_name.startsWith(prefix_menu_item)) continue;
        if(typeof cb.settings[setting_name] !== 'string') continue;

        const setting_value = cb.settings[setting_name].trim();
        if('' === setting_value) continue;

        const menu_item = setting_value.match(regexp_tip_pattern);
        if(null === menu_item) {
            alert_error(setting_name, 'should start with a number followed by a label: disabled for now', color_pastel_red, color_black);
            continue;
        }

        const [, item_amount, item_label] = menu_item;
        menu_options.push({amount: parseInt(item_amount), label: item_label.trim()});
    };

    if(0 === menu_options.length) {
        alert_error('tip menu as a whole', 'requires at least one valid item: the app will not display anything at this time');
        return;
    }

    let items_separator;
    if('' === cb.settings.inline_separator) {
        items_separator = "\n";
    }
    else if(lbl_inline_spacing_before === cb.settings.inline_spacing) {
        items_separator = ' '+cb.settings.inline_separator;
    }
    else if(lbl_inline_spacing_after === cb.settings.inline_spacing) {
        items_separator = cb.settings.inline_separator+' ';
    }
    else if(lbl_inline_spacing_both === cb.settings.inline_spacing) {
        items_separator = ' '+cb.settings.inline_separator+' ';
    }
    else {
        items_separator = cb.settings.inline_separator;
    }

    const background_color = '#'+(txt_match[1].toUpperCase());
    const text_color = '#'+(bg_match[1].toUpperCase());

    if(lbl_not_applicable !== cb.settings.sort_order) {
        menu_options.sort(function(a, b) {
            if(lbl_sort_amount_asc === cb.settings.sort_order) {
                return a.amount - b.amount;
            }
            else {
                return b.amount - a.amount;
            }
        });
    }

    let tip_menu = [];
    if('' !== cb.settings.app_name) {
        tip_menu.push(cb.settings.app_name);
    }

    if('' !== cb.settings.tip_menu_header) {
        tip_menu.push(cb.settings.tip_menu_header);
    }

    for(let i in menu_options) {
        const item = menu_options[i];

        let msg = '';
        if(cb.settings.menu_item_prefix) {
            if(lbl_not_applicable !== cb.settings.inline_spacing) {
                msg += cb.settings.menu_item_prefix+' ';
            }
            else {
                msg += cb.settings.menu_item_prefix;
            }
        }

        msg += cb.settings.menu_item_display_format.replace('{AMOUNT}', item.amount).replace('{LABEL}', item.label)

        if(cb.settings.menu_item_suffix) {
            if(lbl_not_applicable !== cb.settings.inline_spacing) {
                msg += ' '+cb.settings.menu_item_suffix;
            }
            else {
                msg += cb.settings.menu_item_suffix;
            }
        }

        tip_menu.push(msg);
    }

    if('' !== cb.settings.tip_menu_footer) {
        tip_menu.push(cb.settings.tip_menu_footer);
    }

    const tip_menu_items = tip_menu.join(items_separator);
    if(lbl_tip_menu_shown_to_all === cb.settings.tip_menu_shown_to) {
        cb.sendNotice(tip_menu_items, '', background_color, text_color, cb.settings.boldness);
    }
    else {
        cb.sendNotice(tip_menu_items, '', background_color, text_color, cb.settings.boldness, cb.settings.tip_menu_shown_to);
    }

    cb.setTimeout(show_menu, 1000 * 60 * cb.settings.menu_repeat_minutes);
}


if(lbl_not_applicable !== cb.settings.tip_menu_shown_to) {
    cb.setTimeout(show_menu, 1000 * 5);
}
else {
    alert_error('tip_menu_shown_to', 'is set to "'+lbl_not_applicable+'": app is stopped');
}

