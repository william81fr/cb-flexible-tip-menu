/**
 * Made by william81fr
 *
 * Please discuss improvements and issues at:
 * https://github.com/william81fr/cb-flexible-tip-menu
 */


//
// modify the next few lines to adjust the admin panel itself
//

/**
 * Language of the admin panel; values are 'en' or 'fr'
 *   (save and come back to the admin panel to see the changes)
 */
const lang = 'en';

/**
 * Max number of configurable menu items
 */
const nb_of_menu_items = 50;

/**
 * Number of configurable menus, not more than 26
 * Please leave at 1 for now
 */
const nb_of_distinct_menus = 1;


//
// don't modify anything from here on
//

/**
 * This prevents the app from running, and instead shows debug info in the chat
 */
const is_debug = false;

/**
 * The app name can also be changed in the admin panel
 */
const default_app_name = 'Flexible Tip Menu';

/**
 * To generate indices for repeatable configurations
 */
const az = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Messages starting with these characters will be interpreted as commands
 */
const command_prefixes_allow_list = ['/', '!'];

/**
 * For date formatting in chat
 */
const date_tz = 'en-US';

/**
 * For date formatting in chat
 */
const date_opts = { hour12: false };

/**
 * Sample list of hexadecimal color codes
 */
const colors_sample = {
    'black': '#000000',
    'white': '#FFFFFF',
    'bright red': '#FF0000',
    'bright green': '#00FF00',
    'bright blue': '#0000FF',
    'pastel red': '#ea9999',
    'pastel green': '#b6d7a8',
    'pastel blue': '#a4c2f4',
    'purple': '#bf3fbf',
};

/**
 * Identifiers to be used with cb.sendNotice()
 */
const user_groups = {
    mods: 'red',
    fans: 'green',
    tk_50: 'darkblue',
    tk_250: 'lightpurple',
    tk_1000: 'darkpurple',
    have_tk: 'lightblue',
};

/**
 * Can be used with cb.sendNotice()
 */
const font_weights = {
    normal: 'normal',
    bold: 'bold',
    bolder: 'bolder',
};

let shown_errors = []; // Used to show error messages only once


// cf. https://en.wikipedia.org/wiki/List_of_Unicode_characters
// cf. https://en.wikipedia.org/wiki/Miscellaneous_Symbols
// cf. https://en.wikipedia.org/wiki/Emoji#Unicode_blocks

/**
 * Used by automod "unicode" to identify ranges of Unicode characters to test for
 */
const automod_unicode_allowranges = {
    text: [
        '\u{20}-\u{7E}', // most of ASCII 128
        '\u{A0}-\u{FF}', // some of latin1
        '\u{2600}-\u{26D4} \u{2700}-\u{27BF}', // early emotes
    ],
    emoji: [
        { start: parseInt('1F300', 16), end: parseInt('1F64F', 16) },
        { start: parseInt('1F680', 16), end: parseInt('1F6FF', 16) },
        { start: parseInt('1F7E0', 16), end: parseInt('1F7EF', 16) },
        { start: parseInt('1F900', 16), end: parseInt('1FADF', 16) },
    ],
};

/**
 * RegExp patterns used for commands (in chat)
 */
const command_patterns = {
    help: /^he?lp$/i,
    tip_menu: /^(?:tip)?_?menu$/i,
    colors_sample: /^colou?rs_?(?:list)?$/i,
    stats: /^stats$/i,
};

/**
 * RegExp patterns used for label replacements before calling cb.sendNotice()
 */
const label_patterns = {
    amount: /\{(:?AMOUNT|TK|TOKEN|TOKENS)\}/gi,
    app_name: /\{APP\}/gi,
    broadcaster_name: /\{(:?BCASTER|BROADCASTER|SLUG|MODEL|SELF)\}/gi,
    count: /\{COUNT\}/gi,
    item_idx: /\{ITEMIDX\}/gi,
    label: /\{(:?LBL|LABEL)\}/gi,
    message: /\{(:?MSG|MESSAGE)\}/gi,
    menu: /\{(:?MENU|TIPMENU)\}/gi,
    menu_idx: /\{MENUIDX\}/gi,
    service_name: /\{SERVICE\}/gi,
    setting_name: /\{SETTING\}/gi,
    setting_value: /\{(:?VALUE|VAL)\}/gi,
    time: /\{TIME\}/gi,
    username: /\{(:?USER|USERNAME|TIPPER|HANDLE|NICK|NICKNAME)\}/gi,
    varname: /\{VARNAME\}/gi,
    visibility: /\{VISIBILITY\}/gi,
};

const date_patterns = {
    time_short: /:[0-9]{2} .+$/,
    time_medium: / .+$/,
};

/**
 * RegExp patterns used in specific contexts (except commands and mere labels)
 */
const specific_patterns = {
    automod_unicode_allowed: new RegExp('^[' + automod_unicode_allowranges.text.join(' ') + ']+$'),
    automod_link: /[0-9a-z]+:\/\/?[0-9a-z._-]+/i,
    hex_color: /^#?([0-9a-f]{6})$/i,
    menu_item: /^([0-9]+)(.+)$/,
    all_var_names: /\s*\{[0-9A-Z_ -]+\}\s*/g,
};


/**
 * CB has this feature where a setting name is transposed directly as a label in the admin UI
 *   for example, a setting called "app_name" is shown as "App name" in the UI
 *   except if you specify a "label", which is what we do in this app

 * All variable names are reused as:
 *   - CSS class names (unless next to punctuation or as the last word)
 *   	- this is currently not working on the Live website (2021-04)
 *   - HTML IDs (unless next to puncutation or as the first word)

 * Here are a few examples:
 *   - avoid "banner" in your variable name because it breaks the page layout (2020-02-29)
 *   - use "subject" in your variable name to hide the setting name in the admin panel (but still display the user input)
 *   - placing "message" or "top_alert" in your variable name makes a big box with a tame yellow in the background
 *   - placing "importantmessage" in your variable name sets a reddish color as the background
 *   - placing "successmessage" in your variable name sets a green color as the background
 *   - placing "debugmessage" in your variable name sets a purple color as the background
 *   - placing "cambouncernotes" in your variable name sets a bright yellow color as the background
 *   - placing "creat" in your variable name makes a big button with orange background and white text, but also with a white arrow
 *   - placing "code" in your variable name will use a fixed-size font

 * In order to keep our code readable, here is a map of variables internal to our app's workings VS in the Chaturbate UI:
 */
const settings_list = {
    app_name: 'debugmessage appName',
    errors_flag: 'importantmessage errorsFlag',
    automod_unicode_flag: 'debugmessage automodUnicodeFlag',
    automod_links_flag: 'debugmessage automodLinksFlag',
    automods_verbosity: 'automodsVerbosity',
    automods_record_flag: 'automodsRecordFlag',
    decorator_gender_flag: 'debugmessage decoratorGenderFlag',
    decorator_time_flag: 'debugmessage decoratorTimeFlag',
    decorator_tips_flag: 'debugmessage decoratorTipsFlag',
    autogreet_newcomer_flag: 'debugmessage autogreetRoomFlag',
    autogreet_newcomer_background_color: 'autogreetRoomBackgroundColor',
    autogreet_newcomer_text_color: 'autogreetRoomTextColor',
    autogreet_newcomer_boldness: 'autogreetRoomBoldness',
    autogreet_newcomer_format: 'successmessage autogreetRoomFormat',
    autogreet_newfanclub_flag: 'debugmessage autogreetFanclubFlag',
    autogreet_newfanclub_background_color: 'autogreetFanclubBackgroundColor',
    autogreet_newfanclub_text_color: 'autogreetFanclubTextColor',
    autogreet_newfanclub_boldness: 'autogreetFanclubBoldness',
    autogreet_newfanclub_format: 'successmessage autogreetFanclubFormat',
    autothank_follower_flag: 'debugmessage autothankFollowFlag',
    autothank_follower_background_color: 'autothankFollowBackgroundColor',
    autothank_follower_text_color: 'autothankFollowTextColor',
    autothank_follower_boldness: 'autothankFollowBoldness',
    autothank_follower_format: 'successmessage autothankFollowFormat',
    autothank_tip_flag: 'debugmessage autothankTipFlag',
    autothank_tip_above_tokens: 'autothankTipAboveTokens',
    autothank_tip_publicly_background_color: 'autothankTipPubliclyBackgroundColor',
    autothank_tip_publicly_text_color: 'autothankTipPubliclyTextColor',
    autothank_tip_publicly_boldness: 'autothankTipPubliclyBoldness',
    autothank_tip_publicly_format: 'successmessage autothankTipPubliclyFormat',
    autothank_tip_privately_background_color: 'autothankTipPrivatelyBackgroundColor',
    autothank_tip_privately_text_color: 'autothankTipPrivatelyTextColor',
    autothank_tip_privately_boldness: 'autothankTipPrivatelyBoldness',
    autothank_tip_privately_format: 'successmessage autothankTipPrivatelyFormat',
    autothank_tip_remind_note_format: 'successmessage autothankTipRemindNoteFormat',
    autothank_tip_remind_note_flag: 'autothankTipRemindNoteFlag',
    collect_stats_flag: 'debugmessage collectStatsShownTo',
    collect_stats_followers: 'collectStatsFollowers',
    collect_stats_newcomers: 'collectStatsNewcomers',
    collect_stats_fanclubs: 'collectStatsFanclubs',
    best_tippers_flag: 'debugmessage bestTippersFlag',
    best_tippers_start_tokens: 'bestTippersStartTokens',
    best_tippers_repeat_minutes: 'bestTippersRepeatMinutes',
    best_tippers_stack_size: 'bestTippersStackSize',
    best_tippers_background_color: 'bestTippersBackgroundColor',
    best_tippers_text_color: 'bestTippersTextColor',
    best_tippers_boldness: 'bestTippersBoldness',
    best_tippers_format: 'successmessage bestTippersFormat',
    tip_menu_flag: 'debugmessage tipMenuShownTo',
    tip_menu_header: 'tipMenuHeader',
    tip_menu_footer: 'tipMenuFooter',
    inline_separator: 'inlineSeparator',
    inline_spacing: 'inlineSpacing',
    menu_background_color: 'menuBackgroundColor',
    menu_text_color: 'menuTextColor',
    menu_boldness: 'menuBoldness',
    menu_repeat_minutes: 'menuRepeatMinutes',
    menu_item_prefix: 'menuItemPrefix',
    menu_item_suffix: 'menuItemSuffix',
    menu_item_display_format: 'successmessage menuItemDisplayFormat',
    sort_order: 'sortOrder',
    menu_item_lbl: 'menuItemLbl',
};

/**
 * Localized labels for the admin UI & localized message templates for the chat
 */
