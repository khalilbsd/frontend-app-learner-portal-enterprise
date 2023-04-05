import { defineMessages } from '@edx/frontend-platform/i18n';


const messages = defineMessages({
    'welcome.header': {
        id: 'welcome.header',
        defaultMessage: 'welcome',
    },
    'tab.courses': {
        id: 'tab.courses',
        defaultMessage: 'Courses'
    },
    'tab.programs': {
        id: 'tab.programs',
        defaultMessage: 'Programs'
    },
    'license.activation': {
        id: 'license.activation',
        defaultMessage: 'Your license was successfully activated.'
    },
    'get.started.with': {
        id: 'get.started.with',
        defaultMessage: "Getting started with groupadoPro is easy. Simply find a course from your catalog, request enrollment, and get started on your learning journey."
    },
    'btn.find.course': {
        id: 'btn.find.course',
        defaultMessage: 'Find a course'
    },
    'tab.courses.title.recommendation': {
        id: "tab.courses.title.recommendation",
        defaultMessage: "Get course recommendations for you."
    },
    'support.title': {
        id: 'support.title',
        defaultMessage: 'Need help?'
    },
    'support.technical.visit': {
        id: 'support.technical.visit',
        defaultMessage: 'For technical support, visit the'
    },
    'support.technical.help.center': {
        id: 'support.technical.help.center',
        defaultMessage: 'groupado help center'
    },
    'support.technical.help.rquest': {
        id: 'support.technical.help.request',
        defaultMessage: 'To request more benefits or specific courses,'
    },
    'support.technical.help.rquest.email': {
        id: 'support.technical.help.request.email',
        defaultMessage: 'contact your organization\'s groupado administrator'
    },
    'tab.courses.main.dashbaord.my.courses': {
        id: 'tab.courses.main.dashbaord.my.courses',
        defaultMessage: 'My courses'
    },
    'tab.courses.main.dashbaord.my.courses.completed': {
        id: 'tab.courses.main.dashbaord.my.courses.completed',
        defaultMessage: 'Completed courses'
    },
    'tab.courses.main.dashbaord.my.courses.saved': {
        id: 'tab.courses.main.dashbaord.my.courses.saved',
        defaultMessage: 'Saved for later'
    },
    'tab.courses.main.dashboard.course.card.btn.resume': {
        id: 'tab.courses.main.dashboard.course.card.btn.resume',
        defaultMessage: 'Resume'
    },
    'tab.courses.main.dashboard.course.pace': {
        id: 'tab.courses.main.dashboard.course.pace',
        defaultMessage: 'This course '
    },
    'tab.courses.main.dashboard.course.pace.is': {
        id: 'tab.courses.main.dashboard.course.pace.is',
        defaultMessage: 'is '
    },
    'tab.courses.main.dashboard.course.pace.was': {
        id: 'tab.courses.main.dashboard.course.pace.was',
        defaultMessage: 'was '
    },
    'tab.courses.main.dashboard.course.pace.type.self': {
        id: 'tab.courses.main.dashboard.course.pace.type.self',
        defaultMessage: 'self-paced. '
    },
    'tab.courses.main.dashboard.course.pace.type.instructor': {
        id: 'tab.courses.main.dashboard.course.pace.type.instructor',
        defaultMessage: 'instructor-paced. '
    },
    'tab.courses.main.dashboard.course.settings.save.later': {
        id: 'tab.courses.main.dashboard.course.settings.save.later',
        defaultMessage: 'Save course for later'
    },
    'tab.courses.main.dashboard.course.settings.email': {
        id: 'tab.courses.main.dashboard.course.settings.email',
        defaultMessage: 'Email settings'
    },
    'tab.courses.main.dashboard.course.settings.unenroll': {
        id: 'tab.courses.main.dashboard.course.settings.unenroll',
        defaultMessage: 'Unenroll'
    },
    'tab.courses.main.dashboard.course.settings.unenroll.modal.btn.keep': {
        id: 'tab.courses.main.dashboard.course.settings.unenroll.modal.btn.keep',
        defaultMessage: 'Keep learning'
    },
    'tab.courses.main.dashboard.course.settings.unenroll.modal.error': {
        id: 'tab.courses.main.dashboard.course.settings.unenroll.modal.error',
        defaultMessage: 'An error occurred while unenrolling from your course. Please try again.'
    },
    'tab.courses.main.dashboard.course.settings.unenroll.modal.progress': {
        id: 'tab.courses.main.dashboard.course.settings.unenroll.modal.progress',
        defaultMessage: "Progress that you've made so far will not be saved."
    },
    'modal.btn.cancel': {
        id: 'modal.btn.cancel',
        defaultMessage: 'Cancel'
    },
    'tab.courses.main.dashboard.course.settings.save.later.model.title.pending': {
        id: 'tab.courses.main.dashboard.course.settings.save.later.model.title.pending',
        defaultMessage: "Saving course for later..."
    },

    'tab.courses.main.dashboard.course.settings.save.later.model.body.asking.confirmation': {
        id: 'tab.courses.main.dashboard.course.settings.save.later.model.body.asking.confirmation',
        defaultMessage: 'Are you sure you want to save'
    },
    'tab.courses.main.dashboard.course.settings.save.later.model.body.text': {
        id: 'tab.courses.main.dashboard.course.settings.save.later.model.body.text',
        defaultMessage: 'for later? You will remain enrolled, but the course will no longer appear as "In Progress"'
    },
    'tab.courses.main.dashboard.course.settings.save.later.model.body.license.text': {
        id: 'tab.courses.main.dashboard.course.settings.save.later.model.body.license.text',
        defaultMessage: 'As long as your license is valid, you can resume the course by clicking "Move course to In Progress" under your list of courses saved for later.'
    },
    /*subscriptions licenses*/
    'tab.courses.subscription.summary.title':{
        id:'tab.courses.subscription.summary.title',
        defaultMessage:'Subscription Status'
    },
    'tab.courses.subscription.summary.requested':{
        id:'tab.courses.subscription.summary.requested',
        defaultMessage:'Awaiting approval.'
    },
    'tab.courses.subscription.summary.badge.active':{
        id:'tab.courses.subscription.summary.badge.active',
        defaultMessage:'Active'
    },
    'tab.courses.subscription.summary.badge.expiring':{
        id:'tab.courses.subscription.summary.badge.expiring',
        defaultMessage:'Expiring'
    },

    'tab.courses.subscription.summary.badge.expired':{
        id:'tab.courses.subscription.summary.badge.expired',
        defaultMessage:'Expired'
    },
    'tab.courses.subscription.summary.badge.requested':{
        id:'tab.courses.subscription.summary.badge.requested',
        defaultMessage:'Requested'
    },
    'tab.courses.subscription.summary.badge.expiring.soon':{
        id:'tab.courses.subscription.summary.badge.expiring.soon',
        defaultMessage:'Expiring Soon'
    },

    'tab.courses.subscription.summary.badge.available.until':{
        id:'tab.courses.subscription.summary.badge.available.until',
        defaultMessage:'Available until'
    },

    'tab.courses.subscription.summary.badge.expried.on':{
        id:'tab.courses.subscription.summary.badge.expried.on',
        defaultMessage:'Expired on'
    },


})


export default messages