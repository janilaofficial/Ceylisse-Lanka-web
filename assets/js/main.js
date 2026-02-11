// Main JavaScript File
import { initAuthObserver } from './auth.js';

// Function to load components (Navbar, Footer)
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;

            // Re-initialize icons if any
            if (window.lucide) {
                window.lucide.createIcons();
            }
        } else {
            console.error(`Failed to load component: ${componentPath}`);
        }
    } catch (error) {
        console.error(`Error loading component: ${componentPath}`, error);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Load Navbar and Footer
    // We will create these HTML partials later, or use JS to render them if we prefer pure JS components
    // For now, let's assume we might use simple JS rendering for components to keep it simple without HTML imports

    renderNavbar();
    renderFooter();
    initAuthObserver();
});

function renderNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <nav class="fixed w-full z-50 bg-white/90 dark:bg-black-900/90 backdrop-blur-md border-b border-gold-400/20 transition-all duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-20">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="flex items-center gap-2">
                            <span class="text-2xl font-serif font-bold text-gold-400">Ceylisse</span>
                            <span class="text-sm tracking-widest uppercase text-gray-500 hidden md:block">Lanka</span>
                        </a>
                    </div>
                    
                    <!-- Desktop Menu -->
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-8">
                            <a href="index.html" class="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                            <a href="shop.html" class="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Shop</a>
                            <a href="about.html" class="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                            <a href="contact.html" class="hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
                        </div>
                    </div>

                    <!-- Icons -->
                    <div class="hidden md:flex items-center gap-4">
                        <button id="theme-toggle" class="p-2 hover:text-gold-400 transition-colors">
                            <i data-lucide="moon" class="w-5 h-5"></i>
                        </button>
                        <a href="cart.html" class="p-2 hover:text-gold-400 transition-colors relative">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            <span class="absolute top-0 right-0 bg-gold-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
                        </a>
                        <a href="login.html" class="p-2 hover:text-gold-400 transition-colors">
                            <i data-lucide="user" class="w-5 h-5"></i>
                        </a>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="-mr-2 flex md:hidden">
                        <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <i data-lucide="menu" class="w-6 h-6"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            // Save preference to localStorage
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="bg-gray-100 dark:bg-black-800 pt-16 pb-8 border-t border-gold-400/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div class="col-span-1 md:col-span-1">
                        <span class="text-2xl font-serif font-bold text-gold-400 mb-4 block">Ceylisse</span>
                        <p class="text-gray-500 text-sm leading-relaxed">
                            Premium cosmetics related to the true essence of beauty. Gold standard quality for your skin.
                        </p>
                    </div>
                    <div>
                        <h3 class="text-lg font-serif font-semibold mb-4 text-gold-400">Shop</h3>
                        <ul class="space-y-2 text-sm text-gray-500">
                            <li><a href="#" class="hover:text-gold-400 transition-colors">New Arrivals</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Best Sellers</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Skin Care</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Makeup</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-serif font-semibold mb-4 text-gold-400">Support</h3>
                        <ul class="space-y-2 text-sm text-gray-500">
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">FAQs</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" class="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-serif font-semibold mb-4 text-gold-400">Newsletter</h3>
                        <p class="text-sm text-gray-500 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form class="flex">
                            <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black-900 focus:outline-none focus:border-gold-400">
                            <button type="button" class="bg-gold-400 text-black px-4 py-2 font-semibold hover:bg-white hover:text-gold-400 border border-gold-400 transition-colors">
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-xs text-gray-400">© 2026 Ceylisse Lanka. All rights reserved.</p>
                    <div class="flex gap-4">
                        <a href="#" class="text-gray-400 hover:text-gold-400"><i data-lucide="facebook" class="w-4 h-4"></i></a>
                        <a href="#" class="text-gray-400 hover:text-gold-400"><i data-lucide="instagram" class="w-4 h-4"></i></a>
                        <a href="#" class="text-gray-400 hover:text-gold-400"><i data-lucide="twitter" class="w-4 h-4"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Refresh icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
