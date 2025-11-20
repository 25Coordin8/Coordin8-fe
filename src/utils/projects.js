import { Storage } from './storage';

// 프로젝트 데이터 관리
export const Projects = {
    getAll: () => Storage.get('projects') || [],
    add: (project) => {
        const projects = Projects.getAll();
        projects.push({
            ...project,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        Storage.set('projects', projects);
        return projects;
    },
    update: (id, updates) => {
        const projects = Projects.getAll();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updates };
            Storage.set('projects', projects);
        }
        return projects;
    },
    remove: (id) => {
        const projects = Projects.getAll();
        const filtered = projects.filter(p => p.id !== id);
        Storage.set('projects', filtered);
        return filtered;
    }
};

