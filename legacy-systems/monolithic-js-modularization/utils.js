// === BUSINESS DASHBOARD UTILITIES ===
// This file contains ALL utility functions for our small business dashboard
// TODO: Clean this up someday... it's getting pretty messy!

// Global variables (probably shouldn't be here but oh well)
var APP_VERSION = "1.2.3";
let currentUser = null;
const DEFAULT_CURRENCY = "USD";
var debugMode = false;

// === EMAIL VALIDATION STUFF ===
function validateEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidBusinessEmail(email) {
    if (!validateEmail(email)) return false;
    // Check if it's a business email (not gmail, yahoo, etc.)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !personalDomains.includes(domain.toLowerCase());
}

// === PHONE NUMBER UTILITIES ===
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    
    // Format international numbers differently
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
    }
    
    return phoneNumber; // Return original if can't format
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

// === STRING MANIPULATION HELPERS ===
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// This function does too many things but it works...
function sanitizeAndFormatName(name) {
    if (!name || typeof name !== 'string') return '';
    
    // Remove extra spaces
    name = name.trim().replace(/\s+/g, ' ');
    
    // Remove special characters except hyphens and apostrophes
    name = name.replace(/[^a-zA-Z\s\-']/g, '');
    
    // Capitalize properly
    name = capitalizeWords(name);
    
    // Handle special cases
    name = name.replace(/\bMc([a-z])/g, 'Mc$1'.toUpperCase());
    name = name.replace(/\bO'([a-z])/g, "O'$1".toUpperCase());
    
    return name;
}

// === ARRAY UTILITIES ===
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

function sortByProperty(array, property) {
    return array.sort((a, b) => {
        if (a[property] < b[property]) return -1;
        if (a[property] > b[property]) return 1;
        return 0;
    });
}

// More complex array processing
function processCustomerData(customers) {
    // This function does way too many things but it's what we need
    return customers
        .filter(customer => customer.isActive)
        .map(customer => {
            // Calculate customer value
            const totalSpent = customer.orders.reduce((sum, order) => sum + order.amount, 0);
            const avgOrderValue = totalSpent / customer.orders.length;
            
            // Determine customer tier
            let tier = 'Bronze';
            if (totalSpent > 10000) tier = 'Gold';
            else if (totalSpent > 5000) tier = 'Silver';
            
            // Format data
            return {
                id: customer.id,
                name: sanitizeAndFormatName(customer.name),
                email: customer.email.toLowerCase(),
                phone: formatPhoneNumber(customer.phone),
                totalSpent: formatCurrency(totalSpent),
                avgOrderValue: formatCurrency(avgOrderValue),
                tier: tier,
                joinDate: formatDate(customer.joinDate),
                lastOrderDate: customer.orders.length > 0 ? 
                    formatDate(Math.max(...customer.orders.map(o => new Date(o.date)))) : 'Never'
            };
        })
        .sort((a, b) => parseFloat(a.totalSpent.replace(/[$,]/g, '')) - parseFloat(b.totalSpent.replace(/[$,]/g, '')))
        .reverse();
}

// === CURRENCY AND MATH UTILITIES ===
function formatCurrency(amount, currency = DEFAULT_CURRENCY) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount);
        if (isNaN(amount)) return '$0.00';
    }
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
}

function calculateTax(amount, taxRate) {
    return amount * (taxRate / 100);
}

function calculateDiscount(originalPrice, discountPercent) {
    const discount = originalPrice * (discountPercent / 100);
    return {
        discountAmount: discount,
        finalPrice: originalPrice - discount,
        savings: discount
    };
}

// Complex pricing calculation that grew over time
function calculateOrderTotal(items) {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    
    items.forEach(item => {
        let itemTotal = item.price * item.quantity;
        
        // Apply item-specific discount
        if (item.discount) {
            const discountAmount = itemTotal * (item.discount / 100);
            itemTotal -= discountAmount;
            totalDiscount += discountAmount;
        }
        
        // Calculate tax (some items are tax-exempt)
        if (!item.taxExempt) {
            const taxAmount = itemTotal * (item.taxRate || 0.0875); // Default 8.75% tax
            totalTax += taxAmount;
        }
        
        subtotal += itemTotal;
    });
    
    // Apply order-level discount
    if (subtotal > 100) {
        const orderDiscount = subtotal * 0.05; // 5% discount for orders over $100
        totalDiscount += orderDiscount;
        subtotal -= orderDiscount;
    }
    
    const total = subtotal + totalTax;
    
    return {
        subtotal: formatCurrency(subtotal),
        tax: formatCurrency(totalTax),
        discount: formatCurrency(totalDiscount),
        total: formatCurrency(total),
        rawTotal: total
    };
}

// === DATE UTILITIES ===
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return d.toLocaleDateString('en-US', options);
}

function formatDateTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(date);
}

// === OBJECT UTILITIES ===
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

