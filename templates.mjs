import ejs from 'ejs';

/**
 * A simple wrapper for whatever template engine you want. This one is for EJS
 */

export function render(template_name, data) {
    return ejs.renderFile( 'public/' + template_name + '.ejs', data )
};

export default render