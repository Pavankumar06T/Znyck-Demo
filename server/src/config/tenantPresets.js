module.exports = {
    'ebook-saas': {
        theme: {
            primary: '#ff5722', // Deep Orange
            accent: '#ffeecb'
        },
        features: {
            ebooks: true,
            exporting: true,
            jobs: false,
            projects: false
        },
        labels: {
            itemName: 'Ebook',
            actionBtn: 'Write New Ebook'
        },
        aiParams: {
            insightTopic: 'Genre Trends'
        }
    },
    'freelance-saas': {
        theme: {
            primary: '#4caf50', // Green
            accent: '#e8f5e9'
        },
        features: {
            ebooks: false,
            exporting: false,
            jobs: true,
            projects: false
        },
        labels: {
            itemName: 'Job',
            actionBtn: 'Find New Gigs'
        },
        aiParams: {
            insightTopic: 'Skill Demand'
        }
    },
    'project-saas': {
        theme: {
            primary: '#2196f3', // Blue
            accent: '#e3f2fd'
        },
        features: {
            ebooks: false,
            exporting: false,
            jobs: false,
            projects: true
        },
        labels: {
            itemName: 'Project',
            actionBtn: 'Create Project'
        },
        aiParams: {
            insightTopic: 'Team Productivity'
        }
    }
};
