import { db, storage, auth } from './firebase-config.js';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// DOM Elements
const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const addProductModal = document.getElementById('add-product-modal');
const modalOverlay = document.getElementById('modal-overlay');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Products Page Loaded");

    // Check Auth Status First
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Admin Logged In:", user.email);
            fetchProducts();
        } else {
            console.warn("User not logged in. Redirecting...");
            alert("You must be logged in to access the Admin Panel.");
            window.location.href = '../login.html';
        }
    });

    // Event Listeners
    const openBtn = document.getElementById('open-add-modal');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            console.log("Open Modal Clicked");
            openModal();
        });
    } else {
        console.error("Open Modal Button Not Found");
    }

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }
});

// Open/Close Modal
function openModal() {
    addProductModal.classList.remove('hidden');
    addProductModal.classList.remove('pointer-events-none'); // Fix pointer events
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    addProductModal.classList.add('hidden');
    addProductModal.classList.add('pointer-events-none'); // Restore pointer events
    modalOverlay.classList.add('hidden');
    productForm.reset();
}

// Fetch and Display Products
async function fetchProducts() {
    productList.innerHTML = `<tr><td colspan="5" class="text-center py-4">Loading products...</td></tr>`;

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        productList.innerHTML = '';

        if (querySnapshot.empty) {
            productList.innerHTML = `<tr><td colspan="5" class="text-center py-4">No products found.</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const row = document.createElement('tr');
            row.className = "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors";

            row.innerHTML = `
                <td class="py-4 px-6 flex items-center gap-4">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/50'}" alt="${product.name}" class="w-12 h-12 object-cover rounded-md">
                    <span class="font-medium">${product.name}</span>
                </td>
                <td class="py-4 px-6 text-gray-500">${product.category}</td>
                <td class="py-4 px-6 font-medium text-gold-400">LKR ${Number(product.price).toLocaleString()}</td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded bg-green-100 text-green-600 text-xs font-semibold">Instock</span>
                </td>
                <td class="py-4 px-6 text-right">
                    <button class="text-blue-500 hover:text-blue-600 mr-2" onclick="editProduct('${doc.id}')"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                    <button class="text-red-500 hover:text-red-600" onclick="deleteProduct('${doc.id}')"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            `;

            productList.appendChild(row);
        });

        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error("Error fetching products:", error);
        productList.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading products: ${error.message}</td></tr>`;
    }
}

// Add New Product
async function handleAddProduct(e) {
    e.preventDefault();
    console.log("Starting product add...");

    const submitBtn = productForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Uploading Image...";
    submitBtn.disabled = true;

    try {
        const name = document.getElementById('product-name').value;
        const price = Number(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const imageFile = document.getElementById('product-image').files[0];

        if (!imageFile) {
            alert("Please select an image.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Upload Image to Firebase Storage
        console.log("Uploading image...");
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log("Image uploaded, getting URL...");
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Save Data to Firestore
        console.log("Saving to Firestore...");
        submitBtn.innerText = "Saving Product...";
        await addDoc(collection(db, "products"), {
            name,
            price,
            category,
            description,
            imageUrl,
            createdAt: new Date().toISOString()
        });

        console.log("Product saved!");
        alert("Product added successfully!");
        closeModal();
        fetchProducts();

    } catch (error) {
        console.error("Error adding product:", error);
        let errorMsg = error.message;
        if (error.code === 'storage/unauthorized') {
            errorMsg = "Permission denied: Unable to upload image. Check Storage Rules.";
        } else if (error.code === 'permission-denied') {
            errorMsg = "Permission denied: Unable to save to database. Check Firestore Rules.";
        }
        alert("Failed to add product: " + errorMsg);
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

// Expose delete function to window for onclick events
window.deleteProduct = async function (id) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            alert("Product deleted.");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product: " + error.message);
        }
    }
};

window.editProduct = function (id) {
    alert("Edit functionality coming soon!");
};