function mergeObjects(target, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// === DOM UTILITIES ===
function getElementById(id) {
    return document.getElementById(id);
}

function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function showElement(element) {
    if (typeof element === 'string') {
        element = getElementById(element);
    }
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(element) {
    if (typeof element === 'string') {
        element = getElementById(element);
    }
    if (element) {
        element.style.display = 'none';
    }
}

// Complex DOM manipulation function
function updateCustomerTable(customers) {
    const tableBody = getElementById('customerTableBody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = createElement('tr');
        
        // Add customer data cells
        const nameCell = createElement('td', 'customer-name', customer.name);
        const emailCell = createElement('td', 'customer-email', customer.email);
        const phoneCell = createElement('td', 'customer-phone', customer.phone);
        const tierCell = createElement('td', `customer-tier tier-${customer.tier.toLowerCase()}`, customer.tier);
        const spentCell = createElement('td', 'customer-spent', customer.totalSpent);
        
        // Add action buttons
        const actionCell = createElement('td', 'customer-actions');
        const editBtn = createElement('button', 'btn btn-edit', 'Edit');
        const deleteBtn = createElement('button', 'btn btn-delete', 'Delete');
        
        editBtn.onclick = () => editCustomer(customer.id);
        deleteBtn.onclick = () => deleteCustomer(customer.id);
        
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(tierCell);
        row.appendChild(spentCell);
        row.appendChild(actionCell);
        
        tableBody.appendChild(row);
    });
}

// === API UTILITIES ===
function makeApiRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Version': APP_VERSION
        }
    };
    
    const requestOptions = mergeObjects(defaultOptions, options);
    
    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API request failed:', error);
            throw error;
        });
}

function loadCustomers() {
    return makeApiRequest('/api/customers')
        .then(data => {
            const processedCustomers = processCustomerData(data.customers);
            updateCustomerTable(processedCustomers);
            return processedCustomers;
        });
}

function saveCustomer(customerData) {
    // Validate before saving
    if (!validateEmail(customerData.email)) {
        throw new Error('Invalid email address');
    }
    
    if (!validatePhone(customerData.phone)) {
        throw new Error('Invalid phone number');
    }
    
    // Format data
    customerData.name = sanitizeAndFormatName(customerData.name);
    customerData.email = customerData.email.toLowerCase();
    customerData.phone = formatPhoneNumber(customerData.phone);
    
    return makeApiRequest('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
    });
}

// === UTILITY FUNCTIONS ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// === SEARCH AND FILTER UTILITIES ===
function searchCustomers(customers, searchTerm) {
    if (!searchTerm) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.tier.toLowerCase().includes(term)
    );
}

function filterCustomersByTier(customers, tier) {
    if (!tier || tier === 'all') return customers;
    return customers.filter(customer => customer.tier.toLowerCase() === tier.toLowerCase());
}

function filterCustomersBySpending(customers, minSpent, maxSpent) {
    return customers.filter(customer => {
        const spent = parseFloat(customer.totalSpent.replace(/[$,]/g, ''));
        return spent >= minSpent && spent <= maxSpent;
    });
}

// === INITIALIZATION AND EVENT HANDLERS ===
function initializeDashboard() {
    // Set up event listeners
    const searchInput = getElementById('customerSearch');
    if (searchInput) {
        const debouncedSearch = debounce((e) => {
            const searchTerm = e.target.value;
            loadCustomers().then(customers => {
                const filtered = searchCustomers(customers, searchTerm);
                updateCustomerTable(filtered);
            });
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    // Load initial data
    loadCustomers().catch(error => {
        console.error('Failed to load customers:', error);
        // Show error message to user
        const errorDiv = getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = 'Failed to load customer data. Please try again.';
            showElement(errorDiv);
        }
    });
}

// More event handlers that should probably be in separate files
function editCustomer(customerId) {
    // This function is way too long and does too many things
    const customer = currentCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Show edit modal
    const modal = getElementById('editCustomerModal');
    showElement(modal);
    
    // Populate form fields
    getElementById('editCustomerName').value = customer.name;
    getElementById('editCustomerEmail').value = customer.email;
    getElementById('editCustomerPhone').value = customer.phone;
    
    // Handle form submission
    const form = getElementById('editCustomerForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const updatedCustomer = {
            id: customerId,
            name: getElementById('editCustomerName').value,
            email: getElementById('editCustomerEmail').value,
            phone: getElementById('editCustomerPhone').value
        };
        
        saveCustomer(updatedCustomer)
            .then(() => {
                hideElement(modal);
                loadCustomers(); // Reload the table
            })
            .catch(error => {
                alert('Error saving customer: ' + error.message);
            });
    };
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        makeApiRequest(`/api/customers/${customerId}`, { method: 'DELETE' })
            .then(() => {
                loadCustomers(); // Reload the table
            })
            .catch(error => {
                alert('Error deleting customer: ' + error.message);
            });
    }
}

// === EXPORT UTILITIES ===
function exportCustomersToCSV(customers) {
    const headers = ['Name', 'Email', 'Phone', 'Tier', 'Total Spent', 'Join Date', 'Last Order'];
    const csvContent = [
        headers.join(','),
        ...customers.map(customer => [
            `"${customer.name}"`,
            `"${customer.email}"`,
            `"${customer.phone}"`,
            `"${customer.tier}"`,
            `"${customer.totalSpent}"`,
            `"${customer.joinDate}"`,
            `"${customer.lastOrderDate}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${formatDate(new Date())}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// === MISCELLANEOUS UTILITIES ===
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

function isValidCreditCard(cardNumber) {
    // Basic Luhn algorithm implementation
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Global variables that probably shouldn't be global
let currentCustomers = [];
let currentFilters = {};
let isLoading = false;

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Some functions that were added later and don't really fit anywhere
function logDebug(message) {
    if (debugMode) {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 