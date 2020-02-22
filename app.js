/*
 * Made by william81fr for goddesssrina
 */

// modify the next few lines to adjust the admin panel
const nb_of_items = 99; // max number of configurable menu items

// don't modify anything from here on
const regexp_tip_item = /^([0-9]+)[^a-z]+(.+)$/i; // format of the entries in the admin of the app

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

const weight_normal = 'normal';
const weight_bold = 'bold';
const weight_bolder = 'bolder';

const lbl_menu_item_prefix = 'menu item #';
const lbl_not_applicable = 'n/a';
const lbl_tip_menu_shown_to_all = 'everybody';
const lbl_tip_menu_shown_to_fans = 'fans';
//const lbl_tip_menu_shown_to_50tk = 'Dark Blue (Tipped 50 recently)';
//const lbl_tip_menu_shown_to_250tk = 'Light Purple (Tipped 250 recently)';
//const lbl_tip_menu_shown_to_1000tk = 'Dark Purple (Tipped 1000 recently)';
//const lbl_tip_menu_shown_to_havetk = 'Light Blue (Own or purchased tokens)';
const lbl_tip_menu_shown_to_havetk = 'own or purchased tokens';
const lbl_inline_spacing_before = 'before';
const lbl_inline_spacing_after = 'after';
const lbl_inline_spacing_both = 'before + after';
const lbl_errors_shown_to_host = 'broadcaster';
const lbl_errors_shown_to_hostmods = 'broadcaster + moderators';
const lbl_sort_amount_asc = 'lowest to highest';
const lbl_sort_amount_desc = 'highest to lowest';


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
    'choice2': lbl_tip_menu_shown_to_fans,
    'choice3': lbl_tip_menu_shown_to_havetk,
    'choice4': lbl_not_applicable,
    'defaultValue': lbl_tip_menu_shown_to_all
});

cb.settings_choices.push({
    'name': 'errors_shown_to',
    'type': 'choice',
    'choice1': lbl_errors_shown_to_host,
    'choice2': lbl_errors_shown_to_hostmods,
    'choice3': lbl_not_applicable,
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
    'name': 'menu_background_color',
    'type': 'str',
    'minLength': 6,
    'maxLength': 7,
    'defaultValue': color_black
});

cb.settings_choices.push({
    'name': 'menu_text_color',
    'type': 'str',
    'minLength': 6,
    'maxLength': 7,
    'defaultValue': color_white
});

cb.settings_choices.push({
    'name': 'menu_boldness',
    'type': 'choice',
    'choice1': weight_normal,
    'choice2': weight_bold,
    'choice3': weight_bolder,
    'defaultValue': weight_normal
});

cb.settings_choices.push({
    'name': 'menu_repeat_minutes',
    'type': 'int',
    'minValue': 0,
    'maxValue': 60,
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
        'name': lbl_menu_item_prefix + (i+1),
        'type': 'str',
        'minLength': 1,
        'maxLength': 99,
        'defaultValue': '',
        'required': false
    };
    cb.settings_choices.push(new_item);
}

/*
 * Display errors in the chat
 */
function alert_error(setting_name, error_lbl, bg_color=null, txt_color=null) {
    bg_color = bg_color ? bg_color : color_bright_red;
    txt_color = txt_color ? txt_color : color_white;
    const msg = '/!\\ ATTN '+cb.room_slug+': "'+setting_name+'" setting in the tip menu app '+error_lbl;

    switch(cb.settings.errors_shown_to) {
        case lbl_errors_shown_to_host:
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
        break;

        case lbl_errors_shown_to_hostmods:
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
            cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder, group_mods);
        break;

        default:
            // never mind
    }
}

