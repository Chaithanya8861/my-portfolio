import { db, collection, getDocs } from './firebase-config.js';

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = ['Creative Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Tech Explorer'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingText) return;
    
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

if (typingText) {
    typeEffect();
}

// Custom Cursor
if (window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

async function loadItems(collectionName, containerId, isTimeline = false) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        
        if (items.length === 0) {
            container.innerHTML = '<div class="card"><p>No items yet. Check back soon!</p></div>';
            return;
        }
        
        items.forEach((data, index) => {
            let card;
            
            if (isTimeline) {
                card = document.createElement('div');
                card.className = 'timeline-item';
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s backwards`;
                card.innerHTML = `
                    <div class="timeline-icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="timeline-content">
                        <h3>${escapeHtml(data.title || 'Untitled')}</h3>
                        ${data.date ? `<div class="timeline-date"><i class="far fa-calendar-alt"></i> ${escapeHtml(data.date)}</div>` : ''}
                        <p>${escapeHtml(data.description || '')}</p>
                        ${data.link ? `<a href="${escapeHtml(data.link)}" target="_blank" class="link"><i class="fas fa-external-link-alt"></i> Learn More</a>` : ''}
                    </div>
                `;
            } else {
                card = document.createElement('div');
                card.className = 'card';
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s backwards`;
                
                let icon = 'fa-folder-open';
                if (collectionName === 'certificates') icon = 'fa-certificate';
                if (collectionName === 'achievements') icon = 'fa-trophy';
                if (collectionName === 'projects') icon = 'fa-code';
                if (collectionName === 'experience') icon = 'fa-briefcase';
                
                card.innerHTML = `
                    <i class="fas ${icon}"></i>
                    <h3>${escapeHtml(data.title || 'Untitled')}</h3>
                    ${data.date ? `<div class="date"><i class="far fa-calendar-alt"></i> ${escapeHtml(data.date)}</div>` : ''}
                    ${data.tech ? `<div class="tech-stack"><i class="fas fa-microchip"></i> ${escapeHtml(data.tech)}</div>` : ''}
                    <p>${escapeHtml(data.description || '')}</p>
                    ${data.link ? `<a href="${escapeHtml(data.link)}" target="_blank" class="link">View Project <i class="fas fa-arrow-right"></i></a>` : ''}
                `;
            }
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading items:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="card"><p>Error loading data. Please try again later.</p></div>';
        }
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    loadItems('projects', 'projects-list', false);
    loadItems('experience', 'experience-list', true);
    loadItems('certificates', 'certificates-list', false);
    loadItems('achievements', 'achievements-list', false);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    }
});