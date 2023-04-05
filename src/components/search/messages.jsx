import { defineMessages } from '@edx/frontend-platform/i18n';


const messages = defineMessages({
    'page.search.title': {
        id: 'page.search.title',
        defaultMessage: 'Search Courses and Programs'
    },
    'search.error.message': {
        id: 'search.error.message',
        defaultMessage: 'An error occured while finding {lowerCaseTitle} that match your search.'
    },
    'search.error.message.try.again': {
        id: "search.error.message.try.again",
        defaultMessage: "Please try again later."
    },
    'search.not.found.message': {
        id: 'search.not.found.message',
        defaultMessage: 'No {lowerCaseTitle} were found to match your search results.'
    },
    'search.not.found.message.checkout.more': {
        id: 'search.not.found.message.checkout.more',
        defaultMessage: 'Check out some popular {lowerCaseTitle} below.'
    },
    'search.found.message.results': {
        id: 'search.found.message.results',
        defaultMessage: 'results'
    },
    'search.found.message.result': {
        id: 'search.found.message.result',
        defaultMessage: 'result'
    },


    'content.type.title.course': {
        id: 'content.type.title.course',
        defaultMessage: 'Courses'
    },
    'content.type.title.programs': {
        id: 'content.type.title.programs',
        defaultMessage: 'Programs'
    },
    'content.type.title.popular.index': {
        id: 'content.type.title.popular.index',
        defaultMessage: 'popular-{title}'
    },
    'content.type.title.popular': {
        id: 'content.type.title.popular',
        defaultMessage: 'Popular {title}'
    },

})


export default messages