const i18n = {
    en: {
        app_name: "GLOBAL SETTINGS ------------ App name",
        errors_flag: "Show the start-up errors to...",
        automod_unicode_flag: 'AUTOMOD NON-ENGLISH TEXT ------------ who to allow',
        automod_links_flag: 'AUTOMOD LINKS ------------ who to allow',
        automods_verbosity: 'Who gets a notice of each infraction (all automods)',
        automods_record_flag: 'Record automod infractions in chat (all automods)',
        automods_noaction: '[{APP}] Message from {USER} was ignored by autobot ({LABEL})',
        automods_user_count: '[{APP}] Automod recorded {COUNT} infractions for {USER}',
        decorator_gender_flag: "INDICATOR OF USER'S SEX IN CHAT ------------",
        decorator_time_flag: 'INDICATOR OF TIME IN CHAT (GMT/UTC) ------------',
        lbl_time_short: 'HH:MM',
        lbl_time_medium: 'HH:MM:SS',
        lbl_time_full: 'HH:MM:SS +timezone',
        decorator_tips_flag: 'INDICATOR OF TIPPED AMOUNT IN CHAT ------------',
        autogreet_newcomer_flag: 'AUTOMATICALLY GREET NEWCOMERS (in the room) ------------',
        autogreet_newcomer_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autogreet_newfanclub_flag: 'AUTOMATICALLY GREET NEW FANS (to the fanclub) ------------',
        autogreet_newfanclub_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_follower_flag: 'AUTOMATICALLY THANK FOLLOWERS ------------',
        autothank_follower_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_tip_flag: "AUTOMATICALLY THANK TIPPERS ------------",
        autothank_tip_above_tokens: "Only tips above this limit will get a thank you",
        autothank_tip_publicly_background_color: "Background color for the public thanks (hexa code)",
        autothank_tip_publicly_text_color: "Text color for the public thanks (hexa code)",
        autothank_tip_publicly_boldness: "Text thickness for the public thanks",
        autothank_tip_publicly_format: "Template for the public thanks (variables are: {USER}, {AMOUNT}, {SERVICE}) - english recommended",
        autothank_tip_privately_background_color: "Background color for the private thanks (hexa code)",
        autothank_tip_privately_text_color: "Text color for the private thanks (hexa code)",
        autothank_tip_privately_boldness: "Text thickness for the private thanks",
        autothank_tip_privately_format: "Template for the private thanks (variables are: {USER}, {AMOUNT}, {SERVICE}) - english recommended",
        autothank_tip_remind_note_flag: 'Whether to repeat the tip note back to the user',
        autothank_tip_remind_note_format: "Template for the tip note reminder (variables are: {MESSAGE}) - english recommended",
        collect_stats_flag: "STATS COMMAND ------------",
        collect_stats_followers: 'Include new follower stats?',
        collect_stats_newcomers: 'Include influx (chat members)?',
        collect_stats_fanclubs: 'Include fanclub subscriptions?',
        best_tippers_flag: 'BEST TIPPER(S) ------------',
        best_tippers_start_tokens: 'Minimum tokens',
        best_tippers_repeat_minutes: 'Repeat every X minute',
        best_tippers_stack_size: 'Show X winners',
        best_tippers_format: 'Template for the best tipper(s) notice (variables are: {USER}, {AMOUNT}) - english recommended',
        tip_menu_flag: "TIP MENU {MENU} ------------",
        tip_menu_header: "Line before the tip menu {MENU}",
        tip_menu_footer: "Line at the end of the tip menu {MENU}",
        inline_separator: "Separator for a one-line tip menu {MENU} (leave empty for multi-line)",
        inline_spacing: "Spacing around the one-liner separator in menu {MENU}",
        menu_background_color: "Background color for the tip menu {MENU} (hexa code)",
        menu_text_color: "Text color for the tip menu {MENU} (hexa code)",
        menu_boldness: "Text thickness for the tip menu {MENU}",
        menu_repeat_minutes: "The menu {MENU} will repeat every X minutes",
        menu_item_prefix: "Text prefix for the menu {MENU} items (prepend)",
        menu_item_suffix: "Text suffix for the menu {MENU} items (append)",
        menu_item_display_format: "Template for the tip menu {MENU} items (variables are: {LABEL}, {AMOUNT}) - english recommended",
        colorslist_header: 'This is a sample list of colors to help you configure the bot:',
        sort_order: "Sort the menu {MENU} items before display, regardless of their order below",
        menu_item_lbl: "menu item #{MENUIDX}{ITEMIDX}",
        lbl_group_havetk: "have tokens + fans + mods + model",
        lbl_group_50tk: "Dark Blue (Tipped 50 recently)",
        lbl_group_250tk: "Light Purple (Tipped 250 recently)",
        lbl_group_1000tk: "Dark Purple (Tipped 1000 recently)",
        lbl_broadcaster: "broadcaster only",
        lbl_mods: "moderators + broadcaster",
        lbl_fans: "fans + moderators + broadcaster",
        lbl_guests: "anonymous only",
        lbl_everyone: "everyone in chat",
        lbl_single_user: "user only in chat",
        lbl_user_bcaster: 'user + broadcaster',
        lbl_user_mods: 'user + mods + broadcaster',
        lbl_enabled: 'enabled',
        lbl_not_applicable: "n/a (disabled)",
        lbl_inline_spacing_before: "before",
        lbl_inline_spacing_after: "after",
        lbl_inline_spacing_both: "before + after",
        lbl_sort_amount_asc: "lowest to highest price",
        lbl_sort_amount_desc: "highest to lowest price",
        expl_bgcolor: 'Background color (hexa code)',
        expl_txtcolor: 'Text color (hexa code)',
        expl_boldness: 'Text thickness',
        expl_autogreet_newcomer_format: 'Hi {USER}, welcome to my room!',
        expl_autogreet_newfanclub_format: '{USER} has joined my fan club!',
        expl_autothank_follower_format: 'Thanks for following me {USER}!',
        expl_autothank_tip_publicly_format: "{USER} tipped {AMOUNT} for {SERVICE}",
        expl_autothank_tip_privately_format: "Thank you {USER} for your {AMOUNT}tk tip",
        expl_autothank_tip_remind_note_format: "Your tip note was: {MESSAGE}",
        expl_best_tippers_format: "Be the king with {AMOUNT} and get special treatment!",
        lbl_collect_stats_header: '[{APP}] current stats (since {LABEL} GMT):',
        lbl_collect_stats_separator: "; ",
        lbl_collect_stats_tips: '{AMOUNT} tokens in {COUNT} tips',
        lbl_collect_stats_notes: '{COUNT} tip notes',
        lbl_collect_stats_followers: '{COUNT} new followers',
        lbl_collect_stats_newcomers: '{COUNT} new chat members',
        lbl_collect_stats_fanclubs: '{COUNT} new fanclub members',
        lbl_collect_stats_nothingyet: 'nothing yet',
        lbl_collect_stats_nochange: 'no change since last time',
        expl_menu_item_display_format: "{LABEL} ({AMOUNT}tk)",
        errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' in {APP} {LABEL} (currently valued at '{VALUE}')",
        errmsg_app_disabled: "app is disabled",
        errmsg_app_errors: "has errors: app is stopped",
        errmsg_missing: "requires {VARNAME} value",
        errmsg_empty: "should not be empty",
        errmsg_allowlist: 'value "{LABEL}" not in the allowed list [{MESSAGE}]',
        errmsg_color_format: "should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)",
        errmsg_tipmenu_once: "the menu will not be shown again in the chat",
        errmsg_tipmenu_entire: "tip menu as a whole",
        errmsg_tipmenu_noitems: "requires at least one valid item: the app will not display anything at this time",
        errmsg_tipmenu_item_format: "should start with a number followed by a label: disabled for now",
        errmsg_thanks_module_disabled: "disabled thanking module",
        errmsg_thanks_module_errors: "has errors, so the thanking module is disabled",
        errmsg_dbg_start: "dbg start for '{LABEL}' object at {TIME}",
        errmsg_dbg_end: "dbg end for '{LABEL}' object at {TIME}",
        hidden_msg: '[{APP} hid this message]',
        errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
        errmsg_automod_unicode: 'disallowed text',
        errmsg_automod_link: 'link attempt',
        expl_commands_available: "Available commands:",
        expl_commands_tipmenu: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
        expl_commands_colorslist: "/colors or /colorslist -- Display a list of color codes",
        expl_commands_stats: "/stats -- Display the statistics collected for this streaming session",
        errlbl_command_not_recognized: "[{APP}] Your command was not recognized.\nReminder: any message that starts with '/' or '!' is handled as a command for this bot.",
    },
    es: {
        app_name: "OPCIONES GLOBALES ------------ Nombre de la aplicacion",
        errors_flag: "Quien puede ver los errores...",
        automod_unicode_flag: 'AUTOMOD NON-ENGLISH TEXT ------------ who to allow',
        automod_links_flag: 'AUTOMOD LINKS ------------ who to allow',
        automods_verbosity: 'Quien tiene una Notice de cada infraccion (todos los automods)',
        automods_record_flag: 'Guardar las infracciones automod en el chat (todos los autmods)',
        automods_noaction: '[{APP}] El message de {USER} ha sido ignorado por autobot ({LABEL})',
        automods_user_count: '[{APP}] Automod recorded {COUNT} infractions for {USER}',
        decorator_gender_flag: 'INDICACION DEL SEXO DE LOS USUARIOS EN EL CHAT ------------',
        decorator_time_flag: 'INDICACION DEL TIEMPO EN EL CHAT (GMT/UTC) ------------',
        lbl_time_short: 'HH:MM',
        lbl_time_medium: 'HH:MM:SS',
        lbl_time_full: 'HH:MM:SS +timezone',
        decorator_tips_flag: 'INDICATOR OF TIPPED AMOUNT IN CHAT ------------',
        autogreet_newcomer_flag: 'AUTOMATICALLY GREET NEWCOMERS (in the room) ------------',
        autogreet_newcomer_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autogreet_newfanclub_flag: 'AUTOMATICALLY GREET NEW FANS (to the fanclub) ------------',
        autogreet_newfanclub_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_follower_flag: 'AUTOMATICALLY THANK FOLLOWERS ------------',
        autothank_follower_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_tip_flag: "MODULO AGRADECIMIENTOS ------------",
        autothank_tip_above_tokens: "Solo los tips que superan este limite tendran agradecimientos",
        autothank_tip_publicly_background_color: "Color de fondo para las gracias en publico (codigo hexa)",
        autothank_tip_publicly_text_color: "Color del texto para las gracias en publico (codigo hexa)",
        autothank_tip_publicly_boldness: "Grosor de la letra para las gracias en publico",
        autothank_tip_publicly_format: "Modelo del mensaje para las gracias en publico (variables son: {USER}, {AMOUNT}, {SERVICE}) - Ingles recommendado",
        autothank_tip_privately_background_color: "Color de fondo para las gracias en privado (codigo hexa)",
        autothank_tip_privately_text_color: "Color del texto para las gracias en privado (codigo hexa)",
        autothank_tip_privately_boldness: "Grosor de la letra para las gracias en privado",
        autothank_tip_privately_format: "Modelo del mensaje para las gracias en privado (variables son: {USER}, {AMOUNT}, {SERVICE}) - Ingles recommendado",
        autothank_tip_remind_note_flag: 'Whether to repeat the tip note back to the user',
        autothank_tip_remind_note_format: "Modelo del mensaje para el recordatorio de tip note (variables son: {MESSAGE}) - Ingles recommendado",
        collect_stats_flag: "COMANDO DE STATS ------------",
        collect_stats_followers: 'Incluir nuevos seguidores?',
        collect_stats_newcomers: 'Incluir afluencia (miembros del chat)?',
        collect_stats_fanclubs: 'Incluir suscripciones al fanclub?',
        best_tippers_flag: 'MEJOR(ES) TIPPER(S) ------------',
        best_tippers_start_tokens: 'Minimum tokens',
        best_tippers_repeat_minutes: 'Repeat every X minute',
        best_tippers_stack_size: 'Show X winners',
        best_tippers_format: '',
        tip_menu_flag: "MENU DE TIPS {MENU} ------------",
        tip_menu_header: "Linea antes del menu de tips {MENU}",
        tip_menu_footer: "Linea despues del menu de tips {MENU}",
        inline_separator: "Separacion para un menu monolinea (dejar vacio para multi linea)",
        inline_spacing: "Espacio alrededor de la separacion monolinea para el menu {MENU}",
        menu_background_color: "Color de fondo para el menu de tips {MENU} (codigo hexa)",
        menu_text_color: "Color del texto para el menu de tips {MENU} (codigo hexa)",
        menu_boldness: "Grosor de la letra para el menu de tips {MENU}",
        menu_repeat_minutes: "El menu {MENU} sera repetido cada X minutos",
        menu_item_prefix: "Prefijo para cada elemento del menu {MENU}",
        menu_item_suffix: "Sufijo para cada elemento del menu {MENU}",
        menu_item_display_format: "Modelo del mensaje para el menu de tips {MENU} (variables son: {LABEL}, {AMOUNT}) - Ingles recommendado",
        colorslist_header: 'A continuacion un listado de colores para ayudarle a configurar el bot:',
        sort_order: "Ordenar el menu {MENU}, sin tener cuenta de la orden aqui abajo",
        menu_item_lbl: "elemento del menu #{MENUIDX}{ITEMIDX}",
        lbl_group_havetk: "con tokens + fans + mods + streamer",
        lbl_group_50tk: "Azul Oscuro (Ha Tippeado 50 recientemente)",
        lbl_group_250tk: "Violeta Clarito (Ha Tippeado 250 recientemente)",
        lbl_group_1000tk: "Violeta Oscuro (Ha Tippeado 1000 recientemente)",
        lbl_broadcaster: "streamer",
        lbl_mods: "moderadores + streamer",
        lbl_fans: "fans + mods + streamer",
        lbl_guests: "no conectados / anon",
        lbl_everyone: "todo el mundo en el chat",
        lbl_single_user: "solo el usuario en el chat",
        lbl_user_bcaster: 'user + broadcaster',
        lbl_user_mods: 'user + mods + broadcaster',
        lbl_enabled: 'activar',
        lbl_not_applicable: "n/a (desactivar)",
        lbl_inline_spacing_before: "antes",
        lbl_inline_spacing_after: "despues",
        lbl_inline_spacing_both: "antes + despues",
        lbl_sort_amount_asc: "del precio mas bajo al mas alto",
        lbl_sort_amount_desc: "del precio mas alto al mas bajo",
        expl_bgcolor: 'Background color (hexa code)',
        expl_txtcolor: 'Text color (hexa code)',
        expl_boldness: 'Text thickness',
        expl_autogreet_newcomer_format: 'Hi {USER}, welcome to my room!',
        expl_autogreet_newfanclub_format: '{USER} has joined my fan club!',
        expl_autothank_follower_format: "Thanks for following me {USER}!",
        expl_autothank_tip_publicly_format: "{USER} tipped {AMOUNT} for {SERVICE}",
        expl_autothank_tip_privately_format: "Thank you {USER} for your {AMOUNT}tk tip",
        expl_autothank_tip_remind_note_format: "Your tip note was: {MESSAGE}",
        expl_best_tippers_format: "Be the king with {AMOUNT} and get special treatment!",
        lbl_collect_stats_header: '[{APP}] current stats (since {LABEL} GMT):',
        lbl_collect_stats_separator: "; ",
        lbl_collect_stats_tips: '{AMOUNT} tokens in {COUNT} tips',
        lbl_collect_stats_notes: '{COUNT} tip notes',
        lbl_collect_stats_followers: '{COUNT} new followers',
        lbl_collect_stats_newcomers: '{COUNT} new chat members',
        lbl_collect_stats_fanclubs: '{COUNT} new fanclub members',
        lbl_collect_stats_nothingyet: 'nothing yet',
        lbl_collect_stats_nochange: 'no change since last time',
        expl_menu_item_display_format: "{LABEL} ({AMOUNT}tk)",
        errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' en {APP} {LABEL} (actualmente vale '{VALUE}')",
        errmsg_app_disabled: "el bot esta desactivado",
        errmsg_app_errors: "hay errores: el bot esta parado",
        errmsg_missing: "necesita el valor {VARNAME}",
        errmsg_empty: "no puede estar vacio",
        errmsg_allowlist: 'el valor "{LABEL}" no esta autorizado [{MESSAGE}]',
        errmsg_color_format: "debe empezar con # seguido por 6 cifras y letras (cifras de 0 hasta 9 y letras de A hasta F)",
        errmsg_tipmenu_once: "el menu no se ensenara mas en el chat",
        errmsg_tipmenu_entire: "el tip menu",
        errmsg_tipmenu_noitems: "necesita al menos un elemento valido: la app no puede ensenar nada de momento",
        errmsg_tipmenu_item_format: "debe empezar por un numero seguido por una descripcion: desactivado de momento",
        errmsg_thanks_module_disabled: "MODULO de agradecimientos esta desactivado",
        errmsg_thanks_module_errors: "hay errores, asi que el MODULO de agradecimientos esta desactivado",
        errmsg_dbg_start: "dbg empieza para objeto '{LABEL}': {TIME}",
        errmsg_dbg_end: "dbg fin para objeto '{LABEL}': {TIME}",
        hidden_msg: '[{APP} ha escondido este mensaje]',
        errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
        errmsg_automod_unicode: 'disallowed text',
        errmsg_automod_link: 'link attempt',
        expl_commands_available: "Available commands:",
        expl_commands_tipmenu: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
        expl_commands_colorslist: "/colors or /colorslist -- Display a list of color codes",
        expl_commands_stats: "/stats -- Display the statistics collected for this streaming session",
        errlbl_command_not_recognized: "[{APP}] Su comando no ha funcionado.\nRecordatorio: todo mensaje que empieza por '/' o '!' se entiende como un comando por este bot.",
    },
    fr: {
        app_name: "PARAMETRES GENERAUX ------------ Nom de l'aplication",
        errors_flag: "A qui montrer les erreurs de demarrage...",
        automod_unicode_flag: 'AUTOMOD NON-ENGLISH TEXT ------------ who to allow',
        automod_links_flag: 'AUTOMOD LINKS ------------ who to allow',
        automods_verbosity: "A qui montrer les Notices d'infractions (tous les automods)",
        automods_record_flag: 'Enregistrer les infractions automod dans le chat (tous les autmods)',
        automods_noaction: '[{APP}] Le message de {USER} a ete ignore par autobot ({LABEL})',
        automods_user_count: '[{APP}] Automod a enregistre {COUNT} infractions pour {USER}',
        decorator_gender_flag: 'INDICATEUR DU SEXE DES UTILISATEURS DU CHAT ------------',
        decorator_time_flag: 'INDICATEUR DU TEMPS DANS LE CHAT (GMT/UTC) ------------',
        lbl_time_short: 'HH:MM',
        lbl_time_medium: 'HH:MM:SS',
        lbl_time_full: 'HH:MM:SS +timezone',
        decorator_tips_flag: 'INDICATOR OF TIPPED AMOUNT IN CHAT ------------',
        autogreet_newcomer_flag: 'AUTOMATICALLY GREET NEWCOMERS (in the room) ------------',
        autogreet_newcomer_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autogreet_newfanclub_flag: 'AUTOMATICALLY GREET NEW FANS (to the fanclub) ------------',
        autogreet_newfanclub_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_follower_flag: 'AUTOMATICALLY THANK FOLLOWERS ------------',
        autothank_follower_format: 'Template for the notice in chat (variables are: {USER}) - english recommended',
        autothank_tip_flag: "MODULE REMERCIEMENTS ------------",
        autothank_tip_above_tokens: "Seuls les tips au dela de cette limite sont remercies",
        autothank_tip_publicly_background_color: "Couleur de fond pour les remerciements en public (code hexa)",
        autothank_tip_publicly_text_color: "Couleur du texte pour les remerciements en public (code hexa)",
        autothank_tip_publicly_boldness: "Epaisseur du texte pour les remerciements en public",
        autothank_tip_publicly_format: "Modele du message pour les remerciements en public (variables sont : {USER}, {AMOUNT}, {SERVICE}) - anglais recommande",
        autothank_tip_privately_background_color: "Couleur de fond pour les remerciements prives (code hexa)",
        autothank_tip_privately_text_color: "Couleur du texte pour les remerciements prives (code hexa)",
        autothank_tip_privately_boldness: "Epaisseur du texte pour les remerciements prives",
        autothank_tip_privately_format: "Modele du message pour les remerciements prives (variables sont : {USER}, {AMOUNT}, {SERVICE}) - anglais recommande",
        autothank_tip_remind_note_flag: 'Whether to repeat the tip note back to the user',
        autothank_tip_remind_note_format: "Modele du message pour le rappel de tip note (variables sont : {MESSAGE}) - anglais recommande",
        collect_stats_flag: "COMMANDE DE STATS ------------",
        collect_stats_followers: 'Inclure nouveaux abonnes?',
        collect_stats_newcomers: 'Inclure affluence (du chat)?',
        collect_stats_fanclubs: 'Inclure inscriptions au fanclub?',
        best_tippers_flag: 'MEILLEUR(S) TIPPERS ------------',
        best_tippers_start_tokens: 'Minimum tokens',
        best_tippers_repeat_minutes: 'Repeat every X minute',
        best_tippers_stack_size: 'Show X winners',
        best_tippers_format: '',
        tip_menu_flag: "MENU DE TIPS {MENU} ------------",
        tip_menu_header: "Ligne avant le menu de tips {MENU}",
        tip_menu_footer: "Ligne apres le menu de tips {MENU}",
        inline_separator: "Separateur pour un menu monoligne (laisser vide pour multi ligne)",
        inline_spacing: "Espacement autour du separateur monoligne dans le menu {MENU}",
        menu_background_color: "Couleur de fond pour le menu de tips {MENU} (code hexa)",
        menu_text_color: "Couleur du texte pour le menu de tips {MENU} (code hexa)",
        menu_boldness: "Epaisseur du texte pour le menu de tips {MENU}",
        menu_repeat_minutes: "Le menu {MENU} sera repete toutes les X minutes",
        menu_item_prefix: "Prefixe pour chaque element du menu {MENU}",
        menu_item_suffix: "Suffixe pour chaque element du menu {MENU}",
        menu_item_display_format: "Modele du message pour le menu de tips {MENU} (variables sont : {LABEL}, {AMOUNT}) - anglais recommande",
        colorslist_header: 'Voici une liste de couleurs pour vous aider a parametrer le bot:',
        sort_order: "Trier le menu {MENU} avant affichage, peu importe l'ordre ci dessous",
        menu_item_lbl: "element du menu #{MENUIDX}{ITEMIDX}",
        lbl_group_havetk: "ont des tokens + fans + mods + streameur",
        lbl_group_50tk: "Bleu Fonce (A Tippe 50 recemment)",
        lbl_group_250tk: "Violet Clair (A tippe 250 recemment)",
        lbl_group_1000tk: "Violet Fonce (A tippe 1000 recemment)",
        lbl_broadcaster: "streameur seulement",
        lbl_mods: "moderateurs + streameur",
        lbl_fans: "fans + mods + streameur",
        lbl_guests: "non connectes / anonymes",
        lbl_everyone: "tout le monde dans le chat",
        lbl_single_user: "utilisateur uniquement dans le chat",
        lbl_user_bcaster: 'user + broadcaster',
        lbl_user_mods: 'user + mods + broadcaster',
        lbl_enabled: 'active',
        lbl_not_applicable: "n/a (desactiver)",
        lbl_inline_spacing_before: "avant",
        lbl_inline_spacing_after: "apres",
        lbl_inline_spacing_both: "avant + apres",
        lbl_sort_amount_asc: "du prix le plus faible au plus eleve",
        lbl_sort_amount_desc: "du prix le plus eleve au plus faible",
        expl_bgcolor: 'Background color (hexa code)',
        expl_txtcolor: 'Text color (hexa code)',
        expl_boldness: 'Text thickness',
        expl_autogreet_newcomer_format: 'Hi {USER}, welcome to my room!',
        expl_autogreet_newfanclub_format: '{USER} has joined my fan club!',
        expl_autothank_follower_format: "Thanks for following me {USER}!",
        expl_autothank_tip_publicly_format: "{USER} tipped {AMOUNT} for {SERVICE}",
        expl_autothank_tip_privately_format: "Thank you {USER} for your {AMOUNT}tk tip",
        expl_autothank_tip_remind_note_format: "Your tip note was: {MESSAGE}",
        expl_best_tippers_format: "Be the king with {AMOUNT} and get special treatment!",
        lbl_collect_stats_header: '[{APP}] current stats (since {LABEL} GMT):',
        lbl_collect_stats_separator: "; ",
        lbl_collect_stats_tips: '{AMOUNT} tokens in {COUNT} tips',
        lbl_collect_stats_notes: '{COUNT} tip notes',
        lbl_collect_stats_followers: '{COUNT} new followers',
        lbl_collect_stats_newcomers: '{COUNT} new chat members',
        lbl_collect_stats_fanclubs: '{COUNT} new fanclub members',
        lbl_collect_stats_nothingyet: 'nothing yet',
        lbl_collect_stats_nochange: 'no change since last time',
        expl_menu_item_display_format: "{LABEL} ({AMOUNT}tk)",
        errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' dans {APP} {LABEL} (vaut actuellement '{VALUE}')",
        errmsg_app_disabled: "l'app est desactivee",
        errmsg_app_errors: "a des erreurs : l'app est arretee",
        errmsg_missing: "necessite une valeur {VARNAME}",
        errmsg_empty: "ne devrait pas etre vide",
        errmsg_allowlist: 'la valeur "{LABEL}" n\'est pas autorisee [{MESSAGE}]',
        errmsg_color_format: "devrait commencer par un # suivi de 6 chiffres et lettres (chiffres de 0 jusque 9 et lettres de A jusque F)",
        errmsg_tipmenu_once: "le menu ne sera pas repete dans le chat",
        errmsg_tipmenu_entire: "le menu dans son ensemble",
        errmsg_tipmenu_noitems: "requiert au moins un element valide : l'app ne peut rien afficher",
        errmsg_tipmenu_item_format: "devrait commencer par un nombre suivi d'un libelle : desactive pour le moment",
        errmsg_thanks_module_disabled: "module de remerciements inactif",
        errmsg_thanks_module_errors: "contient des erreurs, ainsi le module de remerciements est inactif",
        errmsg_dbg_start: "debut dbg pour '{LABEL}' a {TIME}",
        errmsg_dbg_end: "fin dbg pour '{LABEL}' a {TIME}",
        hidden_msg: '[{APP} a masque ce message]',
        errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
        errmsg_automod_unicode: 'disallowed text',
        errmsg_automod_link: 'link attempt',
        expl_commands_available: "Available commands:",
        expl_commands_tipmenu: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
        expl_commands_colorslist: "/colors or /colorslist -- Display a list of color codes",
        expl_commands_stats: "/stats -- Display the statistics collected for this streaming session",
        errlbl_command_not_recognized: "[{APP}] Votre commande n'est pas reconnue.\nRappel : tout message commencant par '/' ou '!' est traite comme une commande par ce bot.",
    },
};



