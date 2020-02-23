/*
 * Made by william81fr for goddesssrina
 */

// modify the next few lines to adjust the admin panel
const nb_of_menu_items = 99; // max number of configurable menu items
const enable_thank_tippers = true; // whether the Thank Tippers module appears at all

// don't modify anything from here on
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
const lbl_thank_tippers_publicly = 'publicly';
const lbl_thank_tippers_privately = 'privately';
const lbl_inline_spacing_before = 'before';
const lbl_inline_spacing_after = 'after';
const lbl_inline_spacing_both = 'before + after';
const lbl_errors_shown_to_host = 'broadcaster';
const lbl_errors_shown_to_hostmods = 'broadcaster + moderators';
const lbl_sort_amount_asc = 'lowest to highest';
const lbl_sort_amount_desc = 'highest to lowest';

const default_thank_tippers_publicly_format = '{TIPPER} tipped {AMOUNT} for {SERVICE}';
const default_thank_tippers_privately_format = 'Thank you {TIPPER} for your {AMOUNT}tk tip';
const default_thank_tippers_remind_tip_note_format = 'Your tip message was: {MESSAGE}';
const default_menu_item_display_format = '{LABEL} ({AMOUNT}tk)';


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

if(enable_thank_tippers) {
    cb.settings_choices.push({
        'name': 'thank_tippers',
        'type': 'choice',
        'choice1': lbl_thank_tippers_publicly,
        'choice2': lbl_thank_tippers_privately,
        'choice3': lbl_not_applicable,
        'defaultValue': lbl_not_applicable
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_above_tokens',
        'type': 'int',
        'minValue': 1,
        'maxValue': 999999,
        'defaultValue': 24
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_publicly_background_color',
        'type': 'str',
        'minLength': 6,
        'maxLength': 7,
        'defaultValue': color_white
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_publicly_text_color',
        'type': 'str',
        'minLength': 6,
        'maxLength': 7,
        'defaultValue': color_black
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_publicly_boldness',
        'type': 'choice',
        'choice1': weight_normal,
        'choice2': weight_bold,
        'choice3': weight_bolder,
        'defaultValue': weight_bold
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_publicly_format',
        'type': 'str',
        'minLength': 10,
        'maxLength': 99,
        'defaultValue': default_thank_tippers_publicly_format
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_privately_background_color',
        'type': 'str',
        'minLength': 6,
        'maxLength': 7,
        'defaultValue': color_white
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_privately_text_color',
        'type': 'str',
        'minLength': 6,
        'maxLength': 7,
        'defaultValue': color_black
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_privately_boldness',
        'type': 'choice',
        'choice1': weight_normal,
        'choice2': weight_bold,
        'choice3': weight_bolder,
        'defaultValue': weight_bold
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_privately_format',
        'type': 'str',
        'minLength': 10,
        'maxLength': 99,
        'defaultValue': default_thank_tippers_privately_format
    });

    cb.settings_choices.push({
        'name': 'thank_tippers_remind_tip_note_format',
        'type': 'str',
        'minLength': 10,
        'maxLength': 99,
        'defaultValue': default_thank_tippers_remind_tip_note_format
    });
}

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
    'defaultValue': default_menu_item_display_format
});

cb.settings_choices.push({
    'name': 'sort_order',
    'type': 'choice',
    'choice1': lbl_sort_amount_asc,
    'choice2': lbl_sort_amount_desc,
    'choice3': lbl_not_applicable,
    'defaultValue': lbl_sort_amount_asc
});

