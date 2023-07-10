import { createAction, OAuth2PropertyValue, Property } from "@activepieces/pieces-framework";
import { notionCommon } from "../common";
import { Client } from "@notionhq/client";
import { notionAuth } from "@activepieces/piece-notion";

export default createAction({
    name: 'find_page',
    displayName: 'Find Page',
    description: 'Finds a page',
    auth: notionAuth,
    requireAuth: true,
    props: {
        title: Property.ShortText({
            displayName: 'Title',
            description: 'The title of the page to find',
            required: true
        })
    },
    async run(context) {
        const pages = await notionCommon.getPages(context.auth);

        const FoundPages: any[] = [];
        pages.forEach(page => {
            console.log(page.properties.title.title[0].text.content);
            
            if (page.properties.title.title[0].text.content.includes(context.propsValue.title)) {
                FoundPages.push(page);
            }
        });

        return FoundPages
    }
})