/**
 * Main object for the app, grouping all the custom methods
 */
const FlexibleTipMenu = {
    /**
     * Start date & time of the bot
     */
    start: null,

    /**
     * List of feature flags, conditionally enabled before the event listeners are set
     */
    run_flags: {
        autogreet_newcomer: false,
        autogreet_newfanclub: false,
        autothank_follower: false,
        autothank_tip: false,
        collect_stats: false,
    },

    /**
     * Archive of automod infractions, recorded while the bot is running
     */
    automod_infractions: {},

    /**
     * Archive of stats about users in the room, collected while the bot is running
     */
    collected_stats: {
        all: {
            nb_events: 0,
            nb_tips: 0,
            total_amount: 0,
            nb_notes: 0,
            nb_followers: 0,
            nb_newcomers: 0,
            nb_fanclubs: 0,
        },
        tippers: {},
        top_tippers: [],
        followers: [],
        newcomers: [],
        fanclubs: [],
        last_hash: null,
    },

    /**
     * Removes remaining {VAR} syntax from a notice template;
     * This is expected to run at the last moment before cb.sendNotice()
     * After all variables were reasonably replaced
     * @param {string} notice_tpl The notice template meant for cb.sendNotice()
     * @returns The updated notice
     */
    clean_str: function(notice_tpl) {
        if (!notice_tpl.trim()) {
            return '';
        }

        const cfg_app_name = FlexibleTipMenu.val('app_name');

        return notice_tpl
            .replace(label_patterns.app_name, cfg_app_name ? cfg_app_name : default_app_name)
            .replace(label_patterns.broadcaster_name, cb.room_slug)
            .replace(specific_patterns.all_var_names, ' ')
            .trim();
    },

    /**
     * Display app errors in the chat, according to app settings
     * @param {string} cfg_name The name of the app setting that failed
     * @param {string} error_lbl A short label to insert in the notice
     * @param {string} bg_color Color code for the background
     * @param {string} txt_color Color code for the text
     */
    alert_error: function(cfg_name, error_lbl, bg_color = null, txt_color = null) {
        bg_color = bg_color ? bg_color : colors_sample['bright red'];
        txt_color = txt_color ? txt_color : colors_sample.white;
        const cfg_app_name = FlexibleTipMenu.val('app_name');
        const cfg_setting_name = FlexibleTipMenu.i18n(cfg_name);
        const setting_name = (null === cfg_setting_name) ? cfg_name : cfg_setting_name;
        const setting_value = FlexibleTipMenu.val(cfg_name);
        const notice_raw = FlexibleTipMenu.i18n('errmsg_format')
            .replace(label_patterns.app_name, cfg_app_name ? cfg_app_name : default_app_name)
            .replace(label_patterns.broadcaster_name, cb.room_slug)
            .replace(label_patterns.label, error_lbl)
            .replace(label_patterns.setting_value, setting_value)
            .replace(label_patterns.setting_name, setting_name);

        if (!shown_errors.includes(notice_raw)) {
            FlexibleTipMenu.send_notice(notice_raw, cb.room_slug, bg_color, txt_color, font_weights.bolder, 'errors_flag', 100, { user: cb.room_slug, gender: '' });
            shown_errors.push(notice_raw);
        }
    },

    /**
     * Gets the hex value of a color from a settings value
     * @param {string} cfg_color The name of the app setting
     * @param {string} default_value Default color code in case the app setting is misspelled by the user
     * @returns The uppercased hex code prefixed with a #
     */
    get_color_code: function(cfg_color, default_value) {
        const cfg_value = FlexibleTipMenu.val(cfg_color);
        const color_match = specific_patterns.hex_color.exec(cfg_value);
        if (null === color_match) {
            FlexibleTipMenu.alert_error(cfg_color, FlexibleTipMenu.i18n('errmsg_color_format'));
            return default_value;
        }

        return '#' + (color_match[1].toUpperCase());
    },

    /**
     * Gets the menu items separator, whether multi- or single-line and according to spacing setting
     * @param {string} cfg_spacing The app setting name for spacing option
     * @param {string} cfg_separator The app setting name for separator option
     * @returns {string} The value
     */
    get_items_separator: function(cfg_spacing, cfg_separator) {
        let items_separator;
        if ('' === cfg_separator) {
            items_separator = "\n";
        } else if (FlexibleTipMenu.i18n('lbl_inline_spacing_before') === cfg_spacing) {
            items_separator = ' ' + cfg_separator;
        } else if (FlexibleTipMenu.i18n('lbl_inline_spacing_after') === cfg_spacing) {
            items_separator = cfg_separator + ' ';
        } else if (FlexibleTipMenu.i18n('lbl_inline_spacing_both') === cfg_spacing) {
            items_separator = ' ' + cfg_separator + ' ';
        } else {
            items_separator = cfg_separator;
        }

        return items_separator;
    },

    /**
     * Gets the localized list of menu items from the app settings, potentially sorted
     * @returns {array} The list
     */
    get_menu_options: function() {
        let options_list = [];
        for (const setting_name in cb.settings) {
            if (!setting_name.startsWith(settings_list.menu_item_lbl)) continue;
            if ('string' !== typeof cb.settings[setting_name]) continue;

            const setting_value = cb.settings[setting_name].trim();
            if ('' === setting_value) continue;

            const menu_item = specific_patterns.menu_item.exec(setting_value);
            if (null === menu_item) {
                FlexibleTipMenu.alert_error(setting_name, FlexibleTipMenu.i18n('errmsg_tipmenu_item_format'), colors_sample['pastel red'], colors_sample.black);
                continue;
            }

            const [, item_amount, item_label] = menu_item;
            options_list.push({ amount: parseInt(item_amount), label: item_label.trim() });
        };

        if (0 === options_list.length) {
            FlexibleTipMenu.alert_error(FlexibleTipMenu.i18n('errmsg_tipmenu_entire'), FlexibleTipMenu.i18n('errmsg_tipmenu_noitems'));
            return [];
        }

        if (!FlexibleTipMenu.is_disabled('sort_order')) {
            options_list.sort(function(a, b) {
                let res;
                if (FlexibleTipMenu.i18n('lbl_sort_amount_asc') === FlexibleTipMenu.val('sort_order')) {
                    res = a.amount - b.amount;
                } else {
                    res = b.amount - a.amount;
                }

                return res;
            });
        }

        return options_list;
    },

    /**
     * Gets the parametrized tip menu lines according to format setting
     * @param {array} options_list Typically from FlexibleTipMenu.get_menu_options()
     * @returns {array} The list of lines suitable for cb.sendNotice()
     */
    get_tip_menu: function(options_list) {
        const has_inline_spacing = (FlexibleTipMenu.i18n('lbl_not_applicable') !== FlexibleTipMenu.val('inline_spacing'));
        const menu_item_prefix = FlexibleTipMenu.val('menu_item_prefix');
        const menu_item_suffix = FlexibleTipMenu.val('menu_item_suffix');
        const menu_item_display_format = FlexibleTipMenu.val('menu_item_display_format');

        let tip_menu_items = [];
        if ('' !== FlexibleTipMenu.val('app_name')) {
            tip_menu_items.push(FlexibleTipMenu.val('app_name'));
        }

        if ('' !== FlexibleTipMenu.val('tip_menu_header')) {
            tip_menu_items.push(FlexibleTipMenu.val('tip_menu_header'));
        }

        for (const menu_option of options_list) {
            let msg = '';
            if (menu_item_prefix) {
                msg += menu_item_prefix;
                if (has_inline_spacing) {
                    msg += ' ';
                }
            }

            msg += menu_item_display_format;
            msg = msg.replace(label_patterns.amount, menu_option.amount);
            msg = msg.replace(label_patterns.label, menu_option.label);
            msg = msg.replace(label_patterns.broadcaster_name, cb.room_slug);

            if (menu_item_suffix) {
                msg += menu_item_suffix;
                if (has_inline_spacing) {
                    msg += ' ';
                }
            }

            tip_menu_items.push(msg);
        }

        if ('' !== FlexibleTipMenu.val('tip_menu_footer')) {
            tip_menu_items.push(FlexibleTipMenu.val('tip_menu_footer'));
        }

        return tip_menu_items;
    },

    /**
     * Collect stats about a tip that happened
     * @param {tip} tip The tip object that was fired with the event
     */
    collect_stats_tip: function(tip) {
        const tip_amount = parseInt(tip.amount);
        const tip_note = tip.message.trim();

        ++FlexibleTipMenu.collected_stats.all.nb_events;
        ++FlexibleTipMenu.collected_stats.all.nb_tips;
        FlexibleTipMenu.collected_stats.all.total_amount += tip_amount;
        if ('' !== tip_note) {
            ++FlexibleTipMenu.collected_stats.all.nb_notes;
        }

        if (tip.is_anon_tip) {
            return;
        }

        const tip_user = tip.from_user;
        if ('undefined' === typeof FlexibleTipMenu.collected_stats.tippers[tip_user]) {
            FlexibleTipMenu.collected_stats.tippers[tip_user] = {
                total_amount: 0, // in tokens
            };
        }

        FlexibleTipMenu.collected_stats.tippers[tip_user].total_amount += tip_amount;

        FlexibleTipMenu.collect_best_tippers();
    },

    collect_best_tippers: function() {
        if (FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            return; // never mind
        }

        if (FlexibleTipMenu.is_disabled('best_tippers_flag')) {
            return; // never mind
        }

        const stack_size = FlexibleTipMenu.val('best_tippers_stack_size');
        if (isNaN(stack_size) || !parseInt(stack_size)) {
            return; // never mind
        }

        let top_x = [];
        for (const _username in FlexibleTipMenu.collected_stats.tippers) {
            const _total = FlexibleTipMenu.collected_stats.tippers[_username].total_amount;
            top_x.push({ user: _username, total: _total });
        }

        if (!top_x.length) {
            FlexibleTipMenu.collected_stats.top_tippers = []; // not necessary, but...
            return; // never mind
        }

        top_x.sort((user1, user2) => user1.total - user2.total); // ORDER BY total DESC
        FlexibleTipMenu.collected_stats.top_tippers = top_x.slice(0, parseInt(stack_size));
    },

    /**
     * Collect stats about a user action (non-tip)
     * @param {user} user The user object that was fired with the event
     */
    collect_stats_user: function(namespace, user) {
        // @todo possibly check if the user is anonymous etc
        if (!user || !user.user || user.user === cb.room_slug) {
            return;
        }

        const allowlist = ['followers', 'newcomers', 'fanclubs'];
        if (!allowlist.includes(namespace)) {
            const errmsg_lbl = FlexibleTipMenu.i18n('errmsg_allowlist')
                .replace(label_patterns.label, namespace)
                .replace(label_patterns.message, allowlist.join(', '));

            FlexibleTipMenu.alert_error('collect_stats_flag', errmsg_lbl);
            return;
        }

        if (FlexibleTipMenu.is_disabled('collect_stats_' + namespace)) {
            return;
        }

        if (FlexibleTipMenu.collected_stats[namespace].includes(user.user)) {
            return;
        }

        ++FlexibleTipMenu.collected_stats.all.nb_events;
        ++FlexibleTipMenu.collected_stats.all['nb_' + namespace];
        FlexibleTipMenu.collected_stats[namespace].push(user.user);
    },

    collect_stats_follower: function(user) {
        FlexibleTipMenu.collect_stats_user('followers', user);
    },

    collect_stats_newcomer: function(user) {
        FlexibleTipMenu.collect_stats_user('newcomers', user);
    },

    collect_stats_fanclub: function(user) {
        FlexibleTipMenu.collect_stats_user('fanclubs', user);
    },

    hash: function(obj) {
        return JSON.stringify(obj);
    },

    /**
     * Display general stats about the room (current streaming session)
     * @param {string} username Specific user who may have asked for the stats
     */
    show_stats: function(username) {
        if (FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            return;
        }

        let stats_rows = [];
        //stats_rows.push('{COUNT} events'.replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_events));
        if (FlexibleTipMenu.collected_stats.all.nb_tips) {
            const lbl = FlexibleTipMenu.i18n('lbl_collect_stats_tips')
                .replace(label_patterns.amount, FlexibleTipMenu.collected_stats.all.total_amount)
                .replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_tips);

            stats_rows.push(lbl);
        }

        if (FlexibleTipMenu.collected_stats.all.nb_notes) {
            const lbl = FlexibleTipMenu.i18n('lbl_collect_stats_notes')
                .replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_notes);
            stats_rows.push(lbl);
        }

        if (FlexibleTipMenu.collected_stats.all.nb_followers) {
            const lbl = FlexibleTipMenu.i18n('lbl_collect_stats_followers')
                .replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_followers);
            stats_rows.push(lbl);
        }

        if (FlexibleTipMenu.collected_stats.all.nb_newcomers) {
            const lbl = FlexibleTipMenu.i18n('lbl_collect_stats_newcomers')
                .replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_newcomers);
            stats_rows.push(lbl);
        }

        if (FlexibleTipMenu.collected_stats.all.nb_fanclubs) {
            const lbl = FlexibleTipMenu.i18n('lbl_collect_stats_fanclubs')
                .replace(label_patterns.count, FlexibleTipMenu.collected_stats.all.nb_fanclubs);
            stats_rows.push(lbl);
        }

        if (!stats_rows.length) {
            stats_rows.push(FlexibleTipMenu.i18n('lbl_collect_stats_nothingyet'));
        }

        const current_hash = FlexibleTipMenu.hash(stats_rows);
        if (current_hash === FlexibleTipMenu.collected_stats.last_hash) {
            stats_rows.unshift(FlexibleTipMenu.i18n('lbl_collect_stats_nochange'));
        } else {
            FlexibleTipMenu.collected_stats.last_hash = current_hash;
        }

        const header_lbl = FlexibleTipMenu.i18n('lbl_collect_stats_header')
            .replace(label_patterns.label, FlexibleTipMenu.start);

        const separator_lbl = FlexibleTipMenu.i18n('lbl_collect_stats_separator', false);

        FlexibleTipMenu.send_notice(header_lbl + "\n" + stats_rows.join(separator_lbl), username, null, null, font_weights.bolder, 'collect_stats_flag', 100, { user: username, gender: '' });
    },

    /**
     * Display the tip menu, potentially to a specific user or group
     * @param {string} tip_menu_flag Name of the app setting to know who to display to (if anyone)
     * @param {string} username Specific user who may have asked for the menu
     */
    show_menu: function(tip_menu_flag = null, username = null) {
        const menu_boldness = FlexibleTipMenu.val('menu_boldness');
        const background_color = FlexibleTipMenu.get_color_code('menu_background_color', colors_sample.black);
        const text_color = FlexibleTipMenu.get_color_code('menu_text_color', colors_sample.white);
        const options_list = FlexibleTipMenu.get_menu_options();
        const menu_items_separator = FlexibleTipMenu.get_items_separator(FlexibleTipMenu.val('inline_spacing'), FlexibleTipMenu.val('inline_separator'));
        const tip_menu = FlexibleTipMenu.get_tip_menu(options_list).join(menu_items_separator);
        const tip_menu_str = FlexibleTipMenu.clean_str(tip_menu);

        if (tip_menu_flag === null) {
            tip_menu_flag = FlexibleTipMenu.val('tip_menu_flag');
        }

        FlexibleTipMenu.send_notice(tip_menu_str, username, background_color, text_color, menu_boldness, 'tip_menu_flag', 1000);
    },

    /**
     * Start the tip menu with a repeating timer;
     * This is meant to be called on app startup
     */
    show_menu_handler: function() {
        FlexibleTipMenu.show_menu();

        const nb_minutes = FlexibleTipMenu.val('menu_repeat_minutes');
        if (isNaN(nb_minutes) || !parseInt(nb_minutes)) {
            return; // never mind
        }

        cb.setTimeout(FlexibleTipMenu.show_menu_handler, 1000 * 60 * parseInt(nb_minutes));
    },

    /**
     * Look up a service name from the tip menu(s) by its amount
     * @param {integer} tip_amount
     * @returns {boolean|string} The name of the corresponding service in a tip menu, or false
     */
    find_service: function(tip_amount) {
        const options_list = FlexibleTipMenu.get_menu_options();
        if (!options_list || !options_list.length) {
            return false;
        }

        for (const menu_option of options_list) {
            if (menu_option.amount === tip_amount) {
                return menu_option.label;
            }
        }

        return false;
    },

    /**
     * Gets the formatted notice to display in the chat for a tip
     * @param {integer} tip_amount
     * @param {string} from_user
     * @returns {string} The message suitable for cb.sendNotice()
     */
    get_autothank_tip_notice: function(tip_amount, from_user) {
        if (tip_amount <= FlexibleTipMenu.val('autothank_tip_above_tokens')) {
            return false;
        }

        let notice_tpl;
        if (FlexibleTipMenu.i18n('lbl_everyone') === FlexibleTipMenu.val('autothank_tip_flag')) {
            notice_tpl = FlexibleTipMenu.val('autothank_tip_publicly_format');
        } else {
            notice_tpl = FlexibleTipMenu.val('autothank_tip_privately_format');
        }

        let notice = notice_tpl;
        if (label_patterns.service_name.test(notice)) {
            const service_lbl = FlexibleTipMenu.find_service(tip_amount);
            if (!service_lbl) {
                return false;
            }

            notice = notice.replace(label_patterns.service_name, service_lbl);
        }

        notice = notice.replace(label_patterns.amount, tip_amount);
        notice = notice.replace(label_patterns.username, from_user);
        return notice;
    },

    /**
     * Gets the formatted message to display as a user-specific notice to remind the tipper of their tip note
     * @param {string} tip_note
     */
    get_autothank_tip_remind_note_notice: function(tip_note) {
        let res;
        if ('' === tip_note) {
            res = false;
        } else if (!FlexibleTipMenu.val('autothank_tip_remind_note_format').trim()) {
            res = false;
        } else if (!label_patterns.message.test(FlexibleTipMenu.val('autothank_tip_remind_note_format'))) {
            res = false;
        } else {
            res = FlexibleTipMenu.val('autothank_tip_remind_note_format')
                .replace(label_patterns.message, tip_note)
                .replace(label_patterns.broadcaster_name, cb.room_slug);
        }

        return res;
    },

    /**
     * Sends a notice in chat, to relevant users or groups, according to the module's verbosity and visibility settings
     * @param {string} notice_tpl
     * @param {string} dst_username
     * @param {string} bgcolor
     * @param {string} txtcolor
     * @param {string} boldness
     * @param {string} cfg_flag_name
     * @param {integer} delay_ms
     * @param {user} src_user
     */
    send_notice: function(notice_tpl, dst_username, bgcolor, txtcolor, boldness, cfg_flag_name, delay_ms, src_user) {
        if (!notice_tpl) {
            return;
        }

        if (!delay_ms || delay_ms < 0) {
            delay_ms = 100;
        }

        if ('undefined' === typeof src_user) {
            src_user = { user: dst_username, gender: '' };
        }


        if (!FlexibleTipMenu.is_disabled('decorator_time_flag')) {
            // applies to everyone
            notice_tpl = FlexibleTipMenu.decorator_time(notice_tpl);
        }

        if (!FlexibleTipMenu.is_disabled('decorator_tips_flag')) {
            // applies to everyone
            notice_tpl = FlexibleTipMenu.decorator_tips(notice_tpl, src_user.user);
        }


        let broadcaster_notice_tpl = notice_tpl;
        let public_notice_tpl = notice_tpl;

        switch (FlexibleTipMenu.val('decorator_gender_flag')) {
            // broadcaster may get a different version than the rest of the room
            case FlexibleTipMenu.i18n('lbl_broadcaster'):
                broadcaster_notice_tpl = FlexibleTipMenu.decorator_gender_apply(broadcaster_notice_tpl, src_user.user, src_user.gender);
                break;

            case FlexibleTipMenu.i18n('lbl_everyone'):
                broadcaster_notice_tpl = FlexibleTipMenu.decorator_gender_apply(broadcaster_notice_tpl, src_user.user, src_user.gender);
                public_notice_tpl = FlexibleTipMenu.decorator_gender_apply(public_notice_tpl, src_user.user, src_user.gender);
                break;

            case FlexibleTipMenu.i18n('lbl_not_applicable'): // pass through
            default:
                // never mind
        }


        const broadcaster_notice_clean = FlexibleTipMenu.clean_str(broadcaster_notice_tpl);
        const public_notice_clean = FlexibleTipMenu.clean_str(public_notice_tpl);

        switch (FlexibleTipMenu.val(cfg_flag_name)) {
            case 'broadcaster': // pass through
            case FlexibleTipMenu.i18n('lbl_broadcaster'):
                cb.setTimeout(function() {
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_mods'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_fans'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.fans);
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_group_havetk'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.have_tk);
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_group_50tk'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.lbl_group_50tk);
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_group_250tk'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.lbl_group_250tk);
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_group_1000tk'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.lbl_group_1000tk);
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_enabled'): // pass through
            case FlexibleTipMenu.i18n('lbl_everyone'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_single_user'):
                cb.setTimeout(function() {
                    cb.sendNotice(public_notice_clean, dst_username, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_user_bcaster'):
                cb.setTimeout(function() {
                    if (dst_username !== cb.room_slug) {
                        cb.sendNotice(public_notice_clean, dst_username, bgcolor, txtcolor, boldness);
                    }
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_user_mods'):
                cb.setTimeout(function() {
                    if (dst_username !== cb.room_slug) {
                        cb.sendNotice(public_notice_clean, dst_username, bgcolor, txtcolor, boldness);
                    }
                    cb.sendNotice(public_notice_clean, '', bgcolor, txtcolor, boldness, user_groups.mods);
                    cb.sendNotice(broadcaster_notice_clean, cb.room_slug, bgcolor, txtcolor, boldness);
                }, delay_ms);
                break;

            case FlexibleTipMenu.i18n('lbl_not_applicable'): // pass through
            default:
                // never mind
        }
    },

    /**
     * Entrypoint for onTip event; Hands off to various local handlers
     * @param {*} tip
     */
    on_tip: function(tip) {
        if (tip.from_user === cb.room_slug) {
            return;
        }

        if (!FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            FlexibleTipMenu.collect_stats_tip(tip);
        }

        if (!FlexibleTipMenu.is_disabled('autothank_tip_flag')) {
            FlexibleTipMenu.thank_tipper(tip);
        }
    },

    /**
     * Displays a notice to thank the tipper
     * @param {tip} tip The tip object that was fired with the event
     */
    thank_tipper: function(tip) {
        if (tip.is_anon_tip) {
            return;
        }

        const tip_amount = parseInt(tip.amount);
        const tip_note = tip.message.trim();

        const notice_raw = FlexibleTipMenu.get_autothank_tip_notice(tip_amount, tip.from_user);

        if (!notice_raw) {
            // never mind
        } else if (FlexibleTipMenu.i18n('lbl_everyone') === FlexibleTipMenu.val('autothank_tip_flag')) {
            const background_color = FlexibleTipMenu.get_color_code('autothank_tip_publicly_background_color', colors_sample.white);
            const text_color = FlexibleTipMenu.get_color_code('autothank_tip_publicly_text_color', colors_sample.black);
            const boldness = FlexibleTipMenu.val('autothank_tip_publicly_boldness');
            FlexibleTipMenu.send_notice(notice_raw, tip.from_user, background_color, text_color, boldness, 'autothank_tip_flag', 500);
        } else {
            const background_color = FlexibleTipMenu.get_color_code('autothank_tip_privately_background_color', colors_sample.white);
            const text_color = FlexibleTipMenu.get_color_code('autothank_tip_privately_text_color', colors_sample.black);
            const boldness = FlexibleTipMenu.val('autothank_tip_privately_boldness');
            FlexibleTipMenu.send_notice(notice_raw, tip.from_user, background_color, text_color, boldness, 'autothank_tip_flag', 500);
        }

        const reminder_raw = FlexibleTipMenu.get_autothank_tip_remind_note_notice(tip_note);
        const background_color = FlexibleTipMenu.get_color_code('autothank_tip_privately_background_color', colors_sample.white);
        const text_color = FlexibleTipMenu.get_color_code('autothank_tip_privately_text_color', colors_sample.black);
        const boldness = FlexibleTipMenu.val('autothank_tip_privately_boldness');
        FlexibleTipMenu.send_notice(reminder_raw, tip.from_user, background_color, text_color, boldness, 'autothank_tip_remind_note_flag', 500);
    },

    /**
     * Entrypoint for onFollow event; Hands off to various local handlers
     * @param {*} user
     */
    on_follow: function(user) {
        if (user.user === cb.room_slug) {
            return;
        }

        if (!FlexibleTipMenu.is_disabled('autothank_follower_flag')) {
            FlexibleTipMenu.thank_follower(user);
        }

        if (!FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            FlexibleTipMenu.collect_stats_follower(user);
        }
    },

    /**
     * Displays a notice to thank the new follower
     * @param {user} user The user object that was fired with the event
     */
    thank_follower: function(user) {
        // @todo possibly check if the user is in the room before calling the actual function

        if (!user || !user.user || user.user === cb.room_slug) {
            return;
        }

        const collect_stats_ns_enabled = !FlexibleTipMenu.is_disabled('collect_stats_followers');
        if (collect_stats_ns_enabled && FlexibleTipMenu.collected_stats.followers.includes(user.user)) {
            return; // already thanked
        }

        const background_color = FlexibleTipMenu.get_color_code('autothank_follower_background_color', colors_sample.white);
        const text_color = FlexibleTipMenu.get_color_code('autothank_follower_text_color', colors_sample.black);
        const text_boldness = FlexibleTipMenu.val('autothank_follower_boldness');

        const notice_tpl = FlexibleTipMenu.val('autothank_follower_format');
        const notice_raw = notice_tpl.replace(label_patterns.username, user.user);

        FlexibleTipMenu.send_notice(notice_raw, user.user, background_color, text_color, text_boldness, 'autothank_follower_flag', 1000, user);
    },

    /**
     * Displays a notice to greet newcomers (to the room)
     * @param {user} user The user object that was fired with the event
     */
    greet_newcomer_handler: function(user) {
        // @todo possibly check if the user is anonymous etc

        if (!user || !user.user || user.user === cb.room_slug) {
            return;
        }

        const collect_stats_ns_enabled = !FlexibleTipMenu.is_disabled('collect_stats_newcomers');
        if (collect_stats_ns_enabled && FlexibleTipMenu.collected_stats.newcomers.includes(user.user)) {
            return; // already greeted
        }

        const background_color = FlexibleTipMenu.get_color_code('autogreet_newcomer_background_color', colors_sample.white);
        const text_color = FlexibleTipMenu.get_color_code('autogreet_newcomer_text_color', colors_sample.black);
        const text_boldness = FlexibleTipMenu.val('autogreet_newcomer_boldness');

        const notice_tpl = FlexibleTipMenu.val('autogreet_newcomer_format');
        const notice_raw = notice_tpl.replace(label_patterns.username, user.user);

        FlexibleTipMenu.send_notice(notice_raw, user.user, background_color, text_color, text_boldness, 'autogreet_newcomer_flag', 1000, user);
    },

    /**
     * Entrypoint for onEnter event; Hands off to various local handlers
     * @param {*} user
     */
    on_enter: function(user) {
        if (user.user === cb.room_slug) {
            return;
        }

        if (!FlexibleTipMenu.is_disabled('autogreet_newcomer_flag')) {
            FlexibleTipMenu.greet_newcomer_handler(user);
        }

        if (!FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            FlexibleTipMenu.collect_stats_newcomer(user);
        }
    },

    /**
     * Displays a notice to greet new fanclub members
     * @param {user} user The user object that was fired with the event
     */
    greet_newfanclub_handler: function(user) {
        // @todo possibly check if the user is anonymous etc

        if (!user || !user.user || user.user === cb.room_slug) {
            return;
        }

        const collect_stats_ns_enabled = !FlexibleTipMenu.is_disabled('collect_stats_fanclubs');
        if (collect_stats_ns_enabled && FlexibleTipMenu.collected_stats.fanclubs.includes(user.user)) {
            return; // already greeted
        }

        const background_color = FlexibleTipMenu.get_color_code('autogreet_newfanclub_background_color', colors_sample.white);
        const text_color = FlexibleTipMenu.get_color_code('autogreet_newfanclub_text_color', colors_sample.black);
        const text_boldness = FlexibleTipMenu.val('autogreet_newfanclub_boldness');

        const notice_tpl = FlexibleTipMenu.val('autogreet_newfanclub_format');
        const notice_raw = notice_tpl.replace(label_patterns.username, user.user);

        FlexibleTipMenu.send_notice(notice_raw, user.user, background_color, text_color, text_boldness, 'autogreet_newfanclub_flag', 1000, user);
    },

    /**
     * Entrypoint for onFanclubJoin event; Hands off to various local handlers
     * @param {*} user
     */
    on_fanclub_join: function(user) {
        if (user.user === cb.room_slug) {
            return;
        }

        if (!FlexibleTipMenu.is_disabled('autogreet_newfanclub_flag')) {
            FlexibleTipMenu.greet_newfanclub_handler(user);
        }

        if (!FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            FlexibleTipMenu.collect_stats_fanclub(user);
        }
    },

    /**
     * Whether a template string matches its expected format;
     * This will run at bot startup, as a kind of autotest to guide the user in case of misconfiguration
     * @param {string} cfg_setting The name of an app setting, which should refer to a notice template string
     * @param {array} expected_options A list of mandatory labels this template is expected to have
     * @returns
     */
    check_template_format: function(cfg_setting, expected_options) {
        //const cfg_varname = i18n[lang][cfg_setting];
        const notice_tpl = FlexibleTipMenu.val(cfg_setting);
        if (!notice_tpl) {
            FlexibleTipMenu.alert_error(cfg_setting, FlexibleTipMenu.i18n('errmsg_empty'));
            return false;
        }

        const errmsg_missing_tpl = FlexibleTipMenu.i18n('errmsg_missing');
        for (const optname of expected_options) {
            const varname = '{' + optname + '}';
            const regexp = new RegExp(varname, 'i');
            if (!regexp.test(notice_tpl)) {
                const lbl = errmsg_missing_tpl.replace(label_patterns.varname, varname);
                FlexibleTipMenu.alert_error(cfg_setting, lbl);
                return false;
            }
        }

        return true;
    },

    /**
     * Replacement for the official cb.log() function, which does not appear to work;
     * This is meant for debugging and NOT for production
     * @param {*} obj The object to debug in chat
     * @param {*} namespace To identify the object in chat
     * @returns {array} Debug lines to display in chat
     */
    basic_log: function(obj, namespace) {
        let dbg_rows = [];

        const dbg_start = new Date();
        const dbg_lbl_start = FlexibleTipMenu.i18n('errmsg_dbg_start')
            .replace(label_patterns.label, namespace)
            .replace(label_patterns.time, dbg_start.toTimeString());
        dbg_rows.push(dbg_lbl_start);

        for (const idx in obj) {
            const type = typeof(obj[idx]);
            let msg = idx + ': ' + type;
            switch (type) {
                case 'string': // pass through
                case 'number':
                    msg += ' (' + obj[idx] + ')';
                    break;

                case 'boolean':
                    msg += ' (' + (obj[idx] ? 'true' : 'false') + ')';
                    break;

                case 'function':
                    msg += ' (' + (obj[idx].length) + ' params)';
                    break;

                case 'object':
                    let inner_obj = [];
                    for (const inner_idx in obj[idx]) {
                        const inner_type = obj[idx][inner_idx];
                        inner_obj.push(`in ${idx}[${inner_idx}]: ${inner_type} (${obj[idx][inner_idx]})`);
                    }

                    if (0 === inner_obj.length) {
                        dbg_rows.push(msg + ' (empty)');
                        continue;
                    }

                    if (idx === 'settings' || idx === 'settings_choices') {
                        dbg_rows.push(msg + ' (' + inner_obj.length + ' elements)');
                        continue;
                    }

                    dbg_rows.push(msg + ' (' + inner_obj.length + ' elements):');
                    dbg_rows.push(inner_obj.join("\n"));
                    continue;
                    break;

                default:
                    // never mind
            }

            dbg_rows.push(msg);
        }

        const dbg_end = new Date();
        const dbg_lbl_end = FlexibleTipMenu.i18n('errmsg_dbg_end')
            .replace(label_patterns.label, namespace)
            .replace(label_patterns.time, dbg_end.toTimeString());
        dbg_rows.push(dbg_lbl_end);

        return dbg_rows;
    },

    /**
     * Displays the app's list of commands
     * @param {string} username The user who called the command in chat
     * @param {string} usergroup Who should see the menu in chat
     */
    show_commands_help: function(username, usergroup = null) {
        let commands_list = [];
        if (!FlexibleTipMenu.is_disabled('tip_menu_flag')) {
            commands_list.push(FlexibleTipMenu.i18n('expl_commands_tipmenu'));
        }

        commands_list.push(FlexibleTipMenu.i18n('expl_commands_colorslist'));

        if (!FlexibleTipMenu.is_disabled('collect_stats_flag')) {
            commands_list.push(FlexibleTipMenu.i18n('expl_commands_stats'));
        }

        if (!commands_list.length) {
            return;
        }

        commands_list.unshift(FlexibleTipMenu.i18n('expl_commands_available'));
        const notice = FlexibleTipMenu.clean_str(commands_list.join("\n"));

        cb.sendNotice(notice, username, colors_sample.black, colors_sample.white, '', usergroup);
    },

    /**
     * Recommended way to hide message in public chat, but still echoed back to the user
     * @param {message} event_msg The message that came in with the fired Event
     * @returns {message} The updated message
     */
    hide_message: function(event_msg, add_prefix = false) {
        event_msg['X-Spam'] = true;
        if (add_prefix) {
            const prefix_str = FlexibleTipMenu.clean_str(FlexibleTipMenu.i18n('hidden_msg')).trim();
            event_msg.m = prefix_str + ' ' + event_msg.m;
        }

        return event_msg;
    },

    /**
     * Handle generic messages from users
     * @param {message} event_msg The message that came in with the fired Event
     * @returns {message} The updated message
     */
    message_handler: function(event_msg) {
        const txt_msg = event_msg.m.trim();
        if (command_prefixes_allow_list.includes(txt_msg.substring(0, 1))) {
            event_msg = FlexibleTipMenu.commands_handler(event_msg); // that's a command, not a plain message
        } else {
            event_msg = FlexibleTipMenu.plaintext_handler(event_msg); // not a command
        }

        return event_msg;
    },

    /**
     * Entrypoint for onMessage event; Hands off to various local handlers
     * @param {*} message
     * @returns {message} The updated message
     */
    on_message: function(message) {
        return FlexibleTipMenu.message_handler(message);
    },

    /**
     * Notifies relevant people of an exemption made for a message;
     * This means that the message was detected as spammy,
     *   but the bot was configured to ignore this user
     * @param {string} username The username sending the automodded message
     * @param {string} reason A word to describe the reason for the exemption
     */
    automod_noaction: function(username, reason) {
        const notice_raw = FlexibleTipMenu.i18n('automods_noaction')
            .replace(label_patterns.username, username)
            .replace(label_patterns.label, reason);

        FlexibleTipMenu.send_notice(notice_raw, username, null, null, null, 'automods_verbosity', 100);
    },

    /**
     * Keeps track of infractions detected by the automods
     * @param {string} username The username sending the automodded message
     */
    automod_infraction: function(username) {
        if ('undefined' === typeof FlexibleTipMenu.automod_infractions[username]) {
            FlexibleTipMenu.automod_infractions[username] = 0;
        }

        ++FlexibleTipMenu.automod_infractions[username];

        const notice_raw = FlexibleTipMenu.i18n('automods_user_count')
            .replace(label_patterns.username, username)
            .replace(label_patterns.count, FlexibleTipMenu.automod_infractions[username]);

        FlexibleTipMenu.send_notice(notice_raw, username, null, null, null, 'automods_record_flag', 100);
    },

    /**
     * Modify a message according to an automod module's settings
     * @param {message} event_msg The message that came in with the fired Event
     * @param {string} flag_name Name of the app setting for the automod module
     * @param {string} module_lbl A small label to identify the automod in chat (in the main notice)
     * @returns {message} The updated message
     */
    automod_plaintext: function(event_msg, flag_name, module_lbl) {
        const module_flag = FlexibleTipMenu.val(flag_name);
        const lbl_not_applicable = FlexibleTipMenu.i18n('lbl_not_applicable');
        const lbl_mods = FlexibleTipMenu.i18n('lbl_mods');

        if (lbl_not_applicable === module_flag) {
            return event_msg; // change nothing
        }

        const is_bcaster = (event_msg.user === cb.room_slug);
        if (is_bcaster) {
            FlexibleTipMenu.automod_noaction(event_msg.user, module_lbl + ' & broadcaster');
            return event_msg; // change nothing
        }

        const allow_mods = (lbl_mods === module_flag);
        const is_mod = message.is_mod;
        if (allow_mods && (is_mod || is_bcaster)) {
            FlexibleTipMenu.automod_noaction(event_msg.user, module_lbl + ' & moderator');
            return event_msg; // change nothing
        }

        const allow_fans = (FlexibleTipMenu.i18n('lbl_fans') === module_flag);
        const is_fan = event_msg.is_fan;
        if (allow_fans && (is_fan || is_mod || is_bcaster)) {
            FlexibleTipMenu.automod_noaction(event_msg.user, module_lbl + ' & fan');
            return event_msg; // change nothing
        }

        const tk_groups = [
            FlexibleTipMenu.i18n('lbl_group_havetk'),
            FlexibleTipMenu.i18n('lbl_group_50tk'),
            FlexibleTipMenu.i18n('lbl_group_250tk'),
            FlexibleTipMenu.i18n('lbl_group_1000tk'),
        ];
        const allow_havetk = tk_groups.includes(module_flag);
        const has_tokens = event_msg.has_tokens; // the user who sent the msg has tokens
        if (allow_havetk && (has_tokens || is_fan || is_mod || is_bcaster)) {
            FlexibleTipMenu.automod_noaction(event_msg.user, module_lbl + ' & havetk');
            return event_msg; // change nothing
        }


        // take action
        event_msg = FlexibleTipMenu.hide_message(event_msg);
        FlexibleTipMenu.send_notice(notice_raw, event_msg.user, null, null, null, 'automods_verbosity', 100);


        if (!FlexibleTipMenu.is_disabled('automods_record_flag')) {
            FlexibleTipMenu.automod_infraction(event_msg.user);
        }

        return event_msg;
    },

    /**
     * Whether a single character is allowed for display in chat
     * @param {string} c Single character to test (against Unicode ranges etc)
     * @returns {boolean} bool
     */
    automod_validate_single_char: function(c) {
        if (specific_patterns.automod_unicode_allowed.test(c)) {
            return true;
        }

        const code_point_int = parseInt(c.codePointAt(0));
        //const code_point_hex = code_point_int.toString(16);

        let c_res = false; // assume false at first, and revise as soon as a match is found
        for (const allowed_range of automod_unicode_allowranges.emoji) {
            //const range_start_hex = allowed_range.start.toString(16);
            //const range_end_hex = allowed_range.end.toString(16);
            if (code_point_int >= allowed_range.start && code_point_int <= allowed_range.end) {
                //cb.sendNotice(`code point for ${c} is ${code_point_hex}: more than ${range_end_hex}`, cb.room_slug);
                c_res = true;
                break;
            }
        }

        //cb.sendNotice(`code point for ${c} is ${code_point_hex}: ${c_res ? "ok" : "ko"}`, cb.room_slug);
        return c_res;
    },

    /**
     * Whether a complete message is allowed for display in chat (as far as Unicode ranges are concerned)
     * @param {string} txt_msg A copy of the message that came in with the fired Event
     * @returns {boolean} bool
     */
    automod_unicode_validator: function(txt_msg) {
        txt_msg = txt_msg.trim();
        if (specific_patterns.automod_unicode_allowed.test(txt_msg)) {
            return true; // whole text is ascii-128
        }

        if (!automod_unicode_allowranges.emoji.length) {
            return true; // we don't have anything more to test against
        }

        const iterator = txt_msg[Symbol.iterator]();
        let char = iterator.next();

        let str_res = true;
        while (!char.done && str_res) {
            str_res = FlexibleTipMenu.automod_validate_single_char(char.value);
            char = iterator.next();
        }

        return str_res;
    },

    /**
     * Whether a message is allowed for display in chat (as far as links are concerned)
     * @param {string} txt_msg A copy of the message that came in with the fired Event
     * @returns {boolean} bool
     */
    automod_links_validator: function(txt_msg) {
        txt_msg = txt_msg.trim();
        return !specific_patterns.automod_link.test(txt_msg.replace(' ', ''))
    },

    /**
     * Whether a specific module of the app is configured as "broadcaster only"
     * @param {string} cfg_flag_val The actual value from the app settings (not its idx)
     * @returns {boolean} bool
     */
    is_broadcaster_only: function(cfg_flag_val) {
        const valid_values = [
            'broadcaster',
            FlexibleTipMenu.i18n('lbl_broadcaster'),
        ];

        return valid_values.includes(cfg_flag_val);
    },

    /**
     * Helper for a localized time string
     */
    current_time_str: function() {
        return (new Date()).toLocaleTimeString(date_tz, date_opts);
    },

    /**
     * Decorator to add a timestamp to messages in chat
     * @param {message} txt_msg The plaintext message that came in with the fired Event
     * @returns {string} The decorated text
     */
    decorator_time: function(txt_msg) {
        let time_str = FlexibleTipMenu.current_time_str();
        switch (FlexibleTipMenu.val('decorator_time_flag')) {
            case FlexibleTipMenu.i18n('lbl_time_short'):
                time_str = time_str.replace(date_patterns.time_short, '');
                break;

            case FlexibleTipMenu.i18n('lbl_time_medium'):
                time_str = time_str.replace(date_patterns.time_medium, '');
                break;

            case FlexibleTipMenu.i18n('lbl_time_full'):
                // keep the raw date
                break;

            default:
                return txt_msg; // change nothing
        }

        const decorated_msg = '[{TIME}] {MESSAGE}'
            .replace(label_patterns.time, time_str)
            .replace(label_patterns.message, txt_msg);

        return decorated_msg;
    },

    decorator_gender_apply: function(txt_msg, username, gender_code) {
        // cf. https://en.wikipedia.org/wiki/Miscellaneous_Symbols
        // cf. https://en.wikipedia.org/wiki/Planet_symbols#Mars
        // ♀ U+2640 Female sign
        // ♂ U+2642 Male sign
        // ⚥ U+26A5 Male and female sign
        // ⚧ U+26A7 Transsexualism
        // ⚲ U+26B2 Neutral, genderless
        // ⚤ U+26A4 Heterosexuality
        // ⚣ U+26A3 Male homosexuality
        // ⚢ U+26A2 Lesbianism
        // ⚥⚥ U+26A5 Bisexuality

        let gender_str = '';
        if ('m' === gender_code) gender_str = '\u2642'; // male
        else if ('f' === gender_code) gender_str = '\u2640'; // female
        else if ('s' === gender_code) gender_str = '\u26A7'; // trans
        else if ('c' === gender_code) gender_str = '\u26A4'; // couple
        else return txt_msg.replace(label_patterns.gender, '').trim();

        let decorated_msg = txt_msg
            .replace(label_patterns.username, username);

        if (txt_msg.includes(username)) {
            // append to username
            decorated_msg = txt_msg.replace(username, username + ' ' + gender_str);
        } else {
            // prepend to entire message
            decorated_msg = gender_str + ' ' + txt_msg;
        }

        return decorated_msg.replace(label_patterns.gender, '').trim();
    },

    /**
     * Decorator to add the gender to messages in chat, according to the app preferences
     * @param {string} txt_msg The plaintext message that came in with the fired Event
     * @param {user} user The user object that came in with the fired Event
     * @returns {string} The decorated text
     */
    decorator_gender_acl: function(txt_msg, username, gender) {
        const decorator_gender_flag = FlexibleTipMenu.val('decorator_gender_flag');

        if (FlexibleTipMenu.i18n('lbl_not_applicable') === decorator_gender_flag) {
            return txt_msg; // change nothing
        }

        switch (decorator_gender_flag) {
            case FlexibleTipMenu.i18n('lbl_broadcaster'):
                // add a notice to the broadcaster, leave original unmodified
                const notice_tpl = '[{APP}]: test notice for {USER}'
                    .replace(label_patterns.username, username);

                const context_user = { user: username, gender: gender };
                FlexibleTipMenu.send_notice(notice_tpl, cb.room_slug, null, null, null, 'decorator_gender_flag', 10, context_user);
                break;

            case FlexibleTipMenu.i18n('lbl_everyone'):
                // modify original message
                txt_msg = FlexibleTipMenu.decorator_gender_apply('{GENDER} ' + txt_msg, username, gender);
                break;

            default:
                // never mind
        }

        return txt_msg;
    },

    decorator_tips: function(txt_msg, username) {
        if (username === cb.room_slug) {
            return txt_msg; // no change
        }

        if ('undefined' === typeof FlexibleTipMenu.collected_stats.tippers[username]) {
            return txt_msg; // no change
        }

        const total_amount = FlexibleTipMenu.collected_stats.tippers[username].total_amount;
        if (!total_amount) {
            return txt_msg; // no change
        }

        const amount_str = '|{AMOUNT}|'
            .replace(label_patterns.amount, total_amount);

        let decorated_msg = txt_msg
            .replace(label_patterns.username, username);

        if (txt_msg.includes(username)) {
            // append to username
            decorated_msg = txt_msg.replace(username, username + ' ' + amount_str);
        } else {
            // prepend to entire message
            decorated_msg = amount_str + ' ' + txt_msg;
        }

        return decorated_msg.trim();
    },

    /**
     * Show best tipper(s), high king etc
     */
    show_best_tippers: function() {
        const background_color = FlexibleTipMenu.get_color_code('best_tippers_background_color', colors_sample.black);
        const text_color = FlexibleTipMenu.get_color_code('best_tippers_text_color', colors_sample.white);
        const boldness = FlexibleTipMenu.val('best_tippers_boldness');

        let cfg_high_tip = FlexibleTipMenu.val('best_tippers_start_tokens');
        if (isNaN(cfg_high_tip) || !parseInt(cfg_high_tip)) {
            return; // never mind
        }

        cfg_high_tip = parseInt(cfg_high_tip);
        let next_high_tip;
        if (!FlexibleTipMenu.collected_stats.top_tippers.length) {
            next_high_tip = cfg_high_tip;
        } else if (cfg_high_tip > FlexibleTipMenu.collected_stats.top_tippers[0].total) {
            next_high_tip = cfg_high_tip;
        } else {
            next_high_tip = 1 + FlexibleTipMenu.collected_stats.top_tippers[0].total;
        }

        let best_tippers_str = FlexibleTipMenu.val('best_tippers_format')
            .replace(label_patterns.amount, next_high_tip);

        if (FlexibleTipMenu.collected_stats.top_tippers.length) {
            best_tippers_str = best_tippers_str
                .replace(label_patterns.username, FlexibleTipMenu.collected_stats.top_tippers[0].user);
        }

        FlexibleTipMenu.send_notice(best_tippers_str, null, background_color, text_color, boldness, 'best_tippers_flag', 1000, {});
    },

    /**
     * Starting point for the best tippers notice
     */
    show_best_tippers_handler: function() {
        FlexibleTipMenu.show_best_tippers();

        const nb_minutes = FlexibleTipMenu.val('best_tippers_repeat_minutes');
        if (isNaN(nb_minutes) || !parseInt(nb_minutes)) {
            return; // never mind
        }

        cb.setTimeout(FlexibleTipMenu.show_best_tippers_handler, 1000 * 60 * parseInt(nb_minutes));
    },

    /**
     * Handle plain messages from users (non-tips, non-commands);
     * Will run automods and decorators
     * @param {message} event_msg The message that came in with the fired Event
     * @returns {message} The updated message
     */
    plaintext_handler: function(event_msg) {
        if (event_msg['X-Spam']) {
            return event_msg; // was already hidden upstream (another bot?)
        }

        const automod_unicode_enabled = !FlexibleTipMenu.is_disabled('automod_unicode_flag');
        if (automod_unicode_enabled && !FlexibleTipMenu.automod_unicode_validator(event_msg.m)) {
            event_msg = FlexibleTipMenu.automod_plaintext(
                event_msg,
                'automod_unicode_flag',
                'errmsg_automod_unicode'
            );
        }

        if (event_msg['X-Spam']) {
            return event_msg;
        }

        const automod_links_enabled = !FlexibleTipMenu.is_disabled('automod_links_flag');
        if (automod_links_enabled && !FlexibleTipMenu.automod_links_validator(event_msg.m)) {
            event_msg = FlexibleTipMenu.automod_plaintext(
                event_msg,
                'automod_links_flag',
                'errmsg_automod_link'
            );
        }

        if (event_msg['X-Spam']) {
            return event_msg;
        }

        if (!FlexibleTipMenu.is_disabled('decorator_time_flag')) {
            event_msg.m = FlexibleTipMenu.decorator_time(event_msg.m);
        }

        if (!FlexibleTipMenu.is_disabled('decorator_tips_flag')) {
            event_msg.m = FlexibleTipMenu.decorator_tips(event_msg.m, event_msg.user);
        }

        if (!FlexibleTipMenu.is_disabled('decorator_gender_flag')) {
            event_msg.m = FlexibleTipMenu.decorator_gender_acl(event_msg.m, event_msg.user, event_msg.gender);
        }

        event_msg.m = event_msg.m.replace(specific_patterns.all_var_names, ' ');
        return event_msg;
    },

    /**
     * Show a sample of colors to the user who asked for them
     * @param {string} username
     */
    show_colors_sample: function(username) {
        let i = 0; // timer offset

        cb.setTimeout(function() {
            const notice = FlexibleTipMenu.clean_str(FlexibleTipMenu.i18n('colorslist_header'));
            cb.sendNotice(notice, username);
        }, 1000 * ++i);

        // use two different background colors to ensure all colored labels are shown
        const allow_list = [colors_sample.black, colors_sample.white];
        for (const bgcolor of allow_list) {
            // set a timer to try and group the notices by their background
            cb.setTimeout(function() {
                for (const color_lbl in colors_sample) {
                    const color_code = colors_sample[color_lbl];
                    if (bgcolor === color_code) {
                        continue;
                    }

                    // the notices can't be single line because the text color needs to change with each time
                    cb.sendNotice(color_lbl + ': ' + color_code, username, bgcolor, color_code);
                }
            }, 1000 * ++i);
        }
    },

    /**
     * Notice to the user that their command was not recognized, and their message hidden
     * @param {string} username
     */
    show_command_error: function(username) {
        const errlbl_tpl = FlexibleTipMenu.i18n('errlbl_command_not_recognized');
        const errlbl_notice = FlexibleTipMenu.clean_str(errlbl_tpl);
        cb.setTimeout(function() {
            cb.sendNotice(errlbl_notice, username);
        }, 200);
    },

    /**
     * Handle commands from users;
     * This will hide the command itself in chat
     * @param {message} event_msg The message that came in with the fired Event
     * @returns {message} The updated message
     */
    commands_handler: function(event_msg) {
        const txt_msg = event_msg.m.trim();
        const txt_command = txt_msg.substring(1).trim();

        event_msg = FlexibleTipMenu.hide_message(event_msg, true);

        if (command_patterns.help.test(txt_command)) {
            FlexibleTipMenu.show_commands_help(event_msg.user);
        } else if (command_patterns.tip_menu.test(txt_command)) {
            if (event_msg.user === cb.room_slug || event_msg.is_mod) {
                FlexibleTipMenu.show_menu(FlexibleTipMenu.i18n('lbl_everyone'));
            } else {
                FlexibleTipMenu.show_menu(FlexibleTipMenu.i18n('lbl_single_user'), event_msg.user);
            }
        } else if (command_patterns.colors_sample.test(txt_command)) {
            if (event_msg.user === cb.room_slug) {
                FlexibleTipMenu.show_colors_sample(event_msg.user);
            } else {
                FlexibleTipMenu.show_command_error(event_msg.user);
            }
        } else if (command_patterns.stats.test(txt_command)) {
            if (event_msg.user === cb.room_slug) {
                FlexibleTipMenu.show_stats(event_msg.user);
            } else {
                FlexibleTipMenu.show_command_error(event_msg.user);
            }
        } else {
            FlexibleTipMenu.show_command_error(event_msg.user);
        }

        return event_msg;
    },

    /**
     * Gets a value from the app settings (storage)
     * @param {string} name The name of the setting to get a value for
     * @returns {string} The value
     */
    val: function(name) {
        if ('undefined' === typeof settings_list[name]) {
            return null;
        }

        const value = cb.settings[settings_list[name]];
        if (FlexibleTipMenu.i18n('lbl_not_applicable') === value) {
            return null;
        }

        return value;
    },

    /**
     * Gets a localized label or template
     * @param {string} idx The identifier of the label or template to localize
     * @returns {string} The value
     */
    i18n: function(idx, do_trim = true) {
        if ('undefined' === typeof i18n[lang][idx]) {
            return null;
        }

        const lbl = i18n[lang][idx];
        return do_trim ? lbl.trim() : lbl;
    },

    /**
     * Whether a specific setting is disabled in the current configuration
     * @param {string} setting_name
     * @returns {boolean} bool
     */
    is_disabled: function(setting_name) {
        if (!setting_name) {
            return true;
        }

        if ('undefined' !== typeof FlexibleTipMenu.run_flags[setting_name]) {
            return FlexibleTipMenu.run_flags[setting_name];
        }

        const flag_res = (null === FlexibleTipMenu.val(setting_name));
        FlexibleTipMenu.run_flags[setting_name] = flag_res;

        return flag_res;
    },
};

const ftm = FlexibleTipMenu; // shorthand



//
// Start storing settings
//
cb.settings_choices = [];

cb.settings_choices.push({
    name: settings_list.app_name,
    label: ftm.i18n('app_name'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    required: false,
});

cb.settings_choices.push({
    name: settings_list.errors_flag,
    label: ftm.i18n('errors_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_broadcaster'),
});


// automod unicode module
cb.settings_choices.push({
    name: settings_list.automod_unicode_flag,
    label: ftm.i18n('automod_unicode_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_fans'),
    choice4: ftm.i18n('lbl_group_havetk'),
    choice5: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

// automod links module
cb.settings_choices.push({
    name: settings_list.automod_links_flag,
    label: ftm.i18n('automod_links_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_fans'),
    choice4: ftm.i18n('lbl_group_havetk'),
    choice5: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

// settings common to all automods
cb.settings_choices.push({
    name: settings_list.automods_verbosity,
    label: ftm.i18n('automods_verbosity'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.automods_record_flag,
    label: ftm.i18n('automods_record_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_single_user'),
    choice4: ftm.i18n('lbl_user_bcaster'),
    choice5: ftm.i18n('lbl_user_mods'),
    choice6: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});


// decorator modules
cb.settings_choices.push({
    name: settings_list.decorator_gender_flag,
    label: ftm.i18n('decorator_gender_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.decorator_time_flag,
    label: ftm.i18n('decorator_time_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_time_short'),
    choice2: ftm.i18n('lbl_time_medium'),
    choice3: ftm.i18n('lbl_time_full'),
    choice4: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.decorator_tips_flag,
    label: ftm.i18n('decorator_tips_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});


// stats collection module
cb.settings_choices.push({
    name: settings_list.collect_stats_flag,
    label: ftm.i18n('collect_stats_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_mods'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.collect_stats_followers,
    label: ftm.i18n('collect_stats_followers'),
    type: 'choice',
    choice1: ftm.i18n('lbl_enabled'),
    choice2: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_enabled'),
});

cb.settings_choices.push({
    name: settings_list.collect_stats_newcomers,
    label: ftm.i18n('collect_stats_newcomers'),
    type: 'choice',
    choice1: ftm.i18n('lbl_enabled'),
    choice2: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_enabled'),
});

cb.settings_choices.push({
    name: settings_list.collect_stats_fanclubs,
    label: ftm.i18n('collect_stats_fanclubs'),
    type: 'choice',
    choice1: ftm.i18n('lbl_enabled'),
    choice2: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_enabled'),
});


// best tippers module
cb.settings_choices.push({
    name: settings_list.best_tippers_flag,
    label: ftm.i18n('best_tippers_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.best_tippers_start_tokens,
    label: ftm.i18n('best_tippers_start_tokens'),
    type: 'int',
    minValue: 1,
    defaultValue: 1000,
});

cb.settings_choices.push({
    name: settings_list.best_tippers_repeat_minutes,
    label: ftm.i18n('best_tippers_repeat_minutes'),
    type: 'int',
    minValue: 1,
    maxValue: 60,
    defaultValue: 10,
});

cb.settings_choices.push({
    name: settings_list.best_tippers_stack_size,
    label: ftm.i18n('best_tippers_stack_size'),
    type: 'int',
    minValue: 1,
    maxValue: 25,
    defaultValue: 3,
});

cb.settings_choices.push({
    name: settings_list.best_tippers_background_color,
    label: ftm.i18n('expl_bgcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.best_tippers_text_color,
    label: ftm.i18n('expl_txtcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample['pastel blue'],
});

cb.settings_choices.push({
    name: settings_list.best_tippers_boldness,
    label: ftm.i18n('expl_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.best_tippers_format,
    label: ftm.i18n('best_tippers_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_best_tippers_format'),
});


// autogreet module: newcomers
cb.settings_choices.push({
    name: settings_list.autogreet_newcomer_flag,
    label: ftm.i18n('autogreet_newcomer_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_single_user'),
    choice4: ftm.i18n('lbl_user_bcaster'),
    choice5: ftm.i18n('lbl_user_mods'),
    choice6: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.autogreet_newcomer_background_color,
    label: ftm.i18n('expl_bgcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.autogreet_newcomer_text_color,
    label: ftm.i18n('expl_txtcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample['pastel blue'],
});

cb.settings_choices.push({
    name: settings_list.autogreet_newcomer_boldness,
    label: ftm.i18n('expl_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.autogreet_newcomer_format,
    label: ftm.i18n('autogreet_newcomer_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autogreet_newcomer_format'),
});

// autogreet module: new fan club members
cb.settings_choices.push({
    name: settings_list.autogreet_newfanclub_flag,
    label: ftm.i18n('autogreet_newfanclub_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_single_user'),
    choice4: ftm.i18n('lbl_user_bcaster'),
    choice5: ftm.i18n('lbl_user_mods'),
    choice6: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.autogreet_newfanclub_background_color,
    label: ftm.i18n('expl_bgcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.autogreet_newfanclub_text_color,
    label: ftm.i18n('expl_txtcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample['pastel green'],
});

cb.settings_choices.push({
    name: settings_list.autogreet_newfanclub_boldness,
    label: ftm.i18n('expl_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.autogreet_newfanclub_format,
    label: ftm.i18n('autogreet_newfanclub_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autogreet_newfanclub_format'),
});

// autothank module: new followers
cb.settings_choices.push({
    name: settings_list.autothank_follower_flag,
    label: ftm.i18n('autothank_follower_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_single_user'),
    choice4: ftm.i18n('lbl_user_bcaster'),
    choice5: ftm.i18n('lbl_user_mods'),
    choice6: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.autothank_follower_background_color,
    label: ftm.i18n('expl_bgcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.autothank_follower_text_color,
    label: ftm.i18n('expl_txtcolor'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample['pastel red'],
});

cb.settings_choices.push({
    name: settings_list.autothank_follower_boldness,
    label: ftm.i18n('expl_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.autothank_follower_format,
    label: ftm.i18n('autothank_follower_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autothank_follower_format'),
});

// autothank module: tips
cb.settings_choices.push({
    name: settings_list.autothank_tip_flag,
    label: ftm.i18n('autothank_tip_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_broadcaster'),
    choice2: ftm.i18n('lbl_everyone'),
    choice3: ftm.i18n('lbl_single_user'),
    choice4: ftm.i18n('lbl_user_bcaster'),
    choice5: ftm.i18n('lbl_user_mods'),
    choice6: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_above_tokens,
    label: ftm.i18n('autothank_tip_above_tokens'),
    type: 'int',
    minValue: 1,
    maxValue: 999999,
    defaultValue: 24,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_publicly_background_color,
    label: ftm.i18n('autothank_tip_publicly_background_color'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_publicly_text_color,
    label: ftm.i18n('autothank_tip_publicly_text_color'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.black,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_publicly_boldness,
    label: ftm.i18n('autothank_tip_publicly_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_publicly_format,
    label: ftm.i18n('autothank_tip_publicly_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autothank_tip_publicly_format'),
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_privately_background_color,
    label: ftm.i18n('autothank_tip_privately_background_color'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.white,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_privately_text_color,
    label: ftm.i18n('autothank_tip_privately_text_color'),
    type: 'str',
    minLength: 6,
    maxLength: 7,
    defaultValue: colors_sample.black,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_privately_boldness,
    label: ftm.i18n('autothank_tip_privately_boldness'),
    type: 'choice',
    choice1: font_weights.normal,
    choice2: font_weights.bold,
    choice3: font_weights.bolder,
    defaultValue: font_weights.bold,
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_privately_format,
    label: ftm.i18n('autothank_tip_privately_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autothank_tip_privately_format'),
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_remind_note_flag,
    label: ftm.i18n('autothank_tip_remind_note_flag'),
    type: 'choice',
    choice1: ftm.i18n('lbl_single_user'),
    choice2: ftm.i18n('lbl_not_applicable'),
    defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
    name: settings_list.autothank_tip_remind_note_format,
    label: ftm.i18n('autothank_tip_remind_note_format'),
    type: 'str',
    minLength: 1,
    maxLength: 250,
    defaultValue: ftm.i18n('expl_autothank_tip_remind_note_format'),
});


// variable number of tip menus
for (let i = 0; i < nb_of_distinct_menus && i < az.length; ++i) {
    const menu_idx_letter = az[i].toUpperCase();

    // the first offset should retain settigns from earlier versions
    const settings_idx_offset = (0 === i) ? '' : menu_idx_letter;

    cb.settings_choices.push({
        name: settings_list.tip_menu_flag + settings_idx_offset,
        label: ftm.i18n('tip_menu_flag').replace(label_patterns.menu, menu_idx_letter),
        type: 'choice',
        choice1: ftm.i18n('lbl_broadcaster'),
        choice2: ftm.i18n('lbl_everyone'),
        choice3: ftm.i18n('lbl_fans'),
        choice4: ftm.i18n('lbl_group_havetk'),
        choice5: ftm.i18n('lbl_not_applicable'),
        defaultValue: (0 === i) ? ftm.i18n('lbl_broadcaster') : ftm.i18n('lbl_not_applicable'),
    });

    cb.settings_choices.push({
        name: settings_list.tip_menu_header + settings_idx_offset,
        label: ftm.i18n('tip_menu_header').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 1,
        maxLength: 250,
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.tip_menu_footer + settings_idx_offset,
        label: ftm.i18n('tip_menu_footer').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 1,
        maxLength: 250,
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.inline_separator + settings_idx_offset,
        label: ftm.i18n('inline_separator').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 0,
        maxLength: 10,
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.inline_spacing + settings_idx_offset,
        label: ftm.i18n('inline_spacing').replace(label_patterns.menu, menu_idx_letter),
        type: 'choice',
        choice1: ftm.i18n('lbl_inline_spacing_before'),
        choice2: ftm.i18n('lbl_inline_spacing_after'),
        choice3: ftm.i18n('lbl_inline_spacing_both'),
        choice4: ftm.i18n('lbl_not_applicable'),
        defaultValue: ftm.i18n('lbl_not_applicable'),
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.menu_background_color + settings_idx_offset,
        label: ftm.i18n('menu_background_color').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 6,
        maxLength: 7,
        defaultValue: colors_sample.black,
    });

    cb.settings_choices.push({
        name: settings_list.menu_text_color + settings_idx_offset,
        label: ftm.i18n('menu_text_color').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 6,
        maxLength: 7,
        defaultValue: colors_sample.white,
    });

    cb.settings_choices.push({
        name: settings_list.menu_boldness + settings_idx_offset,
        label: ftm.i18n('menu_boldness').replace(label_patterns.menu, menu_idx_letter),
        type: 'choice',
        choice1: font_weights.normal,
        choice2: font_weights.bold,
        choice3: font_weights.bolder,
        defaultValue: font_weights.normal,
    });

    cb.settings_choices.push({
        name: settings_list.menu_repeat_minutes + settings_idx_offset,
        label: ftm.i18n('menu_repeat_minutes').replace(label_patterns.menu, menu_idx_letter),
        type: 'int',
        minValue: 0,
        maxValue: 60,
        defaultValue: 10,
    });

    cb.settings_choices.push({
        name: settings_list.menu_item_prefix + settings_idx_offset,
        label: ftm.i18n('menu_item_prefix').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 1,
        maxLength: 250,
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.menu_item_suffix + settings_idx_offset,
        label: ftm.i18n('menu_item_suffix').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 1,
        maxLength: 250,
        required: false,
    });

    cb.settings_choices.push({
        name: settings_list.menu_item_display_format + settings_idx_offset,
        label: ftm.i18n('menu_item_display_format').replace(label_patterns.menu, menu_idx_letter),
        type: 'str',
        minLength: 1,
        maxLength: 250,
        defaultValue: ftm.i18n('expl_menu_item_display_format'),
    });

    cb.settings_choices.push({
        name: settings_list.sort_order + settings_idx_offset,
        label: ftm.i18n('sort_order').replace(label_patterns.menu, menu_idx_letter),
        type: 'choice',
        choice1: ftm.i18n('lbl_sort_amount_asc'),
        choice2: ftm.i18n('lbl_sort_amount_desc'),
        choice3: ftm.i18n('lbl_not_applicable'),
        defaultValue: ftm.i18n('lbl_sort_amount_asc'),
    });

    const item_lbl_tpl = ftm.i18n('menu_item_lbl');
    for (let j = 0; j < nb_of_menu_items; ++j) {
        const item_lbl = item_lbl_tpl
            .replace(label_patterns.menu_idx, menu_idx_letter)
            .replace(label_patterns.item_idx, j + 1);

        const new_item = {
            name: settings_list.menu_item_lbl + settings_idx_offset + (j + 1),
            label: item_lbl,
            type: 'str',
            minLength: 1,
            maxLength: 250,
            defaultValue: '',
            required: false,
        };

        cb.settings_choices.push(new_item);
    }
}


if (!lang) {
    throw Exception('Please define the default language in the "lang" global variable');
}

if ('undefined' === typeof i18n[lang]) {
    throw Exception('Please define the "{LANG}" language in the "i18n" global variable'.replace('{LANG}', lang));
}


cb.onStart(room_owner => {

    //
    // launch the app components, each with its own self-test
    //

    cb.setTimeout(function() {
        ftm.show_commands_help(room_owner.user);
        ftm.show_commands_help('', user_groups.mods);
    }, 1000 / 2);



    if (is_debug) {
        cb.sendNotice(ftm.basic_log(cbjs, 'cbjs').join("\n"), room_owner.user, colors_sample.black, colors_sample.white);
        cb.sendNotice(ftm.basic_log(cb, 'cb').join("\n"), room_owner.user, colors_sample.white, colors_sample.black);
    } else if (ftm.is_disabled('tip_menu_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else if (!ftm.check_template_format('menu_item_display_format', ['LABEL'])) {
        cb.setTimeout(function() {
            ftm.alert_error('menu_item_display_format', ftm.i18n('errmsg_app_errors'));
        }, 1000 * 2);
    } else if (!ftm.val('menu_repeat_minutes')) {
        cb.setTimeout(function() {
            ftm.alert_error('menu_repeat_minutes', ftm.i18n('errmsg_tipmenu_once'));
            ftm.show_menu();
        }, 1000 * 2);
    } else {
        // self-test passes: go on...
        cb.setTimeout(ftm.show_menu_handler, 1000 * 2); // Repeatedly show the tip menu(s)
    }


    //
    // Start the autogreet module (in the room)
    //

    if (ftm.is_disabled('autogreet_newcomer_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else if (!ftm.check_template_format('autogreet_newcomer_format', ['USER'])) {
        cb.setTimeout(function() {
            ftm.alert_error('autogreet_newcomer_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
        }, 1000 * 2);
    } else {
        // self-test passes: go on...
        ftm.run_flags.autogreet_newcomer = true;
    }


    //
    // Start the autogreet module (to the fanclub)
    //

    if (ftm.is_disabled('autogreet_newfanclub_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else if (!ftm.check_template_format('autogreet_newfanclub_format', ['USER'])) {
        cb.setTimeout(function() {
            ftm.alert_error('autogreet_newfanclub_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
        }, 1000 * 2);
    } else {
        // self-test passes: go on...
        ftm.run_flags.autogreet_newfanclub = true;
    }


    //
    // Start the autothank module (new followers)
    //

    if (ftm.is_disabled('autothank_follower_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else if (!ftm.check_template_format('autothank_follower_format', ['USER'])) {
        cb.setTimeout(function() {
            ftm.alert_error('autothank_follower_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
        }, 1000 * 2);
    } else {
        // self-test passes: go on...
        ftm.run_flags.autothank_follower = true;
    }


    //
    // Start the autothank module (tips)
    //

    if (ftm.is_disabled('autothank_tip_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else if (!ftm.check_template_format('autothank_tip_publicly_format', ['USER'])) {
        cb.setTimeout(function() {
            ftm.alert_error('autothank_tip_publicly_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
        }, 1000 * 2);
    } else if (!ftm.check_template_format('autothank_tip_privately_format', ['USER'])) {
        cb.setTimeout(function() {
            ftm.alert_error('autothank_tip_privately_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
        }, 1000 * 2);
    } else {
        // self-test passes: go on...
        ftm.run_flags.autothank_tip = true;
    }



    //
    // Start the stats collection module (tips)
    //

    if (ftm.is_disabled('collect_stats_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else {
        // self-test passes: go on...
        ftm.run_flags.collect_stats = true;
    }



    if (ftm.is_disabled('best_tippers_flag')) {
        // possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
    } else {
        // self-test passes: go on...
        cb.setTimeout(ftm.show_best_tippers_handler, 1500 * 2); // Repeatedly show the best tipper(s) notice
    }


    //
    // Assign all the event listeners
    //

    ftm.start = ftm.current_time_str().replace(date_patterns.time_short, '');

    cb.onMessage(ftm.on_message); // start listening on messages, possible commands
    cb.onEnter(ftm.on_enter); // start listening for newcomers
    cb.onFanclubJoin(ftm.on_fanclub_join); // start listening for new fan club members
    cb.onFollow(ftm.on_follow); // start listening for new followers
    cb.onTip(ftm.on_tip); // start listening for tips

});
