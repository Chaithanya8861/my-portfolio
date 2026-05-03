import { db, auth, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadAllData();
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
});

document.getElementById('loginBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await signOut(auth);
    alert('Logged out');
});

async function loadAllData() {
    await loadCRUDItems('projects', 'projects-crud');
    await loadCRUDItems('experience', 'experience-crud');
    await loadCRUDItems('certificates', 'certificates-crud');
    await loadCRUDItems('achievements', 'achievements-crud');
}

async function loadCRUDItems(collectionName, containerId) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const div = document.createElement('div');
        div.className = 'crud-item';
        div.innerHTML = `
            <div>
                <strong>${data.title || 'Untitled'}</strong>
                <p>${data.description ? data.description.substring(0, 100) : ''}...</p>
                ${data.tech ? `<small><i class="fas fa-microchip"></i> ${data.tech}</small>` : ''}
            </div>
            <div class="crud-actions">
                <button class="edit-btn" onclick="window.editItem('${collectionName}', '${docSnap.id}')">Edit</button>
                <button class="delete-btn" onclick="window.deleteItem('${collectionName}', '${docSnap.id}')">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

const modal = document.getElementById('itemModal');
const form = document.getElementById('itemForm');

window.showForm = (type) => {
    document.getElementById('modalTitle').innerText = `Add ${type}`;
    document.getElementById('itemType').value = type;
    document.getElementById('itemId').value = '';
    document.getElementById('itemTech').value = '';
    form.reset();
    modal.style.display = 'block';
};

window.editItem = async (type, id) => {
    const docRef = doc(db, type, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    
    document.getElementById('modalTitle').innerText = `Edit ${type}`;
    document.getElementById('itemType').value = type;
    document.getElementById('itemId').value = id;
    document.getElementById('itemTitle').value = data.title || '';
    document.getElementById('itemDesc').value = data.description || '';
    document.getElementById('itemDate').value = data.date || '';
    document.getElementById('itemLink').value = data.link || '';
    document.getElementById('itemTech').value = data.tech || '';
    modal.style.display = 'block';
};

window.deleteItem = async (type, id) => {
    if (confirm('Delete this item?')) {
        await deleteDoc(doc(db, type, id));
        loadAllData();
    }
};

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('itemType').value;
    const id = document.getElementById('itemId').value;
    const data = {
        title: document.getElementById('itemTitle').value,
        description: document.getElementById('itemDesc').value,
        date: document.getElementById('itemDate').value,
        link: document.getElementById('itemLink').value,
        tech: document.getElementById('itemTech').value,
        updatedAt: new Date()
    };
    
    if (id) {
        await updateDoc(doc(db, type, id), data);
    } else {
        await addDoc(collection(db, type), { ...data, createdAt: new Date() });
    }
    modal.style.display = 'none';
    loadAllData();
});

document.querySelector('.close')?.addEventListener('click', () => {
    modal.style.display = 'none';
});