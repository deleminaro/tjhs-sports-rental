# TJHS Sports Rental - GitHub Deployment Guide

## 🚀 **Deploy to GitHub Pages**

### **Step 1: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Repository name: `tjhs-sports-rental`
4. Description: `Sports equipment rental system for The Jannali High School`
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

### **Step 2: Upload Your Code**

#### **Option A: Using GitHub Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in with your GitHub account
3. Click "Clone a repository from the Internet"
4. Enter your repository URL: `https://github.com/YOUR_USERNAME/tjhs-sports-rental`
5. Choose local path: `C:\Users\ivans\OneDrive\Документы\tjhs-sports-rental`
6. Click "Clone"
7. Copy all your project files to this folder
8. In GitHub Desktop, you'll see all your files
9. Add commit message: "Initial commit - TJHS Sports Rental System"
10. Click "Commit to main"
11. Click "Push origin" to upload to GitHub

#### **Option B: Using Command Line**
```bash
# Navigate to your project folder
cd "C:\Users\ivans\OneDrive\Документы\rentals"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - TJHS Sports Rental System"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/tjhs-sports-rental.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy your site

### **Step 4: Access Your Live Site**

Your site will be available at:
`https://YOUR_USERNAME.github.io/tjhs-sports-rental`

## 🔧 **Manual Deployment (Alternative)**

If you prefer to deploy manually:

1. Run the build command:
```bash
npm run build
npm run export
```

2. Upload the `out` folder contents to your web hosting service

## 📱 **PWA Features**

Your deployed site will include:
- ✅ **Installable**: Users can add to home screen
- ✅ **Offline Support**: Basic functionality without internet
- ✅ **Mobile Optimized**: Perfect on phones and tablets
- ✅ **Fast Loading**: Optimized for speed

## 🎯 **Features Available**

### **For Students:**
- Create accounts with student ID
- Rent equipment for any day (up to 30 days ahead)
- View rental history and statistics
- Mobile-friendly interface

### **For Teachers:**
- Manage all rentals
- Bulk return operations
- Search and filter rentals
- Return overdue equipment

### **For Admins:**
- Complete system overview
- Equipment management (add/edit/delete)
- Email notifications for overdue items
- User statistics and analytics
- QR code generation

## 🔐 **Admin Access**

- **Email:** `admin@TJHS`
- **Password:** `admin2025`

## 📞 **Support**

If you need help with deployment:
1. Check the GitHub Actions tab for deployment logs
2. Ensure all files are uploaded correctly
3. Verify the repository is public
4. Check that GitHub Pages is enabled

## 🎉 **Success!**

Once deployed, your TJHS Sports Rental System will be live and accessible to all students, teachers, and administrators at The Jannali High School!

**Live URL:** `https://YOUR_USERNAME.github.io/tjhs-sports-rental`