function get_color_code(cfg_color, default_value) {
    const color_match = cb.settings[cfg_color].match(/^#?([0-9a-f]{6})$/i);
    if(!color_match) {
        alert_error(cfg_color, 'should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)');
        return default_value;
    }

    return '#'+(color_match[1].toUpperCase());
}

function get_items_separator(cfg_spacing, cfg_separator) {
    let items_separator;
    if('' === cfg_separator) {
        items_separator = "\n";
    }
    else if(lbl_inline_spacing_before === cfg_spacing) {
        items_separator = ' '+cfg_separator;
    }
    else if(lbl_inline_spacing_after === cfg_spacing) {
        items_separator = cfg_separator+' ';
    }
    else if(lbl_inline_spacing_both === cfg_spacing) {
        items_separator = ' '+cfg_separator+' ';
    }
    else {
        items_separator = cfg_separator;
    }

    return items_separator;
}

function get_menu_options(tip_item_pattern) {
    let options_list = [];
    for(const setting_name in cb.settings) {
        if(!setting_name.startsWith(lbl_menu_item_prefix)) continue;
        if(typeof cb.settings[setting_name] !== 'string') continue;

        const setting_value = cb.settings[setting_name].trim();
        if('' === setting_value) continue;

        const menu_item = setting_value.match(tip_item_pattern);
        if(null === menu_item) {
            alert_error(setting_name, 'should start with a number followed by a label: disabled for now', color_pastel_red, color_black);
            continue;
        }

        const [, item_amount, item_label] = menu_item;
        options_list.push({amount: parseInt(item_amount), label: item_label.trim()});
    };

    if(0 === options_list.length) {
        alert_error('tip menu as a whole', 'requires at least one valid item: the app will not display anything at this time');
        return [];
    }

    if(lbl_not_applicable !== cb.settings.sort_order) {
        options_list.sort(function(a, b) {
            let res;
            if(lbl_sort_amount_asc === cb.settings.sort_order) {
                res = a.amount - b.amount;
            }
            else {
                res = b.amount - a.amount;
            }

            return res;
        });
    }

    return options_list;
}

function get_tip_menu(tip_menu_options) {
    let tip_menu_items = [];
    if('' !== cb.settings.app_name) {
        tip_menu_items.push(cb.settings.app_name);
    }

    if('' !== cb.settings.tip_menu_header) {
        tip_menu_items.push(cb.settings.tip_menu_header);
    }

    for(let i in tip_menu_options) {
        const item = tip_menu_options[i];

        let msg = '';
        if(cb.settings.menu_item_prefix) {
            if(lbl_not_applicable !== cb.settings.inline_spacing) {
                msg += cb.settings.menu_item_prefix+' ';
            }
            else {
                msg += cb.settings.menu_item_prefix;
            }
        }

        msg += tpl_menu_item_display_format.replace('{AMOUNT}', item.amount).replace('{LABEL}', item.label)

        if(cb.settings.menu_item_suffix) {
            if(lbl_not_applicable !== cb.settings.inline_spacing) {
                msg += ' '+cb.settings.menu_item_suffix;
            }
            else {
                msg += cb.settings.menu_item_suffix;
            }
        }

        tip_menu_items.push(msg);
    }

    if('' !== cb.settings.tip_menu_footer) {
        tip_menu_items.push(cb.settings.tip_menu_footer);
    }

    const menu_items_separator = get_items_separator(cb.settings.inline_spacing, cb.settings.inline_separator);
    return tip_menu_items.join(menu_items_separator);
}

/*
 * Main function
 */
function show_menu() {
    const menu_background_color = get_color_code('menu_background_color', color_black);
    const menu_text_color = get_color_code('menu_text_color', color_white);
    const tip_menu_options = get_menu_options(regexp_tip_item);
    const tip_menu = get_tip_menu(tip_menu_options);

    switch(cb.settings.tip_menu_shown_to) {
        case lbl_tip_menu_shown_to_all:
            cb.sendNotice(tip_menu, '', menu_background_color, menu_text_color, cb.settings.menu_boldness);
        break;

        case lbl_tip_menu_shown_to_fans:
            cb.sendNotice(tip_menu, '', menu_background_color, menu_text_color, cb.settings.menu_boldness, group_fans); // send notice only to group
            cb.sendNotice(tip_menu, cb.room_slug, menu_background_color, menu_text_color, cb.settings.menu_boldness); // also to the broadcaster for good measure
        break;

        case lbl_tip_menu_shown_to_havetk:
            cb.sendNotice(tip_menu, '', menu_background_color, menu_text_color, cb.settings.menu_boldness, group_havetk); // send notice only to group
            cb.sendNotice(tip_menu, cb.room_slug, menu_background_color, menu_text_color, cb.settings.menu_boldness); // also tp the broadcaster for good measure
        break;

        default:
            // never mind
    }

    if(0 < cb.settings.menu_repeat_minutes) {
        cb.setTimeout(show_menu, 1000 * 60 * cb.settings.menu_repeat_minutes);
    }
}


//
// launch the menu
//
const tpl_menu_item_display_format = cb.settings.menu_item_display_format;
if(lbl_not_applicable === cb.settings.tip_menu_shown_to) {
    alert_error('tip_menu_shown_to', 'is set to "'+lbl_not_applicable+'": app is stopped');
}
else if(!tpl_menu_item_display_format) {
    // not sure why this is needed, but without it, the app fails at the includes() call below
    alert_error('menu_item_display_format', 'should not be empty');
}
else if(!tpl_menu_item_display_format.includes('{AMOUNT}')) {
    alert_error('menu_item_display_format', 'requires an {AMOUNT} value');
}
else if(!tpl_menu_item_display_format.includes('{LABEL}')) {
    alert_error('menu_item_display_format', 'requires a {LABEL} value');
}
else {
    if(cb.settings.menu_repeat_minutes <= 0) {
        alert_error('menu_repeat_minutes', 'is set to zero, so the menu will not be shown again in the chat');
    }

    cb.setTimeout(show_menu, 1000 * 5);
}
