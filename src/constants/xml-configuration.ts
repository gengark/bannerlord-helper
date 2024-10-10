/* eslint-disable @typescript-eslint/naming-convention */
const XML_CONFIGURATION = {
    ENABLED_FILE_EXTENSIONS: ['xml', 'xslt'],
    ENABLED_XML_TAG_PATHS: {
        // 'LocationComplexTemplates.LocationComplexTemplate.[number].Location', // Recursion is not currently supported
        // 'Cheats.Cheat', // Missing `id` field
        'Kingdoms.Kingdom': 'name',
        'Factions.Faction': 'name',
        'Projects.Project': 'name',
        'WorkshopTypes.WorkshopType': 'name',
        'Settlements.Settlement': 'name',
        'NPCCharacters.NPCCharacter': 'name',
        'Heroes.Hero': 'text',
        'Items.Item': 'name',
        'Items.CraftedItem': 'name',
        'CraftingPieces.CraftingPiece': 'name',
        'Concepts.Concept': 'text',
        'strings.string': 'text',
    },
    ESCAPED_IDENTIFIERS: ['!'],
    DISABLED_IDENTIFIERS: ['*'],
};
/* eslint-enable @typescript-eslint/naming-convention */

export default XML_CONFIGURATION;