for(let i=0; i<nb_of_menu_items; ++i) {
    const new_item = {
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
    const msg = '/!\\ ATTN '+cb.room_slug+': "'+setting_name+'" setting in the Flexible Tip Menu app '+error_lbl;

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

/*
 * Gets the hex value of a color from a settings value
 */
function get_color_code(cfg_color, default_value) {
    const color_match = cb.settings[cfg_color].match(/^#?([0-9a-f]{6})$/i);
    if(!color_match) {
        alert_error(cfg_color, 'should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)');
        return default_value;
    }

    return '#'+(color_match[1].toUpperCase());
}

/*
 * Gets the menu items separator, whether multi- or single-line and according to spacing setting
 */
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

/*
 * Gets the sorted list of menu items from the app settings
 */
function get_menu_options() {
    let options_list = [];
    for(const setting_name in cb.settings) {
        if(!setting_name.startsWith(lbl_menu_item_prefix)) continue;
        if(typeof cb.settings[setting_name] !== 'string') continue;

        const setting_value = cb.settings[setting_name].trim();
        if('' === setting_value) continue;

        const menu_item = setting_value.match(/^([0-9]+)(.+)$/i);
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

/*
 * Gets the parametrized tip menu lines according to format setting
 */
function get_tip_menu(options_list) {
    let tip_menu_items = [];
    if('' !== cb.settings.app_name) {
        tip_menu_items.push(cb.settings.app_name);
    }

    if('' !== cb.settings.tip_menu_header) {
        tip_menu_items.push(cb.settings.tip_menu_header);
    }

    for(const menu_option of options_list) {
        let msg = '';
        if(cb.settings.menu_item_prefix) {
            if(lbl_not_applicable !== cb.settings.inline_spacing) {
                msg += cb.settings.menu_item_prefix+' ';
            }
            else {
                msg += cb.settings.menu_item_prefix;
            }
        }

        msg += cb.settings.menu_item_display_format;
        msg = msg.replace('{AMOUNT}', menu_option.amount);
        msg = msg.replace('{LABEL}', menu_option.label);

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

    return tip_menu_items;
}

/*
 * Display the tip menu
 */
function show_menu() {
    const background_color = get_color_code('menu_background_color', color_black);
    const text_color = get_color_code('menu_text_color', color_white);
    const options_list = get_menu_options();
    const menu_items_separator = get_items_separator(cb.settings.inline_spacing, cb.settings.inline_separator);
    const tip_menu = get_tip_menu(options_list).join(menu_items_separator);

    switch(cb.settings.tip_menu_shown_to) {
        case lbl_tip_menu_shown_to_all:
            cb.sendNotice(tip_menu, '', background_color, text_color, cb.settings.menu_boldness);
        break;

        case lbl_tip_menu_shown_to_fans:
            cb.sendNotice(tip_menu, '', background_color, text_color, cb.settings.menu_boldness, group_fans); // send notice only to group
            cb.sendNotice(tip_menu, cb.room_slug, background_color, text_color, cb.settings.menu_boldness); // also to the broadcaster for good measure
        break;

        case lbl_tip_menu_shown_to_havetk:
            cb.sendNotice(tip_menu, '', background_color, text_color, cb.settings.menu_boldness, group_havetk); // send notice only to group
            cb.sendNotice(tip_menu, cb.room_slug, background_color, text_color, cb.settings.menu_boldness); // also tp the broadcaster for good measure
        break;

        default:
            // never mind
    }

    if(0 < cb.settings.menu_repeat_minutes) {
        cb.setTimeout(show_menu, 1000 * 60 * cb.settings.menu_repeat_minutes);
    }
}

/*
 * Look up a service from the tip menu by to its amount
 */
function find_service(tip_amount) {
    const options_list = get_menu_options();
    if(0 === options_list.length) {
        return false;
    }

    for(const menu_option of options_list) {
        if(menu_option.amount === tip_amount) {
            return menu_option.label;
        }
    }

    return false;
}

/*
 * Whether the thanks module displays public or private notices
 */
function is_public_thanks() {
    return lbl_thank_tippers_publicly === cb.settings.thank_tippers;
}

/*
 * Gets the formatted message to display in the chat for a tip
 */
function get_thanks_notice(tip) {
    const tip_amount = parseInt(tip.amount);
    if(tip_amount <= cb.settings.thank_tippers_above_tokens) {
        return false;
    }

    let notice_tpl;
    if(is_public_thanks()) {
        notice_tpl = cb.settings.thank_tippers_publicly_format;
    }
    else {
        notice_tpl = cb.settings.thank_tippers_privately_format;
    }

    let notice = notice_tpl;
    notice = notice.replace('{AMOUNT}', tip_amount);
    notice = notice.replace('{TIPPER}', tip.from_user);

    if(notice.includes('{SERVICE}')) {
        const service_lbl = find_service(tip_amount);
        if(!service_lbl) {
            return false;
        }

        notice = notice.replace('{SERVICE}', service_lbl);
    }

    return notice.replace(/\s*{[A-Z_ -]+}\s*/, ' ').trim(); // clear any remaining vars
}

/*
 * Gets the formatted message to display as a private notice to remind the tipper of their tip note
 */
function get_thank_tippers_remind_tip_note_notice(message){
    let res;
    if('' === tip.message) {
        res = false;
    }
    else if (!cb.settings.thank_tippers_remind_tip_note_format) {
        res = false;
    }
    else if(!cb.settings.thank_tippers_remind_tip_note_format.includes('{MESSAGE}')) {
        res = false;
    }
    else {
        res = cb.settings.thank_tippers_remind_tip_note_format.replace('{MESSAGE}', message);
    }

    return res;
}

/*
 * Callback for when a tip is sent, displays a notice to thank the tipper
 */
function thank_tipper(tip) {
    let background_color;
    let text_color;

    const notice = get_thanks_notice(tip);

    if(is_public_thanks()) {
        background_color = get_color_code('thank_tippers_publicly_background_color', color_white);
        text_color = get_color_code('thank_tippers_publicly_text_color', color_black);
        cb.sendNotice(notice, '', background_color, text_color, cb.settings.thank_tippers_publicly_boldness);
    }
    else {
        background_color = get_color_code('thank_tippers_privately_background_color', color_white);
        text_color = get_color_code('thank_tippers_privately_text_color', color_black);
        cb.sendNotice(notice, tip.from_user, background_color, text_color, cb.settings.thank_tippers_privately_boldness);
    }

    const private_notice = get_thank_tippers_remind_tip_note_notice(tip.message);
    if(private_notice) {
        background_color = get_color_code('thank_tippers_privately_background_color', color_white);
        text_color = get_color_code('thank_tippers_privately_text_color', color_black);
        cb.sendNotice(private_notice, tip.from_user, background_color, text_color, cb.settings.thank_tippers_privately_boldness);
    }
}

/*
 * Whether a template string matches its expected format
 */
function check_template_format(cfg_setting, expected_options) {
    const notice_tpl = cb.settings[cfg_setting];
    if(!notice_tpl) {
        alert_error(cfg_setting, 'should not be empty');
        return false;
    }

    for(const i in expected_options) {
        const varname = '{'+expected_options[i]+'}';
        if(!notice_tpl.includes(varname)) {
            alert_error(cfg_setting, 'requires a '+varname+' value');
            return false;
        }
    }

    return true;
}


//
// launch the app
//

if(lbl_not_applicable === cb.settings.tip_menu_shown_to) {
    alert_error('tip_menu_shown_to', 'is set to "'+lbl_not_applicable+'": app is stopped');
}
else if (!check_template_format('menu_item_display_format', ['AMOUNT', 'LABEL'])) {
    alert_error('menu_item_display_format', 'has errors: app is stopped');
}
else {
    if(cb.settings.menu_repeat_minutes <= 0) {
        alert_error('menu_repeat_minutes', 'is set to zero, so the menu will not be shown again in the chat');
    }

    // display the menu (it will re-display itself in a timed loop)
    cb.setTimeout(show_menu, 1000 * 5);


    if(!enable_thank_tippers) {
        // never mind
    }
    else if(lbl_not_applicable === cb.settings.thank_tippers) {
        alert_error('thank_tippers', 'is set to '+lbl_not_applicable+', so the thanking module is disabled', color_white, color_black);
    }
    else if(!check_template_format('thank_tippers_publicly_format', ['TIPPER'])) {
        alert_error('thank_tippers_publicly_format', 'has errors, so the thanking module is disabled', color_pastel_red, color_black);
    }
    else if(!check_template_format('thank_tippers_privately_format', ['TIPPER'])) {
        alert_error('thank_tippers_privately_format', 'has errors, so the thanking module is disabled', color_pastel_red, color_black);
    }
    else {
        // start listening for tips
        cb.onTip(thank_tipper);
    }
}
