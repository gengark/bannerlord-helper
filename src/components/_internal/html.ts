import dedent from 'dedent';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const nhm = new NodeHtmlMarkdown({
    // BulletMarker: `${chalk.yellow('    *')}`
});

function html(htmlContent: string) {
    return dedent(nhm.translate(htmlContent));
}

export default html;
