// course.js — Course cards with filter and credit total

const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce students to programming.', completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course introduces students to the World Wide Web.', completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'Students learn to solve problems by writing new functions.', completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce the notion of a class.', completed: false },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'Students will learn to create dynamic pages.', completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'Students will learn to design and create web pages.', completed: false },
];

const container = document.getElementById('course-cards');
const totalEl = document.getElementById('total-credits');
const filterBtns = document.querySelectorAll('.filter-btns button');

function renderCourses(list) {
    container.innerHTML = '';
    list.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card${course.completed ? ' completed' : ''}`;
        card.setAttribute('aria-label', `${course.subject} ${course.number}: ${course.title} — ${course.credits} credits${course.completed ? ' (completed)' : ''}`);
        card.innerHTML = `
            <strong>${course.subject} ${course.number}</strong>
            <span class="credits">${course.credits} cr</span>
        `;
        container.appendChild(card);
    });

    const total = list.reduce((sum, c) => sum + c.credits, 0);
    totalEl.innerHTML = `Total Credits: <span>${total}</span>`;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let filtered = courses;
        if (filter === 'WDD') filtered = courses.filter(c => c.subject === 'WDD');
        if (filter === 'CSE') filtered = courses.filter(c => c.subject === 'CSE');
        renderCourses(filtered);
    });
});

// Initial render
renderCourses(courses);